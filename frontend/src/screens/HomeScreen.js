import React, { useEffect} from 'react'
import { Col, Pagination, Row } from 'react-bootstrap'
import Product from '../components/Product'
import { useDispatch, useSelector } from 'react-redux'
import { listProducts } from '../actions/productActions'
import Loader from '../components/Loader'
import Message from '../components/Message'
import { useParams } from 'react-router-dom'
import Paginate from '../components/Paginate'
import ProductCarousel from '../components/ProductCarousel'

export default function HomeScreen() {
    const dispatch = useDispatch();

    const keyword = useParams().keyword;
    const page = useParams().page;

    const productList = useSelector(state => state.productList);

    const { loading, error, products, page: pageNumber, pages } = productList;

    useEffect(() => {
        dispatch(listProducts(keyword, page, 4));
    }, [dispatch, keyword, page])

    return (
        <>
            {!keyword && <ProductCarousel />}
            <h1>Latest Products</h1>
            {
                loading ? (
                    <Loader/>
                ) : error ? (
                    <Message variant='danger'>{error}</Message>
                ) : (
                    <>
                    <Row>
                        {products.map(product => (
                            <Col key={product._id} sm={12} md={6} lg={4} xl={3}>
                                <Product product={product}></Product>
                            </Col>
                        ))}
                    </Row>
                        <Paginate pages={pages} page={pageNumber} baseUrl={keyword && `/search/${keyword}`}></Paginate>
                    </>
                )
            }
        </>
    )
}
