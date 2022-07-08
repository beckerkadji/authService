import { Body, Get, Post, Route, Tags, Security } from "tsoa";
import {  IResponse, My_Controller } from "./controller";
import UserType from "../types/userType";
import bcrypt from "bcryptjs"
import {loginSchema, userSchema} from "../validations/user.validation";
import { User } from "../models/user";
import { ResponseHandler } from "../../src/config/responseHandler";
import code from "../../src/config/code";
const response = new ResponseHandler()

@Tags("User Controller")
@Route("/user")

export class UserController extends My_Controller {
    @Security("Jwt")
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
                return response.liteResponse(code.FAILD, "Error occurred during creation, try again", null)

            return response.liteResponse(code.SUCCESS, "User created with success !", body)
        }catch(e){
            return response.catchHandler(e)
        }

    }

    public async login(
        @Body() body : UserType.loginFields
    ) : Promise<IResponse> {
        try {
            const validate = this.validate(loginSchema, body)
            if(validate !== true)
                return response.liteResponse(code.VALIDATION_ERROR, 'Validation error', validate)

            //found user
            const foundUser = await User.findFirst({where: {email: body.email}})
            if(!foundUser)
                return response.liteResponse(code.NOT_FOUND, 'User not found, Invalid email or password !')

            //Compare password
            const compare = bcrypt.compareSync(body.password, foundUser.password)
            return response.liteResponse(code.SUCCESS, "Success request login")
        }
        catch (e){
            return response.catchHandler(e)
        }
    }
}