# 📱 Social Media Backend API

A TypeScript-based RESTful backend for a social media application, built with Node.js, Express, Prisma ORM, and PostgreSQL.

---

## 🚀 Features

- 🔐 JWT authentication
- 🧑 User registration and login
- 📝 Post creation, editing, sharing and deletion
- ❤️ Likes on post and comments
- 👥 Follow/unfollow users
- 📊 Prisma for type-safe database access

---

## 🛠️ Tech Stack

- **Node.js** with **TypeScript**
- **Express.js**
- **Prisma ORM**
- **PostgreSQL**
- **JWT** for auth

---

### HOW TO USE THIS REPO 🛠️

STEP 1: Clone the project.

1.  Launch your terminal and navigate to the directory where you want to store the project (e.g., cd Documents/Projects).
2.  Paste the code below in your terminal

```bash
 git clone https://github.com/tireddev24/tireddev-30-days-challenge
```

STEP 2: Install Dependencies

1. Navigate into the `tireddev-30-days-challenge` folder that was just created and run:

```bash
  npm install
```

2. This installs all dependencies included in the `package.json` file

STEP 3: Configure Environment Variables

1.  In the root folder, create a file named ".env" and add the following to the file:

    ```bash

    PORT = {{your_specified_port}}
    ```

    DATABASE_URL="{{your_postgres_db_connection string}}"
    JWT_SECRET={{your_jwt_secret}}
    IP1=::{{your_current_ip_ddress}}
    IP2=::{{any_other_preferred_ip_address}}

        ```

STEP 4: Run The Development Server

- Use this command to start the development server:

```bash
   npm start
```

- Access the application in your browser with the URL provided in your terminal
  Typically, the URL will be `http://localhost:3000`

### 📝 THINGS TO NOTE

- You need a stable internet connection to successfully clone the repo and install dependencies
- You need to have PostgreSQL installed

## 📁 Project Structure

src/
├── controllers/ // Route handlers
├── middlewares/ // Authentication
├── routers/ // Express routers
├── prisma/ // Prisma schema & client
├── utils/s // Helper functions
└── server.ts // App entry point

## 📬 API Endpoints

**Auth**
POST /api/auth/signup — Register a user

POST /api/auth/login — Login and receive JWT

POST /api/auth/logout - Logout

**Users**
GET /api/users/:id — Get user profile

PUT /api/users/:id — Update user

PUT /api/users/:id/follow — Follow user

PUT /api/users/:id/unfollow — Unfollow user

**Posts**
GET /api/post/:id — Fetch a post

GET /api/post/getall - Fetch all posts

GET /api/post/getuserspost - Get all posts for logged in user

POST /api/post/createpost — Create a new post

PUT /api/post/updatepost/:id — Update a post

DELETE /api/post/deletepost/:id — Delete a post

**Post Actions**

POST /api/post/actions/addlike/:id — Like a post

POST /api/post/actions/unlike/:id — Unlike a post

POST /api/post/actions/dislike/:id — Dislike a post

POST /api/post/actions/addcomment/:id - Add Comment

POST /api/post/actions/deletecomment/:id - Delete Comment

**Follow / Unfollow**

POST /api/follow/followuser/:id - Follow a user

POST /api/follow/unfollowuser/:id - Unfollow a user

## 🧪 Testing

You can test the API using:

Postman

## 🛡️ Security Notes

Passwords are hashed using bcrypt

JWT tokens are stored client-side ( HTTP-only cookies )

Rate limiting is recommended for production

## 👨‍💻 Author

Built by Michael Amao
