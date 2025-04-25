# frozen_string_literal: true

# this page is for Select Waste Collection Address page
class SelectWasteCollectionAddressPage < GenericPage
  include GeneralHelpers
  include ErrorBox
  include PageHelper

  TITLE = Translations.ukmv_value 'single.producer.wasteCollectionDetails.postcode.results.heading'
  INTRO = Translations.ukmv_value 'single.producer.wasteCollectionDetails.postcode.results.intro'
  MANUAL_LINK = Translations.ukmv_value 'single.postcode.manualLinkShort'

  INTRO.gsub!('{count}', '6')

  def check_page_displayed
    expect(self).to have_css 'h1', text: TITLE, exact_text: true
  end

  def check_page_translation
    expect(self).to have_text INTRO.gsub!('{postcode}', 'AL3 8QE')
    expect(self).to have_text MANUAL_LINK
  end

  def select_first_address
    find('addressselection-radio-1', visible: false).click
  end

  def select_second_address
    find('addressselection-radio-2', visible: false).click
  end
end
