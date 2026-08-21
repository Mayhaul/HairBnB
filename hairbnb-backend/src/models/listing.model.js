import mongoose from "mongoose";

const Listings = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title : {
        type: String,
        required: true
    },
    description : { 
        type: String,
        required: true,

        // set default value
        set: (D)=> D==="" ? "Description" : D
    },
    image: {
        type: String,
        default: "https://imgs.search.brave.com/..."
    
},
    price : Number,
    location : String,
    country : String
});

import Review  from "./review.model.js";

// When a listing is deleting, we want all o f its comments deleted aswell. otherwise we will have random orphaned data in our review database.
Listings.post('findOneAndDelete', async (deletedListing)=>{
    try{
        const listingId = deletedListing._id;
        await Review.deleteMany({listing: listingId});
    }catch(e){
        console.log(e);
    }
})

const Listing = mongoose.models.Listing || mongoose.model('Listing',Listings);

export default Listing;