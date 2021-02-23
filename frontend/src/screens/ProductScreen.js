import React, { useState, useEffect } from 'react'
import { Row, Col, Image, ListGroup, Card, Button, Form } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import Rating from '../components/Rating'
import { getProduct, createProductReview } from '../actions/productActions'
import { useDispatch, useSelector } from 'react-redux'
import Loader from '../components/Loader'
import Message from '../components/Message'
import { PRODUCT_CREATE_REVIEW_RESET } from '../constants/productConstants'
import { Helmet } from 'react-helmet'

export default function ProductScreen({ match, history }) {
    const [qty, setQty] = useState(1);
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');

    const dispatch = useDispatch();
    
    const productDetails = useSelector(state => state.productDetails);
    const { loading, error, product } = productDetails;

    const productReviewCreate = useSelector(state => state.productReviewCreate);
    const { error: errorProductReview, success: successProductReview } = productReviewCreate;

    const userLogin = useSelector(state => state.userLogin);
    const { userInfo } = userLogin;

    useEffect(() => {
        if(successProductReview) {
            alert('Review Submitted!');
            setRating(0);
            setComment('');
            dispatch({ type: PRODUCT_CREATE_REVIEW_RESET })
        }

        dispatch(getProduct(match.params.id))
    }, [match.params.id, dispatch, successProductReview])

    function addToCartHandler(){
        if(qty>0)
            history.push(`/cart/${match.params.id}?qty=${qty}`);
    }

    function submitHandler(e){
        e.preventDefault();

        dispatch(createProductReview(match.params.id, { rating, comment }));
    }

    return (
        <>
            <Button className='btn btn-dark my-3' onClick={() => window.history.go(-1)}>
                Go Back
            </Button>
            {
                loading || (product && product._id !== match.params.id) ? (
                    <Loader/>
                ) : error ? (
                    <Message variant='danger'>{error}</Message>
                ) : (
                    <>
                    <Helmet>
                        <title>ProShop | {product.name}</title>
                        <meta name='description' content='We sell the best products for cheap' />
                        <meta name='keyword' content='electronics, buy electronics, cheap electronics' />
                    </Helmet>
                    <Row>
                        <Col md={4} lg={6} >
                            <Image src={product.image} alt={product.name} fluid/>
                        </Col>
                        <Col md={4} lg={3}>
                            <ListGroup varient='flush'>
                                <ListGroup.Item style={{ paddingBottom: '0px'}}>
                                    <h3 style={{paddingBottom: '0px'}}>{product.name}</h3>
                                </ListGroup.Item>
                                <ListGroup.Item style={{}}>
                                    <Rating value={product.rating} text={`${product.numReviews} Reviews`} />
                                </ListGroup.Item>
                                <ListGroup.Item style={{}}> 
                                    Price: ${product.price}
                                </ListGroup.Item>
                                <ListGroup.Item style={{}}> 
                                    Description: ${product.description}
                                </ListGroup.Item>
                            </ListGroup>
                        </Col>
                        <Col md={4} lg={3}>
                            <Card>
                                <ListGroup variant='flush'>
                                    <ListGroup.Item>
                                        <Row>
                                            <Col>
                                                Price:
                                            </Col>
                                            <Col>
                                                <strong>${product.price}</strong>
                                            </Col>
                                        </Row>
                                    </ListGroup.Item>
                                </ListGroup>
                                <ListGroup variant='flush'>
                                    <ListGroup.Item>
                                        <Row>
                                            <Col>
                                                Status:
                                            </Col>
                                            <Col>
                                                {product.countInStock > 0 ? 'In Stock' : 'Out Of Stock'}
                                            </Col>
                                        </Row>
                                    </ListGroup.Item>
                                    {product.countInStock > 0 && (
                                        <ListGroup.Item>
                                            <Row>
                                                <Col>Qty</Col>
                                                <Col>
                                                    <Form.Control as='select' size={"sm"}  value={qty} onChange={e => setQty(Number(e.target.value))}>
                                                        {
                                                            [...(Array(product.countInStock).keys())].map(x => (
                                                                <option key={x + 1} value={x + 1}>
                                                                    {x + 1}
                                                                </option>
                                                            ))
                                                        }
                                                    </Form.Control>
                                                </Col>
                                            </Row>
                                        </ListGroup.Item>
                                    )}
                                    <ListGroup.Item>
                                        <Button onClick={addToCartHandler} className='btn-block' type='button' disabled={product.countInStock < 1}>
                                            Add To Cart
                                        </Button>
                                    </ListGroup.Item>
                                </ListGroup>
                            </Card>
                        </Col>
                    </Row>
                    <Row style={{ marginTop: '1rem' }}>
                        <Col md={6}>
                            <h2>Reviews</h2>
                            {product.reviews.length === 0 && <Message>No Reviews</Message>}
                            <ListGroup variant='flush'>
                                {product.reviews.map(review => (
                                    <ListGroup.Item key={review._id}>
                                        <Rating value={review.rating} />
                                        <p>{review.comment}</p>
                                        <strong>{review.name}</strong>
                                        <p>{review.createdAt.substring(0, 10)}</p>
                                    </ListGroup.Item>
                                ))}
                                <ListGroup.Item>
                                    <h2>Write a Customer Review</h2>
                                    {errorProductReview && <Message variant='danger'>{errorProductReview}</Message>}
                                    {userInfo ? (
                                        <Form onSubmit={submitHandler}>
                                            <Form.Group controlId='rating'>
                                                <Form.Label>Rating</Form.Label>
                                                <Form.Control as='select' value={rating} onChange={e => setRating(e.target.value)}>
                                                    <option value=''>Select...</option>
                                                    <option value='1'>1 - Poor</option>
                                                    <option value='2'>2 - Fair</option>
                                                    <option value='3'>3 - Good</option>
                                                    <option value='4'>4 - Very Good</option>
                                                    <option value='5'>5 - Excellent</option>
                                                </Form.Control>
                                            </Form.Group>
                                            <Form.Group controlId={'comment'}>
                                                <Form.Label>Comment</Form.Label>
                                                <Form.Control as='textarea' row='3' value={comment} onChange={e => setComment(e.target.value)}></Form.Control>
                                            </Form.Group>
                                            <Button type='submit' variant='primary'>Submit</Button>
                                        </Form>
                                    ) : (
                                        <Message>Please <Link to='/login'>sign in</Link> to write a review.</Message>
                                    )}
                                </ListGroup.Item>
                            </ListGroup>
                        </Col>
                    </Row>
                    </>
                )
            }
        </>
    )
}
