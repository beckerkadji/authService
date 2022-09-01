import express, {NextFunction} from "express";
import { ValidateError } from "tsoa";
import { IResponse } from "../../app/controllers/controller";
import codeData from "./code"
import {Middleware_Error} from "./Middleware_Error";


export class ResponseHandler {

    code = 0;
    message = ''
    data = {}

    public errorHandlerValidation(
        err: any,
        req: express.Request,
        res: express.Response,
        next: NextFunction
    ): express.Response | void {

        if ( err instanceof ValidateError) {
            console.warn(`Caught Validation Error for ${req.path}:`, err.fields)
            return res.status(422).json({
                message: "Validation Error",
                details: err?.fields,
            })
        }

        if(err instanceof Middleware_Error ){
                return res.status(401).json({
                    code : codeData.NOT_AUTHORIZED,
                    message: err.message || "NOT_AUTHORIZED"
                });
        }

        if(err instanceof Error ){
            return res.status(400).json({
                message : "Request error",
                details: err.stack
            });
        }
        


        next();
    }

    public notFoundHandler (req: any, res: express.Response) {
        res.status(404).send({
            message : "Request Not Found",
        });
    }

    public liteResponse ( code: number, message: string, data ?: any){
        
        let response : any = {}
        if(code == codeData.VALIDATION_ERROR){
            response.message = message;
            response.code = code;
            response.data = data;
            return  response
        }
        else if (code == codeData.SUCCESS) {
            response.message = message;
            response.code = code;
            response.data = data;
            return  response
        }
        else if (code == codeData.FAILURE) {
            response.message = message;
            response.code = code;
            response.data = data;
            return  response
        }
        else if (code == codeData.NO_TOKEN) {
            response.message = message;
            response.code = code;
            response.data = data;
            return  response
        }
        else if (code == codeData.NOT_FOUND) {
            response.message = message;
            response.code = code;
            response.data = data;
            return  response
        }
        else if (code == codeData.INVALID_TOKEN) {
            response.message = message;
            response.code = code;
            response.data = data;
            return  response
        }
        else if (code == codeData.NOT_AUTHORIZED) {
            response.message = message;
            response.code = code;
            response.data = data;
            return  response
        }
        else {
            return {code :this.code, message :this.message, data : this.data}
        }
    }

    public catchHandler(e: any)  {
        let response : any = {}
        response.message = "Exception"
        response.code = -1000
        response.data = e

        return response;
    }
}