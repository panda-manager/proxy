import { Injectable, NotImplementedException } from '@nestjs/common';
import { TRedisDocument } from '../../../../config/redis/redis.service';
import { BackendsOrchestratorService } from '../../backends_orchestrator.service';

type TRevert = {
  [url: string]: {
    [method: string]: (info: TRedisDocument) => Promise<void>;
  };
};

@Injectable()
export class RevertsService {
  constructor(
    private readonly backends_orchestrator: BackendsOrchestratorService,
  ) {}
  private async hard_delete_credentials(info: TRedisDocument): Promise<void> {
    throw new NotImplementedException();
  }

  private reverts: TRevert = {
    credentials: {
      POST: this.hard_delete_credentials,
    },
  };
  async revert(info: TRedisDocument) {
    await this.reverts[info.uri][info.method](info);
  }
}
