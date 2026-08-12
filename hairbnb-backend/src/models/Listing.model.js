import mongoose from "mongoose";

const listingModel = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
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

export default mongoose.model('Listing',listingModel);