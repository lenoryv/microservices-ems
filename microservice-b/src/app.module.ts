import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
//Mongoose
import { MongooseModule } from '@nestjs/mongoose';
import { ReportSchema } from './schemas/report.schema';
//Transport
import { Transport, ClientsModule } from '@nestjs/microservices';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'REPORT_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://localhost:5672'],
          queue: 'reports_queue',
          queueOptions: {
            durable: false,
          },
        },
      },
    ]),
    ConfigModule.forRoot({
      envFilePath: '.env',
    }),
    MongooseModule.forRoot(process.env.URL_MONGODB, {
      useNewUrlParser: true,
    }),
    MongooseModule.forFeature([{ name: 'Report', schema: ReportSchema }]),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
