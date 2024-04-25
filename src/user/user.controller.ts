import { Body, Controller, Delete, Get, Param, Post, Res, UsePipes, ValidationPipe } from '@nestjs/common';
import { UserService } from './user.service';
import { Response } from 'express';
import { UserSignInDto, UserSignUpDto } from 'src/dto/dto';

@Controller('user')
export class UserController {

    constructor(private readonly userService: UserService) { }

    @Post('signup')
    @UsePipes(new ValidationPipe())
    async signupUser(@Body() signupDto: UserSignUpDto, @Res({ passthrough: true }) res: Response) {
        const token = await this.userService.signUpUser(signupDto)
        res.cookie('token', token, { httpOnly: true });
        res.status(200).json({
            message: 'User signed up successfully'
        })
    }

    @Post('signin')
    @UsePipes(new ValidationPipe())
    async signinUser(@Body() signinDto: UserSignInDto, @Res({ passthrough: true }) response: Response) {
        const token = await this.userService.signInUser(signinDto)
        response.cookie('token', token, { httpOnly: true });
        response.status(200).json({
            message: 'User signed in successfully'
        })
    }
}
