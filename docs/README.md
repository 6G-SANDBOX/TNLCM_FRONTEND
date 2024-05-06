<a name="readme-top"></a>

<div align="center">

  [![Contributors][contributors-shield]][contributors-url]
  [![Forks][forks-shield]][forks-url]
  [![Stargazers][stars-shield]][stars-url]
  [![Issues][issues-shield]][issues-url]
  <!-- [![MIT License][license-shield]][license-url] -->
  <!-- [![LinkedIn][linkedin-shield]][linkedin-url] -->

  <a href="https://github.com/6G-SANDBOX/TNLCM_FRONTEND"><img src="../public/TNLCM_LOGO.png" width="80" title="TNLCM_FRONTEND"></a>

  # Trial Network Life Cycle Manager Frontend - TNLCM <!-- omit in toc -->

  [![TNLCM_FRONTEND][tnlcm-frontend-badge]][tnlcm-frontend-url]

  [Report error](https://github.com/6G-SANDBOX/TNLCM_FRONTEND/issues/new?assignees=&labels=&projects=&template=bug_report.md) · [Feature request](https://github.com/6G-SANDBOX/TNLCM_FRONTEND/issues/new?assignees=&labels=&projects=&template=feature_request.md)
</div>

TNLCM frontend is a web application tailored for use by the platform owners and, as such, will provide information and functionality for handling all the Trial Networks in the corresponding platform. To achieve this, the frontend makes use of the APIs exposed by the TNLCM. Other frontends, for example, a simplified one tailored for Experimenters or Trial Network owners can be developed by making use of the same APIs, either by an external developer or by the 6G-SANDBOX consortium.

> [!NOTE]
> TNLCM frontend is under development and is subject to continuous changes.

<details>
<summary>Table of Contents</summary>

- [:hammer\_and\_wrench: Stack](#hammer_and_wrench-stack)
- [:rocket: Getting Started](#rocket-getting-started)
  - [:inbox\_tray: Download or clone repository](#inbox_tray-download-or-clone-repository)
  - [:wrench: Configure environment variables](#wrench-configure-environment-variables)
  - [:file\_folder: Add node\_modules folder](#file_folder-add-node_modules-folder)
</details>

## :hammer_and_wrench: Stack

- [![Node.js][nodejs-badge]][nodejs-url] - JavaScript runtime platform.
- [![Next.js][nextjs-badge]][nextjs-url] - React framework for web applications. 

## :rocket: Getting Started

> [!WARNING] 
> The following tools are required to be deployed on platforms:
> 
> * Jenkins (Mandatory)
> * OpenNebula (Mandatory)
> * MinIO (Mandatory)
> * TNLCM_BACKEND (Mandatory)

> [!NOTE]
> TNLCM frontend is being developed on Windows 10 and has been tested on Windows 10 and Ubuntu 22.04.3 LTS.

### :inbox_tray: Download or clone repository

Download the **main** branch from the TNLCM_FRONTEND repository.

Clone repository:

```sh
git clone https://github.com/6G-SANDBOX/TNLCM_FRONTEND.git
```

### :wrench: Configure environment variables

Create a `.env` file at the root level, using the structure and content provided in the [`.env.template`](../.env.template) file.

Mandatory update the value of the variable according on the platform:
- `NEXT_PUBLIC_TNLCM_BACKEND`

### :file_folder: Add node_modules folder

> [!IMPORTANT]
> This step requires **Node.js** to be installed on the machine.

* [Windows](https://nodejs.org/en)
* [Ubuntu](https://github.com/nodesource/distributions/blob/master/README.md)

  ```sh
  curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash - &&\
  sudo apt-get install -y nodejs
  ```

The **node_modules** must be created inside the TNLCM_FRONTEND project:

```sh
npm install
```

To start TNLCM frontend:

```sh
npm run dev
```

Frontend will be available at http://tnlcm-frontend-ip:3000

<p align="right"><a href="#readme-top">Back to top&#x1F53C;</a></p>

## :construction_worker: Development Team <!-- omit in toc -->

| Photo | Name | Email | GitHub | Linkedin |
| :---: | :--: | :---: | :----: | :------: |
| <img src="https://github.com/CarlosAndreo.png?size=50" width=50px> | Carlos Andreo López | c.andreo@uma.es | <a href="https://github.com/CarlosAndreo"><img src="https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white"></a> | <a href="https://www.linkedin.com/in/carlos-andreo-lópez-66734b22a/"><img src="https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white"></a> |

<p align="right"><a href="#readme-top">Back to top&#x1F53C;</a></p>

<!-- Urls, Shields and Badges -->
[tnlcm-frontend-badge]: https://img.shields.io/badge/TNLCM_FRONTEND-v0.0.0-blue
[tnlcm-frontend-url]: https://github.com/6G-SANDBOX/TNLCM_FRONTEND/releases/tag/v0.0.0
[nodejs-badge]: https://img.shields.io/badge/Node.js-20.12.2-green?style=for-the-badge&logo=node.js&logoColor=white
[nodejs-url]: https://nodejs.org/en
[nextjs-badge]: https://img.shields.io/badge/Next.js-14.2.3-black?style=for-the-badge&logo=next.js&logoColor=white
[nextjs-url]: https://nextjs.org/
[contributors-shield]: https://img.shields.io/github/contributors/6G-SANDBOX/TNLCM_FRONTEND.svg?style=for-the-badge
[contributors-url]: https://github.com/6G-SANDBOX/TNLCM_FRONTEND/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/6G-SANDBOX/TNLCM_FRONTEND.svg?style=for-the-badge
[forks-url]: https://github.com/6G-SANDBOX/TNLCM_FRONTEND/network/members
[stars-shield]: https://img.shields.io/github/stars/6G-SANDBOX/TNLCM_FRONTEND.svg?style=for-the-badge
[stars-url]: https://github.com/6G-SANDBOX/TNLCM_FRONTEND/stargazers
[issues-shield]: https://img.shields.io/github/issues/6G-SANDBOX/TNLCM_FRONTEND.svg?style=for-the-badge
[issues-url]: https://github.com/6G-SANDBOX/TNLCM_FRONTEND/issues
[linkedin-shield]: https://img.shields.io/badge/-LinkedIn-black.svg?style=for-the-badge&logo=linkedin&colorB=555
[linkedin-url]: https://www.linkedin.com/company/itisuma/
[license-shield]: https://
[license-url]: https://