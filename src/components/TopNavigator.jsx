import { faBars, faUserCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  Box,
  Button,
  Modal,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from 'react';
import { changePwd, getUser } from '../auxFunc/api';
import { getAccessTokenFromSessionStorage } from '../auxFunc/jwt';

const ProfileModal = ({ isOpen, onClose, userInfo }) => {
  // Conditionally render the modal
  const [newPassword, setNewPassword] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Reset the password when the modal is closed
  useEffect(() => {
    if (!isOpen) {
      setSuccess("");
      setNewPassword("");
      setOldPassword("");
      setError("");
    }
  }, [isOpen]);
  // If the user info is not loaded yet, show "Loading..."
  const username = userInfo ? userInfo.username : 'Loading...';
  const organization = userInfo ? userInfo.org : 'Loading...';
  const email = userInfo ? userInfo.email : 'Loading...';
  // Handle the save button click
  const handleSave = async () => {
    setSuccess("");
    if (!oldPassword || !newPassword)  {
      setError("All fields are required.");
      return;
    }
    if (newPassword === oldPassword) {
      setError("Passwords can not be the same.");
      return;
    }
    const result = await changePwd(oldPassword, newPassword, username);
    if (result) {
      setSuccess("Password changed successfully.");
      onClose();
    }
    setError("");
  };

  if (!isOpen) return null;

  return (
    <Modal open={isOpen} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 350,
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 4,
          borderRadius: 4,
          border: '2px solid black',
        }}
      >

        {userInfo ? (
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6"><strong>Username:</strong> {username}</Typography>
            <Typography variant="h6"><strong>Email:</strong> {email}</Typography>
            <Typography variant="h6"><strong>Organization:</strong> {organization}</Typography>
            <Typography variant="h6" gutterBottom style={{ textDecoration: 'underline' }}>
              <strong>Change Password :</strong>
            </Typography>
            <TextField
              label="Current Password"
              type="password"
              fullWidth
              margin="normal"
              variant="outlined"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
            />
            <TextField
              label="New Password"
              type="password"
              fullWidth
              margin="normal"
              variant="outlined"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </Box>
        ) : (
          <Typography variant="h6" color="textSecondary">
            Loading user information...
          </Typography>
        )}

        {error && (
          <Typography variant="body2" color="error" sx={{ mt: 2 }}>
            {error}
          </Typography>
        )}

        {success && (
          <Typography variant="body2" color="success.main" sx={{ mt: 2 }}>
            {success}
          </Typography>
        )}

        <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 3 }}>
          <Button onClick={onClose} color="secondary" sx={{ mr: 2 }}>
            Close
          </Button>
          <Button onClick={handleSave} variant="contained" color="primary">
            Save
          </Button>
        </Box>
      </Box>
    </Modal>
  );
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
