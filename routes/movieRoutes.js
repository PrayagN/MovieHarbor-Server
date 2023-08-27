const express = require('express');
const router = express();
const {importMovies, getMovies, getMovieById, getTopRatedMovies, getRandomMovies, createMovieReview, updateMovie, deleteMovie, createMovie} = require('../controllers/movieController');
const {userProtect,admin} = require('../middleware/Auth');

router.post('/import',importMovies);
router.get('/',getMovies)
router.get('/:id',getMovieById)
router.get('/rated/top',getTopRatedMovies)
router.get('/random/all',getRandomMovies)


router.post('/:id/reviews',userProtect,createMovieReview)
router.put("/:id",userProtect,admin,updateMovie)
router.delete("/:id",userProtect,admin,deleteMovie);
router.post('/',userProtect,admin,createMovie)
module.exports = router