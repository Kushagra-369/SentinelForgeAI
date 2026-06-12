import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import "./Navbar.css";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [isScrolled, setIsScrolled] = useState<boolean>(false);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = (): void => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMenuOpen]);

  const toggleMenu = (): void => {
    setIsMenuOpen((prev) => !prev);
  };

  const closeMenu = (): void => {
    setIsMenuOpen(false);
  };

  const navItems = [
    { path: "/", label: "Home" },
    { path: "/email-scanner", label: "Email Scanner", hasBadge: true },
    { path: "/url-scanner", label: "URL Scanner" },
    { path: "/file-scanner", label: "File Scanner" },
    { path: "/dashboard", label: "Dashboard" },
    { path: "/about", label: "About" },
  ];

  return (
    <>
      <nav className={`navbar ${isScrolled ? "navbar--scrolled" : ""}`}>
        <div className="navbar__container py-3">
          {/* Left - Logo */}
          <Link to="/" className="navbar__logo" onClick={closeMenu}>
            <div className="navbar__logo-icon-wrapper">
              <span className="navbar__logo-icon">⚡</span>
              <span className="navbar__logo-icon-pulse"></span>
            </div>
            <span className="navbar__logo-text">
              Sentinel<span className="navbar__logo-highlight">Forge</span> AI
            </span>
          </Link>

          {/* Hamburger Menu Button (Mobile) */}
          <button
            className={`navbar__hamburger ${isMenuOpen ? "navbar__hamburger--active" : ""}`}
            onClick={toggleMenu}
            aria-label="Toggle menu"
            aria-expanded={isMenuOpen}
          >
            <span></span>
            <span></span>
            <span></span>
          </button>

          {/* Center - Navigation Links */}
          <ul className={`navbar__links ${isMenuOpen ? "navbar__links--active" : ""}`}>
            {navItems.map((item) => (
              <li
                key={item.path}
                onMouseEnter={() => setHoveredItem(item.path)}
                onMouseLeave={() => setHoveredItem(null)}
              >
                <Link
                  to={item.path}
                  className={`navbar__link ${location.pathname === item.path ? "navbar__link--active" : ""}`}
                  onClick={closeMenu}
                >
                  <span className="navbar__link-text">{item.label}</span>
                  {item.hasBadge && (
                    <span className="navbar__badge">
                      <span className="navbar__badge-text">New</span>
                      <span className="navbar__badge-pulse"></span>
                    </span>
                  )}
                  {hoveredItem === item.path && (
                    <span className="navbar__link-glow"></span>
                  )}
                </Link>
              </li>
            ))}
          </ul>

          {/* Right - Social Icons */}
          <div className="navbar__social">
            <a
              className="navbar__social-link"
              href="https://github.com/Kushagra-369"
              target="_blank"
              rel="noreferrer noopener"
              aria-label="GitHub"
            >
              <GitHubIcon />
              <span className="navbar__social-tooltip">GitHub</span>
            </a>
            <a
              className="navbar__social-link"
              href="https://www.linkedin.com/in/kushagra-chhabra-83b215355/"
              target="_blank"
              rel="noreferrer noopener"
              aria-label="LinkedIn"
            >
              <LinkedInIcon />
              <span className="navbar__social-tooltip">LinkedIn</span>
            </a>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="navbar__overlay" onClick={closeMenu}></div>
      )}
    </>
  );
};

// GitHub Icon Component
const GitHubIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    className="navbar__social-icon"
    xmlns="http://www.w3.org/2000/svg"
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill="currentColor"
    {...props}
  >
    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.387.6.113.82-.26.82-.58 0-.287-.01-1.05-.015-2.06-3.338.726-4.042-1.61-4.042-1.61-.546-1.387-1.333-1.756-1.333-1.756-1.09-.745.082-.73.082-.73 1.205.085 1.838 1.237 1.838 1.237 1.07 1.834 2.807 1.304 3.492.997.108-.775.418-1.305.762-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.468-2.38 1.235-3.22-.123-.3-.535-1.52.117-3.16 0 0 1.008-.322 3.3 1.23.96-.267 1.98-.4 3-.405 1.02.005 2.04.138 3 .405 2.29-1.552 3.297-1.23 3.297-1.23.653 1.64.24 2.86.118 3.16.768.84 1.233 1.91 1.233 3.22 0 4.61-2.804 5.62-5.476 5.92.43.37.824 1.102.824 2.22 0 1.602-.015 2.894-.015 3.287 0 .322.216.698.83.578C20.565 21.795 24 17.295 24 12c0-6.63-5.37-12-12-12z" />
  </svg>
);

// LinkedIn Icon Component
const LinkedInIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    className="navbar__social-icon"
    xmlns="http://www.w3.org/2000/svg"
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill="currentColor"
    {...props}
  >
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C0.792 0 0 0.774 0 1.729v20.542C0 23.227 0.792 24 1.771 24h20.451c0.979 0 1.771-0.773 1.771-1.729V1.729C24 0.774 23.22 0 22.225 0z" />
  </svg>
);

export default Navbar;