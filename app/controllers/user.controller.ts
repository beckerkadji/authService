import { Body, Get, Post, Route, Tags } from "tsoa";
import {  IResponse, My_Controller } from "./controller";
import UserType from "../types/userType";
import { userSchema } from "../validations/user.validation";
import { User } from "../models/user";
import { ResponseHandler } from "../../src/config/responseHandler";
import code from "../../src/config/code";
const response = new ResponseHandler()

@Tags("User Controller")
@Route("/user")

export class UserController extends My_Controller {

    @Post("")
    public async create(
        @Body() body : UserType.userCreateFields
    ): Promise<IResponse> {
        try {
           const validate =  this.validate(userSchema, body)
           if(validate !== true)
               return response.liteResponse(code.VALIDATION_ERROR, 'Validation error', validate)
           
            let userCreate = await User.create({data : body});
            if(!userCreate)
                return response.liteResponse(code.FAILD, "Error occured during creation, try again", null)

            return response.liteResponse(code.SUCCESS, "User created with success !", body)
        }catch(e){
            return response.catchHandler(e)
        }

    }
}