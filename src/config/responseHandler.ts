import express, {NextFunction} from "express";
import { ValidateError } from "tsoa";
import { IResponse } from "../../app/controllers/controller";
import codeData from "./code"

export class ResponseHandler {

    code = 0;
    message = ''
    data = {}

    public errorHandlerValidation(
        err: unknown,
        req: express.Request,
        res: express.Response,
        next: NextFunction
    ): express.Response | void {

        console.log(typeof err)
        if ( err instanceof ValidateError) {
            console.warn(`Caught Validation Error for ${req.path}:`, err.fields)
            return res.status(422).json({
                message: "Validation Error",
                details: err?.fields,
            })
        }
        
        if (err instanceof Error) {
            return res.status(500).json({
                message : "Internal Server Error"
            });
        }

        if (err) {
            return res.status(422).json({
                message : "Error",
                details: err
            })
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
        } else {
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