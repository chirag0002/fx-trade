import { Body, Controller, Get, Post, Req, Res, UsePipes, ValidationPipe } from '@nestjs/common';
import { Request, Response } from 'express';
import { AppService } from './app.service';
import { ConversionRequestDto } from './dto/dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './interface/interface';

@Controller()
export class AppController {

    constructor(
        private readonly appService: AppService,
        @InjectModel('User') private readonly userModel: Model<User>
    ) { }

    @Get('fx-rates')
    async getFxRates(@Res() res: Response) {
        try {
            const fxRates = await this.appService.getFxRates();
            return res.status(200).json(fxRates);
        } catch (error) {
            console.error('Error fetching FX rates:', error.message);
            return res.status(500).json({ error: 'Failed to fetch FX rates' });
        }
    }

    @Post('fx-conversion')
    @UsePipes(new ValidationPipe())
    async convertAmount(@Body() conversionRequest: ConversionRequestDto, @Req() req: Request, @Res() res: Response) {
        const userId = req.user._id
        try {
            const { quoteId, fromCurrency, toCurrency, amount } = conversionRequest;

            const user = await this.userModel.findById(userId);

            const fromCurrencyBalance = user.balances.find(balance => balance.currency === fromCurrency);
            if (!fromCurrencyBalance || fromCurrencyBalance.amount < amount) {
                return res.status(400).json({ error: `Insufficient balance in ${fromCurrency}` });
            }

            const convertedAmount = await this.appService.convertAmount(quoteId, amount);

            fromCurrencyBalance.amount -= amount;

            const toCurrencyBalance = user.balances.find(balance => balance.currency === toCurrency);
            if (toCurrencyBalance) {
                toCurrencyBalance.amount += convertedAmount;
            } else {
                const newBalance = {
                    currency: toCurrency,
                    amount: convertedAmount
                };
                user.balances.push(newBalance);
            }

            await user.save()

            return res.status(200).json({
                convertedAmount: convertedAmount,
                currency: toCurrency
            });
        } catch (error) {
            console.error('Error converting amount:', error.message);
            return res.status(500).json({ error: error.message });
        }
    }
}
