# frozen_string_literal: true

# this page is for export waste from uk page details
class WasteTrackingLandingPage < GenericPage

  TITLE = 'Move or export waste'

  def check_page_displayed
    expect(self).to have_css 'h2', text: TITLE, exact_text: true
  end

  def create_green_list_waste_record
    click_link('link-card-GLW')
  end

  def move_waste_in_uk_card
    click_link('link-card-UKWM')
  end
end
