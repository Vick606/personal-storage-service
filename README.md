# 🚀 Personal Storage Service

## 📚 Table of Contents
- [Overview](#-overview)
- [Features](#-features)
- [Technologies Used](#-technologies-used)
- [Getting Started](#-getting-started)
- [API Endpoints](#-api-endpoints)
- [Contributing](#-contributing)
- [License](#-license)

## 🌟 Overview

Personal Storage Service is a web application that allows users to store, organize, and share their files securely. It's a stripped-down version of popular cloud storage services, built with modern web technologies.

## ✨ Features

- 🔐 User authentication and registration
- 📁 Create and manage folders
- 📤 Upload and store files
- 🔍 View and download files
- 🔗 Generate time-limited share links for folders
- 🗑️ Delete files and folders

## 🛠️ Technologies Used

- 🖥️ **Backend**: Node.js, Express.js
- 🗄️ **Database**: PostgreSQL with Prisma ORM
- 🔒 **Authentication**: Passport.js
- 🖼️ **File Storage**: Cloudinary
- 🎨 **Frontend**: EJS templates, Tailwind CSS
- 🔧 **Build Tools**: npm

## 🚀 Getting Started

1. Clone the repository.
2. Install dependencies.
3. Set up your env variables in a '.env' file.
4. Run database migrations. 
5. Start server. 
6. Visit localhost:3000 in your browser. 

## 🔗 API Endpoints

- 🔐 **Auth**
  - POST `/auth/register`: Register a new user
  - POST `/auth/login`: Log in a user
  - POST `/auth/logout`: Log out a user

- 📁 **Folders**
  - GET `/folders`: Get all folders for the authenticated user
  - POST `/folders`: Create a new folder
  - GET `/folders/:id`: Get a specific folder
  - PUT `/folders/:id`: Update a folder
  - DELETE `/folders/:id`: Delete a folder

- 📄 **Files**
  - POST `/files/upload`: Upload a file
  - GET `/files/:id`: Get file details
  - DELETE `/files/:id`: Delete a file

- 🔗 **Share**
  - POST `/share/:folderId`: Generate a share link for a folder
  - GET `/share/:shareId`: Access a shared folder

## 👥 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.