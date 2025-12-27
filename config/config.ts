interface AppwriteConfig {
    appwriteURL: string;
    appwriteProjectId: string;
    appwriteDatabaseId: string;
    appwritePosttableId: string;
    appwriteFoldertableId: string

}

const config: AppwriteConfig = {
    appwriteURL: process.env.NEXT_PUBLIC_APPWRITE_URL!,
    appwriteProjectId: process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!,
    appwriteDatabaseId: process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
    appwritePosttableId: process.env.NEXT_PUBLIC_APPWRITE_POSTTABLE_ID!,
    appwriteFoldertableId: process.env.NEXT_PUBLIC_APPWRITE_FOLDERTABLE_ID!




}
export default config