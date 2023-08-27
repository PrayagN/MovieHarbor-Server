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

  getMovieById: asyncHandler(async (req, res) => {
    try {
      // find movie by id  in database
      const movie = await Movie.findById(req.params.id);
      if (movie) {
        res.json(movie);
      } else {
        res.status(404);
        throw new Error("Movie not found");
      }
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }),

  //@desc get top rated movies
  getTopRatedMovies: asyncHandler(async (req, res) => {
    try {
      const movies = await Movie.find({}).sort({ rate: -1 });
      res.json(movies);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }),

  getRandomMovies: asyncHandler(async (req, res) => {
    try {
      const movies = await Movie.aggregate([{ $sample: { size: 8 } }]);
      res.json(movies);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }),

  createMovieReview: asyncHandler(async (req, res) => {
    const { rating, comment } = req.body;
    try {
      const movie = await Movie.findById(req.params.id);
      if (movie) {
        const alreadyReviewed = movie.reviews.find(
          (r) => r.userId.toString() === req.user._id.toString()
        );

        if (alreadyReviewed) {
          res.status(400);
          throw new Error("You already reviewed this movie");
        }
        const review = {
          userName: req.user.fullName,
          userId: req.user._id,
          rating: Number(rating),
          comment,
        };
        // push the new review to the reviews array
        movie.reviews.push(review);
        // increment the number of reviews
        movie.numberOfReviews = movie.reviews.length;

        // calculate the new rate

        movie.rate =
          movie.reviews.reduce((acc, item) => item.rating + acc, 0) /
          movie.reviews.length;

        await movie.save();

        res.status(201).json({ message: "Review added" });
      } else {
        res.status(404);
        throw new Error("Movie not found");
      }
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }),

  /// Admin Controll ///

  updateMovie: asyncHandler(async (req, res) => {
    try {
      const {
        name,
        desc,
        image,
        titleImage,
        rate,
        numberOfReviews,
        category,
        time,
        language,
        year,
        casts,
        video,
      } = req.body;
      // find movie by id in database

      const movie = await Movie.findById(req.params.id);
      if (movie) {
        movie.name = name || movie.name;
        movie.desc = desc || movie.desc;
        movie.image = image || movie.image;
        movie.titleImage = titleImage || movie.titleImage;
        movie.rate = rate || movie.rate;
        movie.numberOfReviews = numberOfReviews || movie.numberOfReviews;
        movie.category = category || movie.category;
        movie.time = time || movie.time;
        movie.language = language || movie.language;
        movie.year = year || movie.year;
        movie.video = video || movie.video;
        movie.casts = casts || movie.casts;

        const updatedMovie = await movie.save();
        res.status(201).json(updatedMovie);
      } else {
        res.status(404);
        throw new Error("Movie not found");
      }
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }),

  //@desc Delete Movie

  deleteMovie: asyncHandler(async (req, res) => {
    try {
      const movie = await Movie.findById(req.params.id);
      if (movie) {
        await movie.deleteOne();
        res.json({ message: "Movie removed" });
      }
      // if the movie is not found send 404 error
      else {
        res.status(404);
        throw new Error("Movie not found");
      }
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }),

  //@desc Create Movie

  createMovie: asyncHandler(async (req, res) => {
    try {
      const {
        name,
        desc,
        image,
        titleImage,
        rate,
        numberOfReviews,
        category,
        time,
        language,
        year,
        video,
        casts,
      } = req.body;
      
      // create a new movie
      const movie = new Movie({
        name,
        desc,
        image,
        titleImage,
        rate,
        numberOfReviews,
        category,
        time,
        language,
        year,
        video,
        casts,
        userId :req.user._id
      })

      // save the movie in database

      if(movie){
        const createdMovie = await movie.save();
        res.status(201).json(createdMovie)
      }else{
        res.status(400);
        throw new Error("Invalid movie data");
      }
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }),
};
