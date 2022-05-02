import express, { Application, Request, Response } from "express";

import { PrismaClient } from "@prisma/client";
import { addUserAndPost, Params, addPost } from "./addNewPost";

const prisma = new PrismaClient();

const app: Application = express();
const port = 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/", (_req:Request, res: Response) => {
  res.send(`Server is running on port: ${port}`);
});

app.get("/api/data", async (_req:Request, res:Response) => {
  try {
    const allUsers = await prisma.user.findMany({
      include: {
        posts: true,
        profile: true,
      },
    });
    res.json(allUsers);
  } catch (e) {
    console.log(e);
    res.status(500);
  }
});


app.post("/api/post", async (req: Request, res: Response) => {
  if (req.body && req.body.title && req.body.content && req.body.id) {
    const checkUniqueEmail = await prisma.user.findFirst({
      where: {
        id: parseInt(req.body.id)
      }
    });

    if (checkUniqueEmail !== null) {
      const createPost = await prisma.post.create({
        data: {
          title: req.body.title,
          content: req.body.content,
          published: true,
          authorId: parseInt(req.body.id)
        }
      })
      return res.json({
        data: { createPost },
        success: true,
        message: "post successfully created."
      });
    } else {
      return res.json({
        data: {},
        success: false,
        message: "please use correct user id"
      });
    }
  } 
});


app.get("/api/post", async (req: Request, res: Response) => {

  const allPost = await prisma.post.findMany({
    where: {
      published: true,
    },
    include: {
      author: true
    },
  })

  return res.json({
    data: { allPost },
    success: true,
    message: "post successfully created."
  });

});

app.post("/api/data", async (req: Request, res: Response) => {
  const body = req.body as Params;
  if (body && body.name && body.email && body.title) {

    const checkUniqueEmail = await prisma.user.findUnique({
      where: {
        email: body.email
      }
    });

    if (checkUniqueEmail !== null) {
      return res.json({
        data: {
        },
        success: false,
        message: "email already exit please use deferent email"
      });
    }
    await addUserAndPost(body);
    const allUsers = await prisma.user.findMany({
      include: {
        posts: true,
        profile: true,
      },
    });
    return res.json(allUsers);
  }
  res.send("It seems that you forgot to send a data");
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
