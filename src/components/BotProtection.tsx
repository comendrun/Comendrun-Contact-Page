"use client";

import { useEffect, useState } from "react";

interface BotProtectionProps {
  children: React.ReactNode;
}

export default function BotProtection({ children }: BotProtectionProps) {
  const [isBot, setIsBot] = useState(true); // Default to bot until proven otherwise
  const [showContent, setShowContent] = useState(false);
  const [isDevelopment, setIsDevelopment] = useState(false);

  useEffect(() => {
    // Check if we're in development mode or bot protection is disabled
    const devMode =
      process.env.NODE_ENV === "development" ||
      window.location.hostname === "localhost" ||
      window.location.hostname === "127.0.0.1";

    const botProtectionDisabled =
      process.env.NEXT_PUBLIC_ENABLE_BOT_PROTECTION === "false";

    setIsDevelopment(devMode);

    // In development or when disabled, skip bot protection for easier testing
    if (devMode || botProtectionDisabled) {
      setIsBot(false);
      setShowContent(true);
      return;
    }
    // Multiple bot detection methods
    const detectBot = () => {
      // Check user agent for common bot signatures
      const userAgent = navigator.userAgent.toLowerCase();
      const botSignatures = [
        "googlebot",
        "bingbot",
        "slurp",
        "duckduckbot",
        "baiduspider",
        "yandexbot",
        "facebookexternalhit",
        "twitterbot",
        "linkedinbot",
        "whatsapp",
        "applebot",
        "ia_archiver",
        "archive.org_bot",
        "semrushbot",
        "ahrefsbot",
        "mj12bot",
        "bot",
        "crawler",
        "spider",
        "scraper",
        "wget",
        "curl",
      ];

      if (botSignatures.some((sig) => userAgent.includes(sig))) {
        return true;
      }

      // Check for headless browsers
      if (navigator.webdriver) {
        return true;
      }

      // Check for missing window properties that real browsers have
      if (typeof window !== "undefined") {
        // Additional checks for headless browsers
        if (!navigator.languages || navigator.languages.length === 0) {
          return true;
        }

        // Check if it's a completely headless environment
        if (
          !window.chrome &&
          !window.safari &&
          !navigator.brave &&
          !navigator.userAgent.includes("Firefox")
        ) {
          // This might be a headless browser, but let's be more lenient
          // Only flag if multiple suspicious signs
          const suspiciousCount = [
            !navigator.languages?.length,
            !document.documentElement.style,
            !window.history?.length,
          ].filter(Boolean).length;

          if (suspiciousCount >= 2) {
            return true;
          }
        }
      }

      // Check for automation tools
      if (window.phantom || window.__phantom || window.callPhantom) {
        return true;
      }

      return false;
    };

    // Mouse movement detection (bots rarely move mouse naturally)
    let mouseMovements = 0;
    const handleMouseMove = () => {
      mouseMovements++;
      if (mouseMovements > 3) {
        setIsBot(false);
        document.removeEventListener("mousemove", handleMouseMove);
      }
    };

    // Touch detection for mobile devices
    const handleTouch = () => {
      setIsBot(false);
      document.removeEventListener("touchstart", handleTouch);
    };

    // Keyboard interaction
    const handleKeyPress = () => {
      setIsBot(false);
      document.removeEventListener("keydown", handleKeyPress);
    };

    // Initial bot detection
    const initialBotCheck = detectBot();

    if (initialBotCheck) {
      setIsBot(true);
      setShowContent(false);
      return;
    }

    // Add event listeners for human interaction
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("touchstart", handleTouch);
    document.addEventListener("keydown", handleKeyPress);

    // Show content after a short delay if no bot detected
    const timer = setTimeout(() => {
      if (!initialBotCheck) {
        setShowContent(true);
      }
    }, 1000);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("touchstart", handleTouch);
      document.removeEventListener("keydown", handleKeyPress);
      clearTimeout(timer);
    };
  }, []);

  // Show minimal content for bots or during loading
  if (isBot || !showContent) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            {isDevelopment ? "Development Mode" : "Loading..."}
          </h1>
          <div className="animate-pulse w-8 h-8 bg-gray-300 rounded-full mx-auto"></div>
          {!isDevelopment && (
            <p className="text-sm text-gray-500 mt-4">
              Move your mouse or tap to continue
            </p>
          )}
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
