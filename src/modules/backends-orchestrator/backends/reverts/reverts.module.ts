import { forwardRef, Module } from '@nestjs/common';
import { RevertsService } from './reverts.service';
import { BackendsOrchestratorModule } from '../../backends_orchestrator.module';

@Module({
  imports: [forwardRef(() => BackendsOrchestratorModule)],
  providers: [RevertsService],
  exports: [RevertsService],
})
export class RevertsModule {}
