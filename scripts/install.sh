#!/usr/bin/env bash

export DEBIAN_FRONTEND=noninteractive

echo "============================================="
echo "    🚀 TNLCM INSTALLATION SCRIPT 🚀         "
echo "============================================="

echo "============================================="
echo "              GLOBAL VARIABLES               "
echo "============================================="
UBUNTU_VERSION=$(lsb_release -rs)
FRONTEND_PATH="/opt/TNLCM_FRONTEND"
FRONTEND_DOTENV_FILE="${FRONTEND_PATH}/.env"

echo "========== Starting Pre-Checks for Script Execution =========="

echo "Checking if the script is being executed as root..."
if [[ $EUID -ne 0 ]]; then
    echo "This script must be run as root. Please use 'sudo' or switch to the root user"
    exit 1
else
    echo "Script is running as root"
fi

echo "Detecting Ubuntu version..."
echo "Detected Ubuntu version: ${UBUNTU_VERSION}"
if [[ "${UBUNTU_VERSION}" != "22.04" && "${UBUNTU_VERSION}" != "24.04" ]]; then
    echo "Unsupported Ubuntu version: ${UBUNTU_VERSION}. This script only supports Ubuntu 22.04 LTS and 24.04 LTS"
    exit 1
else
    echo "Ubuntu version ${UBUNTU_VERSION} is supported"
fi

echo "Running as root. Ubuntu version detected: ${UBUNTU_VERSION}"

echo "========== Pre-Checks Completed Successfully =========="

echo "========== Starting TNLCM, MongoDB, and Mongo-Express Installation =========="

echo "Updating package lists..."
apt-get update

echo "--------------- Installing Node.js ---------------"
if node -v &> /dev/null; then
    echo "Node.js is already installed"
else
    echo "Node.js is not installed. Installing Node.js..."
    curl -fsSL https://deb.nodesource.com/setup_lts.x -o nodesource_setup.sh
    bash nodesource_setup.sh
    apt-get install -y nodejs
    rm nodesource_setup.sh
    echo "Node.js installed successfully"
fi

echo "--------------- Cloning TNLCM Repository ---------------"
if [[ -d ${FRONTEND_PATH} ]]; then
    echo "TNLCM repository already cloned"
else
    echo "Cloning TNLCM repository..."
    git clone https://github.com/6G-SANDBOX/TNLCM_FRONTEND ${FRONTEND_PATH}
fi

echo "Copying .env.template to .env..."
cp ${FRONTEND_PATH}/.env.template ${FRONTEND_DOTENV_FILE}

HOST_IP=$(hostname -I | awk '{print $1}')
echo "Updating the .env file..."
REACT_APP_TNLCM_BACKEND_API="http://${HOST_IP}:5000/api/v1"
sed -i "s|^REACT_APP_TNLCM_BACKEND_API=.*|REACT_APP_TNLCM_BACKEND_API=${REACT_APP_TNLCM_BACKEND_API}|" "${FRONTEND_DOTENV_FILE}"
echo "Prompting user for configuration details..."
read -rp "Name of the branch in 6G-Sandbox-Sites repository to deploy the trial networks: " REACT_APP_SITES_BRANCH
read -rp "Enter the Name of directory in branch REACT_APP_SITES_BRANCH to deploy the trial networks: " REACT_APP_DEPLOYMENT_SITE
read -rp "Token to encrypt and decrypt the 6G-Sandbox-Sites repository files for your site using Ansible Vault: " REACT_APP_DEPLOYMENT_SITE_TOKEN

sed -i "s/^REACT_APP_SITES_BRANCH=.*/REACT_APP_SITES_BRANCH=\"${REACT_APP_SITES_BRANCH}\"/" ${FRONTEND_DOTENV_FILE}
sed -i "s/^REACT_APP_DEPLOYMENT_SITE=.*/REACT_APP_DEPLOYMENT_SITE=\"${REACT_APP_DEPLOYMENT_SITE}\"/" ${FRONTEND_DOTENV_FILE}
sed -i "s/^REACT_APP_DEPLOYMENT_SITE_TOKEN=.*/REACT_APP_DEPLOYMENT_SITE_TOKEN=\"${REACT_APP_DEPLOYMENT_SITE_TOKEN}\"/" ${FRONTEND_DOTENV_FILE}

echo "Installing TNLCM dependencies..."
npm --prefix ${FRONTEND_PATH}/ install

cat > /etc/systemd/system/tnlcm-frontend.service << EOF
[Unit]
Description=TNLCM Frontend

[Service]
Type=simple
WorkingDirectory=${FRONTEND_PATH}/
ExecStart=/bin/bash -c '/usr/bin/npm start'
Restart=always

[Install]
WantedBy=multi-user.target
EOF

systemctl daemon-reload
systemctl enable --now tnlcm-frontend.service
