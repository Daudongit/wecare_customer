# Gemini Project Details: wecare_customer

This document provides project-specific information for the Gemini AI assistant to ensure it can assist effectively and adhere to this project's standards.

## 1. Project Overview

- **Project Name:** `wecare_customer`
- **Description:** This is a React Native application for online doctor consultations. It appears to be the customer-facing part of the system.
- **Technology Stack:**
    - React Native
    - TypeScript
    - Redux for state management
    - React Navigation for routing
    - Numerous other libraries for features like payments, maps, chat, etc.

## 2. Key Commands

Based on `package.json`, here are the primary commands for this project:

- **Start Metro Bundler:**
  ```bash
  npm run start
  ```

- **Run on Android:**
  ```bash
  npm run android
  ```

- **Run on iOS:**
  ```bash
  npm run ios
  ```

- **Run Linter:**
  ```bash
  npm run lint
  ```

- **Run Tests:**
  ```bash
  npm run test
  ```

## 3. Coding Conventions & Style

- **Code Style:** The project uses ESLint (`.eslintrc.js`) for linting and Prettier (`.prettierrc.js`) for code formatting. All contributions should adhere to these configurations.
- **File Naming:**
    - Components seem to be in `.jsx` files (e.g., `AboutUs.jsx`).
    - The main entry point is `App.tsx`, indicating a mix of TypeScript and JavaScript (JSX).
- **Directory Structure:**
    - `src/views`: Contains the main screens/pages of the application.
    - `src/components`: Contains reusable UI components.
    - `src/actions` & `src/reducers`: Indicate the use of Redux for state management.
    - `src/assets`: Contains static assets like images and CSS.
    - `src/config`: Contains configuration files like constants.

## 4. Project Goals & Instructions

*(Please add any specific goals, architectural guidelines, or instructions for Gemini here.)*
