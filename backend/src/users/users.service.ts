import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../schemas/user.schema';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async createUser(userData: Partial<User>): Promise<User | null> {
    try {
      const { email, name, password } = userData;
      const existingUser = await this.userModel.findOne({ email });
      if (existingUser) {
        throw new UnauthorizedException('Username already exists');
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      delete userData.password;

      const createdUser = new this.userModel({
        ...userData,
        password: hashedPassword,
      });
      await createdUser.save();
      return createdUser;
    } catch (error) {
      throw new UnauthorizedException('Username already exists');
      console.log(error);
    }
  }

  async findAll(): Promise<User[]> {
    return this.userModel.find().lean();
  }
}
