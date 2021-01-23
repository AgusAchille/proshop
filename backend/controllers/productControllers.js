// express-async-handler - middleware for handling exceptions inside of async express routes and passing them to your express error handlers
import asyncHandler from 'express-async-handler'
import Product from '../models/productModel.js'

// @desc    Fetch all products
// @rote    GET /api/products
// @access  Public
const getProducts = asyncHandler(async (req, res) => {
    const products = await Product.find({});
    res.json(products);
})

// @desc    Fetch single product
// @rote    GET /api/products/:id
// @access  Public
const getProductById = asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id)
    
    if(product) {        
        res.json(product);
    } 
    else {
        // res.status(404).json({ message: 'Product not found' })
        res.status(404);
        throw new Error('Product not found');
    }
})

export { getProducts, getProductById };