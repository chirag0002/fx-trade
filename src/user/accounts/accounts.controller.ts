import { Body, Controller, Get, Post, Req, Res } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Request, Response } from 'express';
import { Model } from 'mongoose';
import { TopUpDto } from 'src/dto/dto';
import { User } from 'src/interface/interface';

@Controller('/accounts')
export class AccountsController {
    constructor(@InjectModel('User') private readonly userModel: Model<User>) { }

    @Post('topup')
    async topUp(@Body() topUpDTO: TopUpDto, @Req() req: Request) {
        const userId = req.user._id

        const user = await this.userModel.findById(userId)

        const currencyBalance = user.balances.find(balance => balance.currency === topUpDTO.currency);

        if (currencyBalance) currencyBalance.amount += topUpDTO.amount;
        else {
            const newBalance = {
                currency: topUpDTO.currency,
                amount: topUpDTO.amount
            }
            user.balances.push(newBalance);
        }

        await user.save();

        return `${topUpDTO.currency} ${topUpDTO.amount} is added to your account balance successfully`
    }

    @Get('balance')
    getBalance(@Res() res: Response, @Req() request: Request) {
        const user = request.user

        res.status(200).json({
            balances: user.balances
        })
    }
}
