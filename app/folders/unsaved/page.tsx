"use client"
import React from 'react'
import postservice from '@/Appwrite/PostService/Api'
import folderservice from '@/Appwrite/FolderService/Api'
import { RootState } from '@/store/store'
import { useSelector } from 'react-redux'
import { useState, useEffect } from 'react'
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

type linkinput={
    readonly $id: string,
  url: string,
  description?: string,
  folderid: string,
  userid: string
  readonly $createdAt:string,
  readonly $updatedAt:string

}

function page() {
    const userData = useSelector((state: RootState) => state.auth.userData)
    const userid = userData?.$id ?? null

    const [folder,setfolder]=useState<any>({})
    const [links,setlinks]=useState<any>([])
    const [loading,setloading]=useState(true)




    useEffect(()=>{
        if (!userid){
            setfolder({})
            setloading(false)
            return
        }
        folderservice.ensureUnsavedFolder(userid).then((res)=>{
            setfolder(res)
        })
        .catch((error)=>{
            console.log(error)
        })
        .finally(()=>{
           setloading(false)
        })

    },[userid])

    useEffect(()=>{
        if (!userid){
            setlinks([])
            setloading(false)
            return
        }
        postservice.listfolderlinks(userid,folder.$id).then((res)=>{
            setlinks(res.rows)

        }).catch((error)=>{
            console.log(error)
        })
        .finally(()=>{
            setloading(false)
        })

    },[userid])

    const getDomain = (url: string) => {
    try {
      return new URL(url).hostname.replace("www.", "")
    } catch {
      return url
    }
  }



    return (
        <>
        <div>

        <p className="font-semibold text-2xl"> Unsaved</p>
        <div className="mt-10 grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-4">
          {
            loading ? <div>...Loading</div> : (
              links &&
              links.map((link: linkinput) => (
                <Card
                  key={link.$id}
                  className="group h-56 cursor-pointer rounded-xl border bg-background transition hover:shadow-lg w-full max-w-md"
                  onClick={() => window.open(link.url, "_blank")}
                  tabIndex={0}
                  onKeyDown={(e) =>
                    e.key === "Enter" && window.open(link.url, "_blank")
                  }
                >
                  <CardContent className="flex h-full flex-col justify-between p-4">
                    {/* TOP */}
                    <div className="flex items-center gap-3">
                      <img
                        src={`https://www.google.com/s2/favicons?domain=${getDomain(
                          link.url
                        )}&sz=64`}
                        alt="favicon"
                        className="h-6 w-6 rounded"
                        onError={(e) => {
                          e.currentTarget.src = "/link.svg"
                        }}
                      />

                      <div className="flex min-w-0 flex-col">
                        <p className="truncate text-sm font-semibold">
                          {getDomain(link.url)}
                        </p>
                        <p className="truncate text-xs text-muted-foreground">
                          {link.url}
                        </p>
                      </div>
                    </div>

                    {/* DESCRIPTION */}
                    <div className="mt-4">
                      {link.description ? (
                        <p className="line-clamp-3 text-sm text-muted-foreground">
                          {link.description}
                        </p>
                      ) : (
                        <p className="italic text-sm text-muted-foreground opacity-60">
                          No description
                        </p>
                      )}
                    </div>

                    {/* FOOTER */}
                    <div className="pt-3 text-right">
                      <span className="text-xs font-medium text-primary group-hover:underline">
                        Open link →
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))

            )
          }
        </div>
      </div>
        </>
    )
}

export default page
