"use client"
import React from 'react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from './ui/button'
import { Plus } from 'lucide-react'
import { Input } from './ui/input'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Label } from './ui/label'
import folderservice from '@/Appwrite/FolderService/Api'
import { useEffect,useState } from 'react'
import authservice from '@/Appwrite/AuthService/Api'


function Popup() {

    const [folders,setfolders]=useState<any[]>([])

    const [userid,setuserid]=useState<null | string>(null)

    useEffect(()=>{
        
        authservice.getAccount().then((res)=>{
            setuserid(res.$id)

        }).catch((error)=>{
            console.log("error",error)
        })




    },[])

    useEffect(()=>{
        if (!userid) return

        folderservice.listFolders(userid).then((res)=>{
            setfolders(res.rows)
        })


    },[userid])


    return (
        <div>
            <Dialog>
                <DialogTrigger asChild>
                    <Button variant="ghost" size="sm">
                        <Plus className="mr-1 h-4 w-4" />
                        Link
                    </Button>
                </DialogTrigger>

                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Add new link</DialogTitle>
                    </DialogHeader>

                    <div className="space-y-4">
                        {/* URL */}
                        <div className="space-y-1">
                            <Label htmlFor="url">URL</Label>
                            <Input
                                id="url"
                                placeholder="https://example.com"
                            />
                        </div>

                        {/* Description */}
                        <div className="space-y-1">
                            <Label htmlFor="description">Description</Label>
                            <Input
                                id="description"
                                placeholder="Optional description"
                            />
                        </div>

                        {/* Folder select */}
                        <div className="space-y-1">
                            <Label>Folder</Label>
                            <Select>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select folder" />
                                </SelectTrigger>
                                <SelectContent>
                                    {
                                        folders.map((f)=>{
                                            return(
                                                <SelectItem key={f.$id} value={f.name}>{f.name}</SelectItem>

                                            )
                                        })
                                    }
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Actions */}
                        <div className="flex justify-end gap-2 pt-2">
                            <Button variant="outline">Cancel</Button>
                            <Button>Add link</Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

        </div>
    )
}

export default Popup
