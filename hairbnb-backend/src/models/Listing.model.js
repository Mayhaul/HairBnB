import mongoose from "mongoose";

const listingSchema = new mongoose.Schema({
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
    filename: {
        type: String,
        default: "listingimage"
    },
    url: {
        type: String,
        default: "https://imgs.search.brave.com/..."
    }
},
    price : Number,
    location : String,
    country : String
});

import Review  from "./Review.model.js";

// When a listing is deleting, we want all of its comments deleted aswell. otherwise we will have random orphaned data in our review database.
listingSchema.post('findOneAndDelete', async (deletedListing)=>{
    try{
        const listingId = deletedListing._id;
        await Review.deleteMany({listing: listingId});
    }catch(e){
        console.log(e);
    }
})

export default mongoose.models.Listing || mongoose.model('Listing',listingSchema);