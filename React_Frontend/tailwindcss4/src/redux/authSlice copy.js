import {createSlice} from "@reduxjs/toolkit";

const initialState={
    accessToken:null,
    isAuthenticated:false,
};

const authSlice=createSlice({
    name:"auth",
    initialState,
    reducers:{
        loginSuccess:(state,action)=>{
            state.accessToken=action.payload.accessToken;
            state.isAuthenticated=true;         
        },
        logout:(state)=>{
            state.accessToken=null;
            state.isAuthenticated=false;
        }
    }
});
export const {loginSuccess,logout}=authSlice.actions;
export default authSlice.reducer;