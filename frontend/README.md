# Frontend – Haveje IF Booking System

## Description

The frontend is the user-facing part of the Haveje IF Booking System.

It is developed using **React and JavaScript**, with Vite as the development server and build tool.

The frontend provides the interface through which members and administrators interact with the booking system.

Members can register, log in, view available resources, make bookings and manage their reservations.

Administrators have access to additional functionality for managing members, resources and bookings.

The application is designed to be simple, intuitive and responsive, supporting both desktop and mobile devices.

## Technologies

- React
- JavaScript
- HTML
- CSS
- Vite
- Git

## Architecture

The frontend follows a component-based architecture.

The user interface is divided into reusable components and pages to make the application easier to develop, maintain and extend.

### Components
Reusable interface elements, such as navigation bars, buttons, forms and booking cards.

### Pages
Represent the different screens of the application, such as the login page, resource overview and booking calendar.

### Features
Contains functionality grouped by application area, such as authentication, resources and bookings.

### Services
Handles communication with the backend REST API.

### Styles
Contains CSS files used to style the application.

## Project Structure

```text
frontend/
│
├── public/
│
├── src/
│   │
│   ├── components/
│   │
│   ├── features/
│   │   ├── authentication/
│   │   ├── resources/
│   │   ├── bookings/
│   │   ├── users/
│   │   └── administration/
│   │
│   ├── pages/
│   │
│   ├── services/
│   │
│   ├── hooks/
│   │
│   ├── styles/
│   │
│   ├── App.jsx
│   └── main.jsx
│
├── package.json
├── index.html
└── README.md
```

## Main Features

### Member Interface
- Registration page.
- Login page.
- Resource overview.
- Resource availability and booking calendar.
- Booking creation.
- Overview of existing bookings.
- Booking cancellation.

### Administrator Interface
- Administrative dashboard.
- Member management.
- Resource management.
- Booking overview.
- Manual approval or rejection of booking requests.

### User Interface Requirements
- Danish language.
- Responsive design for desktop and mobile devices.
- Clear navigation.
- Simple booking process.
- Clear feedback when bookings are created, cancelled, approved or rejected.

## Communication with the Backend

The frontend communicates with the backend through HTTP requests to the Spring Boot REST API.

The backend is responsible for processing requests, validating data and communicating with the MySQL database.

The frontend displays the information received from the backend and provides feedback to the user.

The backend API is expected to run locally at:

```text
http://localhost:8080
```

The frontend will normally run at:

```text
http://localhost:5173
```

The frontend API configuration should be centralized in the `services` folder rather than spreading backend URLs throughout the application.

## Running the Frontend

### Prerequisites

- Node.js.
- npm.
- IntelliJ IDEA.

### 1. Install dependencies

Open a terminal in the `frontend` directory and run:

```bash
npm install
```

### 2. Start the development server

Run:

```bash
npm run dev
```

Vite will start the frontend development server.

Open the displayed local URL in your browser. Normally:

```text
http://localhost:5173
```

### 3. Build the application

To create a production build, run:

```bash
npm run build
```

The generated files will be placed in the `dist` folder.

### 4. Preview the production build

Run:

```bash
npm run preview
```

## Development

The frontend is developed as part of the Haveje IF Booking System project.

The initial user interface was designed in Figma. The React implementation will be developed based on the agreed requirements and design.

The frontend is under development, and new components and features will be added throughout the project.
