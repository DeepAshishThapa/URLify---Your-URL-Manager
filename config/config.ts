interface AppwriteConfig {
    appwriteURL: string;
    appwriteProjectId: string;
    appwriteDatabaseId: string;
    appwritePosttableId: string;
    appwriteFoldertableId: string

}

const config: AppwriteConfig = {
    appwriteURL: String(process.env.NEXT_PUBLIC_APPWRITE_URL),
    appwriteProjectId: String(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID),
    appwriteDatabaseId: String(process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID),
    appwritePosttableId: String(process.env.NEXT_PUBLIC_APPWRITE_POSTTABLE_ID),
    appwriteFoldertableId: String(process.env.NEXT_PUBLIC_APPWRITE_FOLDERTABLE_ID)




}
export default config