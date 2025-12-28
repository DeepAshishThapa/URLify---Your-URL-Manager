"use client"


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
import { useForm, SubmitHandler } from 'react-hook-form'
import authservice from '@/Appwrite/AuthService/Api'
import { useDispatch } from 'react-redux'
import { login } from '@/Appwrite/AuthService/authSlice'
import { useRouter } from 'next/navigation'
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useState } from 'react'

type Inputs = {
    email: string,
    password: string
}




function Login() {

    const [status, setStatus] = useState<"success" | "error" | null>(null)

    const [message, setmessage] = useState("")

    const router = useRouter();

    const dispatch = useDispatch()
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },

    } = useForm<Inputs>()


    const onSubmit: SubmitHandler<Inputs> = async (data) => {
        try {
            await authservice.Login(data)
            const userData = await authservice.getAccount()
            dispatch(login(userData))

            setStatus("success")

            setTimeout(() => {
                router.push("/");
            }, 1200);

        }
        catch (error: any) {
            console.log(error)
            setStatus("error")
            setmessage(error.message)

        }



    }





    return (
        <>
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle>Login to your account</CardTitle>
                    <CardDescription>
                        Enter your email below to login to your account
                    </CardDescription>

                </CardHeader>
                <CardContent>
                    {status && (
                        <Alert
                            variant={status === "error" ? "destructive" : "default"}
                            className="mb-4"
                        >
                            <AlertTitle>
                                {status === "success" ? "Login successful" : message}
                            </AlertTitle>
                            <AlertDescription>
                                {status === "success" && "Redirecting you to home..." }
                            </AlertDescription>
                        </Alert>
                    )}
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="flex flex-col gap-6">
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
                                    })}
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
                                    })}
                                />
                                {errors.password && (
                                    <p className="text-sm text-red-500">{errors.password.message}</p>
                                )}
                            </div>
                        </div>
                        <CardFooter className="flex-col gap-2 mt-10">
                            <Button type="submit" className="w-full" disabled={isSubmitting}>
                                {isSubmitting ? "Logging in..." : "Login"}
                            </Button>

                        </CardFooter>
                    </form>
                </CardContent>

            </Card>




        </>
    )
}

export default Login
