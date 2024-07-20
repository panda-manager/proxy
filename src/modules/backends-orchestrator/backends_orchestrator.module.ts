import { Module } from '@nestjs/common';
import { AzureBackendModule } from './backends/azure-backend/azure_backend.module';
import { GCPBackendModule } from './backends/gcp-backend/gcp_backend.module';
import { BackendsOrchestratorService } from './backends_orchestrator.service';
import { RedisModule } from '../../config/redis/redis.module';
import { RevertsModule } from './backends/reverts/reverts.module';

@Module({
  imports: [RedisModule, RevertsModule, AzureBackendModule, GCPBackendModule],
  providers: [BackendsOrchestratorService],
  exports: [BackendsOrchestratorService],
})
export class BackendsOrchestratorModule {}
