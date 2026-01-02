"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Menu, Plus, Trash2, Pencil, Check, X } from "lucide-react";
import authservice from "@/Appwrite/AuthService/Api";
import folderservice from "@/Appwrite/FolderService/Api";
import postservice from "@/Appwrite/PostService/Api";



type folder={
   readonly $id: string,
  name:string,
  isSystem:boolean,
  userid:string
}

type ActiveView =
  | { type: "all" }
  | { type: "folder"; folderId: string };




// -------------------- Component --------------------
export default function Menubar() {
  const [userid, setUserid] = useState<string | null>(null);

  const [folders, setFolders] = useState<any[]>([])
  const [activeView, setActiveView] = useState<ActiveView>({ type: "all" });

  // add folder UI
  const [addingFolder, setAddingFolder] = useState(false);
  const [folderName, setFolderName] = useState("");

  // rename folder UI
  const [editingFolderId, setEditingFolderId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");

  useEffect(() => {
    authservice.getAccount().then((res) => {
      setUserid(res.$id)

    })
      .catch((error) => {
        console.log(error)
      })

  }, [])


  // -------------------- Load folders --------------------
  useEffect(() => {
    if (!userid) return

    (async () => {
      try {
        await ensureUnsavedFolder();
        const f = await folderservice.listFolders(userid)
        setFolders(f.rows);
      } catch (error) {
        console.log("failed to load folders", error)
      }
    })();

  }, [userid])

  async function ensureUnsavedFolder() {
    if (!userid) return
    // try to find Unsaved
    const existing = await folderservice.ensureUnsavedFolder(userid)


    if (existing.total > 0) return;

    // create if not exists
    await folderservice.createFolder({ name: "unsaved", isSystem: true })
  }



  async function renameFolder(folderId: string, name: string) {
    try {
      await folderservice.updateFolder({ rowId: folderId, name })

    } catch (error) {
      console.log("Rename failed", error)
    }

  }

  async function deleteFolder(folderId: string) {
    try{
      await folderservice.deleteFolder(folderId)

    }catch(error){
      console.log("delete failed",error)
    }
  }




  // -------------------- Derived --------------------
  const systemFolders = useMemo(() => folders.filter((f) => f.isSystem), [folders]);
  const userFolders = useMemo(() => folders.filter((f) => !f.isSystem), [folders]);

  // -------------------- Actions --------------------
  async function handleAddFolder() {
    const name = folderName.trim();
    if (!name) return;

    // prevent duplicate names (optional)
    const exists = folders.some((f) => f.name.toLowerCase() === name.toLowerCase());
    if (exists) return;

    try{
      const created = await folderservice.createFolder({name:folderName,isSystem:false})
      setFolders((prev) => [...prev, created]);

    }
    catch(error){
      console.log("adding failed",error)
    }

    
    

    setFolderName("");
    setAddingFolder(false);
  }

  function startRename(folder:folder) {
    if (folder.isSystem) return;
    setEditingFolderId(folder.$id);
    setEditingName(folder.name);
  }

  async function saveRename() {
    if (!editingFolderId) return;
    const name = editingName.trim();
    if (!name) return;

    await renameFolder(editingFolderId, name);

    setFolders((prev) =>
      prev.map((f) => (f.$id === editingFolderId ? { ...f, name } : f))
    );

    setEditingFolderId(null);
    setEditingName("");
  }

  function cancelRename() {
    setEditingFolderId(null);
    setEditingName("");
  }

  async function handleDeleteFolder(folder:folder) {
    if (folder.isSystem) return;

    await deleteFolder(folder.$id);
    setFolders((prev) => prev.filter((f) => f.$id !== folder.$id));

    if (activeView.type === "folder" && activeView.folderId === folder.$id) {
      setActiveView({ type: "all" });
    }
  }

  // -------------------- UI --------------------
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon">
          <Menu className="w-5 h-5 ml-2 hover:cursor-pointer" />
        </Button>
      </SheetTrigger>

      <SheetContent side="left" className="w-[340px]">
        <SheetHeader>
          <SheetTitle>Folders</SheetTitle>
        </SheetHeader>

        {/* All (UI-only) */}
        <div className="mt-6 space-y-2">
          <Button
            variant={activeView.type === "all" ? "secondary" : "ghost"}
            className="w-full justify-start"
            onClick={() => setActiveView({ type: "all" })}
          >
            All
          </Button>
        </div>

        {/* System folders (Unsaved from DB) */}
        <div className="mt-6">
          <p className="text-sm font-medium opacity-80 mb-2">System</p>

          <div className="space-y-1">
            {systemFolders.map((folder) => {
              const isActive =
                activeView.type === "folder" && activeView.folderId === folder.$id;

              return (
                <Button
                  key={folder.$id}
                  variant={isActive ? "secondary" : "ghost"}
                  className="w-full justify-start"
                  onClick={() =>
                    setActiveView({ type: "folder", folderId: folder.$id })
                  }
                  title="System folder (cannot rename/delete)"
                >
                  {folder.name}
                </Button>
              );
            })}
          </div>
        </div>

        {/* User folders + add folder */}
        <div className="mt-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium opacity-80">Your folders</p>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => setAddingFolder((v) => !v)}
              title="Add folder"
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>

          {addingFolder && (
            <div className="flex gap-2 mb-3">
              <Input
                value={folderName}
                onChange={(e) => setFolderName(e.target.value)}
                placeholder="Folder name..."
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleAddFolder();
                  if (e.key === "Escape") {
                    setAddingFolder(false);
                    setFolderName("");
                  }
                }}
              />
              <Button onClick={handleAddFolder}>Add</Button>
            </div>
          )}

          <div className="space-y-1">
            {userFolders.map((folder) => {
              const isActive =
                activeView.type === "folder" && activeView.folderId === folder.$id;

              const isEditing = editingFolderId === folder.$id;

              return (
                <div key={folder.$id} className="flex items-center gap-1">
                  <Button
                    variant={isActive ? "secondary" : "ghost"}
                    className="flex-1 justify-start"
                    onClick={() =>
                      setActiveView({ type: "folder", folderId: folder.$id })
                    }
                  >
                    {isEditing ? (
                      <Input
                        value={editingName}
                        onChange={(e) => setEditingName(e.target.value)}
                        className="h-7"
                        autoFocus
                        onKeyDown={(e) => {
                          if (e.key === "Enter") saveRename();
                          if (e.key === "Escape") cancelRename();
                        }}
                      />
                    ) : (
                      folder.name
                    )}
                  </Button>

                  {/* Rename */}
                  {isEditing ? (
                    <>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={saveRename}
                        title="Save"
                      >
                        <Check className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={cancelRename}
                        title="Cancel"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </>
                  ) : (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => startRename(folder)}
                      title="Rename"
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                  )}

                  {/* Delete */}
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDeleteFolder(folder)}
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              );
            })}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
