"use server"
import prisma from "../lib/db";

export async function createUser(formData:FormData){
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    await prisma.user.create({

        data:{
            name,
            email,
            password
        }
    })
    

}
    