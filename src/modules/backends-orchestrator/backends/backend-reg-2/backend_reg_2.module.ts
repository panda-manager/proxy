import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { BackendReg2Service } from './backend_reg_2.service';

@Module({
  imports: [HttpModule],
  providers: [BackendReg2Service],
  exports: [BackendReg2Service],
})
export class BackendReg2Module {}
