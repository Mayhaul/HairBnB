import express from "express";
const router = express.Router();


// ---------------- MIDDLEWARE ----------------
router.use(express.json());
router.use(express.urlencoded({ extended: true }));



import Listing from '../models/Listing.model.js'

router.get('/form',(req,res)=>{
    res.render('form.ejs');
});

router.post('/submit', async (req, res) => {
    try {
        await Listing.create(req.body);
        console.log("submitted");
        res.redirect('/listings');
    } catch (e) {
        console.error("CREATE ERROR:", e);
        res.status(400).send(`Failed to submit: ${e.message}`);
    }
});


// listings route
router.get('/',async (req,res)=>{
    try{
        const listings = await Listing.find({});
        res.render("listings.ejs", { listings });
    }catch(e){
        console.log(`GET ERROR: ${e}`)
        res.status(404).send(`Failed to show listings: ${e.message}`);
    }
    
})

// open the selected listing.
router.get('/:id',async (req,res)=>{
    try{
        const ad = await Listing.findById(req.params.id);
        res.render("ad.ejs", {ad});
        console.log(ad);
    }catch(e){
        res.send(e.message);
    }
})

// Edit listing
router.get('/:id/edit', async (req,res)=>{
    try {
        const id = req.params.id;
        const ad = await Listing.findById(id);

        res.render("editForm.ejs",{ad});
        console.log(ad);

    } catch (e) {
        res.send(e.message);
    }   
})

router.post('/:id/edit', async(req,res)=>{
    try {
        const NewData = req.body;
        const {id} = req.params;

        await Listing.findByIdAndUpdate(id, req.body);
        res.redirect(`/listings/${id}`); 

    } catch (e) {
        res.send(e.message);
    }
})

// Delete
router.post('/:id/delete', async (req,res)=>{
    try {
        const {id} = req.params;
        await Listing.findByIdAndDelete(id);

        res.redirect('/listings');

    } catch (e) {
        res.send(e.message);
    }
})



export default router;