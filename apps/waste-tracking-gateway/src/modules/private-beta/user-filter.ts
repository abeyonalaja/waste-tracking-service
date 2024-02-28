import Boom from '@hapi/boom';
import { DaprLimitedAudienceClient } from '@wts/client/limited-audience';
import { LRUCache } from 'lru-cache';
import { UserFilter } from '../../lib/auth/user-filter';

export class LimitedAudienceUserFilter {
  constructor(
    private client: DaprLimitedAudienceClient,
    private cache: LRUCache<string, boolean>
  ) {}

  filter: UserFilter = async ({ dcidSubjectId }) => {
    const cached = this.cache.get(dcidSubjectId);
    if (cached !== undefined && cached) {
      return true;
    }

    const response = await this.client.checkParticipation({
      dcidSubjectId,
      content: 'GLW',
    });
    if (!response.success) {
      throw Boom.internal();
    }

    this.cache.set(dcidSubjectId, response.value.participant);
    return response.value.participant;
  };
}
