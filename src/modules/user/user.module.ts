import { forwardRef, Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { AuthModule } from '../auth/auth.module';
import { BackendsOrchestratorModule } from '../backends-orchestrator/backends_orchestrator.module';

@Module({
  imports: [forwardRef(() => AuthModule), BackendsOrchestratorModule],
  providers: [UserService],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}
