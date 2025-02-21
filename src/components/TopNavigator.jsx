import { faBars, faUserCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { getAccessTokenFromSessionStorage } from '../auxFunc/jwt';

const ProfileModal = ({ isOpen, onClose, userInfo }) => {
  // Conditionally render the modal
  const [newPassword, setNewPassword] = useState("");
  // Reset the password when the modal is closed
  useEffect(() => {
    if (!isOpen) {
      setNewPassword("");
    }
  }, [isOpen]);
  // If the user info is not loaded yet, show "Loading..."
  const username = userInfo ? userInfo.username : 'Loading...';
  const organization = userInfo ? userInfo.org : 'Loading...';
  const email = userInfo ? userInfo.email : 'Loading...';
  // Handle the save button click
  const handleSave = async () => {
    if (!newPassword) {
      alert("Please enter a new password");
      return;
    }
    const result = await changePwd(newPassword, email);
    if (result) {
      alert("Password changed successfully");
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-xl shadow-2xl w-80 max-w-sm border border-gray-200">
        <div className="mb-6">
          {userInfo ? (
            <div>
              <p className="text-sm text-gray-700 mb-2">
                <strong>Username:</strong> {username}
              </p>
              <p className="text-sm text-gray-700 mb-2">
                <strong>Email:</strong> {email}
              </p>
              <p className="text-sm text-gray-700 mb-4">
                <strong>Organization:</strong> {organization}
              </p>
            </div>
          ) : (
            <p className="text-sm text-gray-500 mb-4">Loading user information...</p>
          )}
        </div>

        <p className="text-sm text-gray-700 mb-2"><strong>Change Password: </strong></p>
        <input
          type="password"
          placeholder="New Password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className="w-full p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-6"
        />
        
        <div className="flex justify-end gap-4">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 focus:outline-none transition duration-300"
          >
            Close
          </button>
          <button
            onClick={handleSave}
            className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none transition duration-300"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

// Send the POST request to change the password
const changePwd = async (newPwd, mail) => {
  try {
    const url = `${process.env.REACT_APP_ENDPOINT}/tnlcm/user/change-password`;
    const access_token = await getAccessTokenFromSessionStorage();
    const auth = `Bearer ${access_token}`;
    const payload = {
      email: mail,
      password: newPwd
    };
    const response = await axios.post(url, payload, {
      headers: {
        Authorization: auth,
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (err) {
    console.error("Error while changing password:", err.response?.data?.message || err.message);
  }
};

// Send the POST request
const getUser = async () => {
  try {
    const url = `${process.env.REACT_APP_ENDPOINT}/tnlcm/user`;
    const access_token = await getAccessTokenFromSessionStorage();
    const auth = `Bearer ${access_token}`;

    const response = await axios.get(url, {
      headers: {
        Authorization: auth,
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (err) {
    console.error("Error while retrieving user info:", err.response?.data?.message || err.message);
  }
};

const TopNavigator = () => {
  const [menuVisible, setMenuVisible] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isModalOpen, setModalOpen] = useState(false);
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    const checkAuthentication = async () => {
      const accessToken = await getAccessTokenFromSessionStorage();
      const refreshToken = localStorage.getItem("refresh_token");
      if (accessToken && refreshToken) {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
    };
    checkAuthentication();
  }, []);

  useEffect(() => {
    const fetchUserInfo = async () => {
      if (isAuthenticated) {
        const user = await getUser();
        setUserInfo(user);
      }
    };

    fetchUserInfo();
  }, [isAuthenticated]);

  const handleProfileClick = () => {
    if (!isAuthenticated) return;
    setMenuVisible(!menuVisible);
  };

  const handleListClick = () => {
    if (!isAuthenticated) return;
    window.location = '/dashboard';
  };

  const handleLogout = () => {
    sessionStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    setIsAuthenticated(false);
    setMenuVisible(false);
    setTimeout(() => {
      window.location = '/';
    }, 1001);
  };

  return (
    <div id="topNavigator" className="bg-purple-600 h-16 flex items-center justify-between px-4 shadow-md">
      <button className="text-white text-lg focus:outline-none" onClick={handleListClick}>
        <FontAwesomeIcon icon={faBars} />
      </button>
      <div className="relative">
        <button className="text-white text-lg focus:outline-none" onClick={handleProfileClick}>
          <FontAwesomeIcon icon={faUserCircle} />
        </button>
        {menuVisible && isAuthenticated && (
          <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-lg">
            <button
              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:rounded-lg"
              onClick={() => setModalOpen(true)}
            >
              Profile
            </button>
            <button
              className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-gray-100 hover:rounded-lg"
              onClick={handleLogout}
            >
              Log out
            </button>
          </div>
        )}
      </div>
      <ProfileModal isOpen={isModalOpen} onClose={() => setModalOpen(false)} userInfo={userInfo} />
    </div>
  );
};

export default TopNavigator;
