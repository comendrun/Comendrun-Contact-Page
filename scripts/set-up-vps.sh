#!/usr/bin/env bash
set -euo pipefail

### =====[ EDIT THESE ]=====

# Domains (must already point to this VPS IP)
VPN_DOMAIN="vpn.comendrun.com"          # for Iran users
HOME_DOMAIN="homeserver.comendrun.com"  # for your WireGuard admin (HTTP not needed; just for cleanliness)

# Your email for Let's Encrypt (can be blank, but recommended)
ADMIN_EMAIL="kamran.rouhani@outlook.com"

# UUID for VLESS (if empty, script will auto-generate)
XRAY_UUID=""

# Optional: your Next.js repo to build a static site as camouflage
# Leave empty to use a simple placeholder page now.
NEXTJS_REPO="https://github.com/comendrun/Comendrun-Contact-Page.git"      # e.g. "https://github.com/yourname/your-nextjs-app.git"
NEXTJS_BRANCH="main"

### =====[ STOP EDITING ]=====

echo "[*] Updating system and installing base packages..."
apt-get update
apt-get -y upgrade
apt-get -y install ca-certificates curl git unzip ufw jq

echo "[*] Cleaning up conflicting containerd packages..."
apt-get remove -y containerd containerd.io || true
apt-get autoremove -y


echo "[*] Installing Docker Engine..."
apt-get update
apt-get install -y ca-certificates curl gnupg lsb-release

install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg \
  | gpg --dearmor -o /etc/apt/keyrings/docker.gpg
chmod a+r /etc/apt/keyrings/docker.gpg

echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] \
  https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" \
  | tee /etc/apt/sources.list.d/docker.list > /dev/null

apt-get update
apt-get install -y docker-ce docker-ce-cli docker-buildx-plugin docker-compose-plugin



systemctl enable --now docker

# Basic firewall (UFW)
echo "[*] Configuring UFW firewall..."
ufw default deny incoming
ufw default allow outgoing
ufw allow 22/tcp         # SSH
ufw allow 80/tcp         # HTTP (Let's Encrypt)
ufw allow 443/tcp        # HTTPS (Caddy)
ufw allow 51820/udp      # WireGuard
yes | ufw enable || true
ufw status verbose || true

# Directories
STACK_DIR="/opt/vpn-stack"
CADDY_DIR="$STACK_DIR/caddy"
XRAY_DIR="$STACK_DIR/xray"
SITE_DIR="/var/www/vpn-site"
mkdir -p "$CADDY_DIR" "$XRAY_DIR" "$SITE_DIR"

# XRAY UUID
if [ -z "$XRAY_UUID" ]; then
  XRAY_UUID="$(cat /proc/sys/kernel/random/uuid)"
  echo "[*] Generated XRAY UUID: $XRAY_UUID"
fi

# Create Xray config (VLESS + WS at 127.0.0.1:10000, path /comendrunvpn; TLS handled by Caddy)
cat > "$XRAY_DIR/config.json" <<"JSON"
{
  "log": {
    "loglevel": "warning"
  },
  "inbounds": [
    {
      "tag": "vless-in",
      "port": 10000,
      "listen": "0.0.0.0",
      "protocol": "vless",
      "settings": {
        "decryption": "none",
        "clients": [
          { "id": "__XRAY_UUID__", "flow": "" }
        ]
      },
      "streamSettings": {
        "network": "ws",
        "security": "none",
        "wsSettings": { "path": "/comendrunvpn" }
      }
    }
  ],
  "outbounds": [
    { "protocol": "freedom", "tag": "direct" },
    { "protocol": "blackhole", "tag": "blocked" }
  ],
  "routing": {
    "domainStrategy": "AsIs",
    "rules": []
  }
}
JSON
sed -i "s/__XRAY_UUID__/$XRAY_UUID/g" "$XRAY_DIR/config.json"

# Caddyfile: serve static site AND reverse proxy the /comendrunvpn path to xray:10000
cat > "$CADDY_DIR/Caddyfile" <<CADDY
{
  email $ADMIN_EMAIL
}

$VPN_DOMAIN {
  encode zstd gzip
  root * /var/www/vpn-site
  file_server

  @xray path /comendrunvpn*
  reverse_proxy @xray xray:10000 {
    header_up Host {host}
    header_up X-Real-IP {remote_host}
    header_up X-Forwarded-For {remote_host}
    header_up -Origin
  }
}

$HOME_DOMAIN {
  # Not used for HTTP; just keep it "normal"
  respond "OK" 200
}
CADDY

# Placeholder static site (if no Next.js repo provided)
if [ -z "$NEXTJS_REPO" ]; then
  echo "[*] Creating simple placeholder static site..."
  cat > "$SITE_DIR/index.html" <<HTML
<!doctype html>
<html lang="en"><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Comendrun — Tech Journal</title>
<link rel="icon" href="data:,">
<style>body{font-family:system-ui,-apple-system,Segoe UI,Roboto,Ubuntu,Helvetica,Arial,sans-serif;max-width:720px;margin:48px auto;padding:0 16px;line-height:1.5}</style>
<h1>Comendrun — Notes & Experiments</h1>
<p>A small tech journal with occasional posts on development, networking, and self-hosting.</p>
<p>Last updated: $(date -u +"%Y-%m-%d %H:%M UTC")</p>
HTML
else
  echo "[*] Building static Next.js from $NEXTJS_REPO ($NEXTJS_BRANCH)..."
  # Build in a container so the VPS stays clean/light
  docker run --rm -v "$SITE_DIR:/site" node:20-bullseye bash -lc "
    set -euo pipefail
    apt-get update >/dev/null 2>&1
    cd /site
    rm -rf app && git clone --depth=1 -b '$NEXTJS_BRANCH' '$NEXTJS_REPO' app
    cd app
    corepack enable
    npm ci
    npm run build || npm run build:prod || true
    npm run export || (mkdir -p out && echo '<h1>Site exported</h1>' > out/index.html)
    rm -rf /site/* && cp -r out/* /site/
  "
fi

# Docker Compose stack
cat > "$STACK_DIR/docker-compose.yml" <<"YML"
version: "3.8"
services:
  caddy:
    image: caddy:2
    restart: unless-stopped
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./caddy/Caddyfile:/etc/caddy/Caddyfile:ro
      - /var/www/vpn-site:/var/www/vpn-site:ro
      - caddy_data:/data
      - caddy_config:/config
    depends_on:
      - xray

  xray:
    image: ghcr.io/xtls/xray-core:latest
    restart: unless-stopped
    command: ["xray","-config","/etc/xray/config.json"]
    volumes:
      - ./xray/config.json:/etc/xray/config.json:ro

volumes:
  caddy_data:
  caddy_config:
YML

echo "[*] Bringing up Docker stack (Caddy + Xray)..."
cd "$STACK_DIR"
docker compose pull
docker compose up -d
sleep 2
docker compose ps

# --- WireGuard hub setup on VPS ---
echo "[*] Installing WireGuard on VPS (hub for admin access to home)..."
apt-get -y install wireguard wireguard-tools

WG_DIR="/etc/wireguard"
mkdir -p "$WG_DIR"
chmod 700 "$WG_DIR"

# Generate VPS keys if not exist
if [ ! -f "$WG_DIR/server_privatekey" ]; then
  wg genkey | tee "$WG_DIR/server_privatekey" | wg pubkey > "$WG_DIR/server_publickey"
  chmod 600 "$WG_DIR/server_privatekey"
fi

VPS_PRIVKEY="$(cat $WG_DIR/server_privatekey)"
VPS_PUBKEY="$(cat $WG_DIR/server_publickey)"

# Also generate an example CLIENT keypair for you (you'll import on your laptop/phone)
if [ ! -f "$WG_DIR/client_privatekey" ]; then
  wg genkey | tee "$WG_DIR/client_privatekey" | wg pubkey > "$WG_DIR/client_publickey"
  chmod 600 "$WG_DIR/client_privatekey"
fi
CLIENT_PRIVKEY="$(cat $WG_DIR/client_privatekey)"
CLIENT_PUBKEY="$(cat $WG_DIR/client_publickey)"

# We don't know the home LXC public key yet. You'll fill it later.
HOME_WG_PUBKEY="__REPLACE_WITH_HOME_WG_PUBKEY__"

cat > "$WG_DIR/wg0.conf" <<WG
[Interface]
Address = 10.6.0.1/24
ListenPort = 51820
PrivateKey = $VPS_PRIVKEY
# Enable forwarding when wg0 is up:
PostUp = sysctl -w net.ipv4.ip_forward=1
PostDown = sysctl -w net.ipv4.ip_forward=0

# Home LXC peer (routes your home LAN via the LXC)
[Peer]
# Home LXC public key:
PublicKey = $HOME_WG_PUBKEY
# Route the home WireGuard IP and the whole LAN via the LXC
AllowedIPs = 10.6.0.2/32, 192.168.2.0/24
PersistentKeepalive = 25

# Your personal client
[Peer]
PublicKey = $CLIENT_PUBKEY
AllowedIPs = 10.6.0.3/32
WG

chmod 600 "$WG_DIR/wg0.conf"
systemctl enable --now wg-quick@wg0 || true

echo
echo "================= IMPORTANT OUTPUT ================="
echo "[VPS] WireGuard public key (give this to your home LXC):"
echo "  $VPS_PUBKEY"
echo
echo "[Client] Example WireGuard client config (use on your laptop/phone):"
cat <<CLIENTCFG

[Interface]
Address = 10.6.0.3/32
PrivateKey = $CLIENT_PRIVKEY
DNS = 1.1.1.1

[Peer]
# VPS hub
PublicKey = $VPS_PUBKEY
Endpoint = 5.250.191.185:51820
# Send WireGuard subnet + Home LAN via the tunnel:
AllowedIPs = 10.6.0.0/24, 192.168.2.0/24
PersistentKeepalive = 25
CLIENTCFG
echo "===================================================="
echo
echo "[VLESS] Share this with Iran users (clients like v2rayN/Nekoray/Shadowrocket):"
echo "  UUID: $XRAY_UUID"
echo "  Address: $VPN_DOMAIN"
echo "  Port: 443"
echo "  TLS: on (server name $VPN_DOMAIN)"
echo "  Network: ws"
echo "  Path: /comendrunvpn"
echo
echo "VLESS URL (many clients support this):"
echo "vless://$XRAY_UUID@$VPN_DOMAIN:443?encryption=none&security=tls&type=ws&host=$VPN_DOMAIN&path=%2Fcomendrunvpn#Comendrun"
echo
echo "[*] Next steps below (home LXC WireGuard + tests)."
