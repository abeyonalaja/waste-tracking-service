import { Assignment } from './model';
import { Container, ErrorResponse } from '@azure/cosmos';
import Boom from '@hapi/boom';
import { Logger } from 'winston';

export interface AssignmentRepository {
  getAssignment(
    content: Assignment['content'],
    dcidSubjectId: string
  ): Promise<Assignment | undefined>;

  setAssignment(value: Assignment): Promise<void>;
}

export class CosmosAssignmentRepository implements AssignmentRepository {
  constructor(private container: Container, private logger: Logger) {}

  async getAssignment(
    content: string,
    dcidSubjectId: string
  ): Promise<Assignment | undefined> {
    try {
      const { resource } = await this.container
        .item(dcidSubjectId, content)
        .read();

      if (resource === undefined) {
        return undefined;
      }

      return resource.value as Assignment;
    } catch (err) {
      if (err instanceof ErrorResponse) {
        this.logger.error('Error reading Cosmos DB item', err);
        throw Boom.internal(err.message);
      } else {
        this.logger.error('Error reading Cosmos DB item', {
          id: dcidSubjectId,
          partitionKey: content,
          container: this.container.id,
          err,
        });
        throw Boom.internal();
      }
    }
  }

  async setAssignment(value: Assignment): Promise<void> {
    try {
      await this.container
        .item(value.dcidSubjectId, value.content)
        .replace({ value });
    } catch (err) {
      if (err instanceof ErrorResponse) {
        this.logger.error('Error writing Cosmos DB item', err);
        throw Boom.internal(err.message);
      } else {
        this.logger.error('Error writing Cosmos DB item', { value, err });
        throw Boom.internal();
      }
    }
  }
}
