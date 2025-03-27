import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { Database } from './database/database';
import { DatabaseModule } from './database/database.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { JwtModule } from '@nestjs/jwt';
import { CommonWebSocketGateway } from './common/gateways/websocket/websocket.gateway';
import { WebsocketModule } from './common/gateways/websocket/websocket.module';
@Module({
  imports: [
    // Configuration module
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    // Mongoose connection
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI'),
      }),
      inject: [ConfigService],
    }),

    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: configService.get<string>('JWT_EXPIRATION', '3600'),
        },
      }),
      inject: [ConfigService],
    }),
    // User module
    UsersModule,

    AuthModule,

    WebsocketModule,
    // Other modules...
  ],
  controllers: [AppController],
  providers: [AppService, Database, CommonWebSocketGateway],
})
export class AppModule {}
