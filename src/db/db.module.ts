import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
    imports: [
        MongooseModule.forRoot('mongodb+srv://admin:admin123@cluster0.j8ehdug.mongodb.net/fx-currency')
    ]
})
export class DbModule {}
