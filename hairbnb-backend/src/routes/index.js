import express from 'express';
import ListingRoutes from './listing.routes.js';
import apiError from '../utils/ApiError.js';
import reviewRoutes from './review.routes.js';
import authRoutes from './auth.routes.js'
const router = express.Router();

// Mount listings routes
router.use('/listings', ListingRoutes );
router.use('/listings/:id/reviews', reviewRoutes );
router.use('/', authRoutes );

router.all('*', (req,res,next)=>{
    next(new apiError(404,'Page not Found'));
})

// Global Error Handler Middleware
router.use((err, req, res, next) => {
    let {statusCode = 500, message = 'some Mongoose error'} = err;
    res.status(statusCode).render("error.ejs", { err: { statusCode, message, stack: err.stack } });
});

export default router;