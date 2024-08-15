import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { BackendsOrchestratorModule } from '../backends-orchestrator/backends_orchestrator.module';

@Module({
  imports: [BackendsOrchestratorModule],
  providers: [UserService],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}
