import { Module } from '@nestjs/common';
import { AzureBackendService } from './azure_backend.service';

@Module({
  providers: [AzureBackendService],
  exports: [AzureBackendService],
})
export class AzureBackendModule {}
