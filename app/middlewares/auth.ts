import * as jwt from "jsonwebtoken"
import express, {Request, Response} from "express"
import code from "../../src/config/code";
import { ResponseHandler } from "../../src/config/responseHandler";
import {IResponse} from "../controllers/controller";
const response = new ResponseHandler()

export const expressAuthentication = async (
    request : express.Request,
    securityName : string,
    scopes? : string[],
) : Promise<any> => {
    try {
        if (securityName === "jwt") {
            const token = request.body.token || request.query.token || request.headers["x-access-token"] || request.headers["authorization"];

            if(!token)
                return response.liteResponse(code.NO_TOKEN, "No token provided", null)

            let decodedToken : any
            jwt.verify(token, `[${<string>process.env.SECRET_TOKEN}]`, (err:any, decoded: any) => {
                if(err)
                    return response.liteResponse(code.INVALID_TOKEN, "Invalid token provided", null)

                //Check if JWT contains all required scopes
                const containScopes: string[] = <string[]>scopes
                for(let scope of containScopes){
                    if(!decoded.scopes.includes(scope))
                        return response.liteResponse(code.NOT_AUTHORIZED, "JWT does not contain required scope.",null)
                }
                decodedToken = decoded
            })
            return response.liteResponse(code.SUCCESS, "SUCCESS REQUEST", {...response.data, decodedToken})
        }
    } catch (e){
        return response.catchHandler(e)
    }
}