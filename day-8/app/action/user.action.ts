"use server";

import prisma from "../lib/db";


export async function createUser(formData: FormData) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  await prisma.user.create({
    data: {
      name,
      email,
      password,
    },
  });
}

export const createPost = async (formdata: FormData) => {
  const title = formdata.get("title") as string;
  const content = formdata.get("content") as string;

  await prisma.post.create({
    data: {
      title,
      content,
    },
  });
};

export const deletePost = async (id: number) => {
  await prisma.post.delete({
    where: {
      id: id,
    },
  });
};

export const updatePost = async (
  id: number,
  title: string,
  content: string,
) => {
  await prisma.post.update({
   where: {
      id
   },
   data:{
    title:title,
    content:content
   }
})
};


export const getPostById = async (id:number) =>{
    const post = await prisma.post.findUnique({
        where:{
            id:id
        }
    })
    return{
       post 
    }
}

export const getPost = async () =>{
    const post = await prisma.post.findMany()
return{
    post
}
}
