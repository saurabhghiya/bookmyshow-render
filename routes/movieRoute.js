const router = require('express').Router();
const authMiddleware = require('../middlewares/authMiddleware');
const Movie = require('../models/movieModels');

//add a movie
router.post('/add-movie', authMiddleware, async(req,res)=>{
    try {
        const newMovie = new Movie(req.body);
        await newMovie.save();
        res.send({
            success:true,
            message:"Movie Added"
        })
    } catch (err) {
        res.send({
            success: false,
            message: err.message
        })
    }
})

//get all movies
router.get('/get-all-movies', authMiddleware, async(req,res)=>{
    try {
        const movies = await Movie.find();
        res.send({
            success:true,
            message:"All movies fetched",
            data: movies,
        })
    } catch (err) {
        res.send({
            success: false,
            message: err.message
        })
    }
})

//update movies
router.put('/update-movie', authMiddleware, async(req,res)=>{
    try {
        await Movie.findByIdAndUpdate(req.body.movieId,req.body);
        res.send({
            success:true,
            message:"Movie Updated"
        })
    } catch (err) {
        res.send({
            success: false,
            message: err.message
        })
    }
})

//delete movie
router.delete('/delete-movie', authMiddleware, async(req,res)=>{
    try {
        await Movie.deleteOne({ "_id":req.body.movieId })
        res.send({
            success:true,
            message:"Movie Deleted"
        })
    } catch (err) {
        res.send({
            success: false,
            message: err.message
        })
    }
})

//get a movie by id
router.get('/get-movie-by-id/:id', async(req,res) => {
    try {
        const movie = await Movie.findById(req.params.id);
        res.send({
            success: true,
            message: 'Movie Fetched',
            data: movie
        })
    } catch (err) {
        res.send({
            success: false,
            message: err.message
        })
    }
})


module.exports = router;