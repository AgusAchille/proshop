import React from 'react'
import { Link } from 'react-router-dom'
import { Row, Col, Image, ListGroup, Card, Button } from 'react-bootstrap'
import Rating from '../components/Rating'
import products from '../products'

export default function ProductScreen({ match }) {
    const product = products.find( p => p._id === match.params.id)

    return (
        <>
            <Link className='btn btn-dark my-3' to='/'>
                Go Back
            </Link>
            <Row>
                <Col md={6}>
                    <Image src={product.image} alt={product.name} fluid/>
                </Col>
                <Col md={3}>
                    <ListGroup varient='flush'>
                        <ListGroup.Item style={{border: 'none', paddingBottom: '0px'}}>
                            <h3 style={{paddingBottom: '0px'}}>{product.name}</h3>
                        </ListGroup.Item>
                        <ListGroup.Item style={{border: 'none'}}>
                            <Rating value={product.rating} text={`${product.numReviews} Reviews`} />
                        </ListGroup.Item>
                        <ListGroup.Item style={{border: 'none'}}> 
                            Price: ${product.price}
                        </ListGroup.Item>
                        <ListGroup.Item style={{border: 'none'}}> 
                            Description: ${product.description}
                        </ListGroup.Item>
                    </ListGroup>
                </Col>
                <Col md={3}>
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
                            <ListGroup.Item>
                                <Button className='btn-block' type='button' disabled={product.countInStock < 1}>
                                    Add To Cart
                                </Button>
                            </ListGroup.Item>
                        </ListGroup>
                    </Card>
                </Col>
            </Row>
        </>
    )
}
