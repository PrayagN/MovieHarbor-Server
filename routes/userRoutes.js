const express = require('express');
const userRoute = express();
const {registerUser, loginUser, changePassword, getLikedMovies, addLikedMovie} = require('../controllers/userController');
const { userProtect } = require('../middleware/Auth');


userRoute.post('/',registerUser);
userRoute.post('/login',loginUser);
userRoute.put('/password',userProtect,changePassword);
userRoute.get('/favorites',userProtect,getLikedMovies);
userRoute.post('/add-liked-movies',userProtect,addLikedMovie);
userRoute.post('/add-liked-movies',userProtect,addLikedMovie);

module.exports =userRoute