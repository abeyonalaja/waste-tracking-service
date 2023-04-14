# frozen_string_literal: true

# this page is for submit an export page details
class SubmitAnExportPage < GenericPage
  def check_page_displayed
    expect(self).to have_css 'h1', text: 'Submit an export', exact_text: true
  end

  def reference_number
    find('my-reference')
  end

  # These methods need the 'has_' prefix so that RSpec can use them as matchers.
  # rubocop:disable Naming/PredicateName

  def has_completed_badge_for_task?(task_name, status)
    task_name += '-status'
    find(task_name.downcase.gsub(' ', '-')).text == status.upcase
  end

  # rubocop:enable Naming/PredicateName
  def waste_codes_and_description
    click_on 'Waste codes and description'
  end

end
