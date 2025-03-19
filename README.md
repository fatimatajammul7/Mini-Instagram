# Mini Instagram
Mini Instagram is a social media application that mimics the core features of Instagram. It allows users to create posts, like and comment on them, follow other users, and manage follow requests.

##  Features
- **User Authentication:** Sign up and log in using JWT tokens.
- **Posts:** Create, view, and manage posts with images.
- **Likes:** Like and unlike posts.
- **Comments:** Comment on posts and reply to existing comments.
- **Follow Requests:** Send, accept, or reject follow requests.
- **Followers:** View followers of a user.
- **Most Liked and Least Commented Posts:** Retrieve posts with the most likes or least comments.

##  Technologies Used
- **Backend:** Node.js, Express.js
- **Database:** MySQL with Sequelize ORM
- **Authentication:** JSON Web Tokens (JWT)
- **Validation:** express-validator

##  Project Structure
```
project
├── controllers       # API controllers
├── models            # Database models
├── routes            # API routes
├── middleware        # Authentication middleware
├── utils             # Utility files (e.g., database connection)
└── index.js          # Entry point of the application
```

## ⚙Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/fatimatajammul7/Mini-Instagram.git
   cd Mini-Instagram
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up your environment variables:
   ```bash
   touch .env
   ```
   Add your database configuration:
   ```
   DB_NAME=node-complete
   DB_USER=root
   DB_PASSWORD=MyNewPass123!
   DB_HOST=localhost
   JWT_SECRET=somesupersecretsecret
   ```
4. Start the application:
   ```bash
   node index.js
   ```

##  API Endpoints
### Authentication
- **POST /login** - User login
- **POST /signup** - User registration

### Posts
- **GET /posts** - Get all posts
- **POST /post** - Create a new post

### Likes
- **POST /like/:id** - Like a post
- **DELETE /unlike/:id** - Unlike a post
- **GET /most-liked** - Get the most liked posts

### Comments
- **POST /comment/:id** - Add a comment
- **POST /reply-comment/:id** - Reply to a comment
- **PATCH /update-comment/:id** - Update a comment
- **DELETE /delete-comment/:id** - Delete a comment
- **GET /least-commented** - Get the least commented posts

### Requests
- **GET /users** - Get all users
- **POST /send-request/:id** - Send a follow request
- **PATCH /request/:id** - Update follow request status
- **GET /followers/:username** - Get followers of a user

##  Troubleshooting
If you encounter issues while running the application, make sure:
- Your database credentials are correct.
- The MySQL server is running.
- The environment variables are properly configured.

##  Contributing
Feel free to fork this project, submit issues, or make pull requests. Contributions are welcome!

