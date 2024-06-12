import { Injectable } from '@nestjs/common';
import { HttpMethod } from '../../../../common';
import { TRedisDocument } from '../../../../config/redis/redis.service';

type TRevert = {
  [url: string]: {
    [method in HttpMethod]: (info: TRedisDocument) => Promise<void>;
  };
};

@Injectable()
export class RevertsService {
  //TODO
  private reverts: TRevert = {};
  constructor() {}
  async revert(info: TRedisDocument) {
    await this.reverts[info.uri][info.method](info);
  }
}
