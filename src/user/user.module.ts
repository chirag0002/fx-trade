import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { UserSchema } from 'src/schema/user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
    JwtModule.register({
      secret: 'thisisthesecretkey',
      signOptions: { expiresIn: '24h' }
    })
  ],
  controllers: [UserController],
  providers: [UserService],
  exports:[UserService]
})
export class UserModule { }