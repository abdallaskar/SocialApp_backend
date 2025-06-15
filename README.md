# SociallApp Backend 🛠️🌐

This is the **backend server** for **SociallApp**, a social media platform that allows users to register,   
login, and create, edit, or delete their own posts — each with a title, description, image, and timestamp.
The backend is built using **Node.js**, **Express.js**, and **MongoDB**, and handles all API requests, authentication, and data storage.

> 🌍 **Frontend Live Demo:** [https://social-app-gamma-nine.vercel.app](https://social-app-gamma-nine.vercel.app)  
> 📁 **Frontend Repo:** [https://github.com/abdallaskar/SocialApp](https://github.com/abdallaskar/SocialApp)  
> 📁 **Backend Repo:** [https://github.com/abdallaskar/SocialApp_Backend](https://github.com/abdallaskar/SocialApp_Backend)  
> 📽️ **YouTube Video:** Coming Soon!

---

## 🚀 Key Features

- ✅ **User Registration & Login**
- 🔒 **JWT-Based Authentication**
- 📝 **Create / Read / Update / Delete Posts**
- 📦 **MongoDB Atlas for data storage**
- 🌐 **CORS-enabled for frontend access**
- 📤 **Uploadcare integration for image uploads**

---

## 🧪 API Endpoints Overview

### 🔐 Auth Routes

| Method | Endpoint         | Description             |
|--------|------------------|-------------------------|
| POST   | `/api/auth/register` | Register a new user     |
| POST   | `/api/auth/login`    | Login and receive token |

### 📄 Post Routes

| Method | Endpoint     | Description                      |
|--------|--------------|----------------------------------|
| GET    | `/api/posts` | Get all posts                    |
| POST   | `/api/posts` | Create a new post (auth required) |
| PATCH  | `/api/posts/:id` | Update a post (auth + ownership) |
| DELETE | `/api/posts/:id` | Delete a post (auth + ownership) |

---

## 🛠️ Tech Stack

- **Backend:**
  - [Node.js](https://nodejs.org/)
  - [Express.js](https://expressjs.com/)
  - [MongoDB Atlas](https://www.mongodb.com/)
  - [JWT](https://jwt.io/)
  - [Uploadcare](https://uploadcare.com/)
  - [dotenv](https://www.npmjs.com/package/dotenv)
  - [Railway](https://railway.app/) for deployment

