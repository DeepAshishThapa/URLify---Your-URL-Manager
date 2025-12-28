"use client"
import React from 'react'
import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@radix-ui/react-label'
import authservice from '@/Appwrite/AuthService/Api'
import { login } from '@/Appwrite/AuthService/authSlice'
import { useDispatch } from 'react-redux'
import { useState } from 'react'
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useForm, SubmitHandler } from "react-hook-form"
import { useRouter } from 'next/navigation'


type Inputs = {
    name: string
    email: string
    password: string
}


function Signup() {
    const router=useRouter()

    const [status,setStatus]=useState<"error" | "success" | null>(null)

    const [message,setmessage]=useState("")


    const dispatch=useDispatch()

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },

    } = useForm<Inputs>()

    const onSubmit: SubmitHandler<Inputs> = async (data) => {
        try {
            
             await authservice.createAccount(data)
             const userData = await authservice.getAccount();

            // Automatically log user in and update Redux state
            dispatch(login(userData));

            setStatus("success")

            setTimeout(() => {
                router.push("/");

                
            }, 1200);





            
        } catch (error:any) {
            console.log(error.message)
            setStatus("error")
            setmessage(error.message)
        }

    }
  

    return (
        <>
            <Card className="w-full max-w-lg">
                <CardHeader>
                    <CardTitle>Create a new account</CardTitle>


                </CardHeader>
                <CardContent>
                    {status && (
                         <Alert
                            variant={status === "error" ? "destructive" : "default"}
                            className="mb-4"
                        >
                            <AlertTitle>
                                {status === "success" ? "Signup successful" : message}
                            </AlertTitle>
                            <AlertDescription>
                                {status === "success" && "Redirecting you to home..." }
                            </AlertDescription>
                        </Alert>
                        
                    )

                    
                     }
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="flex flex-col gap-6">
                            <div className="grid gap-2">
                                <Label htmlFor="name">Name</Label>
                                <Input
                                    id="name"

                                    placeholder="name"
                                    required
                                    {...register("name", {
                                        minLength: { value: 2, message: "Name must be at least 2 characters" },
                                    }

                                    )}
                                />
                                {errors.name && (
                                    <p className="text-sm text-red-500">{errors.name.message}</p>
                                )}
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="m@example.com"
                                    required
                                    {...register("email", {
                                        pattern: {
                                            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                            message: "Enter a valid email address",
                                        }
                                    }

                                    )}
                                />
                                {errors.email && (
                                    <p className="text-sm text-red-500">{errors.email.message}</p>
                                )}
                            </div>
                            <div className="grid gap-2">
                                <div className="flex items-center">
                                    <Label htmlFor="password">Password</Label>

                                </div>
                                <Input id="password" type="password" required
                                    {...register("password", {
                                        minLength: { value: 8, message: "Password must be at least 8 characters" }
                                    }

                                    )}
                                />
                                {errors.password && (
                                    <p className="text-sm text-red-500">{errors.password.message}</p>
                                )}
                            </div>
                            {/* <div className="grid gap-2">
                                <div className="flex items-center">
                                    <Label htmlFor="confirmpassword">Confirm Password</Label>

                                </div>
                                <Input id="confirmpassword" type="password" required />
                            </div> */}
                        </div>
                        <CardFooter className="flex-col gap-2 mt-10">
                            <Button type="submit" className="w-full" disabled={isSubmitting}>
                                {isSubmitting ? "Submitting..." : "Signup"}
                            </Button>

                        </CardFooter>
                    </form>
                </CardContent>

            </Card>

            

        </>
    )
}

export default Signup
