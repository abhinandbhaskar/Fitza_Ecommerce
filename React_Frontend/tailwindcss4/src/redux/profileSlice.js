import { createSlice } from "@reduxjs/toolkit";

const initialState={
    user:{
        name:null,
        email:null,
        profilePicture:null,
    }
}

const profileSlice=createSlice({
    name:"profile",
    initialState,
    reducers:{
        updateProfile:(state,action)=>{
            state.user.name=action.payload.name;
            state.user.email=action.payload.email;
            state.user.profilePicture=action.payload.profilePicture;
        },
        clearProfile:(state)=>{
            state.user.name=null;
            state.user.email=null;
            state.user.profilePicture=null;
        }
    }
});
export const {updateProfile,clearProfile} = profileSlice.actions;
export default profileSlice.reducer;