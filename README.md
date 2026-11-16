# Haveje IF – Booking System

## Project Description

This project is a web-based booking system developed for the sports association **Haveje IF**.

The purpose of the system is to provide Haveje IF with a flexible and user-friendly platform for managing bookable resources and reservations. The system is intended to replace the association's current booking solution and give the association greater control over its own booking data and infrastructure.

Members will be able to register, log in, view available resources, make bookings and manage their existing reservations. Administrators will have additional permissions to manage members, resources and bookings.

The application will be accessible through a web browser on both desktop and mobile devices.

## Main Features

### Member functionality
- Register a new member account.
- Log in and access the booking system.
- View available bookable resources.
- View resource details, including name, location, type and capacity.
- View available dates and time slots.
- Create bookings for available resources.
- View existing bookings.
- Cancel bookings.

### Administrator functionality
- Manage member accounts.
- Create, edit and delete bookable resources.
- View and manage bookings.
- Approve or reject bookings when manual approval is enabled.
- Configure whether bookings require manual or automatic approval.

### Booking management
- Prevent double bookings and overlapping reservations for the same resource.
- Check whether a member is eligible to make a booking.
- Keep track of booking statuses, such as pending, approved, rejected and cancelled.

## Technologies

The project is developed using the following technologies:

| Area | Technology |
|---|---|
| Frontend | React, JavaScript, HTML and CSS |
| Frontend development server | Vite |
| Backend | Java and Spring Boot |
| Database | MySQL |
| Backend build tool | Maven |
| Version control | Git and GitHub |
| UI design and prototyping | Figma |
| IDE | IntelliJ IDEA |

## Project Structure

The repository is organized into separate frontend and backend applications.

```text
HavejeIF-BookingSystem/
│
├── backend/
│   ├── src/
│   ├── pom.xml
│   └── README.md
│
├── frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── README.md
│
├── database/
│   └── schema.sql
│
├── docs/
│   └── project-documentation/
│
└── README.md
```

### Frontend

The frontend is developed using React and is responsible for the user interface and interaction with the booking system.

It communicates with the backend through HTTP requests to the REST API.

See [frontend/README.md](frontend/README.md) for setup instructions.

### Backend

The backend is developed using Java and Spring Boot.

It handles the application's business logic, user authentication, booking validation, resource management and communication with the database.

See [backend/README.md](backend/README.md) for setup instructions.

### Database

MySQL is used to store information about members, resources and bookings.

The database is responsible for maintaining the application's data and supporting the booking system's requirements.

## Getting Started

To run the complete application locally, you need to start the database, backend and frontend.

### Prerequisites

Install the following:

- Java Development Kit (JDK), matching the version configured in the backend.
- IntelliJ IDEA.
- Node.js and npm.
- MySQL Server.
- Git.

### 1. Clone the repository

```bash
git clone <GITHUB_REPOSITORY_URL>
cd HavejeIF-BookingSystem
```

### 2. Start the database

Make sure your MySQL server is running.

Create the database and configure the connection details used by the backend.

See the backend README for database configuration.

### 3. Start the backend

Open the `backend` folder in IntelliJ IDEA.

Configure the database connection and run the Spring Boot application.

The backend will normally run at:

```text
http://localhost:8080
```

### 4. Start the frontend

Open a terminal in the `frontend` folder and run:

```bash
npm install
npm run dev
```

The frontend will normally be available at:

```text
http://localhost:5173
```

## Development Workflow

The project is developed iteratively using an Agile development process based on Scrum.

The team uses Git and GitHub for version control and collaboration.

Recommended workflow:

1. Create a separate branch for each feature or task.
2. Implement and test the changes locally.
3. Commit and push the changes to GitHub.
4. Create a Pull Request.
5. Review and merge the changes into the main branch.

## Project Team

The project is developed by a group of seven students at the Technical University of Denmark (DTU) in collaboration with Haveje IF.

The project is part of the course Software Processes and Patterns.

## Project Status

The project is under development. Features and documentation will be updated throughout the development process.
