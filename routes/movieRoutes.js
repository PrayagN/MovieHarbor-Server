const express = require('express');
const router = express();
const {importMovies, getMovies} = require('../controllers/movieController');
const {userProtect,admin} = require('../middleware/Auth');

router.post('/import',importMovies);
router.get('/',getMovies)

module.exports = router