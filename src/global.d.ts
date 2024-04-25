import { Request } from "express";
import { User } from "./interface/interface";

interface user extends User {
    _id: ObjectId;
}

declare global {
    namespace Express {
        interface Request {
            user: user
        }
    }
}