import { Injectable } from '@nestjs/common';
//Mongoose
import mongoose, { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
//Interfaces
import { User } from './interfaces/user.interface';
import { Employee } from './interfaces/employee.interface';
//Data Transfer Object
import { CreateEmployeeDTO } from './dto/employee.dto';

@Injectable()
export class AppService {
  constructor(
    @InjectModel('User') private readonly userModel: Model<User>,
    @InjectModel('Employee') private readonly employeeModel: Model<Employee>,
  ) {}

  // Login admin
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

  // Get all employees
  async getEmployees(): Promise<Employee[]> {
    const employees = await this.employeeModel.find();
    return employees;
  }
  // Get a single employee
  async getEmployee(employeeID: string): Promise<Employee> {
    const employee = await this.employeeModel.findById(employeeID);
    return employee;
  }

  // Post a single employee
  async createEmployee(
    createEmployeeDTO: CreateEmployeeDTO,
  ): Promise<Employee> {
    const newEmployee = new this.employeeModel(createEmployeeDTO);
    return newEmployee.save();
  }

  // Delete employee
  async deleteEmployee(employeeID: string): Promise<Employee> {
    try {
      const deletedEmployee = await this.employeeModel.findByIdAndDelete(
        new mongoose.Types.ObjectId(employeeID),
      );
      return deletedEmployee;
    } catch (error) {
      return null;
    }
  }

  // Put a single employee
  async updateEmployee(
    employeeID: string,
    createEmployeeDTO: CreateEmployeeDTO,
  ): Promise<Employee> {
    const updatedEmployee = await this.employeeModel.findByIdAndUpdate(
      employeeID,
      createEmployeeDTO,
      { new: true },
    );
    return updatedEmployee;
  }
  // Validate Employee in Database
  async validateEmployee(employeeID: string): Promise<boolean> {
    try {
      const validatedEmployee = await this.employeeModel.findById(
        new mongoose.Types.ObjectId(employeeID),
      );
      return !!validatedEmployee;
    } catch (error) {
      return false;
    }
  }
}
