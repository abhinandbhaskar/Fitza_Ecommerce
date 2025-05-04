import { createSlice } from "@reduxjs/toolkit";

const initialState={
    order: {
        name: null,
        email: null,
        phone: null,
        ordertotal: 0.0,
        discountamount: 0.0,
        appliedcoupon: null,
        finaltotal: 0.0,
        shippingapplied: false,
        quantity: 0,
        platformfee: 0.0,
      },
}

const ShopOrderSlice=createSlice({
    name:"shoporder",
    initialState,
    reducers:{
        updateShopOrder:(state,action)=>{
            state.order.name=action.payload.name;
            state.order.email=action.payload.email;
            state.order.phone=action.payload.phone;
            state.order.ordertotal=action.payload.ordertotal;
            state.order.discountamount=action.payload.discountamount;
            state.order.appliedcoupon=action.payload.appliedcoupon;
            state.order.finaltotal=action.payload.finaltotal;
            state.order.shippingapplied=action.payload.shippingapplied;
            state.order.quantity=action.payload.quantity;
            state.order.platformfee=action.payload.platformfee;

        },
        clearShopOrder: (state) => {
            state.order = { ...initialState.order };
        },
    }
});
export const {updateShopOrder,clearShopOrder}=ShopOrderSlice.actions;
export default ShopOrderSlice.reducer;