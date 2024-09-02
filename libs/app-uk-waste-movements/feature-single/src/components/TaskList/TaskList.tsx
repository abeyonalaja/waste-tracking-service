import * as GovUK from '@wts/ui/govuk-react-ui';
import Link from 'next/link';
import styles from './TaskList.module.scss';
import { useTranslations } from 'next-intl';
import { formatToKebabCase } from '../../util';

interface Task {
  name: string;
  href: string;
  status: string;
}

interface TaskListSection {
  heading: string;
  description: string;
  overallSectionStatus: string;
  tasks: Task[];
}

interface TaskListProps {
  sections: TaskListSection[];
}
export function TaskList({ sections }: TaskListProps): React.ReactNode {
  const t = useTranslations('single.taskList.tags');

  function createTag(status: string) {
    let tagColour: GovUK.TagColour['colour'];
    let tagText: string;

    switch (status) {
      case 'Complete':
        tagColour = 'green';
        tagText = t('completed');
        break;
      case 'Incomplete':
        tagColour = 'blue';
        tagText = t('incomplete');
        break;
      case 'Started':
        tagColour = 'yellow';
        tagText = t('inProgress');
        break;
      case 'NotStarted':
        tagColour = 'grey';
        tagText = t('notStarted');
        break;
      case 'CannotStart':
        tagColour = 'grey';
        tagText = t('cannotStart');
        break;
      default:
        tagColour = 'red';
        tagText = 'invalid status';
        break;
    }

    return [tagColour, tagText];
  }

  return (
    <>
      {sections.map((section, index) => {
        const [tagColour, tagText] = createTag(section.overallSectionStatus);

        return (
          <div key={section.heading}>
            <div
              className={`${styles.details} ${index !== 0 && styles.firstSection}`}
            >
              <div>
                <GovUK.Heading
                  level={2}
                  size="m"
                  aria-describedby={formatToKebabCase(
                    `${section.heading}-status`,
                  )}
                >
                  {section.heading}
                </GovUK.Heading>
                <GovUK.Paragraph>{section.description}</GovUK.Paragraph>
              </div>
              <div className="govuk-task-list__status">
                {tagText === 'Completed' ? (
                  <strong
                    id={formatToKebabCase(`${section.heading}-status`)}
                    className="govuk-body  govuk-!-font-weight-regular"
                  >
                    {tagText}
                  </strong>
                ) : (
                  <GovUK.Tag
                    id={formatToKebabCase(`${section.heading}-status`)}
                    colour={tagColour as unknown as GovUK.TagColour}
                    noWrap={true}
                  >
                    {tagText}
                  </GovUK.Tag>
                )}
              </div>
            </div>
            <ul className="govuk-task-list">
              {section.tasks.map((task, index) => {
                const [tagColour, tagText] = createTag(task.status);

                return (
                  <li
                    key={task.name}
                    className={`govuk-task-list__item govuk-task-list__item--with-link ${index === 0 && styles.firstTask}`}
                  >
                    <div className="govuk-task-list__name-and-hint">
                      {tagText === 'Cannot start yet' ? (
                        <p className="govuk-!-margin-0">{task.name}</p>
                      ) : (
                        <Link
                          href={task.href}
                          className="govuk-link govuk-task-list__link govuk-link--no-visited-state"
                          aria-describedby={formatToKebabCase(
                            `${task.name}-status`,
                          )}
                        >
                          {task.name}
                        </Link>
                      )}
                    </div>
                    <div className="govuk-task-list__status">
                      {tagText === 'Completed' ? (
                        <strong
                          id={formatToKebabCase(`${task.name}-status`)}
                          className="govuk-!-font-weight-regular"
                        >
                          {tagText}
                        </strong>
                      ) : (
                        <GovUK.Tag
                          id={formatToKebabCase(`${task.name}-status`)}
                          colour={tagColour as unknown as GovUK.TagColour}
                          noWrap={true}
                        >
                          {tagText}
                        </GovUK.Tag>
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        );
      })}
    </>
  );
}
