# Backend – Haveje IF Booking System

## Description

The backend is responsible for handling the application's business logic, data processing and communication with the database.

It is developed using **Java and Spring Boot** and exposes a REST API that the React frontend uses to communicate with the system.

The backend ensures that bookings follow the rules defined by Haveje IF. This includes checking resource availability, validating users and preventing overlapping reservations.

## Technologies

- Java
- Spring Boot
- Spring Web
- Spring Data JPA
- MySQL
- Maven
- Git

## Architecture

The backend follows a layered architecture to separate responsibilities and make the application easier to maintain and extend.

The main layers are:

### Controller
Handles incoming HTTP requests from the frontend and returns appropriate responses.

### Service
Contains the application's business logic and validation rules.

### Repository
Handles communication with the database through Spring Data JPA.

### Model
Contains the application's main data entities, such as users, resources and bookings.

### DTO (Data Transfer Objects)
Defines the data transferred between the frontend and backend.

### Config
Contains application configuration, such as security and CORS settings.

### Exception
Contains custom exceptions and error handling.

## Project Structure

```text
backend/
│
├── src/
│   ├── main/
│   │   ├── java/
│   │   │   └── dk/
│   │   │       └── havejeif/
│   │   │           └── booking/
│   │   │               │
│   │   │               ├── config/
│   │   │               ├── controller/
│   │   │               ├── service/
│   │   │               ├── repository/
│   │   │               ├── model/
│   │   │               ├── dto/
│   │   │               └── exception/
│   │   │
│   │   └── resources/
│   │       └── application.properties
│   │
│   └── test/
│       └── java/
│
├── pom.xml
└── README.md
```

## Main Data Entities

The backend will manage the following main entities:

### User
Represents a registered member or administrator.

Possible attributes:
- ID
- Full name
- Email
- Password
- Phone number
- Address
- Postal code
- Municipality
- Country
- Birthdate
- Sex
- Role
- Membership status

### Resource
Represents a bookable facility or resource.

Possible attributes:
- ID
- Name
- Location
- Type
- Capacity
- Booking approval setting

### Booking
Represents a reservation made by a member.

Possible attributes:
- ID
- User
- Resource
- Start time
- End time
- Team name
- Booking status

The final database structure will be determined during implementation.

## API Responsibilities

The backend provides endpoints for the frontend to access the system's functionality.

The planned API functionality includes:

| Area | Functionality |
|---|---|
| Authentication | Register and log in |
| Users | View and manage member information |
| Resources | View, create, update and delete resources |
| Bookings | Create, view and cancel bookings |
| Administration | Manage users, resources and bookings |
| Approvals | Approve or reject pending bookings |

All booking validation must be handled by the backend rather than relying only on frontend checks.

In particular, the backend must verify that:
- The user is eligible to make a booking.
- The selected resource exists.
- The requested time period is valid.
- The resource is not already booked during an overlapping period.
- The booking follows the resource's approval settings.

## Database Configuration

The backend uses MySQL.

Before running the application:

1. Make sure MySQL Server is running.
2. Create the project database.
3. Configure the database connection in `src/main/resources/application.properties`.

Example configuration:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/havejeif_booking
spring.datasource.username=${DB_USERNAME}
spring.datasource.password=${DB_PASSWORD}

spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
```

The database username and password should be configured as environment variables.

Do not commit real passwords or other sensitive credentials to GitHub.

The Hibernate configuration shown above is intended for local development. The final database configuration should be reviewed before deployment.

## Running the Backend

### Prerequisites

- Java JDK matching the project configuration.
- IntelliJ IDEA.
- MySQL Server.
- Maven (or the included Maven Wrapper, if available).

### Running through IntelliJ IDEA

1. Open the `backend` folder or the backend Maven project in IntelliJ IDEA.
2. Wait for Maven to load the dependencies.
3. Configure the MySQL database connection.
4. Locate the main Spring Boot application class.
5. Run the application.

The backend will normally start at:

```text
http://localhost:8080
```

### Running through the terminal

From the backend directory:

```bash
mvn spring-boot:run
```

## Testing

The backend will use different levels of testing:

- Unit testing: Test individual service methods and business logic.
- Integration testing: Test communication between controllers, services and repositories.
- Database testing: Verify that data is stored and retrieved correctly.
- Acceptance testing: Verify that the system meets Haveje IF's requirements.

Important booking scenarios to test include overlapping reservations, unavailable resources, invalid users and booking approval.

## Development

The backend is developed as part of the Haveje IF Booking System project.

The application is under development, and the structure and functionality may change as new requirements are implemented.
