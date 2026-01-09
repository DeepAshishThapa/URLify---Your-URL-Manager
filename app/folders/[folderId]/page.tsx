"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import folderservice from "@/Appwrite/FolderService/Api"
import postservice from "@/Appwrite/PostService/Api"

import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { useSelector } from "react-redux"
import { RootState } from "@/store/store"

type linkinput={
  readonly $id:string,
  url:string,
  description?:string,
  folderid:string,
  userid:string

}

function Page() {
  const params = useParams()
  const folderId = params?.folderId as string | undefined
  const userData = useSelector((state: RootState) => state.auth.userData)
  const userid = userData?.$id ?? null

  const [folder, setFolder] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [links, setlinks] = useState<any>(null)
  

  useEffect(() => {
    if (!folderId) return

    folderservice.getFolder(folderId).then((res) => {
      setFolder(res)
      setLoading(false)
    })
  }, [folderId])

  

  useEffect(() => {
    if (!userid || !folderId) return

    postservice.listfolderlinks(userid,folderId).then((res) => {
      setlinks(res.rows)
    })

  }, [userid,folderId])

  if (loading) {
    return <p>Loading...</p>
  }

  return (
    <div>

      <p className="font-semibold text-2xl"> {folder?.name}</p>
      <div className="mt-10 grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-4">
        {links &&
          links.map((link:linkinput) => (
            <Card className="w-full max-w-md h-60 " key={link.$id}>
              <CardHeader>
                <CardTitle className="h-">{link.url}</CardTitle>
                <CardDescription></CardDescription>
                <CardAction></CardAction>
              </CardHeader>
              <CardContent>
                <p className="text-gray-400 font-semibold"> {link.description}</p>
              </CardContent>
              <CardFooter>
                <p></p>
              </CardFooter>
            </Card>

          ))

        }
      </div>
    </div>
  )
}

export default Page
