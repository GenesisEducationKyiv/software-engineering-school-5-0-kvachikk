import { Module } from '@nestjs/common';

import { EmailerGrpcController } from '../grpc/emailer-grpc.controller';
import { EmailerApplicationModule } from '../../application/modules/emailer-application.module';

@Module({
   imports: [EmailerApplicationModule],
   controllers: [EmailerGrpcController],
})
export class GrpcPresentationModule {} 