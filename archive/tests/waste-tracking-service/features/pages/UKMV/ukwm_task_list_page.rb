# frozen_string_literal: true

# this page is for UKWM Task List details
class UkwmTaskListPage < GenericPage

  TITLE = Translations.ukmv_value 'single.taskList.title'
  UNIQUE_REFER = Translations.ukmv_value 'single.taskList.caption'

  PRODUCER_AND_COLLECTION_TITLE = Translations.ukmv_value 'single.taskList.producerAndCollection.heading'
  PRODUCER_AND_COLLECTION_DESCRIPTION = Translations.ukmv_value 'single.taskList.producerAndCollection.description'

  CARRIER_TITLE = Translations.ukmv_value 'single.taskList.carrier.heading'
  CARRIER_DESCRIPTION = Translations.ukmv_value 'single.taskList.carrier.description'

  RECEIVER_TITLE = Translations.ukmv_value 'single.taskList.receiver.heading'
  RECEIVER_DESCRIPTION = Translations.ukmv_value 'single.taskList.receiver.description'


  def check_page_displayed
    expect(self).to have_css 'h1', text: TITLE, exact_text: true
  end

  def check_page_translation
    expect(self).to have_text UNIQUE_REFER
    expect(self).to have_text PRODUCER_AND_COLLECTION_TITLE
    expect(self).to have_text PRODUCER_AND_COLLECTION_DESCRIPTION
    expect(self).to have_text CARRIER_TITLE
    expect(self).to have_text CARRIER_DESCRIPTION
    expect(self).to have_text RECEIVER_TITLE
    expect(self).to have_text RECEIVER_DESCRIPTION
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
    find('waste-producer-and-collection-details-status')
  end

  def waste_carrier_details_status
    find('waste-carrier-details-(optional)-status')
  end

  def waste_receiver_details_status
    find('waste-receiver-details-status')
  end
end
