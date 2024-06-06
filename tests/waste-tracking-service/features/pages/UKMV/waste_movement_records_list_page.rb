# frozen_string_literal: true

# this page is for ukmw movement list page details
class WasteMovementRecordsListPage < GenericPage
  include GeneralHelpers
  include ErrorBox
  include CommonComponents

  def check_page_displayed
    title = 'Waste movement records'
    expect(self).to have_css 'h1', text: title, exact_text: true
  end

  def next_link
    find(:css, "[rel='next']>span")
  end

  def click_next_link
    click_link 'Next'
  end

  def click_previous_link
    click_link 'Previous'
  end
end
