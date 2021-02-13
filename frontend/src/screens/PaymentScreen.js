import React, { useState } from 'react'
import { Form, Button, Col} from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import FormContainer from '../components/FormContainer'
import { savePaymentMethod } from '../actions/cartActions'
import CheckoutSteps from '../components/CheckoutSteps'

export default function PaymentScreen ({ history }) {
    const cart = useSelector(state => state.cart);
    const { shippingAddress } = cart;

    if(!shippingAddress) {
        history.push('/shipping')
    }

    const [paymentMethod, setPaymentMethod] = useState('PayPal');

    const dispatch = useDispatch();

    function submitHandler(e) {
        e.preventDefault();
        dispatch(savePaymentMethod(paymentMethod));
        history.push('/placeorder');
    }

    return (
        <FormContainer>
            <CheckoutSteps step={3}/>
            <h1>Payment Method</h1>
            <Form onSubmit={submitHandler}>
                <Form.Group>
                    <Form.Label as='legend'>Select Method</Form.Label>
                    <Col>
                        <Form.Check
                            type='radio'
                            label='PayPal or CreditCard'
                            id='PayPal'
                            name='paymentMethod'
                            value='PayPal'
                            defaultChecked={true}
                            onChange={e => setPaymentMethod(e.target.value)}>
                        </Form.Check>
                        <Form.Check
                            type='radio'
                            label='Mercado Pago'
                            id='MercadoPago'
                            name='paymentMethod'
                            value='MercadoPago'
                            onChange={e => setPaymentMethod(e.target.value)}>
                        </Form.Check>
                    </Col>
                </Form.Group>
                
                <Button type='submit' variant='primary'>
                    Continue
                </Button>
            </Form>
        </FormContainer>
    )
}
