import * as mongoose from 'mongoose';

const BalanceSchema = new mongoose.Schema({
    currency: String,
    amount: Number
}, { _id: false });

export const UserSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
    balances: [BalanceSchema] 
});