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
import postservice from "@/Appwrite/PostService/Api"
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
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"


// =======================
// ZOD SCHEMA (validation)
// =======================
const formSchema = z.object({
    url: z
        .string()
        .trim()
        .min(1, "URL is required")
        .url("Please enter a valid URL (https://...)"),

    description: z
        .string()
        .optional(),

    folderid: z
        .string()
        .min(1, "Please select a folder"),
})


// single source of truth for types
type Inputs = z.infer<typeof formSchema>

function Popup() {
    //  RHF form instance
    const form = useForm<Inputs>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            url: "",
            description: "",
            folderid: "",
        },
    })

    const [status,setstatus]=useState<"error" | "success" | null>(null)
    // const [message,setmessage]=useState<string>("")

    const { register, formState: { errors, isSubmitting } } = form

    //  submit handler
    const onSubmit: SubmitHandler<Inputs> = async (data) => {
        try {
            const result = await postservice.createLink(data)
            setstatus("success")

        } catch (error) {
            console.log(error)
            setstatus("error")
        }
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
                {status && (
                        <Alert
                            variant={status === "error" ? "destructive" : "default"}
                            className="mb-4"
                        >
                            <AlertTitle>
                                {status === "success" ? "Link added successful":"Error when adding link"}
                            </AlertTitle>
                            
                        </Alert>
                    )}

                {/*  shadcn Form wrapper */}
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">

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
                            <Button type="submit" disabled={isSubmitting}>{isSubmitting ? "Adding" : "Add Link"}</Button>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}

export default Popup
