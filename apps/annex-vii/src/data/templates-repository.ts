import { Template, TemplateSummaryPage } from '../model';
import { BaseRepository } from './base-repository';

export interface TemplateRepository extends BaseRepository {
  getTemplates(
    accountId: string,
    order: 'ASC' | 'DESC',
    pageLimit?: number,
    token?: string
  ): Promise<TemplateSummaryPage>;
  getTemplate(id: string, accountId: string): Promise<Template>;
  deleteTemplate(id: string, accountId: string): Promise<void>;
  saveTemplate(template: Template, accountId: string): Promise<void>;
}
