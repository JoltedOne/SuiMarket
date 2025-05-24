# SUI Monolith Backend

This is the backend for the SUI Monolith project, handling user profile data storage using MongoDB.

## Setup

1.  **Navigate to the backend directory:**
    ```bash
    cd backend
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up MongoDB:**
    - Ensure you have MongoDB installed and running. If you're running it locally with default settings, the provided `MONGODB_URI` in `index.js` should work.
    - For a remote database (e.g., MongoDB Atlas), set the `MONGODB_URI` environment variable.

4.  **Environment Variables:**
    - `PORT`: The port the server will run on (default is 5000).
    - `MONGODB_URI`: Your MongoDB connection string (default is `mongodb://localhost:27017/suimonolith`).

## Running the Server

-   **Development Mode (with nodemon):**
    ```bash
    npm run dev
    ```
-   **Production Mode:**
    ```bash
    npm start
    ```

## API Endpoints

-   `GET /api/profiles/:walletAddress`: Get a user profile by wallet address. If no profile exists, a new one is created.
-   `PATCH /api/profiles/:walletAddress`: Update an existing user profile. 