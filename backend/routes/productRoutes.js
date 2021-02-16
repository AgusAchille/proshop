import express from 'express'
const router = express.Router();
import { getProducts, getProductById, deleteProduct } from '../controllers/productControllers.js'
import { protect, admin } from '../middleware/authMiddleware.js'

//router.get('/', getProducts);
router.route('/').get(getProducts);

//router.get('/:id', getProductById);
router.route('/:id')
    .get(getProductById)
    .delete(protect, admin, deleteProduct);

export default router;