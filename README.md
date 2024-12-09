# Permiset Documentation


# Permiset Backend 
Permiset is a user, role, and access management system. The backend is implemented using Node.js, Express, and TypeScript. A lightweight fake database using `lowdb` is used for data storage.

---

## Core Components

### 1. Project Structure
The backend is organized modularly. Key folders and files include:

- **`/api`**: Contains routes (endpoints) for working with users, roles, and authentication:  
  - `/users`: User operations (CRUD).  
  - `/roles`: Role management (CRUD).  
  - `/auth`: Routes for authorization, authentication, and registration.  

- **`/middlewares`**: Middleware functions for token verification, access control, and other tasks.  

- **`/services`**: Business logic (e.g., access control checks).  

- **`/db`**: Database files:  
  - `db.json`: Main data storage (users, roles, tokens, etc.).  
  - `index.ts`: Database utility functions.  

- **`/utils`**: Utility functions (e.g., for password hashing or data validation).  

- **`swagger.json`**: API documentation description (Swagger/OpenAPI).

---

### 2. Key Features

#### 2.1 Users (`/users`)
The backend provides CRUD operations for user management. Each user has the following attributes:
- **`id`**: Unique identifier.  
- **`name`**: User's name.  
- **`email`**: Email address.  
- **`password`**: Hashed password.  
- **`role`**: User's role (e.g., Administrator, Manager, User).  
- **`status`**: User status (active or inactive).  
- **`createdAt`**, **`updatedAt`**: Creation and last update timestamps.  

Available endpoints:
- **GET `/users`**: Retrieve a list of users (protected route).  
- **POST `/users`**: Create a new user (admin-only).  
- **GET `/users/:id`**: Retrieve information about a specific user.  
- **PUT `/users/:id`**: Update user data.  
- **DELETE `/users/:id`**: Delete a user.  

---

#### 2.2 Roles (`/roles`)
Roles define the actions a user can perform. Each role includes:
- **`id`**: Unique identifier.  
- **`name`**: Role name (e.g., User, Manager, Administrator).  
- **`permissions`**: A list of associated permissions (e.g., read, create, update, delete).  

Available endpoints:
- **GET `/roles`**: Retrieve a list of roles.  
- **POST `/roles`**: Create a new role.  
- **GET `/roles/:id`**: Retrieve information about a specific role.  
- **PUT `/roles/:id`**: Update a role.  
- **DELETE `/roles/:id`**: Delete a role.  

---

#### 2.3 Authentication and Authorization (`/auth`)
The system uses JSON Web Tokens (JWT) for secure request authorization.  

Available endpoints:
- **POST `/auth/login`**:  
  - Verifies user email and password.  
  - Returns an `Access Token` (valid for 1 hour) and a `Refresh Token` (valid for 7 days).  

- **POST `/auth/refresh`**:  
  - Uses the `Refresh Token` to issue a new `Access Token`.  

- **POST `/auth/register`**:  
  - Registers a new user (does not require a token).  

- **GET `/auth/verify`**:  
  - Validates the token (for debugging purposes).  

---

### 3. Route Protection

#### 3.1 Authentication Middleware
The `authenticate` middleware verifies that the request includes a valid `Access Token`. If the token is missing or invalid, the request is rejected with a `401 Unauthorized` error.  

#### 3.2 Permissions Middleware
The `checkPermissions` middleware ensures the current user has the necessary permissions for a specific action. Examples:
- Only administrators can create, update, or delete users.  
- Users with the `Manager` role can only view and edit user data.  

---

### 4. Data Storage
All data is stored in a fake database (`db.json`). Example structure:

```json
{
  "users": [
    {
      "id": "1",
      "name": "John Doe",
      "email": "john.doe@example.com",
      "password": "$2b$10$...",
      "role": "Administrator",
      "status": "active",
      "createdAt": "2024-11-30T10:00:00.000Z",
      "updatedAt": "2024-11-30T10:00:00.000Z"
    }
  ],
  "roles": [
    {
      "id": "role_user",
      "name": "User",
      "permissions": ["read"]
    }
  ],
  "auditLogs": [],
  "refreshTokens": []
}
```

---

### 5. Activity Logging
User actions are tracked in an audit log (`auditLogs` table). Attributes include:
- **`id`**: Unique record identifier.  
- **`userId`**: ID of the user performing the action.  
- **`action`**: Description of the action (e.g., `create_user`).  
- **`targetId`**: ID of the object being acted upon.  
- **`timestamp`**: Time of the action.  

---

### 6. API Documentation
API documentation is created using Swagger. The `swagger.json` file describes all endpoints, including parameters, request bodies, and possible responses. Users can view the documentation in a browser at:  
[http://localhost:3000/api-docs](http://localhost:3000/api-docs)

---

### Conclusion
The Permiset backend provides robust tools for user, role, and access management. It includes complete authorization features and is designed for scalability and security.
 
