# Apartment Management System

## Introduction
This is a simple apartment management system built to support the management of apartment-related activities such as user, apartment, bill, feedback, and notification management.

## Key Features
*   **User Management:** Register, log in, approve residents, update user information.
*   **Apartment Management:** View list, create, update, and delete apartments.
*   **Bill Management:** Automatically generate bills, pay bills, and view a list of bills.
*   **Feedback Management:** Create, view, update, and delete feedback from residents.
*   **Notification Management:** Create, view, and delete important announcements.
*   **Security:** User authentication (JWT) and authorization (Admin, Accountant, Resident).

## Technologies Used
### Backend
*   **Framework:** Node.js, Express.js
*   **Database:** MongoDB (with Mongoose ODM)
*   **Security:** `bcryptjs` (password hashing), `jsonwebtoken` (JWT authentication)
*   **Environment:** `dotenv` (environment variable management)
*   **Middleware:** `cors`, `helmet`, `morgan` (HTTP request logger)

### Frontend
*   **Framework:** React (with Vite)
*   **Styling:** Tailwind CSS
*   **UI Components:** `react-icons`

## Project Structure
```
.
├── apartment-management-system/
│   ├── backend/
│   │   ├── .env
│   │   ├── package.json
│   │   ├── server.js
│   │   └── src/
│   │       ├── app.js
│   │       ├── config/
│   │       ├── controllers/
│   │       ├── middlewares/
│   │       ├── models/
│   │       ├── routes/
│   │       ├── services/
│   │       └── utils/
│   └── frontend/
│       ├── public/
│       ├── src/
│       ├── index.html
│       ├── package.json
│       └── ...
└── ...
```

## Installation
1.  **Clone the repository:**
    ```bash
    git clone <YOUR_REPOSITORY_URL>
    cd apartment-management-system
    ```
2.  **Install backend dependencies:**
    ```bash
    cd backend
    npm install
    ```
3.  **Install frontend dependencies:**
    ```bash
    cd ../frontend
    npm install
    ```
4.  **Create a .env file:**
    In the `backend` directory, create a `.env` file and add the necessary environment variables. Here is an example:
    ```
    NODE_ENV=development
    PORT=3000
    MONGO_URI=mongodb://localhost:27017/apartmentdb
    JWT_SECRET=supersecretkey
    JWT_EXPIRE=30d
    COOKIE_EXPIRE=30
    ```
    *Note: Change `MONGO_URI` and `JWT_SECRET` to your own values.*

## How to Run the Application
### Development Mode
1.  **Run the backend:**
    ```bash
    cd backend
    npm run dev
    ```
2.  **Run the frontend:**
    ```bash
    cd frontend
    npm run dev
    ```
The application will be running on `http://localhost:5173` (or the port configured in Vite). The backend will be running on `http://localhost:3000` (or the port you configured in `.env`).

### Production Mode
1.  **Build the frontend:**
    ```bash
    cd frontend
    npm run build
    ```
2.  **Run the backend:**
    ```bash
    cd backend
    npm start
    ```

## API Endpoints
The main API routes are defined in `/backend/src/routes`.

### User - `/api/v1/users`
*   `POST /login`: Log in a user.
*   `POST /residents/register`: Register a new resident.
*   `PATCH /residents/:id/approve`: Approve a resident (requires ADMIN privileges).
*   `PUT /:id`: Update user information (requires ADMIN privileges).

### Apartment - `/api/v1/apartments`
*   `GET /`: Get all apartments (requires authentication).
*   `POST /`: Create a new apartment (requires ADMIN privileges).
*   `PUT /:id`: Update apartment information (requires ADMIN privileges).
*   `DELETE /:id`: Delete an apartment (requires ADMIN privileges).

### Bill - `/api/v1/bills`
*   `GET /`: Get all bills (requires authentication).
*   `POST /generate`: Generate bills (requires ADMIN or ACCOUNTANT privileges).
*   `POST /:id/pay`: Pay a bill (requires authentication).
*   `DELETE /:id`: Delete a bill (requires ADMIN privileges).


### Feedback - `/api/v1/feedback`
*   `GET /`: Get all feedback (requires authentication).
*   `POST /`: Create new feedback (requires authentication).
*   `PUT /:id`: Update feedback (requires authentication).
*   `DELETE /:id`: Delete feedback (requires ADMIN privileges).

### Notification - `/api/v1/notifications`
*   `GET /`: Get all notifications (requires authentication).
*   `POST /`: Create a new notification (requires ADMIN privileges).
*   `DELETE /:id`: Delete a notification (requires ADMIN privileges).

## Contributing
We welcome all contributions! Please fork the repository and create a pull request.

## License
This project is licensed under the <YOUR_LICENSE_NAME_E.G._MIT>.
