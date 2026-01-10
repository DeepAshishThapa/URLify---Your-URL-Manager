"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import Menubar from "./Menubar"

import { useSelector } from "react-redux"
import { useDispatch } from "react-redux"
import type { RootState } from "../store/store"
import authservice from "@/Appwrite/AuthService/Api"
import { logout } from "@/Appwrite/AuthService/authSlice"
import { User } from "lucide-react"
import { usePathname } from "next/navigation"
import Popup from "./Popup"
import { useRouter } from "next/navigation"


export default function Navbar() {
  const dispatch = useDispatch()
  const pathname = usePathname()
  const router= useRouter()

  

  const authStatus = useSelector((state: RootState) => state.auth.status)
  const userData = useSelector((state: RootState) => state.auth.userData)
  const userName = userData?.name ?? ""

  const hideAddLinkRoutes = ["/login", "/signup"]
  const showAddLink =
    !hideAddLinkRoutes.includes(pathname)


  const authcomps = [
    { name: "Login", path: "/login", active: !authStatus },
    { name: "Signup", path: "/signup", active: !authStatus },
    { name: "Logout", path: '/', active: authStatus }
  ]


  const handleLogout = async () => {

    try {
      const result = await authservice.Logout()
      dispatch(logout())
      router.push("/")


    }
    catch (error) {
      console.log(error)
    }



  }




  return (
    <>

      <nav className="w-full flex items-center justify-between  px-4 py-3 border-b">
        <div className="flex items-center gap-5 ">
          <Menubar />

         

           {showAddLink && (
          <Popup/>
        )}

        </div>







        <div className="flex items-center gap-5 ">

          {userName && (
            <div className="flex">
              <User />
              <div className="font-bold">{userName}</div>
            </div>

          )

          }

          {authcomps
            .filter((i) => i.active)
            .map((i) =>
              i.name === "Logout" ? (
                <Button
                  key={i.name}
                  variant="default"
                  onClick={handleLogout}
                  size="sm"
                >
                  {i.name}
                </Button>

              ) : (
                <Button key={i.name} variant="default" size="sm" asChild>
                  <Link href={i.path}>{i.name}</Link>
                </Button>

              )
            )}




        </div>


      </nav>
    </>

  )
}

