import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class FxRateService {
    private fxRates: { [key: string]: number } = {};
    private currencyPairs: string[] = ['USD-EUR', 'USD-GBP', 'USD-JPY'];

    async getFxRates() {
        if (Object.keys(this.fxRates).length === 0) {
            await this.fetchAndStoreFxRates();
        }
        return this.fxRates;
    }

    private async fetchAndStoreFxRates() {
        try {
            for (const pair of this.currencyPairs) {
                const rate = await this.fetchFxRate(pair);
                this.fxRates[pair] = rate;
            }
        } catch (error) {
            console.error('Failed to fetch and store FX rates:', error.message);
            throw new Error('Failed to fetch and store FX rates');
        }
    }

    private async fetchFxRate(pair: string) {
        try {
            const response = await axios.get(`https://www.alphavantage.co/query?function=CURRENCY_EXCHANGE_RATE&from_currency=${pair.split('-')[0]}&to_currency=${pair.split('-')[1]}&apikey=G45WDFKB3TFPHW8X`);
            return parseFloat(response.data['Realtime Currency Exchange Rate']['5. Exchange Rate']);
        } catch (error) {
            console.error(`Failed to fetch FX rate for ${pair}:`, error.message);
            throw new Error(`Failed to fetch FX rate for ${pair}`);
        }
    }
}
