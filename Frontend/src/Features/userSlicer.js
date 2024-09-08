import { createSlice } from "@reduxjs/toolkit";

const initialState={
    
        status:false,
        userdata: null

    
}


const authSlice=createSlice({
    name:"auth",
    initialState,
    reducers:{
        login:(state,action)=>{
            state.status=true
            state.userdata=action.payload.userdata
        },
        logout:(state)=>{
            state.status=false
            state.userdata=null
        },
        clearState: () => initialState
    }
})


export const {login,logout,clearState}=authSlice.actions

export default authSlice.reducer