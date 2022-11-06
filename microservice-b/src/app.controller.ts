import { Controller, Get, HttpStatus, Res } from '@nestjs/common';
import { Body, Inject, Post, Query } from '@nestjs/common/decorators';
import { ClientProxy } from '@nestjs/microservices';
import { AppService } from './app.service';

import { CreateReportDTO } from './dto/report.dto';

@Controller('report')
export class AppController {
  constructor(
    private readonly appService: AppService,
    @Inject('MATH_SERVICE') private readonly client: ClientProxy,
  ) {}

  //Get all reports
  @Get('/')
  async getReports(@Res() res) {
    const reports = await this.appService.getReports();
    return res.status(HttpStatus.OK).json(reports);
  }
  //Get by month
  @Get('hours')
  async getHoursByMonth(
    @Res() res,
    @Body() range,
    @Query() employeeID: string,
  ) {
    const { startDate, endDate } = range;
    const reports = await this.appService.getHours(
      employeeID,
      startDate,
      endDate,
    );
    let totalHours = 0;
    if (reports.length > 0) {
      reports.map((report) => {
        const start = report.entryTime.getHours();
        const end = report.exitTime.getHours();
        const hours = end - start;
        totalHours += hours;
      });
      const newReport = {
        employeeID: Object.values(employeeID).toString(),
        hours: totalHours,
        reports: reports,
      };
      return res.status(HttpStatus.OK).json(newReport);
    }
    return res.status(HttpStatus.OK).json({
      message: 'Without Reports',
    });
  }

  // Add report: /report/create without validating whether an employee exists
  @Post('/createDirect')
  async createReport(@Res() res, @Body() createReportDTO: CreateReportDTO) {
    const { employeeID, entryTime, exitTime } = createReportDTO;
    const newReport: CreateReportDTO = {
      employeeID: employeeID,
      entryTime: entryTime,
      exitTime: exitTime,
    };
    try {
      const report = await this.appService.createReport(newReport);
      return res.status(HttpStatus.OK).json({
        message: 'Report Successfully Created',
        report,
      });
    } catch (error) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: error,
      });
    }
  }
  //Validate EmployeeID with RabbitMQ message and create Report
  @Post('/create')
  async sendEmployeeID(
    @Res() res,
    @Body() createReportDTO: CreateReportDTO,
    @Query('employeeID') employeeID,
  ) {
    const validatedEmployee = await this.appService.sendEmployeeID(employeeID);
    validatedEmployee.subscribe(async (data) => {
      if (data) {
        const { entryTime, exitTime } = createReportDTO;
        const newReport: CreateReportDTO = {
          employeeID: employeeID,
          entryTime: entryTime,
          exitTime: exitTime,
        };
        try {
          const report = await this.appService.createReport(newReport);
          return res.status(HttpStatus.OK).json({
            message: 'Report Successfully Created',
            report,
          });
        } catch (error) {
          return res.status(HttpStatus.BAD_REQUEST).json({
            message: error,
          });
        }
      } else {
        return res.status(HttpStatus.OK).json({
          message: 'Employee Does Not Exist',
        });
      }
    });
  }
}
