import { IsEmail, IsNotEmpty, IsNumber, IsPositive, IsString } from "class-validator";

export class UserSignUpDto {
    @IsString()
    @IsNotEmpty()
    name:string;

    @IsString()
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsNotEmpty()
    password: string;
}

export class UserSignInDto {
    @IsString()
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsNotEmpty()
    password: string;
}

export class TopUpDto {
    @IsString()
    @IsNotEmpty()
    currency:string;

    @IsNumber()
    @IsNotEmpty()
    amount: number;
}

export class ConversionRequestDto{
    @IsString()
    @IsNotEmpty()
    quoteId: string;

    @IsString()
    @IsNotEmpty()
    fromCurrency: string;

    @IsString()
    @IsNotEmpty()
    toCurrency: string;

    @IsNumber()
    @IsPositive()
    @IsNotEmpty()
    amount: number;
}