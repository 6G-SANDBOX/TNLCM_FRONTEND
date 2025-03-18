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
    git clone https://github.com/6G-SANDBOX/TNLCM ${FRONTEND_PATH}
fi

echo "Copying .env.template to .env..."
cp ${FRONTEND_PATH}/.env.template ${FRONTEND_PATH}/.env

HOST_IP=$(hostname -I | awk '{print $1}')
echo "Updating the .env file..."
REACT_APP_TNLCM_BACKEND_API="http://${HOST_IP}:3000"
sed -i "s/^REACT_APP_TNLCM_BACKEND_API=.*/REACT_APP_TNLCM_BACKEND_API=\"${REACT_APP_TNLCM_BACKEND_API}\"/" ${FRONTEND_DOTENV_FILE}

echo "Installing TNLCM dependencies..."
npm --prefix ${FRONTEND_PATH}/ install

echo "--------------- Installing nginx ---------------"
apt-get install -y nginx
sudo mkdir -p /etc/nginx/ssl
sudo openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout /etc/nginx/ssl/tnlcm.key -out /etc/nginx/ssl/tnlcm.crt -subj "/CN=${HOST_IP}"
cat > /etc/nginx/sites-enabled/tnlcm << EOF
server {
    listen 80;
    server_name ${HOST_IP};
    return 301 https://\$host\$request_uri;
}
server {
    listen 443 ssl;
    server_name ${HOST_IP};
    ssl_certificate /etc/nginx/ssl/tnlcm.crt;
    ssl_certificate_key /etc/nginx/ssl/tnlcm.key;
    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
    }
}
EOF

systemctl restart nginx

cd ${FRONTEND_PATH} || exit
npm run start
