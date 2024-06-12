import { Module } from '@nestjs/common';
import { RevertsService } from './reverts.service';

@Module({
  providers: [RevertsService],
  exports: [RevertsService],
})
export class RevertsModule {}
