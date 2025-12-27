"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useSelector } from "react-redux"
import { useDispatch } from "react-redux"
import type { RootState } from "../store/store"
import authservice from "@/Appwrite/AuthService/Api"
import { logout } from "@/Appwrite/AuthService/authSlice"

export default function Navbar() {
  const dispatch = useDispatch()  

  const authStatus = useSelector((state: RootState) => state.auth.status)

  const authcomps = [
    { name: "Login", path: "/login", active: !authStatus },
    { name: "Signup", path: "/signup", active: !authStatus },
    { name: "Logout", path: '/', active: authStatus }
  ]

  const handleLogout=async ()=>{
    
    try{
      const result=await authservice.Logout()
       dispatch(logout())

    }
    catch(error){
      console.log(error)
    }
    


  }




  return (
    <>

      <nav className="w-full flex items-center justify-between px-4 py-3 border-b">
        <Link href="/" className="font-semibold">
          Links
        </Link>




        <div className="flex items-center gap-2">
          {authcomps
            .filter((i) => i.active)
            .map((i) =>
              i.name === "Logout" ? (
                <Button
                  key={i.name}
                  variant="default"
                  onClick={handleLogout}
                >
                  {i.name}
                </Button>

              ) : (
                <Button key={i.name} variant="default" asChild>
                  <Link href={i.path}>{i.name}</Link>
                </Button>

              )
            )}



        </div>


      </nav>
    </>

  )
}