import React, { useEffect, useState } from 'react'
import { Button, Row, Col, ListGroup, Image, Card } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import Message from '../components/Message'
import Loader from '../components/Loader'
import { getOrderDetails, payOrder, deliverOrder } from '../actions/orderActions'
import axios from 'axios'
import { ORDER_PAY_RESET, ORDER_DELIVER_RESET } from '../constants/orderConstants'

export default function OrderScreen({ match, history }) {
    //TODO: Remove paypal
    //TODO: This screen should only be visible for the orders owner or an admin
    const orderId = match.params.id;

    const [sdkReady, setSdkReady ] = useState(false);

    const dispatch = useDispatch();
    
    const userLogin = useSelector(state => state.userLogin);
    const { userInfo } = userLogin;

    const orderDetails = useSelector(state => state.orderDetails);
    const { order, loading, error } = orderDetails;

    const orderPay = useSelector(state => state.orderPay);
    const { loading: loadingPay, success: successPay } = orderPay;

    const orderDeliver = useSelector(state => state.orderDeliver);
    const { loading: loadingDeliver, success: successDeliver } = orderDeliver;

    order.itemsPrice = order.orderItems.reduce((acc, item) => acc + Number(item.price) * Number(item.qty), 0)

    useEffect(() => {
        if(!userInfo) {
            history.push('/login');
        }

        async function addPayPalScript () {
            const { data: clientId } = await axios.get('/api/config/paypal');
            
            const script = document.createElement('script');
            script.type = 'text/javascript';
            script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}`;
            script.async = true;

            script.onload = () => {
                setSdkReady(true)
            }
            document.body.appendChild(script);
        }

        //make sure that the order ID matches the ID in the URL. If it does not, then dispatch getOrderDetails() to fetch the most recent order
        if(!order || order._id !== orderId || successPay || successDeliver) {
            dispatch({type: ORDER_PAY_RESET})
            dispatch({type: ORDER_DELIVER_RESET})
            dispatch(getOrderDetails(orderId))
        }
        else if(!order.idPaid) {
            if(!window.paypal) {
                addPayPalScript();
            }
            else {
                setSdkReady(true);
            }
        }
    }, [order, orderId, successPay, successDeliver])

    const { address, city, postalCode, country } = order.shippingAddress;

    function successPaymentHandler() {
        dispatch(payOrder(orderId));
    }

    function deliverHandler(){
        dispatch(deliverOrder(order));
    }

    return loading ? <Loader /> :
        error ? <Message variant='danger'>{error}</Message> :
        <>
            <h1>Order {order._id}</h1>
            <Row>
                <Col md={8}>
                    <ListGroup variant='flush'>
                        <ListGroup.Item>
                            <h2>Shipping</h2>
                            <p>
                                <strong>Name:</strong> {order.user.name}<br />
                                <strong>Email:</strong> <a href={`mailto:${order.user.email}`}>{order.user.email}</a><br />
                                <strong>Address:</strong> {address}, {city}, {postalCode}, {country}.
                            </p>
                            {order.isDelivered ? (
                                <Message variant='success'> Delivered on {order.deliveredAt}</Message> 
                            ) : (
                                <Message variant='danger'>Not delivered</Message>
                            )}
                        </ListGroup.Item>

                        <ListGroup.Item>
                            <h2>Payment Method</h2>
                            <p>
                                <strong>Method: </strong> {order.paymentMethod}.
                            </p>
                            {order.isPaid ? (
                                <Message variant='success'> Paid on {order.paidAt}</Message> 
                            ) : (
                                <Message variant='danger'>Not paid</Message>
                            )}
                        </ListGroup.Item>
                        <ListGroup.Item>
                            <h2>Order Items</h2>
                            {order.orderItems.length === 0 ?
                            <Message>Order is empty</Message> : (
                                <ListGroup variant='flush'>
                                    {order.orderItems.map((item, index) => (
                                        <ListGroup.Item key={index}>
                                            <Row>
                                                <Col md={1}>
                                                    <Link to={`/product/${item.productId}`}>
                                                        <Image src={item.image} alt={item.name} fluid rounded />
                                                    </Link>
                                                </Col>
                                                <Col>
                                                    <Link to={`/product/${item.productId}`}>
                                                        {item.name}
                                                    </Link>
                                                </Col>
                                                <Col md={4}>
                                                    {item.qty} x ${item.price} = ${(item.qty * item.price).toFixed(2)}
                                                </Col>
                                            </Row>
                                        </ListGroup.Item>
                                    ))}
                                </ListGroup>
                            )}
                        </ListGroup.Item>
                    </ListGroup>
                </Col>
                <Col md={4}>
                    <Card>
                        <ListGroup variant='flush'>
                            <ListGroup.Item>
                                <h2>Order Summary</h2>
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <Row>
                                    <Col>Items</Col>
                                    <Col>${order.itemsPrice && order.itemsPrice.toFixed(2)}</Col>
                                </Row>
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <Row>
                                    <Col>Shipping</Col>
                                    <Col>${order.shippingPrice && order.shippingPrice.toFixed(2)}</Col>
                                </Row>
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <Row>
                                    <Col>Tax</Col>
                                    <Col>${order.taxPrice && order.taxPrice.toFixed(2)}</Col>
                                </Row>
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <Row>
                                    <Col>Total</Col>
                                    <Col>${order.totalPrice && order.totalPrice.toFixed(2)}</Col>
                                </Row>
                            </ListGroup.Item>
                            {!order.isPaid && (
                                <ListGroup.Item>
                                    {loadingPay && <Loader />}
                                    {!sdkReady ? <Loader /> : (
                                        <Button onClick={successPaymentHandler} >Pagar</Button>
                                    )}
                                </ListGroup.Item>
                            )}
                            {loadingDeliver && <Loader />}
                            {userInfo && userInfo.isAdmin && order.isPaid && !order.isDelivered && (
                                <ListGroup.Item>
                                    <Button type='button' className='btn btn-block' onClick={deliverHandler}>
                                        Mark as delivered
                                    </Button>
                                </ListGroup.Item>
                            )}
                        </ListGroup>
                    </Card>
                </Col>
            </Row>
        </>
}
