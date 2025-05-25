import { createSlice } from "@reduxjs/toolkit";

const initialState={
    order: {
        totalmrp: 0.0,
        productdiscount: 0.0,
        shippingfee: null,
        platformfee: 0.0,
        couponapplied: "",
        discountcard: 0,
        orderTotal: 0.0,
      },
}

const ShopOrderSlice=createSlice({
    name:"shoporder",
    initialState,
    reducers:{
        updateShopOrder:(state,action)=>{
            state.order.totalmrp=action.payload.totalmrp;
            state.order.productdiscount=action.payload.productdiscount;
            state.order.shippingfee=action.payload.shippingfee;
            state.order.platformfee=action.payload.platformfee;
            state.order.couponapplied=action.payload.couponapplied;
            state.order.discountcard=action.payload.discountcard;
            state.order.orderTotal=action.payload.orderTotal;

        },
        clearShopOrder: (state) => {
            state.order = { ...initialState.order };
        },
    }
});
export const {updateShopOrder,clearShopOrder}=ShopOrderSlice.actions;
export default ShopOrderSlice.reducer;