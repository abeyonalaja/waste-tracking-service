import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { TaskList } from './TaskList';
import { NextIntlClientProvider } from 'next-intl';

const messages = {
  single: {
    taskList: {
      tags: {
        completed: 'Completed',
        incomplete: 'Incomplete',
        inProgress: 'In progress',
        notStarted: 'Not started yet',
        cannotStart: 'Cannot start yet',
      },
    },
  },
};

const testSections = [
  {
    heading: 'Test section 1',
    description: 'Description of test section 1',
    overallSectionStatus: 'Incomplete',
    tasks: [
      {
        name: 'Task 1 of test section 1',
        href: '/section-1-task-1',
        status: 'Complete',
      },
      {
        name: 'Task 2 of test section 1',
        href: '/section-1-task-2',
        status: 'Started',
      },
      {
        name: 'Task 3 of test section 1',
        href: '/section-1-task-3',
        status: 'NotStarted',
      },
    ],
  },
  {
    heading: 'Test section 2',
    description: 'Description of test section 2',
    overallSectionStatus: 'Complete',
    tasks: [
      {
        name: 'Task 1 of test section 2',
        href: '/',
        status: 'Complete',
      },
      {
        name: 'Task 2 of test section 2',
        href: '/',
        status: 'Complete',
      },
    ],
  },
  {
    heading: 'Test section 3',
    description: 'Description of test section 3',
    overallSectionStatus: 'CannotStart',
    tasks: [
      {
        name: 'Task 1 of test section 3',
        href: '/',
        status: 'CannotStart',
      },
    ],
  },
];

describe('TaskList', () => {
  it('renders with a heading for each section', () => {
    render(
      <NextIntlClientProvider messages={messages} locale="en">
        <TaskList sections={testSections} />;
      </NextIntlClientProvider>,
    );

    const section1Heading = screen.getByRole('heading', {
      name: 'Test section 1',
      level: 2,
    });
    const section2Heading = screen.getByRole('heading', {
      name: 'Test section 2',
      level: 2,
    });

    expect(section1Heading).toBeInTheDocument();
    expect(section2Heading).toBeInTheDocument();
  });

  it('renders with a description for each section', () => {
    render(
      <NextIntlClientProvider messages={messages} locale="en">
        <TaskList sections={testSections} />;
      </NextIntlClientProvider>,
    );

    const section1Description = screen.getByText(
      'Description of test section 1',
    );
    const section2Description = screen.getByText(
      'Description of test section 2',
    );

    expect(section1Description).toBeInTheDocument();
    expect(section2Description).toBeInTheDocument();
  });

  it('has an aria-relationship between section heading and overall section status tag', () => {
    render(
      <NextIntlClientProvider messages={messages} locale="en">
        <TaskList sections={testSections} />;
      </NextIntlClientProvider>,
    );

    const section1Heading = screen.getByRole('heading', {
      name: 'Test section 1',
    });

    expect(section1Heading).toHaveAttribute(
      'aria-describedby',
      'test-section-1-status',
    );
  });

  it('renders a link for each task', () => {
    render(
      <NextIntlClientProvider messages={messages} locale="en">
        <TaskList sections={testSections} />;
      </NextIntlClientProvider>,
    );

    const taskLinks = screen.getAllByRole('link');

    expect(taskLinks).toHaveLength(5);
  });

  it('task links render with correct hrefs', () => {
    render(
      <NextIntlClientProvider messages={messages} locale="en">
        <TaskList sections={testSections} />;
      </NextIntlClientProvider>,
    );

    const taskLinks = screen.getAllByRole('link');

    expect(taskLinks[0]).toHaveAttribute('href', '/section-1-task-1');
    expect(taskLinks[1]).toHaveAttribute('href', '/section-1-task-2');
  });

  it('has aria-relationship between task links and task status tags', () => {
    render(
      <NextIntlClientProvider messages={messages} locale="en">
        <TaskList sections={testSections} />;
      </NextIntlClientProvider>,
    );

    const taskLink1 = screen.getByRole('link', {
      name: 'Task 1 of test section 1',
    });

    expect(taskLink1).toHaveAttribute(
      'aria-describedby',
      'task-1-of-test-section-1-status',
    );
  });

  it('formats tag status correctly', () => {
    render(
      <NextIntlClientProvider messages={messages} locale="en">
        <TaskList sections={testSections} />;
      </NextIntlClientProvider>,
    );

    const completedTags = screen.getAllByText('Completed');
    const inCompleteTags = screen.getAllByText('Incomplete');
    const inProgressTags = screen.getAllByText('In progress');
    const notStartedTags = screen.getAllByText('Not started yet');
    const cannotStartTags = screen.getAllByText('Cannot start yet');

    expect(completedTags).toHaveLength(4);
    expect(inCompleteTags).toHaveLength(1);
    expect(inProgressTags).toHaveLength(1);
    expect(notStartedTags).toHaveLength(1);
    expect(cannotStartTags).toHaveLength(2);
  });
});
