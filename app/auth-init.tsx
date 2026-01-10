// app/auth-init.tsx
"use client"

import { useEffect } from "react"
import { useDispatch } from "react-redux"
import authservice from "@/Appwrite/AuthService/Api"
import { login, logout } from "@/Appwrite/AuthService/authSlice"


export default function AuthInit({ children }: { children: React.ReactNode }) {
  const dispatch = useDispatch()
  
  
  useEffect(() => {
    authservice
      .getAccount()
      .then((user) => {
        if (user) dispatch(login(user))
        else dispatch(logout())
      })
      .catch(() => dispatch(logout()))
  }, [dispatch])

  return <>{children}</>
}