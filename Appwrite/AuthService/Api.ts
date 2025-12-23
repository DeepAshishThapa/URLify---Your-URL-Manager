import { Client, Account, ID } from "appwrite"
import config from "../../config/config"

type createAccountInput = {
    email: string;
    password: string;
    name: string

}

type LoginInput = {
    email: string;
    password: string;

}

class AuthService {
    private client = new Client()
    private account;

    constructor() {
        this.client
            .setEndpoint(config.appwriteURL)
            .setProject(config.appwriteProjectId)

        this.account = new Account(this.client)

    }

    async createAccount({ email, password, name }: createAccountInput) {
        const user = await this.account.create({
            userId: ID.unique(),
            email,
            password,
            name
        })

        await this.Login({ email, password })

        return user



    }

    async Login({ email, password }: LoginInput) {
        return await this.account.createEmailPasswordSession({
            email,
            password
        })
    }

    async getAccount(){
        return await this.account.get()
        
    }

    async Logout(){
        return await this.account.deleteSessions()
    }

}

const authservice= new AuthService()

export default authservice