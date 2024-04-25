export interface User {
    name: string;
    email: string;
    password: string;
    balances: [
        {
            currency: string;
            amount: number;
        }
    ]
}