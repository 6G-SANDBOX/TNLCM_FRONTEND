<a name="readme-top"></a>

<div align="center">

  [![Contributors][contributors-shield]][contributors-url]
  [![Forks][forks-shield]][forks-url]
  [![Stargazers][stars-shield]][stars-url]
  [![Issues][issues-shield]][issues-url]

  <a href="https://github.com/6G-SANDBOX/TNLCM_FRONTEND"><img src="../public/TNLCM_LOGO.png" width="80" title="TNLCM_FRONTEND"></a>

  # Trial Network Life Cycle Manager Frontend - TNLCM <!-- omit in toc -->

  [![TNLCM_FRONTEND][tnlcm-frontend-badge]][tnlcm-frontend-url]

  [Report error](https://github.com/6G-SANDBOX/TNLCM_FRONTEND/issues) · [Suggest something](https://github.com/6G-SANDBOX/TNLCM_FRONTEND/issues)
</div>

TNLCM Frontend is a web application tailored for use by the platform owners and, as such, will provide information and functionality for handling all the Trial Networks in the corresponding platform. To achieve this, the Frontend makes use of the APIs exposed by the TNLCM. Other Frontends, for example, a simplified one tailored for Experimenters or Trial Network owners can be developed by making use of the same APIs, either by an external developer or by the 6G-SANDBOX consortium.

> [!WARNING]
> TNLCM Frontend is under development and is subject to continuous changes.

<details>
<summary>Table of Contents</summary>

- [🛠️ Stack](#️-stack)
- [Distribution of branches](#distribution-of-branches)
- [🚀 Getting Started](#-getting-started)
  - [Download or clone repository](#download-or-clone-repository)
  - [Create .env using .env.template](#create-env-using-envtemplate)
  - [Add node\_modules folder](#add-node_modules-folder)
</details>

## 🛠️ Stack

- [![Node.js][nodejs-badge]][nodejs-url] - JavaScript runtime platform.
- [![Next.js][nextjs-badge]][nextjs-url] - React framework for web applications. 

## Distribution of branches

The **main** branch will be updated every time there is a plenary meeting. Releases will be created from this branch.

The **dev** branch will be used for development. This branch will feed the staging and main branches.

The **staging** branch will be updated every time there is a plenary meeting or a demo.

## 🚀 Getting Started

### Download or clone repository

Download the main branch from the TNLCM repository

Clone repository:

```bash
git clone https://github.com/6G-SANDBOX/TNLCM_FRONTEND.git
```

### Create .env using .env.template

Create the .env file at the same level and with the contents of the [.env.template](./.env.template) file.

### Add node_modules folder

> [!WARNING] 
> This step requires Node.js to be installed on the machine.

* [Windows](https://nodejs.org/en)
* [Linux](https://github.com/nodesource/distributions/blob/master/README.md)

    ```bash
    curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash - &&\
    sudo apt-get install -y nodejs
    ```

The **node_modules/** must be created inside the TNLCM_FRONTEND project

```bash
npm install
```

To start TNLCM frontend

```bash
npm run dev
```

Frontend will be available at http://localhost:3000

<p align="right"><a href="#readme-top">Back to top🔼</a></p>

<!-- Urls, Shields and Badges -->
[tnlcm-frontend-badge]: https://img.shields.io/badge/TNLCM_FRONTEND-v0.0.0-blue
[tnlcm-frontend-url]: https://github.com/6G-SANDBOX/TNLCM_FRONTEND/releases/tag/v0.1.0
[nodejs-badge]: https://img.shields.io/badge/Node.js-20.11.1+-green?style=for-the-badge&logo=node.js&logoColor=white
[nodejs-url]: https://nodejs.org/en
[nextjs-badge]: https://img.shields.io/badge/Next.js-14+-black?style=for-the-badge&logo=next.js&logoColor=white
[nextjs-url]: https://nextjs.org/
[contributors-shield]: https://img.shields.io/github/contributors/6G-SANDBOX/TNLCM_FRONTEND.svg?style=for-the-badge
[contributors-url]: https://github.com/6G-SANDBOX/TNLCM_FRONTEND/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/6G-SANDBOX/TNLCM_FRONTEND.svg?style=for-the-badge
[forks-url]: https://github.com/6G-SANDBOX/TNLCM_FRONTEND/network/members
[stars-shield]: https://img.shields.io/github/stars/6G-SANDBOX/TNLCM_FRONTEND.svg?style=for-the-badge
[stars-url]: https://github.com/6G-SANDBOX/TNLCM_FRONTEND/stargazers
[issues-shield]: https://img.shields.io/github/issues/6G-SANDBOX/TNLCM_FRONTEND.svg?style=for-the-badge
[issues-url]: https://github.com/6G-SANDBOX/TNLCM_FRONTEND/issues