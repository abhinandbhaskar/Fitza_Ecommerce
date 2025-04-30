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
        attributes: [],
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
        },
        addProductAttribute: (state, action) => {
            state.product.attributes.push({
              colorid: action.payload.colorid,
              sizeid: action.payload.sizeid,
              price: action.payload.price,
              stock: action.payload.stock,
            });
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
            state.product.attributes=[];
        }
    }
});
export const { updateProducts, clearProducts,addProductAttribute } = ProductsSlice.actions;
export default ProductsSlice.reducer;