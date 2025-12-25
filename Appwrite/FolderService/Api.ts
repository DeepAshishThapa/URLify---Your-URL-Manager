import { Client, TablesDB, Permission, Role,ID, Query } from "appwrite";
import config from "@/config/config";
import authservice from "../AuthService/Api";

type createFolderInput={
    name:string,
    isSystem:boolean,
    
}

type updateFolderInput={
    name?:string
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
        const userData=await authservice.getAccount()
        const userid=userData.$id

        return await this.tablesDB.createRow({
            databaseId:config.appwriteDatabaseId,
            tableId:config.appwriteFoldertableId,
            rowId:ID.unique(),
            data:{
                name,
                isSystem
            },
            permissions:[
                Permission.read(Role.user(userid)),
                Permission.update(Role.user(userid)),
                Permission.delete(Role.user(userid))

            ]

        })

    }

    async listLinks(userid:string){
        return await this.tablesDB.listRows({
            databaseId:config.appwriteDatabaseId,
            tableId:config.appwriteFoldertableId,
            queries:[
                Query.equal("userid",userid)
            ]
        })
    }

    

    
}