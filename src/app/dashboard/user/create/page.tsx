'use client'

import { createUser } from "@/services/User/UserService";
import { CreateUserRequest } from "@/types/User/CreateUserRequest";
import { ErrorResponse, ValidationErrorResponse } from "@/types/shared/ValidationError";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { UserPlus } from 'lucide-react';
import { getIp, logAuditAction } from "@/services/Audit/AuditService";
import { useAuthToken } from "@/hooks/useAuthToken";

// New Form
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import Header from "@/components/Header";

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { toast } from "sonner";
import validFunctions from '@/providers/ValidateFunctions';

function UserCreateForm() {
    const router = useRouter();
    const token = useAuthToken();

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        const ip = await getIp();
        try {
            await createUser(values, token).then(async (res) => {
                if (res.status === 201) {
                    await logAuditAction({
                        functionName: 'SEC-USERS-CREATE',
                        action: 'create User',
                        description: 'Successfully created user',
                        observation: `User name: ${values.username}`,
                        ip: ip.toString(),
                    }, token);
                    toast.success("User created successfully");
                    return router.push("/dashboard/user");
                }
                await logAuditAction({
                    functionName: 'SEC-USERS-CREATE',
                    action: 'create User',
                    description: 'Error creating user',
                    ip: ip.toString(),
                }, token);

                await res.json().then((data: ValidationErrorResponse) => {
                    if (data.error === 'ValidationException') {
                        data.message.forEach((error) => {
                            toast.error(error.errors);
                        });
                    } else {
                        toast.error(data.message.toString());
                    }
                });

            }).catch((err) => {
                toast.error(err.message);
            });
        } catch (error) {
            if (error instanceof Error) {
                toast.error(error.message);
            }
        }
    }

    const formSchema = z.object({
        username: z.string().min(5, {
            message: "Name must be at least 5 characters.",
        }),
        email: z.string().email({
            message: "Email is not valid.",
        }),
        dni: z.string()
            .min(10, {
                message: "DNI must be at least 10 characters.",
            }).max(15, {
                message: "DNI must be at most 15 characters."
            }),
    })

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            username: "",
            email: "",
            dni: "",
        },
    })

    return (
        <>
            <Header title='Create User' icon={<UserPlus size={26} />} />

            <div className="flex justify-center items-center">


                <Card className="w-[40%] my-10">
                    {/* {errorResponse?.message && (
                        <div className="bg-red-100 border flex justify-center border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                            <strong className="font-bold">Error! </strong>
                            <span className="block sm:inline">{errorResponse?.message}</span>
                        </div>
                    )} */}
                    <CardHeader>
                        <CardTitle>Create Users</CardTitle>
                        <CardDescription>User Creation - Security Module.</CardDescription>
                    </CardHeader>
                    <div data-orientation="horizontal" role="none" className="shrink-0 mb-4 bg-border h-[1px] w-full"></div>
                    <CardContent>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                                <FormField
                                    control={form.control}
                                    name="username"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Username</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Enter your username " {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Email</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Enter your email" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="dni"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>DNI</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Enter your DNI" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <div className="flex justify-between">
                                    <Button variant="outline" type="button" onClick={() => router.push("/dashboard/user")}>Cancel</Button>
                                    <Button
                                        type="submit"
                                        value="Save"
                                    >Create</Button>
                                </div>
                            </form>
                        </Form>
                    </CardContent>
                </Card>
            </div >
        </>
    );
};
export default validFunctions(UserCreateForm, 'SEC-USERS-CREATE');

