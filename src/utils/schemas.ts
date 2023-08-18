import { Request } from "express";
import Joi, { ObjectSchema } from "joi";
import passwordComplexity from "joi-password-complexity";

const PASSWORD_COMPLEXITY_OPTIONS = {
  min: 4,
  max: 8,
};

const authSignup = Joi.object().keys({
  firstName: Joi.string().required().min(2).max(20),
  lastName: Joi.string().required().min(2).max(20),
  email: Joi.string().required().email(),
  password: passwordComplexity(PASSWORD_COMPLEXITY_OPTIONS).required(),
});

const authSignin = Joi.object().keys({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

export const insertVacation = Joi.object().keys({
  destination: Joi.string().min(2).required(),
  description: Joi.string().min(2).max(1000).required(),
  startingDate: Joi.date().iso().required(),
  endingDate: Joi.date().iso().greater(Joi.ref("startingDate")).required(),
  price: Joi.number().integer().positive().max(10000).required(),
  imgUrl: Joi.string().required(),
});

const updateVacation = Joi.object().keys({
  destination: Joi.string().min(2),
  description: Joi.string().min(2).max(1000),
  startingDate: Joi.date().iso(),
  endingDate: Joi.date().iso().greater(Joi.ref("startingDate")),
  price: Joi.number().integer().positive().max(10000),
  imgUrl: Joi.string(),
});

const schemas = {
  "[post][.api.v1.auth.signin]": authSignin,
  "[post][.api.v1.auth.signup]": authSignup,
  "[post][.api.v1.vacations]": insertVacation,
  "[patch][.api.v1.vacations]": updateVacation,
} as { [key: string]: ObjectSchema };

export default schemas;

export const extractSchema = (req: Request) => {
  const method = req.method.toLowerCase();
  const baseUrl = req.baseUrl;
  const originalUrl = req.originalUrl;

  const key = `${method}_${baseUrl ? baseUrl : originalUrl}`;
  return schemas[key];
};
