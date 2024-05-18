import { Module } from '@nestjs/common';
import { BackendReg1Service } from './backend_reg_1.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  providers: [BackendReg1Service],
  exports: [BackendReg1Service],
})
export class BackendReg1Module {}
