const express = require('express');
const userRoute = express();
const {registerUser, loginUser, changePassword, getLikedMovies, addLikedMovie, deleteLikedMovies} = require('../controllers/userController');
const { userProtect } = require('../middleware/Auth');


userRoute.post('/',registerUser);
userRoute.post('/login',loginUser);
userRoute.put('/password',userProtect,changePassword);
userRoute.get('/favorites',userProtect,getLikedMovies);
userRoute.post('/favorites',userProtect,addLikedMovie);
userRoute.delete('/favorites',userProtect,deleteLikedMovies);

module.exports =userRoute