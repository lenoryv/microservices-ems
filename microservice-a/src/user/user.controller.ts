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

import { CreateUserDTO } from './dto/user.dto';

import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  // Add user: /user/create
  @Post('/create')
  async createUser(@Res() res, @Body() createUserDTO: CreateUserDTO) {
    const user = await this.userService.createUser(createUserDTO);
    return res.status(HttpStatus.OK).json({
      message: 'user Successfully Created',
      user,
    });
  }

  // GET single user
  @Get('/login')
  async loginUser(@Res() res, @Query() filterQuery) {
    const { username, password } = filterQuery;
    const user = await this.userService.loginUser(username, password);
    if (!user) throw new NotFoundException('Incorrect username or password');
    return res.status(HttpStatus.OK).json({
      message: 'user Successfully logged in',
      user,
    });
  }

  // Get users/user
  // @Get('/list')
  @Get('/')
  async getUsers(@Res() res) {
    const users = await this.userService.getUsers();
    return res.status(HttpStatus.OK).json(users);
  }

  @Delete('/delete')
  async deleteUser(@Res() res, @Query('userID') userID) {
    const userDeleted = await this.userService.deleteUser(userID);
    if (!userDeleted) throw new NotFoundException('User does not exist!');
    return res.status(HttpStatus.OK).json({
      message: 'User Deleted Successfully',
      userDeleted,
    });
  }

  // Update User: /update?userID=5c9d45e705ea4843c8d0e8f7
  @Put('/update')
  async updateUser(
    @Res() res,
    @Body() createUserDTO: CreateUserDTO,
    @Query('userID') userID,
  ) {
    const updatedUser = await this.userService.updateUser(
      userID,
      createUserDTO,
    );
    if (!updatedUser) throw new NotFoundException('User does not exist!');
    return res.status(HttpStatus.OK).json({
      message: 'User Updated Successfully',
      updatedUser,
    });
  }
}
