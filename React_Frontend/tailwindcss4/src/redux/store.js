import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import profileReducer from "./profileSlice";
import ProductsSlice  from "./ProductsSlice";
import ShopOrderSlice from "./ShopOrderSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer, 
    profile:profileReducer,
    product:ProductsSlice,
    shoporder:ShopOrderSlice,
  },
});
