import { faEnvelope, faMapMarkerAlt, faPhone } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';

const Footer = () => {
  return (
    <div className="w-full bg-white">
      <div className="flex justify-center space-x-16 py-8">
        {/* Email */}
        <div className="text-center">
          <div className="flex justify-center mb-2">
            <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center">
              <FontAwesomeIcon icon={faEnvelope} />
            </div>
          </div>
          <h3 className="text-sm font-medium text-gray-700">Email</h3>
          <p className="text-sm text-gray-500">Our friendly team is here to help.</p>
          <p className="text-sm text-purple-600">hi@untitledui.com</p>
        </div>

        {/* Office */}
        <div className="text-center">
          <div className="flex justify-center mb-2">
            <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center">
              <FontAwesomeIcon icon={faMapMarkerAlt} />
            </div>
          </div>
          <h3 className="text-sm font-medium text-gray-700">Office</h3>
          <p className="text-sm text-gray-500">Come say hello at our office HQ.</p>
          <p className="text-sm text-purple-600">100 Smith Street<br />Collingwood VIC 3066 AU</p>
        </div>

        {/* Phone */}
        <div className="text-center">
          <div className="flex justify-center mb-2">
            <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center">
              <FontAwesomeIcon icon={faPhone} />
            </div>
          </div>
          <h3 className="text-sm font-medium text-gray-700">Phone</h3>
          <p className="text-sm text-gray-500">Mon-Fri from 8am to 5pm.</p>
          <p className="text-sm text-purple-600">+1 (555) 000-0000</p>
        </div>
      </div>
    </div>
  );
};

export default Footer;
