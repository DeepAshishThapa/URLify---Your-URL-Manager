"use client"

import  { useEffect, useState } from "react"
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
import postservice from "@/Appwrite/PostService/Api"

import { useSelector } from "react-redux"
import type { RootState } from "@/store/store"

import { useForm, SubmitHandler } from "react-hook-form"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"

import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Alert, AlertTitle } from "@/components/ui/alert"



// =======================
// ZOD SCHEMA
// =======================
const formSchema = z.object({
  url: z
    .string()
    .trim()
    .min(1, "URL is required")
    .url("Please enter a valid URL (https://...)"),

  description: z.string().optional(),

  folderid: z.string().min(1, "Please select a folder"),
})

type Inputs = z.infer<typeof formSchema>

export default function Popup() {
  // -------------------- Redux auth --------------------
  const userData = useSelector((state: RootState) => state.auth.userData)
  const userid = userData?.$id ?? null

  // -------------------- Form --------------------
  const form = useForm<Inputs>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      url: "",
      description: "",
      folderid: "",
    },
  })

    const [open, setOpen] = useState(false)

  const { isSubmitting } = form.formState

  // -------------------- UI state --------------------
  const [status, setStatus] = useState<"success" | "error" | null>(null)
  const [folders, setFolders] = useState<any[]>([])

  // -------------------- Fetch folders --------------------
  useEffect(() => {
    if (!userid) {
      setFolders([])
      return
    }

    folderservice.listFolders(userid).then((res) => {
      setFolders(res.rows)
    })
  }, [userid])


  /* -------------------- Reset state on open -------------------- */
  useEffect(() => {
    if (open) {
      setStatus(null)
    }
  }, [open])


  // -------------------- Submit --------------------
  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    if (!userid) {
      setStatus("error")
      return
    }

    try {
      await postservice.createLink(data
        
      )

      setStatus("success")
      form.reset()
    } catch (error) {
      console.error(error)
      setStatus("error")
    }
  }

  // -------------------- UI --------------------
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="default" size="sm" disabled={!userid}>
          <Plus className="mr-1 h-4 w-4" />
          Link
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add new link</DialogTitle>
        </DialogHeader>

        {status && (
          <Alert
            variant={status === "error" ? "destructive" : "default"}
            className="mb-4"
          >
            <AlertTitle>
              {status === "success"
                ? "Link added successfully"
                : "Failed to add link"}
            </AlertTitle>
          </Alert>
        )}

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4"
          >
            {/* URL */}
            <FormField
              control={form.control}
              name="url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>URL</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="https://example.com"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Description */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Optional description"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Folder */}
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
              <Button type="submit" disabled={isSubmitting || !userid}>
                {isSubmitting ? "Adding..." : "Add Link"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
