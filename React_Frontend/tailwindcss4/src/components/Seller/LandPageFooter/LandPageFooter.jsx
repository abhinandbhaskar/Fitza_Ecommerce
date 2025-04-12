import React from "react";

const LandPageFooter = () => {
  return (
    <footer className="bg-gray-800 text-gray-300 py-8">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 px-6">
        {/* Column 1: About */}
        <div>
          <h3 className="text-xl font-semibold text-white mb-4">About Fitza</h3>
          <p className="text-sm">
            Fitza is a platform designed to connect sellers with customers, providing an intuitive
            interface and powerful tools to grow your business.
          </p>
        </div>

        {/* Column 2: Quick Links */}
        <div>
          <h3 className="text-xl font-semibold text-white mb-4">Quick Links</h3>
          <ul className="space-y-2">
            <li>
              <a href="/seller/register" className="hover:text-indigo-400">
                Become a Seller
              </a>
            </li>
            <li>
              <a href="/seller/login" className="hover:text-indigo-400">
                Seller Login
              </a>
            </li>
            <li>
              <a href="/help" className="hover:text-indigo-400">
                Help Center
              </a>
            </li>
            <li>
              <a href="/terms" className="hover:text-indigo-400">
                Terms & Conditions
              </a>
            </li>
          </ul>
        </div>

        {/* Column 3: Contact */}
        <div>
          <h3 className="text-xl font-semibold text-white mb-4">Contact Us</h3>
          <p className="text-sm mb-2">Email: support@fitza.com</p>
          <p className="text-sm mb-2">Phone: +1 123-456-7890</p>
          <p className="text-sm">
            Address: 123 Fitza Street, Innovation City, Techland
          </p>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="border-t border-gray-600 mt-8 pt-4 text-center text-sm">
        <p>&copy; {new Date().getFullYear()} Fitza. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default LandPageFooter;
