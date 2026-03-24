import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"
import dbConnect from "@/lib/dbConnect"
import UserModel from "@/model/user.model"

export const { handlers, signIn, signOut, auth } = NextAuth({
    providers: [
        Credentials({

            credentials: {
                email: {},
                password: {}
            },

            authorize: async (credentials) => {
                await dbConnect()

                if (!credentials) return null

                const email = credentials.email as string
                const password = credentials.password as string

                const user = await UserModel.findOne({
                    email
                })

                if (!user) {
                    throw new Error("User not found")
                }

                if (!user.isVerified) {
                    throw new Error("Please verify your account first")
                }

                const isValid = await bcrypt.compare(
                    password,
                    user.password
                )

                if (!isValid) {
                    throw new Error("Invalid Password")
                }

                return {
                    id: user._id.toString(),
                    email: user.email,
                    username: user.username,
                    isVerified: user.isVerified,

                }
            }
        })
    ],
    session: {
        strategy: "jwt"
    },

    callbacks: {

        async jwt({ token, user }) {
            if (user) {
                token._id = user.id,
                    token.username = user.username,
                    token.isVerified = user.isVerified,
                    token.email = user.email
            }

            return token
        },

        async session({ session, token }) {
            session.user._id = token._id as string,
                session.user.username = token.username as string,
                session.user.isVerified = token.isVerified as boolean


            return session
        }
    },

    pages: {
        signIn: "/sign-in"
    },

    secret: process.env.Auth_SECRET
})
