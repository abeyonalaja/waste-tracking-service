# frozen_string_literal: true

# this page is for submit an export page details
class SubmitAnExportPage < GenericPage

  TITLE = Translations.value 'exportJourney.submitAnExport.title'
  STATUS =

    def check_page_displayed
      expect(self).to have_css 'h1', text: TITLE, exact_text: true
    end

  def reference_number
    find('my-reference')
  end

  # These methods need the 'has_' prefix so that RSpec can use them as matchers.
  # rubocop:disable Naming/PredicateName

  def has_completed_badge_for_task?(task_name, status)
    task_name = 'recovery-facility-or-laboratory' if task_name == 'Laboratory details'
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
