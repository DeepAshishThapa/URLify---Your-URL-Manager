import { Client, TablesDB, Permission, Role, ID } from "appwrite";
import config from "@/config/config";

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

    async createLink({ url, description, userid, folderid }: createLinkInput) {


        const result = await this.tablesDB.createRow({
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



}

    

}

