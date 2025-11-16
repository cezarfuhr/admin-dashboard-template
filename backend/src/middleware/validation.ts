import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';

export const validateRequest = (schema: Joi.ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error } = schema.validate(req.body, { abortEarly: false });

    if (error) {
      const errors = error.details.map(detail => detail.message);
      return res.status(400).json({
        success: false,
        error: 'Validation error',
        details: errors
      });
    }

    next();
  };
};

export const schemas = {
  createUser: Joi.object({
    name: Joi.string().min(2).max(100).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    role: Joi.string().valid('admin', 'user').default('user'),
    avatar: Joi.string().uri().optional(),
  }),

  updateUser: Joi.object({
    name: Joi.string().min(2).max(100).optional(),
    email: Joi.string().email().optional(),
    password: Joi.string().min(6).optional(),
    role: Joi.string().valid('admin', 'user').optional(),
    avatar: Joi.string().uri().optional(),
  }),

  login: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
};
