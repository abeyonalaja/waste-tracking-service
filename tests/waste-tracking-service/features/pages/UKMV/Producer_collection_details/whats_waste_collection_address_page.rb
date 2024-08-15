# frozen_string_literal: true

# this page is for Whats Waste Collection Address page
class WhatsWasteCollectionAddressPage < GenericPage
  include GeneralHelpers
  include ErrorBox
  include PageHelper
  include CommonComponents

  TITLE = Translations.ukmv_value 'single.producer.wasteCollectionDetails.postcode.search.heading'
  CAPTION = Translations.ukmv_value 'single.producer.caption'
  INTRO = Translations.ukmv_value 'single.producer.wasteCollectionDetails.postcode.search.intro'
  SEARCH_POSTCODE_BUTTON = Translations.ukmv_value 'single.postcode.button'

  def check_page_displayed
    expect(self).to have_css 'h1', text: TITLE, exact_text: true
  end

  def check_page_translation
    expect(self).to have_text CAPTION
    expect(self).to have_text INTRO
  end

end
