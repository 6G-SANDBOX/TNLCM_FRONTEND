# TRIAL NETWORK LIFECYCLE MANAGER FRONTEND (TNLCM) <!-- omit in toc -->

[![Node.js](https://img.shields.io/badge/Node.js-20.11.1+-green?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/en)
[![Next.js](https://img.shields.io/badge/Next.js-14+-black?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)

> ⚠ TNLCM frontend is under development and is subject to continuous changes.

## Table of contents <!-- omit in toc -->
- [Deploy TNLCM frontend](#deploy-tnlcm-frontend)
  - [Download or clone repository](#download-or-clone-repository)
  - [Create .env using .env.template](#create-env-using-envtemplate)
  - [Add the node\_modules folder](#add-the-node_modules-folder)
  - [Start TNLCM frontend](#start-tnlcm-frontend)

## Deploy TNLCM frontend

### Download or clone repository

Download the main branch from the TNLCM repository

Clone repository:

    git clone https://github.com/6G-SANDBOX/TNLCM_FRONTEND.git

### Create .env using .env.template

Create the .env file at the same level and with the contents of the [.env.template](./.env.template) file.

### Add the node_modules folder

> ⚠ This step requires Node.js to be installed on the machine.

* [Windows](https://nodejs.org/en)
* [Linux](https://github.com/nodesource/distributions/blob/master/README.md)

    ```
    curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash - &&\
    sudo apt-get install -y nodejs
    ```

The **node_modules/** must be created inside the TNLCM_FRONTEND project

    npm install

### Start TNLCM frontend

    npm run dev

Frontend will be available at http://localhost:3000