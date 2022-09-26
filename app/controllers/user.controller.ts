import {Body, Get, Post, Route, Tags, Security, Request} from "tsoa";
import {  IResponse, My_Controller } from "./controller";
import UserType from "../types/userType";
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import {userCreateSchema} from "../validations/user.validation";
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
    @Get("")
    public async index(
    ): Promise<IResponse> {
        try {
            let findUser = await UserModel.findMany();
            if(!findUser)
                return response.liteResponse(code.FAILD, "Error occurred during Finding ! Try again", null)

            return response.liteResponse(code.SUCCESS, "User found with success !", findUser)
        }catch(e){
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

                const token = jwt.sign(payload, <string>process.env.SECRET_TOKEN, { expiresIn: '1d'})
                const decode: any = jwt.decode(token)
                //Create token for this user
                const createToken = await TokenModel.create({data : {
                    userId: foundUser.id,
                        jwt: token,
                        expireIn : decode.exp
                    }, select : {
                        jwt: true,
                    }})
                const jwtToken : any = createToken.jwt
                return response.liteResponse(code.SUCCESS, "Success request login", {...foundUser, token: jwtToken})
            }

        }
        catch (e){
            return response.catchHandler(e)
        }
    }

    @Post("register")
    public async register(
        @Body() body: UserType.userCreateFields
    ): Promise<IResponse>{
        try {
            const validate = this.validate(userCreateSchema, body)
            if(validate !== true)
                return response.liteResponse(code.VALIDATION_ERROR, "Validation Error !", validate)

            //Check if email already exist
            console.log("Check Email...")
            const verifyEmail = await UserModel.findFirst({where:{email : body.email}})
            if(verifyEmail)
                return response.liteResponse(code.FAILURE, "Email already exist, Try with another email")
            console.log("Check Email finished")

            //save user
            console.log("Create user...")
            const createUser = await UserModel.create({data: {
                    firstName: body.firstName,
                    lastName: body.lastName,
                    email: body.email,
                    password: bcrypt.hashSync(body.password, 10),
                    roleId: USER_ROLE.USER
                }})
            console.log("Create user Success")
            return response.liteResponse(code.SUCCESS, "User registered with Success !", createUser)
        }catch (e){
            return response.catchHandler(e)
        }
    }

    @Get('logout')
    @Security("Jwt")
    public async logout(
        @Request() req : any
    ): Promise<IResponse> {
        try {
            const token = await TokenModel.findFirst({where: {jwt : req.headers['authorization']}})
            if(!token)
                return response.liteResponse(code.FAILURE, "Token not found",null)

            let expirate  = Math.round((new Date().getTime() / 1000) / 2)
            await TokenModel.update({where : {id: token.id}, data: {
                    expireIn: expirate,
                }})
            return response.liteResponse(code.SUCCESS, "Logout with success !", null)
        }catch (e){
            return response.catchHandler(e)
        }
    }
}