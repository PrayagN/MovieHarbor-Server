const asyncHandler = require("express-async-handler");
const movieData = require("../Data/movieData");
const Movie = require("../models/movieModel");

module.exports = {
  //@desc import all movies
  importMovies: asyncHandler(async (req, res) => {
    const movies = await Movie.insertMany(movieData);
    res.status(201).json(movies);
  }),

  // @desc get all movies
  getMovies: asyncHandler(async (req, res) => {
    try {
      // filter movies by category,time, language, rate,year and search
      const { category, time, language, rate, year, search } = req.query;
      let query = {
        ...(category && { category }),
        ...(time && { time }),
        ...(language && { language }),
        ...(rate && { rate }),
        ...(year && { year }),
        ...(search && { name: { $regex: search, $options: "i" } }),
      };
      // load more movies
      const page = Number(req.query.pageNumber) || 1;
      const limit = 2;
      const skip = (page - 1) * limit;

      // find movies by query , skip and limit

      const movies = await Movie.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

      // get total number of movies
      const count = await Movie.countDocuments(query);

      // send response with movies and total numbebr of movies

      res.json({
        movies,
        page,
        pages: Math.ceil(count / limit),
        totalMovies: count,
      });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }),

  //@desc get movie by id

  getMovieById :asyncHandler(async(req,res)=>{
    try {
        // find movie by id  in database
        const movie = await Movie.findById(req.params.id);
        if(movie){
            res.json(movie);
        }else{
            res.status(404);
            throw new Error("Movie not found");
        }
    } catch (error) {
        res.status(400).json({message:error.message})
    }
  })
};
