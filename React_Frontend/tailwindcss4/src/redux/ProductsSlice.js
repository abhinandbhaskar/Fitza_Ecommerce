import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    product: {
        products: "",
        description: "",
        cateid: null, 
        brandid: null,
        modelheight: "",
        modelwearing: "",
        instruction: "",
        about: "",
        colorid:null,
        sizeid:null,
        price:"",
        stock:"",
    },
};

const ProductsSlice=createSlice({
    name:"storeproduct",
    initialState,
    reducers:{
        updateProducts:(state,action)=>{
            state.product.products=action.payload.products;
            state.product.description=action.payload.description;
            state.product.cateid=action.payload.cateid;
            state.product.brandid=action.payload.brandid;
            state.product.modelheight=action.payload.modelheight;
            state.product.modelwearing=action.payload.modelwearing;
            state.product.instruction=action.payload.instruction;
            state.product.about=action.payload.about;
            state.product.colorid=action.payload.colorid;
            state.product.sizeid=action.payload.sizeid;
            state.product.price=action.payload.price;
            state.product.stock=action.payload.stock;
        },
        clearProducts:(state)=>{
            state.product.products="";
            state.product.description="";
            state.product.cateid=null;
            state.product.brandid=null;
            state.product.modelheight="";
            state.product.modelwearing="";
            state.product.instruction="";
            state.product.about="";
            state.product.colorid=null;
            state.product.sizeid=null;
            state.product.price="";
            state.product.stock="";
        }
    }
});
export const { updateProducts, clearProducts } = ProductsSlice.actions;
export default ProductsSlice.reducer;