import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { GCPBackendService } from './gcp_backend.service';

@Module({
  imports: [HttpModule],
  providers: [GCPBackendService],
  exports: [GCPBackendService],
})
export class GCPBackendModule {}
