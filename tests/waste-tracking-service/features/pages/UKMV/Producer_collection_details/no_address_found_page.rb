# frozen_string_literal: true

# this page is for no address found page
class NoAddressFoundPage < GenericPage
  include GeneralHelpers
  include ErrorBox
  include PageHelper

  TITLE = Translations.ukmv_value 'single.producer.postcode.noResults.heading'
  CAPTION = Translations.ukmv_value 'single.producer.caption'
  SEARCH_AGAIN_LINK = Translations.ukmv_value 'single.postcode.searchAgain'
  ENTER_MANUALLY_LINK = Translations.ukmv_value 'single.postcode.manualLinkShort'
  INTRO_ONE = Translations.ukmv_value 'single.postcode.notFound'
  INTRO_TWO = Translations.ukmv_value 'single.postcode.notFoundPrompt'

  def check_page_displayed
    expect(self).to have_css 'h1', text: TITLE, exact_text: true
  end

  def check_page_translation
    expect(self).to have_text CAPTION
    expect(self).to have_text "#{INTRO_ONE} n1p3bp"
    expect(self).to have_text INTRO_TWO
    expect(self).to have_text SEARCH_AGAIN_LINK
    expect(self).to have_text ENTER_MANUALLY_LINK
  end

end
