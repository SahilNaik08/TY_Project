const express = require("express");

const { registerUser, loginUser, getProfile, updateProfile, bookSlot, listBookings, cancelBooking } = require("../controllers/userController");
const authUser = require("../middlewares/authUser");

const userRouter = express.Router()

userRouter.post('/register',registerUser)
userRouter.post('/login',loginUser)

userRouter.get('/get-profile',authUser,getProfile)
userRouter.post('/update-profile',authUser,updateProfile)
userRouter.post('/book-slot',authUser,bookSlot)
userRouter.get('/user-bookings',authUser,listBookings)
userRouter.post('/cancel-booking',authUser,cancelBooking)


module.exports = userRouter;