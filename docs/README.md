<a name="readme-top"></a>

<div align="center">

  [![Contributors][contributors-shield]][contributors-url]
  [![Forks][forks-shield]][forks-url]
  [![Stargazers][stars-shield]][stars-url]
  [![Issues][issues-shield]][issues-url]
  [![CodeFactor](https://www.codefactor.io/repository/github/6g-sandbox/tnlcm_frontend/badge/main)](https://www.codefactor.io/repository/github/6g-sandbox/tnlcm_frontend/overview/main)
  <!-- [![MIT License][license-shield]][license-url] -->
  <!-- [![LinkedIn][linkedin-shield]][linkedin-url] -->

  <a href="https://github.com/6G-SANDBOX/TNLCM"><img src="./images/logo.png" width="100" title="TNLCM"></a>

  [![TNLCM_FRONTEND][tnlcm-frontend-badge]][tnlcm-frontend-url]

  [Report error](https://github.com/6G-SANDBOX/TNLCM_FRONTEND/issues/new?assignees=&labels=&projects=&template=bug_report.md) · [Feature request](https://github.com/6G-SANDBOX/TNLCM_FRONTEND/issues/new?assignees=&labels=&projects=&template=feature_request.md)
</div>

TNLCM frontend is a web application tailored for use by the platform owners and, as such, will provide information and functionality for handling all the Trial Networks in the corresponding platform. To achieve this, the frontend makes use of the APIs exposed by the TNLCM. Other frontends, for example, a simplified one tailored for Experimenters or Trial Network owners can be developed by making use of the same APIs, either by an external developer or by the 6G-SANDBOX consortium.

> [!NOTE]
> TNLCM frontend is under development and is subject to continuous changes.

<details>
<summary>Table of Contents</summary>

- [:rocket: Getting Started Locally](#rocket-getting-started-locally)
  - [:inbox\_tray: Download or clone repository](#inbox_tray-download-or-clone-repository)
  - [:wrench: Configure environment variables](#wrench-configure-environment-variables)
  - [:file\_folder: Add node\_modules folder](#file_folder-add-node_modules-folder)
- [:hammer\_and\_wrench: Stack](#hammer_and_wrench-stack)
</details>

## :rocket: Getting Started Locally

> [!TIP]
> TNLCM frontend uses the following repository branches:
> 
> | Repository | Release                                                                |
> | ---------- | ---------------------------------------------------------------------- |
> | 6G-Library | [v0.3.1](https://github.com/6G-SANDBOX/6G-Library/releases/tag/v0.3.1) |
> | TNLCM      | [v0.4.4](https://github.com/6G-SANDBOX/TNLCM/releases/tag/v0.4.4)      |

### :inbox_tray: Download or clone repository

Download the **main** branch from the TNLCM_FRONTEND repository.

Clone repository:

```sh
git clone https://github.com/6G-SANDBOX/TNLCM_FRONTEND.git
```

### :wrench: Configure environment variables

Create a `.env` file at the root level, using the structure and content provided in the [`.env.template`](../.env.template) file.

Mandatory update the value of the variable according on the platform:
- `REACT_APP_ENDPOINT`

### :file_folder: Add node_modules folder

The **node_modules** must be created inside the TNLCM_FRONTEND project:

```sh
npm install
```

To start TNLCM frontend:

```sh
npm run dev
```

Frontend will be available at http://tnlcm-frontend-ip:3000

## :hammer_and_wrench: Stack

- [![Node.js][nodejs-badge]][nodejs-url] - JavaScript runtime platform.
- [![Next.js][react-badge]][react-url] - React framework for web applications. 

## Contributors <!-- omit in toc -->

<a href="https://github.com/6G-SANDBOX/TNLCM_FRONTEND/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=6G-SANDBOX/TNLCM_FRONTEND" />
</a>

<p align="right"><a href="#readme-top">Back to top&#x1F53C;</a></p>

<!-- Urls, Shields and Badges -->
[tnlcm-frontend-badge]: https://img.shields.io/badge/TNLCM_FRONTEND-v0.1.0-blue
[tnlcm-frontend-url]: https://github.com/6G-SANDBOX/TNLCM_FRONTEND/releases/tag/v0.1.0
[nodejs-badge]: https://img.shields.io/badge/Node.js-22.12.0-green?style=for-the-badge&logo=node.js&logoColor=white
[nodejs-url]: https://nodejs.org/en
[react-badge]: https://img.shields.io/badge/React-18.3.1-black?style=for-the-badge&logo=react&logoColor=white
[react-url]: https://es.react.dev/
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
