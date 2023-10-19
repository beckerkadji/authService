import * as jwt from "jsonwebtoken"
import express, {Request, Response} from "express"
import {JsonWebTokenError, TokenExpiredError} from "jsonwebtoken";
import {TokenModel} from "../models/token";
import {roleModel, USER_ROLE} from "../models/role";
import {AUTHUSER} from "../models/user";
import {Middleware_Error} from "../../src/config/Middleware_Error";


export const expressAuthentication = async (
    request : express.Request,
    securityName : string,
    scopes? : string[],
) : Promise<any> => {
    try {
        const authorization : any = request.body.authorization || request.query.authorization || request.headers["authorization"];
        
        const params = scopes ? scopes : [];

        if (securityName === "Jwt") {
            const token = await checkAuthorization(authorization)

            if (!scopes || scopes && scopes?.length < 0)
            return Promise.resolve(`token here ${token.user}`)

            const permissions = token.user.permissions.map(({permission_id}) => permission_id)

            for (const scope of scopes){
                if (!permissions.includes(scope))
                    throw new Middleware_Error("You are not allowed to perform this action")
            }

            return Promise.resolve(token.user)
        }
    } catch (e: any){
        return Promise.reject(new Middleware_Error(e.m))
    }
}

export const checkAuthorization = async (authorization ?: string) => {
    if (!authorization)
        throw new Middleware_Error("Token Not Found")


    const decoded : any = jwt.decode(authorization);
    if (!decoded || decoded instanceof (JsonWebTokenError || TokenExpiredError)){
       throw new Middleware_Error("Incorrect token");
    }

    const token = await TokenModel.findFirst({where : {jwt : authorization}, include : {user : {include : {permissions : {
        select : {
            permission_id: true
        }
    }}}}})
    
    if (!token)
        throw new Middleware_Error("Token not found");
    if (token.expireIn < Math.round(new Date().getTime() / 1000))
        throw new Middleware_Error("Token expired");
    if (token)
        return token;
    throw new Middleware_Error("Unknown token")
}
