import {
  forwardRef,
  Inject,
  Injectable,
  NotImplementedException,
} from '@nestjs/common';
import { TRedisDocument } from '../../../../config/redis/redis.service';
import { BackendsOrchestratorService } from '../../backends_orchestrator.service';
import { AxiosHeaders, AxiosRequestConfig } from 'axios';
import { HttpMethod } from '../../../../common';

type TRevert = {
  [url: string]: Partial<{
    [method in HttpMethod]: (info: TRedisDocument) => Promise<void>;
  }>;
};

@Injectable()
export class RevertsService {
  constructor(
    @Inject(forwardRef(() => BackendsOrchestratorService))
    private readonly backends_orchestrator: BackendsOrchestratorService,
  ) {}

  private reverts: TRevert = {
    credentials: {
      POST: this.hard_delete_credentials,
      DELETE: this.restore_credentials,
      PUT: this.revert_update_credentials,
    },
  };

  private async hard_delete_credentials(info: TRedisDocument): Promise<void> {
    const uri = '/credentials';

    const config: AxiosRequestConfig = {
      method: 'DELETE',
      url: uri,
      data: {
        ...info.body,
        type: 'hard',
      },
      headers: info.headers as AxiosHeaders,
    };

    await this.backends_orchestrator.make_request(config, info.backend);
  }

  private async restore_credentials(info: TRedisDocument): Promise<void> {
    const uri = '/credentials/restore';

    const config: AxiosRequestConfig = {
      method: 'PUT',
      url: uri,
      data: info.body,
      headers: info.headers as AxiosHeaders,
    };

    await this.backends_orchestrator.make_request(config, info.backend);
  }

  private async revert_update_credentials(): Promise<void> {
    throw new NotImplementedException();
  }

  async revert(info: TRedisDocument): Promise<void> {
    if (!(info.uri in this.reverts) || !(info.method in this.reverts[info.uri]))
      return;

    await this.reverts[info.uri][info.method](info);
  }
}
