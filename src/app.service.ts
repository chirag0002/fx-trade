import { Injectable } from '@nestjs/common';
import { FxRateService } from './fx-rate/fx-rate.service';

@Injectable()
export class AppService {
    private fxRatesWithId: { [key: string]: { rate: number, quoteId: string } } = {};
    private fxQuoteIdWithExpiry: { [quoteId: string]: { expired: boolean } } = {};

    constructor(private readonly fxRateService: FxRateService) {}

    async getFxRates() {
        try {
            const fxRates = await this.fxRateService.getFxRates();
            for (const [pair, rate] of Object.entries(fxRates)) {
                const quoteId = this.generateUniqueId()
                this.fxRatesWithId[pair] = { rate, quoteId };
                this.fxQuoteIdWithExpiry[quoteId] = { expired: false };
                setTimeout(() => {
                    this.fxQuoteIdWithExpiry[quoteId].expired = true;
                }, 30000);
            }
            return this.fxRatesWithId;
        } catch (error) {
            console.error('Failed to initialize FX rates with unique ID:', error.message);
            throw new Error('Failed to initialize FX rates with unique ID');
        }
    }

    private generateUniqueId() {
        const randomId = Math.floor(Math.random() * (99999 - 10000 + 1)) + 10000;
        return randomId.toString();
    }

    async convertAmount(quoteId: string, amount: number) {
        try {
            const fxRateWithId = Object.values(this.fxRatesWithId).find(rate => rate.quoteId === quoteId);
    
            if (!fxRateWithId) throw new Error('Invalid quoteId');
    
            if (this.fxQuoteIdWithExpiry[quoteId].expired) throw new Error('Rate is expired. Fetch rates again and try with a new quoteId');
    
            const rate = fxRateWithId.rate;
            const convertedAmount = amount * rate;
            return convertedAmount;
        } catch (error) {
            console.error('Failed to convert amount by quoteId:', error.message);
            throw new Error('Failed to convert amount');
        }
    }
    
}
