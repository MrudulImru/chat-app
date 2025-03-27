import { Controller, Get, Post, Body } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from 'src/interfaces/user.interface';
import { CreateUserDto } from 'src/dto/user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  @Get()
  findAll(): Promise<any[]> {
    return this.usersService.findAll();
  }
  @Post()
  createUser(@Body() data: CreateUserDto): Promise<any> {
    return this.usersService.createUser(data);
  }
}
// You should create a `dto` folder inside the `users` directory to keep the DTOs organized.
// For example: `/home/mruduldev/Documents/projects/nestjs/chat2-app/src/users/dto`

// import {
//     Controller,
//     Post,
//     UploadedFile,
//     UseInterceptors
//   } from '@nestjs/common';
//   import { FileInterceptor } from '@nestjs/platform-express';

//   @Post('upload')
//   @UseInterceptors(FileInterceptor('file'))
//   uploadFile(@UploadedFile() file: Express.Multer.File) {
//     console.log(file);
//     return {
//       filename: file.originalname,
//       size: file.size
//     };
//   }
