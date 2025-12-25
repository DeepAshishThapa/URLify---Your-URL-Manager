import { configureStore } from "@reduxjs/toolkit";
import authreducer from "../Appwrite/AuthService/authSlice"

const store=configureStore({
    reducer:{
        auth:authreducer
    }
          
    
})

export default store 