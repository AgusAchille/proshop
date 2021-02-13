import { CART_ADD_ITEM, CART_REMOVE_ITEM, CART_SAVE_SHIPPING_ADDRESS } from '../constants/cartConstants'

export function cartReducer( state = { cartItems: [], shippingAddress: {} }, action) {
    switch(action.type) {
        case CART_ADD_ITEM:
            const item = action.payload;

            const existsItem = state.cartItems.find(cartItem => cartItem.productId === item.productId);

            if(existsItem) {
                return {    
                    ...state,
                    cartItems: state.cartItems.map(cartItem => cartItem.productId === item.productId ? item : cartItem)
                }
            }
            else {
                return {
                    ...state,
                    cartItems: [...state.cartItems, item]
                }
            }
        
        case CART_REMOVE_ITEM:
            return {
                ...state,
                cartItems: state.cartItems.filter(item => item.productId !== action.payload)
            }
        case CART_SAVE_SHIPPING_ADDRESS:
            return {
                ...state,
                shippingAddress: action.payload
            }
        default:
            return state;

    }
}