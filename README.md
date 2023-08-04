Assignments:-

Welcome to the Project repository! This is a Node.js project developed using TypeScript, Express, Swagger, MySQL, and RESTful APIs. The project implements a user management system with Super Admin, Admin, and User roles, allowing different levels of access to various features.

Table of Contents
1. Introduction
2. Features
3. Installation
4. Usage
5. API Documentation
6. File System and Excel Logging

Introduction:-
The Project Name is a web application that serves as a user management system with hierarchical access control. It enables Super Admin, Admin, and User roles, each having specific privileges and restrictions.

Features:-
1. Super Admin Role: The Super Admin has access to all operations on both Admin and User APIs. They can create feeds and assign them to Admins and Users.

2. Admin Role: Admins are created by Super Admins and have limited permissions. They can create, update, and delete Users, as well as assign feeds to them.

3. User Role: Users can only view the feeds assigned to them and their details.

4. File System and Excel Logging: The project uses the Node.js file system and node-cron npm package to create an Excel file every 5 minutes. The Excel file logs CRUD operations performed by Admins, Feeds, and Users. Files older than 30 minutes are automatically deleted.

Installation:-
1. Clone this repository to your local machine using git clone <repository-url>

2. Navigate to the project directory: cd <project-directory>

3. Install the required dependencies: `npm install`

3. Setup database settings inside `src/Loaders/TypeormLoader.ts` file

4. To start the application, run the following command: `npm start` command

5. The application will be accessible at `http://localhost:<PORT>`, where <PORT> is the port number specified in the configuration.

API Documentation:-
1. The API endpoints are documented using Swagger. Once the server is running, you can access the API documentation at `http://localhost:<PORT>/swagger` .

File System and Excel Logging:-
1. The project uses the Node.js file system and the node-cron npm package to create an Excel file every 5 minutes. The Excel file contains logs of CRUD operations performed by Admins, Feeds, and Users. Files older than 30 minutes are automatically deleted to manage disk space.

