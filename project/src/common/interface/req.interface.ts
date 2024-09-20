import { Request } from "express";

export class ICustomRequest extends Request {
    user: {
        sub: string
        email: string
    }
}