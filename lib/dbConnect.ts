import mongoose from "mongoose"
import { DB_NAME } from "@/constants"

type ConnectionObject={
    isConnected?:number
}

const connection:ConnectionObject={}

async function dbConnect(): Promise<void> {
    // check if its connected or not
    
    if (connection.isConnected){
        console.log("Already conncted to the server")
        return
    }

    try{
        const db=await mongoose.connect(`${process.env.MONGODB_URL}/${DB_NAME}` || '', {})

        connection.isConnected=db.connections[0].readyState

        console.log('Database connected successfully')
        

    }
    catch(error){
        console.error('Database connection failed', error)

        // Graceful exit in case of a connection error
        process.exit(1)


    }
}

export default dbConnect;