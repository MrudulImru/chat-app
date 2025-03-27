import { Injectable } from '@nestjs/common';
import { Connection } from 'mongoose';
import { UserSchema } from 'src/schemas/user.schema';

@Injectable()
export class Users {}

export const UsersProviders = [
  {
    provide: 'USER_MODEL',
    useFactory: (connection: Connection) =>
      connection.model('User', UserSchema),
    inject: ['DATABASE_CONNECTION'],
  },
];
