import { faBars, faUserCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';

const TopNavigator = () => {
  return (
    <div className="bg-purple-600 h-16 flex items-center justify-between px-4 shadow-md">
      <button className="text-white text-lg focus:outline-none">
        <FontAwesomeIcon icon={faBars} />
      </button>
      <button className="text-white text-lg focus:outline-none">
        <FontAwesomeIcon icon={faUserCircle} />
      </button>
    </div>
  );
};

export default TopNavigator;
