import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-4 mt-8 shadow-inner">
      <div className="container mx-auto px-4 text-center">
        <p className="text-sm">
          &copy; {new Date().getFullYear()} Fitza. All rights reserved.
        </p>
        <p className="text-xs mt-1">
          Designed and developed with ❤️ by the Fitza team.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
