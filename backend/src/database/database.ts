import { Injectable } from '@nestjs/common';
import * as mongoose from 'mongoose';

@Injectable()
export class Database {}

export const databaseProviders = [
  {
    provide: 'DATABASE_CONNECTION',
    useFactory: (): Promise<typeof mongoose> =>
      mongoose
        .connect(process.env.MONGODB_URI as string)
        .then((res) => {
          console.log('Connected to mongodb');
          return res;
        })
        .catch((error) => {
          console.log('Mongodb connection error');
          console.log(error);
          return error;
        }),
  },
];
