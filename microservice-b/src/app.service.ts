import { Inject, Injectable } from '@nestjs/common';
//Mongoose
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
//Interface
import { Report } from './interfaces/report.interface';
//Data Transfer Object
import { CreateReportDTO } from './dto/report.dto';
//Client RabbitMQ
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class AppService {
  constructor(
    @InjectModel('Report') private readonly reportModel: Model<Report>,
    @Inject('REPORT_SERVICE') private readonly client: ClientProxy,
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
  //Get hours by range time
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
