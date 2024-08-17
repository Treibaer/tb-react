# Game Project App (Modern Version)

## Overview

This project is a modern rewrite of a tool originally developed using PHP and JavaScript. The tool's primary goal is to combine multiple systems required for managing software projects into one streamlined application. It focuses on delivering the most essential features from platforms like Notion and Jira but in a faster, more lightweight, and highly connected manner.

### Features

- **Project Creation**: Quickly and easily create new projects with a minimal setup process.
- **Lightweight Ticket System**: Manage tasks and issues efficiently with a user-friendly ticketing system.
- **Integrated Wiki**: Maintain project documentation within a built-in wiki that’s easy to use and search.
- **User Management**: Simple and effective user system with role-based access control.

## Tech Stack

This modern version of the application is built using a state-of-the-art tech stack to ensure scalability, maintainability, and performance.

- **Frontend**: 
  - [React](https://reactjs.org/) - A JavaScript library for building user interfaces.
  - [Next.js](https://nextjs.org/) - A React framework for production, providing server-side rendering and static site generation.
  - [Redux](https://redux.js.org/) - A predictable state container for JavaScript apps, used to manage the application state.
  - [Tailwind CSS](https://tailwindcss.com/) - A utility-first CSS framework for rapidly building custom user interfaces.
  - [TypeScript](https://www.typescriptlang.org/) - A strongly typed programming language that builds on JavaScript.

- **Backend**:
  - **Current**: 
    - [PHP](https://www.php.net/) - A popular general-purpose scripting language that is especially suited to web development.
    - [Symfony](https://symfony.com/) - A set of reusable PHP components and a PHP framework for web projects.
  - **Planned**: 
    - [Node.js](https://nodejs.org/) - A JavaScript runtime built on Chrome's V8 JavaScript engine.
    - [Express](https://expressjs.com/) - A minimal and flexible Node.js web application framework for building APIs.

- **Database**: 
  - [MariaDB](https://mariadb.org/) - An open-source relational database management system, a fork of MySQL.

## Getting Started

### Prerequisites

Ensure you have the following installed:

- Node.js (>=14.x)
- npm

### Installation

1. **Clone the repository**:
    ```bash
    git clone https://github.com/Treibaer/tb-react
    cd tb-react
    ```

2. **Install dependencies for the frontend**:
    ```bash
    npm install
    ```

3. **Run the development server for the frontend**:
    ```bash
    npm run dev
    ```

    The app will be available at `http://localhost:3051`.

## Usage

### Project Creation

- Navigate to the "Projects" section to create and manage your projects.

### Ticket System

- Manage tickets through the "Tickets" section. Create, assign, and track progress effortlessly.

### Wiki

- Use the integrated wiki to keep all project documentation organized and easily accessible.

### User Management

- Admins can manage users and roles under the "User Management" section.

## Acknowledgements

- The original version of this tool was developed using PHP 8, Symfony 6.3, jQuery, and Bootstrap.
- Inspired by tools like Notion and Jira for feature ideas.
