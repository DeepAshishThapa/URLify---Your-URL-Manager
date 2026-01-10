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

type linkinput = {
  readonly $id: string,
  url: string,
  description?: string,
  folderid: string,
  userid: string

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

    postservice.listfolderlinks(userid, folderId).then((res) => {
      setlinks(res.rows)
    })

  }, [userid, folderId])

  if (loading) {
    return <p>Loading...</p>
  }

  const getDomain = (url: string) => {
    try {
      return new URL(url).hostname.replace("www.", "")
    } catch {
      return url
    }
  }

  return (
    <div>

      <p className="font-semibold text-2xl"> {folder?.name}</p>
      <div className="mt-10 grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-4">
        {links &&
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

        }
      </div>
    </div>
  )
}

export default Page
