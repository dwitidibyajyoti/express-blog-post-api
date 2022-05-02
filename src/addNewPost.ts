import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";

const prisma = new PrismaClient();

export interface Params {
  name: string;
  email: string;
  title: string;
  bio: string;
}

export const addUserAndPost = async (params: Params) => {
  const { name, email, title, bio } = params;

  const result = await prisma.user.create({
    data: {
      name,
      email,
      posts: {
        create: { title },
      },
      profile: {
        create: { bio },
      },
    },
  });
  return result;
};

export const addPost = async (req: Request, res:Response ) => {

  res.json({
    req
  })
  // const { name, email, title, bio } = params;

  // const result = await prisma.user.create({
  //   data: {
  //     name,
  //     email,
  //     posts: {
  //       create: { title },
  //     },
  //     profile: {
  //       create: { bio },
  //     },
  //   },
  // });
  // return result;
};
