# returns 'words'
## Usage
foobar
# **Permiset Backend**

Permiset is a user management and access control system. The backend is built with Node.js, Express, and TypeScript, using `lowdb` as a lightweight database. It provides CRUD operations for users and roles, along with authentication and access control via JWT.

---

## **Project Structure**

- **`/api`**: Contains routes for:
  - **`/users`**: User management.
  - **`/roles`**: Role management.
  - **`/auth`**: Authentication and authorization.
- **`/middlewares`**: Middleware for token verification and permission checks.
- **`/db`**: Fake database setup and JSON file storage.
- **`/swagger.json`**: API documentation for Swagger.

---

## **Features**

### **1. User Management**
- CRUD operations for managing users.
- Users have roles, statuses, and timestamps for creation and updates.

### **2. Role Management**
- Define roles with associated permissions (e.g., `read`, `create`, `update`, `delete`).

### **3. Authentication**
- JWT-based login system.
- Endpoints for login, token refresh, and user registration.

### **4. Access Control**
- Middleware to restrict actions based on roles and permissions.

### **5. Audit Logging**
- Tracks user actions like creation, updates, and deletions.

---

## **Data Storage**

All data is stored in `db.json`, a lightweight JSON file, including users, roles, and tokens.

---

## **API Documentation**

The API is documented with Swagger and can be accessed at:
```
http://localhost:3000/api-docs
```

---

## **Getting Started**

1. Clone the repository and install dependencies.
2. Run the development server with:
   ```
   pnpm run dev
   ```
3. Access the API at:
   ```
   http://localhost:3000
   ```

---

## **Next Steps**

Build the frontend to integrate with the backend, enabling user and role management with a polished UI. 🚀 