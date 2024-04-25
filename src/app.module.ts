import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { DbModule } from './db/db.module';
import { FxRateService } from './fx-rate/fx-rate.service';
import { AccountsModule } from './user/accounts/accounts.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthMiddleware } from './middlewares/user.middleware';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from './schema/user.schema';
import { RateLimitMiddleware } from './middlewares/rateLimit.middleware';

@Module({
  imports: [
    UserModule,
    DbModule,
    AccountsModule,
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
  ],
  controllers: [AppController],
  providers: [FxRateService, AppService, RateLimitMiddleware],
})
export class AppModule implements NestModule {
  constructor(private readonly rateLimitMiddleware: RateLimitMiddleware) { }
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .forRoutes('fx-conversion')

    consumer
      .apply(this.rateLimitMiddleware.initialize())
      .forRoutes(
        { path: '/fx-rates', method: RequestMethod.GET },
        { path: '/fx-conversion', method: RequestMethod.POST },
      );

  }
}
