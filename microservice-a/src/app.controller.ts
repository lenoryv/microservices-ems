import {
  Controller,
  Post,
  Res,
  HttpStatus,
  Body,
  Get,
  Delete,
  Put,
  Query,
  NotFoundException,
} from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { AppService } from './app.service';

import { CreateUserDTO } from './dto/user.dto';

@Controller('user')
export class AppController {
  constructor(private appService: AppService) {}

  // GET single user
  @Get('/login')
  async loginUser(@Res() res, @Query() filterQuery) {
    const { username, password } = filterQuery;
    const user = await this.appService.loginUser(username, password);
    if (!user) throw new NotFoundException('Incorrect username or password');
    return res.status(HttpStatus.OK).json({
      message: 'user Successfully logged in',
      user,
    });
  }

  // Get users
  @Get('/')
  async getUsers(@Res() res) {
    const users = await this.appService.getUsers();
    return res.status(HttpStatus.OK).json(users);
  }

  // Add user: /user/create
  @Post('/create')
  async createUser(@Res() res, @Body() createUserDTO: CreateUserDTO) {
    const { name, rol, username, password, age } = createUserDTO;
    const newUser: CreateUserDTO = {
      name: name,
      rol: rol,
      username: username,
      password: password,
      age: age,
    };
    try {
      const user = await this.appService.createUser(newUser);
      return res.status(HttpStatus.OK).json({
        message: 'User Successfully Created',
        user,
      });
    } catch (error) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: error,
      });
    }
  }

  // Update user: /update?userID=5c9d45e705ea4843c8d0e8f7
  @Put('/update')
  async updateUser(
    @Res() res,
    @Body() createUserDTO: CreateUserDTO,
    @Query('userID') userID,
  ) {
    const updatedUser = await this.appService.updateUser(userID, createUserDTO);
    if (!updatedUser) throw new NotFoundException('User does not exist!');
    return res.status(HttpStatus.OK).json({
      message: 'User Updated Successfully',
      updatedUser,
    });
  }

  //Delete user: /delete?userID=5c9d45e705ea4843c8d0e8f7
  @Delete('/delete')
  async deleteUser(@Res() res, @Query('userID') userID) {
    const userDeleted = await this.appService.deleteUser(userID);
    if (!userDeleted) throw new NotFoundException('User does not exist!');
    return res.status(HttpStatus.OK).json({
      message: 'User Deleted Successfully',
      userDeleted,
    });
  }
  //RabbitMQ
  @MessagePattern({ cmd: 'greeting' })
  getGreetingMessage(name: string): string {
    return `Hello Leor ${name}`;
  }
}
