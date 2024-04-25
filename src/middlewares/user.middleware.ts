import { Injectable, NestMiddleware, Req, Res } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";
import * as jwt from 'jsonwebtoken';
import { UserService } from "src/user/user.service";

@Injectable()
export class AuthMiddleware implements NestMiddleware {
    constructor(private readonly userService: UserService) { }

    async use(@Req() req: Request, @Res() res: Response, next: NextFunction) {
        const token = req.cookies['token'];

        if (!token) return res.status(401).json({ message: "Unauthorized" });

        try {
            const decoded: any = jwt.verify(token, 'thisisthesecretkey');
            const userId = decoded.userId;

            const user = await this.userService.findById(userId);

            if (!user) return res.status(404).json({ message: "Invalid token" });

            req.user = user;

            next();
        } catch (error) {
            return res.status(401).json({ message: "Invalid token" });
        }
    }
}
