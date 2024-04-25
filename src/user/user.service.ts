import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { compare, genSalt, hash } from 'bcrypt';
import { JwtService } from '@nestjs/jwt'
import { UserSignInDto, UserSignUpDto } from 'src/dto/dto';
import { User } from 'src/interface/interface';

@Injectable()
export class UserService {
    constructor(
        @InjectModel('User') private readonly userModel: Model<User>,
        private readonly jwtService: JwtService
    ) { }

    async signUpUser(signupDto: UserSignUpDto) {
        const user = await this.userModel.findOne({ email: signupDto.email });
        if (user) throw new UnauthorizedException('User already exists');

        const salt = await genSalt()
        const hashedPassword = await hash(signupDto.password, salt);
        const newUser = new this.userModel({
            name: signupDto.name,
            email: signupDto.email,
            password: hashedPassword
        });

        await newUser.save()

        const token = this.jwtService.sign({ userId: newUser._id, email: newUser.email });

        return token;
    }

    async signInUser(signinDto: UserSignInDto) {
        const user = await this.userModel.findOne({ email: signinDto.email });
        if (!user) throw new NotFoundException('User does not exists');

        const matchPassword = compare(signinDto.password, user.password);
        if (!matchPassword) throw new UnauthorizedException('Invalid credentials');

        const token = this.jwtService.sign({ userId: user._id, email: user.email });

        return token;
    }

    async findById(userId: string) {
        const user = await this.userModel.findById(userId);
        if (!user) throw new NotFoundException('User not found');
        return user;
    }
}
