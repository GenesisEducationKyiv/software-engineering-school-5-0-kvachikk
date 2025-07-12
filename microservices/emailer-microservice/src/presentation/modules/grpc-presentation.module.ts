import { Module } from '@nestjs/common';

import { EmailerApplicationModule } from '../../application/modules/emailer-application.module';
import { EmailerGrpcController } from '../grpc/emailer-grpc.controller';

@Module({
   imports: [EmailerApplicationModule],
   controllers: [EmailerGrpcController],
})
export class GrpcPresentationModule {}
