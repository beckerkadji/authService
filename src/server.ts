import express from "express";
import dotenv from 'dotenv'; 
import bodyParser from "body-parser";
import cors from "cors";
import * as swaggerUi from 'swagger-ui-express';

import appLogger from "../app/middlewares/appLogger";
import  "../app/controllers/controller"
import { RegisterRoutes } from '../router/routes';

import {ResponseHandler} from "./config/responseHandler"
const Response = new ResponseHandler()

dotenv.config()

export const app: express.Application = express();

const hostname: string = <string>process.env.HOSTNAME;
let port : number = <number>  parseInt(<string>process.env.PORT);

//configuration express for receive form data
app.use(express.json());
app.use(express.urlencoded({extended : false}))

// support parsing of application/json type post data
app.use(bodyParser.json());

//traking middleware configuration
app.use(appLogger)


//configuring cors for cross origin request
app.use(cors())


//Router configuration
const apiRoutes = express(); 
RegisterRoutes(apiRoutes)
app.use('/api', apiRoutes)

RegisterRoutes(app)

//Response configuration
app.use(Response.errorHandlerValidation)
//app.use(Response.notFoundHandler)

app.get('/health', (req, res) =>{
    const data = {
        uptime: process.uptime(),
        message: 'Ok',
        date: new Date()
    }
    res.status(200).send(data)
})

try {
    const swaggerDocument = require ('../build/swagger.json');
    app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument) );
} catch (err) {
    console.error("Unable to read swagger.json", err)
}


app.listen( port, () =>{
    console.log(`Express server is started on port ${port}`);
})
                                                                                            