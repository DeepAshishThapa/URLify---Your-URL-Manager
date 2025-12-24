import { Client, TablesDB, Permission, Role, ID, Query } from "appwrite";
import config from "@/config/config";
import authservice from "../AuthService/Api";

type createLinkInput = {
    url: string;
    description: string;
    userid: string;
    folderid: string;


}




class PostService {
    private client = new Client;
    private tablesDB;

    constructor() {
        this.client
            .setEndpoint(config.appwriteURL)
            .setProject(config.appwriteProjectId)

        this.tablesDB = new TablesDB(this.client)
    }

    async createLink({ url, description, folderid }: createLinkInput) {

        const userData = await authservice.getAccount()

        const userid = userData.$id


        return await this.tablesDB.createRow({
            databaseId: config.appwriteDatabaseId,
            tableId: config.appwritePosttableId,
            rowId: ID.unique(),
            data: {
                url,
                description,
                userid,
                folderid
            },
            permissions: [
                Permission.read(Role.user(userid)),
                Permission.update(Role.user(userid)),
                Permission.delete(Role.user(userid)),

            ]


        })

    }

    async listLinks(userid: string) {
        return await this.tablesDB.listRows({
            databaseId: config.appwriteDatabaseId,
            tableId: config.appwritePosttableId,
            queries: [
                Query.equal("userid", userid)
            ]
        })
    }





}





