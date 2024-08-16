import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { BackendsOrchestratorService } from '../../backends_orchestrator.service';
import { AxiosRequestConfig, RawAxiosRequestHeaders } from 'axios';
import { TRevertsMap } from '../../../../common';
import { RevertSchema } from '../../../../config/redis/dto/revert.dto';

@Injectable()
export class RevertsService {
  constructor(
    @Inject(forwardRef(() => BackendsOrchestratorService))
    private readonly backendsOrchestratorService: BackendsOrchestratorService,
  ) {}

  private reverts: TRevertsMap = {
    credentials: {
      POST: this.hardDeleteCredentials,
      DELETE: this.restoreCredentials,
      PUT: this.revertUpdateCredentials,
    },
  };

  private async hardDeleteCredentials(info: RevertSchema): Promise<void> {
    const uri = '/credentials';

    const config: AxiosRequestConfig = {
      method: 'DELETE',
      url: uri,
      data: {
        host: info.body['host'],
        login: info.body['login'],
        type: 'hard',
      },
      headers: info.headers as RawAxiosRequestHeaders,
    };

    await this.backendsOrchestratorService.makeRequest(config, info.backend);
  }

  private async restoreCredentials(info: RevertSchema): Promise<void> {
    const uri = '/credentials/restore';

    const config: AxiosRequestConfig = {
      method: 'PUT',
      url: uri,
      data: {
        host: info.body['host'],
        login: info.body['login'],
      },
      headers: info.headers as RawAxiosRequestHeaders,
    };

    await this.backendsOrchestratorService.makeRequest(config, info.backend);
  }

  private async revertUpdateCredentials(info: RevertSchema): Promise<void> {
    const deleteUri = '/credentials';

    const deleteConfig: AxiosRequestConfig = {
      method: 'DELETE',
      url: deleteUri,
      data: {
        host: info.body['host'],
        login: info.body['login'],
        type: 'hard',
      },
      headers: info.headers as RawAxiosRequestHeaders,
    };

    await this.backendsOrchestratorService.makeRequest(
      deleteConfig,
      info.backend,
    );

    const restoreUri = '/credentials/restore';
    const restoreConfig: AxiosRequestConfig = {
      method: 'PUT',
      url: restoreUri,
      data: {
        host: info.body['host'],
        login: info.body['login'],
      },
      headers: info.headers as RawAxiosRequestHeaders,
    };

    await this.backendsOrchestratorService.makeRequest(
      restoreConfig,
      info.backend,
    );
  }

  async revert(info: RevertSchema): Promise<void> {
    if (!(info.uri in this.reverts) || !(info.method in this.reverts[info.uri]))
      return;

    await this.reverts[info.uri][info.method](info);
  }
}
