import { Body, FormField, Get, Post, Route, Tags, UploadedFile, Request, UploadedFiles } from "tsoa";
import {  IResponse, My_Controller } from "./controller";
import { ResponseHandler } from "../../src/config/responseHandler";
import code from "../../src/config/code";
import PostType from "../types/postType";
import { postSchema } from "../validations/post.validation";
import {PostModel} from "../models/post"
const response = new ResponseHandler()

@Tags("Post Controller")
@Route("/post")

export class postController extends My_Controller {

    @Post("single")
    public async create(
        @FormField() title : string,
        @FormField() description : string,
        @UploadedFile() image : Express.Multer.File
    ): Promise<IResponse> {
        try {
        //    const validate =  this.validate(postSchema, body)
        //    if(validate !== true)
        //        return response.liteResponse(code.VALIDATION_ERROR, 'Validation error', validate)
        let url = await this.uploadFile(image)
        console.log(url)

        // const savePost =  await PostModel.create({data:{
        //     userId: 34,
        //     title : title,
        //     description: description,
        //     Images : uploaded.secure_url
        // }})
        
            
            
            return response.liteResponse(code.SUCCESS, "User created with success !", url)
        }catch(e){
            return response.catchHandler(e)
        }

    }
    @Post("multiple")
    public async createMultiple(
        @FormField() title : string,
        @FormField() description : string,
        @UploadedFiles() image : Express.Multer.File
    ): Promise<IResponse> {
        try {
        //    const validate =  this.validate(postSchema, body)
        //    if(validate !== true)
        //        return response.liteResponse(code.VALIDATION_ERROR, 'Validation error', validate)
        let url = await this.uploadFile(image)
        console.log(url)

        // const savePost =  await PostModel.create({data:{
        //     userId: 34,
        //     title : title,
        //     description: description,
        //     Images : uploaded.secure_url
        // }})
        
            
            
            return response.liteResponse(code.SUCCESS, "User created with success !", url)
        }catch(e){
            return response.catchHandler(e)
        }

    }
}