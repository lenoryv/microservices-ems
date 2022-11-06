import { Inject, Injectable } from '@nestjs/common';
//Mongoose
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

import { Report } from './interfaces/report.interface';
import { CreateReportDTO } from './dto/report.dto';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class AppService {
  constructor(
    @InjectModel('Report') private readonly reportModel: Model<Report>,
    @Inject('MATH_SERVICE') private readonly client: ClientProxy,
  ) {}
  //Get all reports
  async getReports(): Promise<Report[]> {
    const reports = await this.reportModel.find();
    return reports;
  }
  //Post a single report
  async createReport(createReportDTO: CreateReportDTO): Promise<Report> {
    const newReport = new this.reportModel(createReportDTO);
    return newReport.save();
  }
  // Put a single report
  async updateReport(
    reportID: string,
    createReportDTO: CreateReportDTO,
  ): Promise<Report> {
    const updatedReport = await this.reportModel.findByIdAndUpdate(
      reportID,
      createReportDTO,
      { new: true },
    );
    return updatedReport;
  }
  //Get hours by month
  async getHours(
    employeeID: string,
    startDate: string,
    endDate: string,
  ): Promise<Report[]> {
    const reports = await this.reportModel.find({
      $and: [
        {
          employeeID: Object.values(employeeID),
        },
        {
          entryTime: {
            $gte: new Date(startDate),
            $lte: new Date(endDate),
          },
        },
      ],
    });
    return reports;
  }
  //RabbitMQ
  async sendEmployeeID(employeeID: string) {
    const message = this.client.send<boolean>({ cmd: 'validate' }, employeeID);
    return message;
  }
}
