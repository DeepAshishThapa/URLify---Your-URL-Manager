"use client"

import React, { useEffect, useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import folderservice from "@/Appwrite/FolderService/Api"
import authservice from "@/Appwrite/AuthService/Api"
import { useForm, SubmitHandler } from "react-hook-form"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"

type Inputs = {
  url: string
  description: string
  folderid: string
}

function Popup() {
  // ✅ RHF form instance
  const form = useForm<Inputs>({
    defaultValues: {
      url: "",
      description: "",
      folderid: "",
    },
  })

  const { register } = form

  // ✅ submit handler
  const onSubmit: SubmitHandler<Inputs> = (data) => {
    console.log(data)
  }

  // state
  const [folders, setFolders] = useState<any[]>([])
  const [userid, setUserid] = useState<string | null>(null)

  // fetch user
  useEffect(() => {
    authservice
      .getAccount()
      .then((res) => setUserid(res.$id))
      .catch((err) => console.error(err))
  }, [])

  // fetch folders
  useEffect(() => {
    if (!userid) return

    folderservice.listFolders(userid).then((res) => {
      setFolders(res.rows)
    })
  }, [userid])

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="default" size="sm">
          <Plus className="mr-1 h-4 w-4" />
          Link
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add new link</DialogTitle>
        </DialogHeader>

        {/*  shadcn Form wrapper */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">

            {/* URL */}
            <FormItem>
              <FormLabel htmlFor="url">URL</FormLabel>
              <FormControl>
                <Input
                  id="url"
                  placeholder="https://example.com"
                  {...register("url")}
                />
              </FormControl>
              <FormMessage />
            </FormItem>

            {/* Description */}
            <FormItem>
              <FormLabel htmlFor="description">Description</FormLabel>
              <FormControl>
                <Input
                  id="description"
                  placeholder="Optional description"
                  {...register("description")}
                />
              </FormControl>
              <FormMessage />
            </FormItem>

            {/* Folder Select */}
            <FormField
              control={form.control}
              name="folderid"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Folder</FormLabel>

                  <FormControl>
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select folder" />
                      </SelectTrigger>

                      <SelectContent>
                        {folders.map((f) => (
                          <SelectItem key={f.$id} value={f.$id}>
                            {f.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Actions */}
            <div className="flex justify-end pt-2">
              <Button type="submit">Add link</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

export default Popup
