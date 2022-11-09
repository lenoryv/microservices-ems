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
//Data Transfer Object
import { CreateEmployeeDTO } from './dto/employee.dto';

@Controller('employee')
export class AppController {
  constructor(private appService: AppService) {}

  // Admin Login
  @Get('/login')
  async loginUser(@Res() res, @Query() filterQuery) {
    const { username, password } = filterQuery;
    const user = await this.appService.loginUser(username, password);
    if (!user) throw new NotFoundException('Incorrect username or password');
    return res.status(HttpStatus.OK).json({
      message: 'User Logged In Successfully',
      user,
    });
  }

  // Get employees
  @Get('/')
  async getEmployees(@Res() res) {
    const employees = await this.appService.getEmployees();
    return res.status(HttpStatus.OK).json(employees);
  }

  // Get a single employee
  @Get('/')
  async getEmployee(@Res() res, @Query('employeeID') employeeID) {
    const employee = await this.appService.getEmployee(employeeID);
    return res.status(HttpStatus.OK).json(employee);
  }

  // Add employee: /employee/create
  @Post('/create')
  async createEmployee(
    @Res() res,
    @Body() createEmployeeDTO: CreateEmployeeDTO,
  ) {
    const { name, age } = createEmployeeDTO;
    const newEmployee: CreateEmployeeDTO = {
      name: name,
      age: age,
    };
    try {
      const employee = await this.appService.createEmployee(newEmployee);
      return res.status(HttpStatus.OK).json({
        message: 'Employee Created Successfully',
        employee,
      });
    } catch (error) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: error,
      });
    }
  }

  // Update employee: /update?employeeID=5c9d45e705ea4843c8d0e8f7
  @Put('/update')
  async updateEmployee(
    @Res() res,
    @Body() createEmployeeDTO: CreateEmployeeDTO,
    @Query('employeeID') employeeID,
  ) {
    const updatedEmployee = await this.appService.updateEmployee(
      employeeID,
      createEmployeeDTO,
    );
    if (!updatedEmployee)
      throw new NotFoundException('Employee does not exist!');
    return res.status(HttpStatus.OK).json({
      message: 'Employee Updated Successfully',
      updatedEmployee,
    });
  }

  //Delete employee: /delete?employeeID=5c9d45e705ea4843c8d0e8f7
  @Delete('/delete')
  async deleteEmployee(@Res() res, @Query('employeeID') employeeID) {
    const deletedEmployee = await this.appService.deleteEmployee(employeeID);
    if (!deletedEmployee)
      throw new NotFoundException('Employee does not exist!');
    return res.status(HttpStatus.OK).json({
      message: 'Employee Deleted Successfully',
      deletedEmployee,
    });
  }
  //RabbitMQ
  @MessagePattern({ cmd: 'validate' })
  async getGreetingMessageAysnc(employeeID: string): Promise<boolean> {
    const validated = await this.appService.validateEmployee(employeeID);
    return validated;
  }
}
