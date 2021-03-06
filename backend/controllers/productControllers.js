// express-async-handler - middleware for handling exceptions inside of async express routes and passing them to your express error handlers
import asyncHandler from 'express-async-handler'
import Product from '../models/productModel.js'

// @desc    Fetch all products
// @route   GET /api/products
// @access  Public
export const getProducts = asyncHandler(async (req, res) => {
    const pageSize = Number(req.query.pageSize) || 3;
    const page = Number(req.query.pageNumber) || 1;

    const keyword = {};
    
    if(req.query.keyword)
        keyword.name = {
            $regex: req.query.keyword,
            $options: 'i'
        }

    const count = await Product.countDocuments({ ...keyword });
    const products = await Product.find({ ...keyword }).limit(pageSize).skip(pageSize * (page - 1));
    res.json({ products, page, pages: Math.ceil(count / pageSize) });
})

// @desc    Fetch single product
// @route   GET /api/products/:id
// @access  Public
export const getProductById = asyncHandler(async (req, res) => {
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

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
export const deleteProduct = asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id)
    
    if(product) {        
        await product.remove();
        res.json({ message: 'Produt removed'})
    } 
    else {
        // res.status(404).json({ message: 'Product not found' })
        res.status(404);
        throw new Error('Product not found');
    }
})

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
export const createProduct = asyncHandler(async (req, res) => {
    const product = new Product({
        name: 'Sample name',
        price: 0,
        user: req.user._id,
        image: '/images/sample.jpg',
        brand: 'Sample brand',
        category: 'Sample category',
        countInStock: 0,
        numReviews: 0,
        description: 'Sample description'
    });

    const createdProduct = await product.save();

    res.status(201).json(createdProduct);
})

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
export const updateProduct = asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);
    
    if(product) {
        const { name, price, description, image, brand, category, countInStock } = req.body;

        if(name) product.name = name;
        if(price !== undefined) product.price = price;
        if(description) product.description = description;
        if(image) product.image = image;
        if(brand) product.brand = brand;
        if(category) product.category = category;
        if(countInStock !== undefined) product.countInStock = countInStock;

        const updatedProduct = await product.save();

        res.status(201).json(updatedProduct);
    }
    else {
        res.status(404);
        throw new Error('Product not found');
    }
})

// @desc    Create new review
// @route   POST /api/products/:id/reviews
// @access  Private
export const createProductReview = asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);
    
    if(product) {
        const alreadyReviewed = product.reviews.find(review => review.user.toString() === req.user._id.toString());

        if(alreadyReviewed) {
            res.status(400);
            throw new Error('Product already reviewed');
        }

        const { rating, comment } = req.body;

        const review = {
            name: req.user.name,
            rating: Number(rating),
            comment,
            user: req.user._id
        }

        product.reviews.push(review);

        product.numReviews = product.reviews.length;
        product.rating = product.reviews.reduce((acc, item) => item.rating + acc, 0) / product.reviews.length;

        await product.save();
        res.status(201).json({ message: 'Review added'})
    }
    else {
        res.status(404);
        throw new Error('Product not found');
    }
})

// @desc    Fetch top rated products
// @route   GET /api/products/top
// @access  Public
export const getTopProducts = asyncHandler(async (req, res) => {
    const products = await Product.find().sort({ rating: -1 }).limit(3);
    
    res.json(products);
})