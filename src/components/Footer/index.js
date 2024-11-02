// src/Footer.js
import React from "react";
import "./styles.css";
import { FaInstagram, FaLinkedin, FaHeart, FaFacebook } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="social-icons">
          <p>© {new Date().getFullYear()} Financly. All rights reserved.</p>
          <p>
            Made with <FaHeart className="heart-icon" />
            By Vishal Kumar Tiwari
          </p>
          <a
            href="https://www.instagram.com/yourprofile"
            target="https://www.instagram.com/tiwari__vishal_/?hl=en"
            rel="noopener noreferrer"
          >
            <FaInstagram className="icon" />
          </a>
          <a
            href="https://www.linkedin.com/in/yourprofile"
            target="https://www.linkedin.com/in/vishal-kumar-tiwari-692601210/"
            rel="noopener noreferrer"
          >
            <FaLinkedin className="icon" />
          </a>
          <a
            href="https://www.facebook.com/yourprofile"
            target="https://www.facebook.com/profile.php?id=100026305427740"
            rel="noopener noreferrer"
          >
            <FaFacebook className="icon" />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
