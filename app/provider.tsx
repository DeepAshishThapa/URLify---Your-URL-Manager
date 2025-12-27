"use client"

import { Provider } from "react-redux"
import { store } from "@/store/store" 
import AuthInit from "./auth-init"

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <AuthInit>{children}</AuthInit>
    </Provider>
  )
}