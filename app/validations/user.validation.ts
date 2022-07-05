import Joi from "joi";
import  {schema}  from "../utils/schema";

export const userSchema = Joi.object({
    firstName : schema.firstName,
    lastName : schema.lastName,
    email : schema.email
})