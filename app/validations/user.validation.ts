import Joi from "joi";
import  {schema}  from "../utils/schema";

export const userCreateSchema = Joi.object({
    firstName : schema.firstName,
    lastName : schema.lastName,
    email : schema.email,
    password : schema.password,
})

export const loginSchema = Joi.object({
    email : schema.email,
    password : schema.password
})