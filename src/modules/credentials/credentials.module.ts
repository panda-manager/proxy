import { Module } from '@nestjs/common';
import { CredentialsController } from './credentials.controller';
import { CredentialsService } from './credentials.service';
import { AuthModule } from '../../auth/auth.module';
import { BackendsOrchestratorModule } from '../backends-orchestrator/backends_orchestrator.module';

@Module({
  imports: [AuthModule, BackendsOrchestratorModule],
  controllers: [CredentialsController],
  providers: [CredentialsService],
})
export class CredentialsModule {}
