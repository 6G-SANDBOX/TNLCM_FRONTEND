# TNLCM FRONTEND

# React App Setup Guide

This guide will walk you through the steps to set up and run a the front end application, including installing dependencies, adding Font Awesome for icons, and starting the development server.

## Prerequisites

Before you begin, ensure you have the following installed on your machine:

- **Node.js** (v14 or later) and **npm** (Node Package Manager)
- A code editor (e.g., VS Code)

## Steps to Set Up the App

### 1. Clone the Repository

If you haven’t already cloned the project repository, do so with the following command:

```bash
git clone <repository-url>
cd <project-folder>
```

### 2. Install Dependencies

Run the following command to install all necessary dependencies:

```bash
npm install
```

This will install the packages listed in the `package.json` file.

### 3. Install Font Awesome

To add Font Awesome for icons, install the following packages:

```bash
npm install --save @fortawesome/fontawesome-svg-core @fortawesome/free-solid-svg-icons @fortawesome/react-fontawesome
```

#### Optionally, you can install other Font Awesome icon packs, such as:

- Free Regular Icons:
  ```bash
  npm install --save @fortawesome/free-regular-svg-icons
  ```
- Free Brands Icons:
  ```bash
  npm install --save @fortawesome/free-brands-svg-icons
  ```

### 4. Start the Development Server

Run the following command to start the app in development mode:

```bash
npm run dev
```

This will start the development server and provide a local URL (usually `http://localhost:3000`) to preview the app in your browser.

## Additional Notes

- Make sure to check the `README` or `package.json` of the project for any specific configurations or scripts that might differ.
- If you encounter issues during setup, ensure that all dependencies are correctly installed and that your Node.js version meets the requirements.

Enjoy building and running your React application!
