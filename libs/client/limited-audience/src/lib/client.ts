import { DaprClient, HttpMethod } from '@dapr/dapr';
import {
  AddParticipantRequest,
  AddParticipantResponse,
  CheckParticipationRequest,
  CheckParticipationResponse,
  RedeemInvitationRequest,
  RedeemInvitationResponse,
  addParticipant,
  checkParticipation,
  redeemInvitation,
} from '@wts/api/limited-audience';

export class DaprLimitedAudienceClient {
  constructor(
    private daprClient: DaprClient,
    private limitedAudienceAppId: string
  ) {}

  async checkParticipation(
    req: CheckParticipationRequest
  ): Promise<CheckParticipationResponse> {
    return (await this.daprClient.invoker.invoke(
      this.limitedAudienceAppId,
      checkParticipation.name,
      HttpMethod.POST,
      req
    )) as CheckParticipationResponse;
  }

  async redeemInvitation(
    req: RedeemInvitationRequest
  ): Promise<RedeemInvitationResponse> {
    return (await this.daprClient.invoker.invoke(
      this.limitedAudienceAppId,
      redeemInvitation.name,
      HttpMethod.POST,
      req
    )) as RedeemInvitationResponse;
  }

  async addParticipant(
    req: AddParticipantRequest
  ): Promise<AddParticipantResponse> {
    return (await this.daprClient.invoker.invoke(
      this.limitedAudienceAppId,
      addParticipant.name,
      HttpMethod.POST,
      req
    )) as AddParticipantResponse;
  }
}
