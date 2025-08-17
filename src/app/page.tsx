import BotProtection from "@/components/BotProtection";

export default function Home() {
  return (
    <BotProtection>
      <div className="min-h-screen">
        {/* Navigation */}
        <nav className="bg-white shadow-sm sticky top-0 z-50">
          <div className="container-max section-padding">
            <div className="flex items-center justify-between h-16">
              <div className="font-bold text-xl text-blue-600">Portfolio</div>
              <div className="hidden md:flex space-x-8">
                <a
                  href="#about"
                  className="text-gray-600 hover:text-blue-600 transition-colors"
                >
                  About
                </a>
                <a
                  href="#experience"
                  className="text-gray-600 hover:text-blue-600 transition-colors"
                >
                  Experience
                </a>
                <a
                  href="#skills"
                  className="text-gray-600 hover:text-blue-600 transition-colors"
                >
                  Skills
                </a>
                <a
                  href="#projects"
                  className="text-gray-600 hover:text-blue-600 transition-colors"
                >
                  Projects
                </a>
                <a
                  href="#contact"
                  className="text-gray-600 hover:text-blue-600 transition-colors"
                >
                  Contact
                </a>
              </div>
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <section className="bg-gradient-to-br from-blue-50 to-indigo-100 py-20">
          <div className="container-max section-padding">
            <div className="text-center">
              <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
                Senior Software Developer
              </h1>
              <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
                Passionate about creating robust, scalable applications using
                modern technologies. Specialized in full-stack development with
                a focus on performance and user experience.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a href="#projects" className="btn-primary">
                  View My Work
                </a>
                <a href="#contact" className="btn-secondary">
                  Get In Touch
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section id="about" className="py-20 bg-white">
          <div className="container-max section-padding">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                About Me
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                With over 8 years of experience in software development, I&apos;ve
                had the privilege of working with diverse teams and technologies
                to build impactful digital solutions.
              </p>
            </div>
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                  My Journey
                </h3>
                <p className="text-gray-600 mb-6">
                  Started as a junior developer with a passion for clean code
                  and elegant solutions. Over the years, I&apos;ve evolved into a
                  senior developer who thrives on solving complex problems and
                  mentoring upcoming talent.
                </p>
                <p className="text-gray-600">
                  I believe in continuous learning and staying updated with the
                  latest industry trends. My approach combines technical
                  expertise with strong communication skills to deliver projects
                  that exceed expectations.
                </p>
              </div>
              <div className="bg-gray-50 p-8 rounded-lg">
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                  Quick Facts
                </h3>
                <ul className="space-y-3 text-gray-600">
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-blue-600 rounded-full mr-3"></span>
                    8+ years of professional experience
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-blue-600 rounded-full mr-3"></span>
                    50+ projects completed successfully
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-blue-600 rounded-full mr-3"></span>
                    Expertise in modern web technologies
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-blue-600 rounded-full mr-3"></span>
                    Strong focus on performance optimization
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Experience Section */}
        <section id="experience" className="py-20 bg-gray-50">
          <div className="container-max section-padding">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Experience
              </h2>
              <p className="text-lg text-gray-600">
                A timeline of my professional journey
              </p>
            </div>
            <div className="space-y-8">
              {[
                {
                  title: "Senior Full-Stack Developer",
                  company: "Tech Innovation Corp",
                  period: "2022 - Present",
                  description:
                    "Leading development of scalable web applications using React, Node.js, and cloud technologies. Mentoring junior developers and architecting solutions for high-traffic applications.",
                },
                {
                  title: "Full-Stack Developer",
                  company: "Digital Solutions Ltd",
                  period: "2019 - 2022",
                  description:
                    "Developed and maintained multiple web applications serving thousands of users. Implemented CI/CD pipelines and improved application performance by 40%.",
                },
                {
                  title: "Frontend Developer",
                  company: "StartupXYZ",
                  period: "2017 - 2019",
                  description:
                    "Built responsive user interfaces using React and Vue.js. Collaborated with UX/UI designers to create engaging user experiences.",
                },
              ].map((job, index) => (
                <div
                  key={index}
                  className="bg-white p-6 rounded-lg shadow-sm border border-gray-200"
                >
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                    <h3 className="text-xl font-semibold text-gray-900">
                      {job.title}
                    </h3>
                    <span className="text-blue-600 font-medium">
                      {job.period}
                    </span>
                  </div>
                  <p className="text-gray-700 font-medium mb-2">
                    {job.company}
                  </p>
                  <p className="text-gray-600">{job.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Skills Section */}
        <section id="skills" className="py-20 bg-white">
          <div className="container-max section-padding">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Skills & Technologies
              </h2>
              <p className="text-lg text-gray-600">
                Tools and technologies I work with
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  category: "Frontend",
                  skills: [
                    "React",
                    "Next.js",
                    "TypeScript",
                    "Tailwind CSS",
                    "Vue.js",
                    "JavaScript ES6+",
                  ],
                },
                {
                  category: "Backend",
                  skills: [
                    "Node.js",
                    "Express",
                    "Python",
                    "PostgreSQL",
                    "MongoDB",
                    "RESTful APIs",
                  ],
                },
                {
                  category: "DevOps & Tools",
                  skills: ["Docker", "AWS", "Git", "CI/CD", "Linux", "Nginx"],
                },
              ].map((skillGroup, index) => (
                <div key={index} className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">
                    {skillGroup.category}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {skillGroup.skills.map((skill, skillIndex) => (
                      <span
                        key={skillIndex}
                        className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Projects Section */}
        <section id="projects" className="py-20 bg-gray-50">
          <div className="container-max section-padding">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Featured Projects
              </h2>
              <p className="text-lg text-gray-600">
                Some of the projects I&apos;m most proud of
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  title: "E-Commerce Platform",
                  description:
                    "Full-stack e-commerce solution with payment integration, inventory management, and admin dashboard.",
                  tech: ["React", "Node.js", "PostgreSQL", "Stripe"],
                },
                {
                  title: "Task Management App",
                  description:
                    "Collaborative task management application with real-time updates and team collaboration features.",
                  tech: ["Next.js", "Socket.io", "MongoDB", "Tailwind"],
                },
                {
                  title: "Analytics Dashboard",
                  description:
                    "Data visualization dashboard for business metrics with interactive charts and reporting features.",
                  tech: ["Vue.js", "Python", "D3.js", "FastAPI"],
                },
              ].map((project, index) => (
                <div
                  key={index}
                  className="bg-white p-6 rounded-lg shadow-sm border border-gray-200"
                >
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    {project.title}
                  </h3>
                  <p className="text-gray-600 mb-4">{project.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {project.tech.map((tech, techIndex) => (
                      <span
                        key={techIndex}
                        className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-sm"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="py-20 bg-white">
          <div className="container-max section-padding">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Get In Touch
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                I&apos;m always interested in hearing about new opportunities and
                interesting projects. Let&apos;s connect and discuss how we can work
                together.
              </p>
            </div>
            <div className="max-w-2xl mx-auto">
              <div className="grid md:grid-cols-2 gap-8">
                <div className="text-center p-6 bg-gray-50 rounded-lg">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Email
                  </h3>
                  <p className="text-gray-600">hello@example.com</p>
                </div>
                <div className="text-center p-6 bg-gray-50 rounded-lg">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    LinkedIn
                  </h3>
                  <p className="text-gray-600">linkedin.com/in/yourprofile</p>
                </div>
              </div>
              <div className="text-center mt-8">
                <p className="text-gray-600">
                  Also check out my main portfolio at{" "}
                  <a
                    href="https://comendrun.com"
                    className="text-blue-600 hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    comendrun.com
                  </a>
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-gray-900 text-white py-8">
          <div className="container-max section-padding">
            <div className="text-center">
              <p>&copy; 2024 Professional Portfolio. All rights reserved.</p>
              <p className="text-gray-400 mt-2">
                Built with Next.js and Tailwind CSS
              </p>
            </div>
          </div>
        </footer>
      </div>
    </BotProtection>
  );
}
