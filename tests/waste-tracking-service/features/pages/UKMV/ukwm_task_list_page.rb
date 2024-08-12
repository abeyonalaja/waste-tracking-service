# frozen_string_literal: true

# this page is for UKWM Task List details
class UkwmTaskListPage < GenericPage

  TITLE = 'Create a single waste movement'
  UNIQUE_REFER = 'Unique reference'
  TITLE1 = 'Waste producer and collection details'
  SUB_TITLE1 = 'Details of the waste producer and waste collection'

  def check_page_displayed
    expect(self).to have_css 'h1', text: TITLE, exact_text: true
  end

  def check_page_translation
    expect(self).to have_text UNIQUE_REFER
    expect(self).to have_text TITLE1
    expect(self).to have_text SUB_TITLE1
  end

  def has_completed_badge_for_task?(task_name, status)
    task_name += '-status'
    find(task_name.downcase.gsub(' ', '-')).text == task_status(status)
  end

  def task_status(status)
    case status.downcase
    when 'completed'
      Translations.value 'single.taskList.tags.completed'
    when 'not started'
      Translations.value 'single.taskList.tags.notStarted'
    when 'cannot start yet'
      Translations.value 'single.taskList.tags.cannotStart'
    when 'not started yet'
      'Not started yet'
    when 'in progress'
      Translations.value 'single.taskList.tags.inProgress'
    else
      raise 'Invalid status option'
    end
  end

  def waste_producer_collection_details_status
    find('details-of-the-waste-producer-and-waste-collection-status')
  end
end
