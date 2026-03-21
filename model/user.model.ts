import mongoose, { Schema } from 'mongoose'

export interface UserObject extends mongoose.Document {
    username: string,
    email: string,
    password: string,
    verifyCode: string,
    isVerified: boolean,
      verifyCodeExpiry: Date;

}

const userSchema: Schema<UserObject> = new Schema(
    {
        username: {
            type: String,
            required: [true, 'Username is required'],
            trim: true,
            unique: true
        },
        email: {
            type: String,
            required: [true, 'Email is required'],
            unique: true,
            match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Please use a valid email address']
        },
        password: {
            type: String,
            required: [true, 'Password is required'],


        },
        verifyCode: {
            type: String,
            required: [true, 'Verify Code Expiry is required']
        },
        isVerified: {
            type: Boolean,
            default: false
        },
        verifyCodeExpiry: {
            type: Date,
            required: [true, 'Verify Code Expiry is required'],
        }

    }
)

const UserModel =
    (mongoose.models.User as mongoose.Model<UserObject>) ||
    mongoose.model<UserObject>('User', userSchema);

export default UserModel;         
