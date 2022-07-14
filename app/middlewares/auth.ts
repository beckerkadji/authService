import * as jwt from "jsonwebtoken"
import express, {Request, Response} from "express"
import code from "../../src/config/code";
import { ResponseHandler } from "../../src/config/responseHandler";
import {IResponse} from "../controllers/controller";
import {JsonWebTokenError, TokenExpiredError} from "jsonwebtoken";
import {TokenModel} from "../models/token";
const response = new ResponseHandler()

export const expressAuthentication = async (
    request : express.Request,
    securityName : string,
    scopes? : string[],
) : Promise<any> => {
    try {

        const authorization : any = request.body.authorization || request.query.authorization || request.headers["authorization"];
        const params = scopes ? scopes : [];

        if (securityName === "Jwt") {
            const token: any = await checkAuthorization(authorization)
            console.log("Verify authorization", authorization)
            if(authorization){
                let decodedToken : any
                jwt.verify(authorization, `[${<string>process.env.SECRET_TOKEN}]`, (err:any, decoded: any) => {
                    if(err){
                        console.log("error here")
                        return response.liteResponse(code.INVALID_TOKEN, "Invalid token provided", null)
                    }
                   
                    //Check if JWT contains all required scopes
                    const containScopes: string[] = <string[]>scopes
                    for(let scope of containScopes){
                        if(!decoded.scopes.includes(scope))
                            return response.liteResponse(code.NOT_AUTHORIZED, "JWT does not contain required scope.",null)
                    }
                    decodedToken = decoded
                })
                return Promise.resolve(decodedToken.userId)
            }
        } else{
            return Promise.reject({})
        }

    } catch (e){
        return response.catchHandler(e)
    }


}

export const checkAuthorization = async (authorization ?: string) => {
    if (!authorization)
        throw new Error("Token not found");

    const decoded : any = jwt.decode(authorization);

    if (!decoded || decoded instanceof (JsonWebTokenError || TokenExpiredError)){
        throw new Error("Incorrect token");
    }

    if (!decoded){
        throw new Error("Incorrect token");
    }

    const token = await TokenModel.findFirst({where : {jwt : authorization}, include : {user : {include : {role : true}}}});
    if (!token)
        throw new Error("Token not found");
    if (token.expiredAt < new Date())
        throw new Error("Token expired");
    if (token)
        return token;
    throw new Error("Unknown token")
}