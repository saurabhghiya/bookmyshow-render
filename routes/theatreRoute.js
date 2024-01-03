const router = require('express').Router();
const authMiddleware = require('../middlewares/authMiddleware');
const Theatre = require('../models/theatreModels')

//add theatre
router.post('/add-theatre', authMiddleware, async(req,res)=>{
    try {
        const newTheatre = new Theatre(req.body);
        await newTheatre.save();
        res.send({
            success:true,
            message:"Theatre Added"
        })
    } catch (err) {
        res.send({
            success: false,
            message: err.message
        })
    }
})

//get theatre by owner
router.post('/get-all-theatres-by-owner', authMiddleware, async(req,res)=>{
    try {
        const theatres = await Theatre.find({owner:req.body.ownerId});
        
        res.send({
            success:true,
            message:"All theatres by owners fetched",
            data: theatres,
        })
    } catch (err) {
        res.send({
            success: false,
            message: err.message
        })
    }
})

//get all theatres
router.get('/get-all-theatres', authMiddleware, async(req,res)=>{
    try {
        const theatres = await Theatre.find().populate('owner');
        res.send({
            success:true,
            message:"All theatres fetched",
            data: theatres,
        })
    } catch (err) {
        res.send({
            success: false,
            message: err.message
        })
    }
})

//update theatre
router.put('/update-theatre', authMiddleware, async(req,res)=>{
    try {
        await Theatre.findByIdAndUpdate(req.body.theatreId,req.body);
        res.send({
            success:true,
            message:"Theatre Updated"
        })
    } catch (err) {
        res.send({
            success: false,
            message: err.message
        })
    }
})

//delete theatre
router.delete('/delete-theatre', authMiddleware, async(req,res)=>{
    try {
        await Theatre.deleteOne({ "_id": req.body.theatreId });
        res.send({
            success:true,
            message:"Theatre Deleted"
        })
    } catch (err) {
        res.send({
            success: false,
            message: err.message
        })
    }
})



module.exports = router;