import { Injectable } from '@nestjs/common';
//Mongoose
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

import { Report } from './interfaces/report.interface';
import { CreateReportDTO } from './dto/report.dto';

@Injectable()
export class AppService {
  constructor(
    @InjectModel('Report') private readonly reportModel: Model<Report>,
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
}
