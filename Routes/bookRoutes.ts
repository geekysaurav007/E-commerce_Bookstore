import express from "express";
const bookRouter = express.Router();
import {
  createBook,
  deleteBookById,
  findBookByCategory,
  getAllBooks,
} from "../controllers/bookController";
import { adminAuthMiddleware } from "../middlewares/user-auth-middleware";
import multer from "multer";
import path from "path";
import * as dotenv from 'dotenv';
dotenv.config();
import mongoose from "mongoose";

import { S3Client } from "@aws-sdk/client-s3";
// const multerS3 = require('multer-s3')
import multers3 from "multer-s3";

const app = express();
console.log(process.env.s3_secret_key);
console.log(process.env.s3_key);

const s3 = new S3Client({
  region: "ap-southeast-2",
  credentials: {
    accessKeyId:String(process.env.s3_key),
    secretAccessKey:String(process.env.s3_secret_key),
  },
});

// const tempMulter = multerS3({ dest: "media/products" });
let storage = multers3({
  s3: s3,
  bucket: "pageturnbooksimg",
  metadata: function (
    req: any,
    file: { fieldname: any },
    cb: (arg0: null, arg1: { fieldName: any }) => void
  ) {
    cb(null, { fieldName: file.fieldname });
  },
  key: function (req: any, file: any, cb: (arg0: null, arg1: string) => void) {
    cb(null, new mongoose.Types.ObjectId() + ".png");
  },
});
const upload = multer({ storage });

bookRouter.post("/addbook", upload.single("image"), createBook);
bookRouter.get("/allbooks", getAllBooks);
bookRouter.delete("/deletebook/:id", adminAuthMiddleware, deleteBookById);
bookRouter.get("/getbookbycategory/:id", findBookByCategory);
export { bookRouter };
