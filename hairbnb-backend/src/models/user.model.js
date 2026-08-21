import mongoose from "mongoose";
import passportLocalMongoose from 'passport-local-mongoose'
const userSchema = new mongoose.Schema(
    {
        
        email: {
            type: String,
            required: [true, "Email is required"]
        },
        googleId: String
    }
);


import Review from "./review.model.js";
import Listing from "./listing.model.js"


userSchema.post('findOneAndDelete', async (deletedUser)=>{
    // we can add here the logic for deleting everything the user is associated to in our app.
        if (deletedUser) {
        console.log(`Deleting listings and review for user: ${deletedUser.username}`);

        // 1. Delete all listings created by this user
        await Listing.deleteMany({ user: deletedUser._id });

        // 2. Delete all review authored by this user
        await Review.deleteMany({ user: deletedUser._id });
    }
    // console.log(DeletedUser);
})

userSchema.plugin(passportLocalMongoose.default);

export default mongoose.model("User", userSchema);