# frozen_string_literal: true

# this page is for task list page details
class TaskListPage < GenericPage

  TITLE = Translations.value 'exportJourney.submitAnExport.title'
  BANNER_TITLE = Translations.value 'templates.use.banner.title'
  BANNER_CONTENT = Translations.value 'templates.use.banner.content'
  INTRO = Translations.value 'exportJourney.submitAnExport.intro'

  def check_page_displayed
    expect(self).to have_css 'h1', text: TITLE, exact_text: true
  end

  def check_page_translation
    expect(self).to have_text 'You have completed 0 of 5 sections.'
    expect(self).to have_text INTRO
  end

  def check_template_task_list_page_translation
    expect(self).to have_text BANNER_CONTENT
    expect(self).to have_text BANNER_TITLE
  end

  def reference_number
    find('my-reference')
  end

  # These methods need the 'has_' prefix so that RSpec can use them as matchers.
  # rubocop:disable Naming/PredicateName

  def has_completed_badge_for_task?(task_name, status)
    task_name = 'recovery-facility-or-laboratory' if ['Laboratory details', 'Recovery facility details'].include?(task_name)
    task_name += '-status'

    find(task_name.downcase.gsub(' ', '-')).text == task_status(status)
  end

  # rubocop:enable Naming/PredicateName
  def waste_codes_and_description
    click_on 'Waste codes and description'
  end

  def exporter_details
    click_on 'Exporter details'
  end

  def recovery_facility
    click_link Translations.value 'exportJourney.submitAnExport.SectionFour.recoveryDetails'
  end

  def find_important_banner
    find('govuk-notification-banner-title')
  end

  private

  def task_status(status)
    case status.downcase
    when 'completed'
      Translations.value 'exportJourney.submitAnExport.statusTwo'
    when 'not started'
      Translations.value 'exportJourney.submitAnExport.statusOne'
    when 'cannot start yet'
      Translations.value 'exportJourney.submitAnExport.statusZero'
    when 'in progress'
      'IN PROGRESS'
    else
      raise 'Invalid status option'
    end
  end

end
