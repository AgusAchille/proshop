import axios from 'axios'
import {
    ORDER_CREATE_REQUEST,
    ORDER_CREATE_SUCCESS,
    ORDER_CREATE_FAIL,
    ORDER_DETAILS_REQUEST,
    ORDER_DETAILS_SUCCESS,
    ORDER_DETAILS_FAIL
} from '../constants/orderConstants'

export const createOrder = (order) => async(dispatch, getState) => {
    try {
        dispatch({
            type: ORDER_CREATE_REQUEST
        })

        //TODO: probar obtener el token directamente en vez de hacer destructuring
        const { userInfo } = getState().userLogin;

        const config = {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${userInfo.token}`
            }
        }

        const { data } = await axios.post(`/api/orders`, order, config);

        dispatch({
            type: ORDER_CREATE_SUCCESS,
            payload: data
        });
    }
    catch (error) {
        dispatch({
            type: ORDER_CREATE_FAIL,
            payload: error.response && error.response.data.message ? error.response.data.message : error.response
        });
    }
}

export const getOrderDetails = (orderId) => async(dispatch, getState) => {
    try {
        dispatch({
            type: ORDER_DETAILS_REQUEST
        })

        //TODO: probar obtener el token directamente en vez de hacer destructuring
        const { userInfo } = getState().userLogin;

        const config = {
            headers: { Authorization: `Bearer ${userInfo.token}` }
        }

        debugger;
        const { data } = await axios.get(`/api/orders/${orderId}`, config);
        dispatch({
            type: ORDER_DETAILS_SUCCESS,
            payload: data
        });
    }
    catch (error) {
        dispatch({
            type: ORDER_DETAILS_FAIL,
            payload: error.response && error.response.data.message ? error.response.data.message : error.response
        });
    }
}