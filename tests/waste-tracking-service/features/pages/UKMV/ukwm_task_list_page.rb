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
    task_name = 'recovery-facility-or-laboratory' if ['Laboratory details', 'Recovery facility details'].include?(task_name)
    task_name += '-status'

    find(task_name.downcase.gsub(' ', '-')).text == task_status(status)
  end

  def waste_producer_collection_details_status
    find('details-of-the-waste-producer-and-waste-collection-status')
  end
end
