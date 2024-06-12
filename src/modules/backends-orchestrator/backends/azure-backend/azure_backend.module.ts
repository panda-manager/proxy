import { Module } from '@nestjs/common';
import { AzureBackendService } from './azure_backend.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  providers: [AzureBackendService],
  exports: [AzureBackendService],
})
export class AzureBackendModule {}
