# Job Portal Backend

This project is a backend-only implementation of a Job Portal. It provides API for managing users, jobs, and job-related statistics.

## Features
- **User Management**: User registration, login, and profile updates.
- **Job Management**: Create, update, delete, and retrieve jobs.
- **Advanced Job Filtering**: Search for jobs based on criteria like status and keywords.
- **Job Statistics**:
  - Overall job statistics categorized by status (e.g., Pending, Rejected, Interview).
  - Monthly application statistics.
- **Secure Authentication**: Token-based authentication with middleware for access control.
- **Error Handling**: Centralized error handling middleware for clean and maintainable code.

## Technology Stack
- **Node.js**: Backend runtime.
- **MongoDB**: Database for storing user and job data.
- **Mongoose**: ORM for database operations.
- **Swagger**: API documentation.
- **Security Packages**: Implemented to ensure secure authentication and data handling.

## Current State
This project was developed for learning purposes and remains in development mode. While the API exposes tokens in responses for debugging, this is not suitable for production use. Future improvements should include:
- Removing tokens from API responses.
- Implementing proper logging and monitoring.

## Setup Instructions
1. Clone the repository:
   ```bash
   git clone complete-url-of-repository

2. Install dependencies:
npm install

3. Configure environment variables in a .env file:
PORT=3100
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret

4. Start the server:
npm start

### Disclaimer
This project is intended for development purposes only. Certain features, such as token exposure in API responses, were implemented for debugging and testing during development. These practices are not suitable for production use. For secure implementation, ensure tokens are never sent in responses and follow industry-standard best practices for security.
