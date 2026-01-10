import { configureStore } from "@reduxjs/toolkit";
import authreducer from "../Appwrite/AuthService/authSlice"

export const store=configureStore({
    reducer:{
        auth:authreducer
    }
          
    
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch