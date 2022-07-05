import Joi from "joi";
import  {schema}  from "../utils/schema";

export const postSchema = Joi.object({
    title : schema.title,
    description : schema.description,
    image : schema.image
})