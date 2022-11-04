import { Injectable } from '@nestjs/common';

import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

import { User } from './interfaces/user.interface';
import { CreateUserDTO } from './dto/user.dto';

@Injectable()
export class UserService {
  constructor(@InjectModel('User') private readonly userModel: Model<User>) {}

  //Login admin
  async loginUser(username: string, password: string): Promise<User> {
    try {
      const user = await this.userModel.findOne({
        username: username,
        password: password,
        rol: 'admin',
      });
      return user;
    } catch (error) {}
  }

  // Get all users
  async getUsers(): Promise<User[]> {
    const users = await this.userModel.find();
    return users;
  }

  // Post a single user
  async createUser(createUserDTO: CreateUserDTO): Promise<User> {
    const newUser = new this.userModel(createUserDTO);
    return newUser.save();
  }

  // Delete User
  async deleteUser(userID: string): Promise<User> {
    try {
      const deletedUser = await this.userModel.findOneAndDelete({
        _id: { $oid: userID },
      });
      return deletedUser;
    } catch (error) {
      return null;
    }
  }

  // Put a single User
  async updateUser(
    userID: string,
    createUserDTO: CreateUserDTO,
  ): Promise<User> {
    const updatedUser = await this.userModel.findByIdAndUpdate(
      userID,
      createUserDTO,
      { new: true },
    );
    return updatedUser;
  }
}
