import * as jwt from "jsonwebtoken"
import express, {Request, Response} from "express"
import {JsonWebTokenError, TokenExpiredError} from "jsonwebtoken";
import {TokenModel} from "../models/token";
import {RoleModel, USER_ROLE} from "../models/role";
import {AUTHUSER} from "../models/user";

export const expressAuthentication = async (
    request :Request,
    securityName : string,
    scopes? : string[],
) : Promise<any> => {
    try {

        const authorization : any = request.body.authorization || request.query.authorization || request.headers["authorization"];
        const params = scopes ? scopes : [];

        if (securityName === "Jwt") {
            const token : any = await checkAuthorization(authorization)
            console.log("token is", token)
            if(token){
                if (await typeRole(token.user, params[0]))
                    return Promise.resolve(token.user)
            }
            throw new Error("You don't have a permission");
        }
    } catch (e: any){
        return Promise.reject(new Error(e))
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

const typeRole = async (user : any, role ?: string) => {
    if (!role)
        return true;

    const roleValue = normalizeRole(role);
    const askRole = await RoleModel.findFirst({where : {id : roleValue}})
    if (!askRole)
        throw new Error("Role not found");

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