import React from 'react';
import './admin-footer.scss';

const AdminFooter: React.FC = () => {
  return (
    <footer className="admin-footer">
      <div className="container">
        <div className="footer-content">
          <div className="company-info">
            <h2>FORTUNE</h2>
            <p>&copy; {new Date().getFullYear()} FORTUNE. All rights reserved.</p>
          </div>
          <div className="footer-links">
            <a href="/about-us">About Us</a>
            <a href="/contact">Contact</a>
            <a href="/privacy-policy">Privacy Policy</a>
            <a href="/terms-of-service">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default AdminFooter;
