import { Module } from '@nestjs/common';
import { GCPBackendService } from './gcp_backend.service';

@Module({
  providers: [GCPBackendService],
  exports: [GCPBackendService],
})
export class GCPBackendModule {}
