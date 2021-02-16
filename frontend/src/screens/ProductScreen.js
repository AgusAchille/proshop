import React, { useState, useEffect } from 'react'
import { Row, Col, Image, ListGroup, Card, Button, Form } from 'react-bootstrap'
import Rating from '../components/Rating'
import { getProduct } from '../actions/productActions'
import { useDispatch, useSelector } from 'react-redux'
import Loader from '../components/Loader'
import Message from '../components/Message'

export default function ProductScreen({ match, history }) {
    const [qty, setQty] = useState(1);

    const dispatch = useDispatch();
    
    const productDetails = useSelector(state => state.productDetails);
    
    const { loading, error, product } = productDetails;

    useEffect(() => {
        dispatch(getProduct(match.params.id))
    }, [match.params.id, dispatch])

    function addToCartHandler(){
        if(qty>0)
            history.push(`/cart/${match.params.id}?qty=${qty}`);
    }

    return (
        <>
            {/* <Link className='btn btn-dark my-3' to='/'>
                Go Back
            </Link> */}
            <Button className='btn btn-dark my-3' onClick={() => window.history.go(-1)}>
                Go Back
            </Button>
            {
                loading ? (
                    <Loader/>
                ) : error ? (
                    <Message variant='danger'>{error}</Message>
                ) : (
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
                )
            }
        </>
    )
}
