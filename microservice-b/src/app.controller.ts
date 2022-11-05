import { Controller, Get, HttpStatus, Res } from '@nestjs/common';
import { Body, Post } from '@nestjs/common/decorators';
import { AppService } from './app.service';

import { CreateReportDTO } from './dto/report.dto';

@Controller('report')
export class AppController {
  constructor(private readonly appService: AppService) {}

  //Get reports
  @Get('/')
  async getReports(@Res() res) {
    const reports = await this.appService.getReports();
    return res.status(HttpStatus.OK).json(reports);
  }

  // Add report: /report/create
  @Post('/create')
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
}
