import { CART_ADD_ITEM } from '../constants/cartConstants'

export function cartReducer( state = { cartItems: [] }, action) {
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

        default:
            return state;

    }
}