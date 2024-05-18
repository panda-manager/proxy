import { Module } from '@nestjs/common';
import { BackendReg1Module } from './backends/backend-reg-1/backend_reg_1.module';
import { BackendReg2Module } from './backends/backend-reg-2/backend_reg_2.module';
import { BackendsOrchestratorService } from './backends_orchestrator.service';

@Module({
  imports: [BackendReg1Module, BackendReg2Module],
  providers: [BackendsOrchestratorService],
  exports: [BackendsOrchestratorService],
})
export class BackendsOrchestratorModule {}
