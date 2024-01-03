const router = require('express').Router();
const { response } = require('express');
const authMiddleware = require('../middlewares/authMiddleware');
const Shows = require('../models/showsModels');
const Bookings = require('../models/bookingModels')

//add a show
router.post('/add-show', authMiddleware, async (req, res) => {
    try {
        const newShow = new Shows(req.body);
        await newShow.save();
        res.send({
            success: true,
            message: "Show Added"
        })
    } catch (err) {
        res.send({
            success: false,
            message: err.message
        })
    }
})

//get all shows by theatre
router.post('/get-all-shows-by-theatre', authMiddleware, async (req, res) => {
    try {
        const shows = await Shows.find({ theatre: req.body.theatreId }).populate('movie');
        res.send({
            success: true,
            message: "Shows Fetched",
            data: shows
        })
    } catch (err) {
        res.send({
            success: false,
            message: err.message
        })
    }
})

//update shows
router.put('/update-shows', authMiddleware, async (req, res) => {
    try {
        await Shows.findByIdAndUpdate(req.body.showsId, req.body);
        res.send({
            success: true,
            message: "shows Updated"
        })
    } catch (err) {
        res.send({
            success: false,
            message: err.message
        })
    }
})

//delete shows
router.delete('/delete-shows', authMiddleware, async (req, res) => {
    try {
        const currentShow = await Shows.findById(req.body.showId);
        if (currentShow.bookedSeats.length > 0) {
            res.send({
                success: false,
                message: "Cannot delete show with active bookings"
            })
        }
        else {
            await Shows.deleteOne({ "_id": req.body.showId });

            res.send({
                success: true,
                message: "Show Deleted"
            })
        }
    } catch (err) {
        res.send({
            success: false,
            message: err.message
        })
    }
})

//get all unique theatres which have shows of a movie
router.post('/get-all-theatres-by-movie', authMiddleware, async (req, res) => {
    try {
        const { movie, date } = req.body;
        //find all the shows of a movie on given date
        const shows = await Shows.find({ movie, date }).populate('theatre');
        //get all unique theatres
        let uniqueTheatre = [];
        shows.forEach((show) => {
            const isTheatre = uniqueTheatre.find(
                (theatre) => theatre._id == show.theatre._id
            )
            //Array.find returns true/false value
            if (!isTheatre) {
                const showsForThisTheatre = shows.filter(
                    (showObj) => showObj.theatre._id == show.theatre._id
                )
                uniqueTheatre.push({
                    ...show.theatre._doc, //._doc gives all key-val pairs of the document referred to
                    shows: showsForThisTheatre
                });
            }
        })
        res.send({
            success: true,
            message: "Unique Data Fetched",
            data: uniqueTheatre
        })
    } catch (err) {
        res.send({
            success: false,
            message: err.message
        })
    }
})


router.post('/get-show-by-id', authMiddleware, async (req, res) => {
    try {
        const show = await Shows.findById(req.body.showId).populate('movie').populate('theatre');
        res.send({
            success: true,
            message: "Show Fetched",
            data: show
        })
    } catch (error) {
        res.send({
            success: false,
            message: err.message
        })
    }
})

module.exports = router;