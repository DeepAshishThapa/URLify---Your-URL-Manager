import { Client, TablesDB, Permission, Role,ID } from "appwrite";
import config from "@/config/config";

type createFolderInput={
    name:string,
    isSystem:boolean,
    
}

class PostService{
    private client = new Client();
    tablesDB;
    constructor(){
        this.client
            .setEndpoint(config.appwriteURL)
            .setProject(config.appwriteProjectId)

        this.tablesDB=new TablesDB(this.client)


    }

    async createFolder({name,isSystem}:createFolderInput){
        return await this.tablesDB.createRow({
            databaseId:config.appwriteDatabaseId,
            tableId:config.appwriteFoldertableId,
            rowId:ID.unique(),
            data:{
                name,
                isSystem
            }

        })

    }
}