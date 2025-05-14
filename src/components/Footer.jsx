import { faGithub } from "@fortawesome/free-brands-svg-icons";
import { faEnvelope, faGlobe } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";

const Footer = () => {
  return (
    <div className="w-full bg-white p-4">
      <div className="flex justify-center space-x-16 py-8">
        {/* Email */}
        <div className="text-center">
          <div className="flex justify-center mb-2">
            <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center">
              <FontAwesomeIcon icon={faEnvelope} />
            </div>
          </div>
          <h3 className="text-sm font-medium text-gray-700">Email</h3>
          <p className="text-sm text-gray-500">
            Our friendly team is here to help.
          </p>
          <p className="text-sm text-purple-600">hi@untitledui.com</p>
        </div>

        {/* Office */}
        <div className="text-center">
          <div className="flex justify-center mb-2">
            <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center">
              <FontAwesomeIcon icon={faGlobe} />
            </div>
          </div>
          <h3 className="text-sm font-medium text-gray-700">Web Page</h3>
          <p className="text-sm text-gray-500">Take a look for more details.</p>
          <a
            href="https://6g-sandbox.eu/"
            className="text-sm text-purple-600"
            target="_blank"
            rel="noopener noreferrer"
          >
            https://6g-sandbox.eu/
          </a>
        </div>

        {/* Phone */}
        <div className="text-center">
          <div className="flex justify-center mb-2">
            <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center">
              <FontAwesomeIcon icon={faGithub} />
            </div>
          </div>
          <h3 className="text-sm font-medium text-gray-700">Github</h3>
          <p className="text-sm text-gray-500">Check out our projects.</p>
          <a
            href="https://github.com/6G-SANDBOX"
            className="text-sm text-purple-600"
            target="_blank"
            rel="noopener noreferrer"
          >
            https://github.com/6G-SANDBOX
          </a>
        </div>
      </div>
    </div>
  );
};

export default Footer;
