import { Body, Get, Post, Route, Tags, Security } from "tsoa";
import {  IResponse, My_Controller } from "./controller";
import UserType from "../types/userType";
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import {loginSchema, userSchema} from "../validations/user.validation";
import {AUTHUSER, UserModel} from "../models/user";
import { ResponseHandler } from "../../src/config/responseHandler";
import code from "../../src/config/code";
import {USER_ROLE} from "../models/role";
import {TokenModel} from "../models/token";
const response = new ResponseHandler()

@Tags("User Controller")
@Route("/user")

export class UserController extends My_Controller {
    @Security("Jwt", [AUTHUSER.ROOT])
    @Post("")
    public async create(
        @Body() body : UserType.userCreateFields
    ): Promise<IResponse> {
        try {
           console.log('we enter')
            let userCreate = await UserModel.create({data : {
                    firstName: body.firstName,
                    lastName: body?.lastName,
                    email: body.email,
                    password:body.password,
                    roleId: USER_ROLE.USER
                }});
            if(!userCreate)
                return response.liteResponse(code.FAILD, "Error occurred during creation, try again", null)

            return response.liteResponse(code.SUCCESS, "User created with success !", body)
        }catch(e){
            console.log("error", e)
            return response.catchHandler(e)
        }

    }

    @Post('login')
    public async login(
        @Body() body : UserType.loginFields
    ) : Promise<IResponse> {
        try {
            //found user
            const foundUser = await UserModel.findFirst({where: {email: body.email}})
            if(!foundUser)
                return response.liteResponse(code.NOT_FOUND, 'User not found, Invalid email or password !')

            //Compare password
            const compare = bcrypt.compareSync(body.password, foundUser.password)
            if(!compare){
                return response.liteResponse(code.FAILURE, "Invalid password. Try again !")
            }
            else {
                // Create generate token
                const payload : any = {
                    userId : foundUser.id,
                    email : foundUser.email
                }

                const token = jwt.sign(payload, <string>process.env.SECRET_TOKEN)

                //Create token for this user
                const createToken = await TokenModel.create({data : {
                    userId: foundUser.id,
                        jwt: token,
                        expiredAt : new Date(Date.now() + (parseInt(<string> process.env.TOKEN_DAY_VALIDITY)*24*60*60*1000))
                    }})
                return response.liteResponse(code.SUCCESS, "Success request login", {foundUser, createToken})
            }

        }
        catch (e){
            return response.catchHandler(e)
        }
    }
}