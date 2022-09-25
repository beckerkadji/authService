import * as jwt from "jsonwebtoken"
import express, {Request, Response} from "express"
import {JsonWebTokenError, TokenExpiredError} from "jsonwebtoken";
import {TokenModel} from "../models/token";
import {RoleModel, USER_ROLE} from "../models/role";
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
            const token : any = await checkAuthorization(authorization)
            if(token){
                if (await typeRole(token.user, params[0]))
                    return Promise.resolve(`token here ${token.user}`)
            }
            throw new Middleware_Error("You don't have a permission");
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
    const token = await TokenModel.findFirst({where : {jwt : authorization}, include : {user : {include : {role : true}}}});
    
    if (!token)
        throw new Middleware_Error("Token not found");
    if (token.expireIn < Math.round(new Date().getTime() / 1000))
        throw new Middleware_Error("Token expired");
    if (token)
        return token;
    throw new Middleware_Error("Unknown token")
}

const typeRole = async (user : any, role ?: string) => {
    if (!role)
        return true;

    const roleValue = normalizeRole(role);
    const askRole = await RoleModel.findFirst({where : {id : roleValue}})
    if (!askRole)
        throw new Middleware_Error("Role not found");

    if (user.role.level >= askRole.level)
        return true;
    return false;
}

const normalizeRole = (name : string) : USER_ROLE => {
    switch (name) {
        case AUTHUSER.ROOT:
            return USER_ROLE.ROOT
        case AUTHUSER.ADMIN:
            return USER_ROLE.ADMIN
        case AUTHUSER.USER:
            return USER_ROLE.USER
        default:
            throw new Error("Unknown role : " + name)
    }
}