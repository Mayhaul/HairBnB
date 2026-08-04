import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: [true, "Username is required"],
            unique: true,
            trim: true
        },
        email: {
            type: String,
            required: [true, "Email is required"],
            unique: true,
            trim: true
        },
        password: {
            type: String,
            required: [true, "Password is required"]
        },
        // Array of ObjectIds referencing the 'Listing' model
        listings: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Listing"
            }
        ]
    },
    {
        timestamps: true
    }
);

userSchema.post('findOneAndDelete', async (DeletedUser)=>{
    // we can add here the logic for deleting everything the user is associated to in our app.
    console.log(DeletedUser);
})

export default mongoose.model("User", userSchema);