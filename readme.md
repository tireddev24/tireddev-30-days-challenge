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
