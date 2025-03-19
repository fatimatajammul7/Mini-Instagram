const express = require('express');
const bodyParser = require('body-parser');
const sequelize = require('./utils/database');

const app = express();
// app.use(bodyParser.urlencoded({extended : false}));
// // Middleware to parse JSON bodies
app.use(express.json());

// Middleware to parse URL-encoded bodies (from HTML forms)
// app.use(express.urlencoded({ extended: true }));

//models 
const Post = require('./models/post');
const User = require('./models/user');
const Request = require('./models/request');
const Like = require('./models/like');
const Image = require('./models/image');
const Comment = require('./models/comment');

//routes
const postRoutes = require('./routes/posts')
const authRoutes = require('./routes/auth')
const requestRoutes = require('./routes/request')
const likeRoutes = require('./routes/like')
const commentRoutes = require('./routes/comment')

app.use(postRoutes);
app.use(requestRoutes);
app.use(authRoutes);
app.use(likeRoutes);
app.use(commentRoutes);

// associations right before sync

// Posts and Users
Post.belongsTo(User, { foreignKey: 'user_id', as: 'author' });  
User.hasMany(Post, { foreignKey: 'user_id', as: 'posts' });    

// Follow Requests 
Request.belongsTo(User, { foreignKey: 'follower_id', as: 'follower' }); 
Request.belongsTo(User, { foreignKey: 'followed_id', as: 'followed' }); 
User.hasMany(Request, { foreignKey: 'follower_id', as: 'followRequestsSent' }); 
User.hasMany(Request, { foreignKey: 'followed_id', as: 'followRequestsReceived' }); 

// Images and Posts
Image.belongsTo(Post, { foreignKey: 'post_id', as: 'post' }); 
Post.hasMany(Image, { foreignKey: 'post_id', as: 'images' });  

// Likes and Posts
Like.belongsTo(Post, { foreignKey: 'post_id', as: 'post' });   
Post.hasMany(Like, { foreignKey: 'post_id', as: 'likes' });  

// Likes and Users 
Like.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
User.hasMany(Like, { foreignKey: 'user_id', as: 'likes' }); 

// Comments and Posts
Comment.belongsTo(Post, { foreignKey: 'post_id', as: 'post' });  
Post.hasMany(Comment, { foreignKey: 'post_id', as: 'comments' }); 

// Comments and Users 
Comment.belongsTo(User, { foreignKey: 'user_id', as: 'author' }); 
User.hasMany(Comment, { foreignKey: 'user_id', as: 'comments' }); 

// Handling Replies 
Comment.belongsTo(Comment, { foreignKey: 'parent_comment_id', as: 'parentComment' }); 
Comment.hasMany(Comment, { foreignKey: 'parent_comment_id', as: 'replies' });        


sequelize.sync()
    .then(result=>{
        app.listen(8080, ()=>{
            console.log('Server is listening...');
        }); 
    })
    .catch(err=>{
        console.log(err);                                                                                                                              
    });
  