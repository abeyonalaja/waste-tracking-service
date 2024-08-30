# frozen_string_literal: true

# this page is for select producer address page
class SelectReceiverAddressPage < GenericPage
  include CommonComponents
  include GeneralHelpers
  include ErrorBox
  include PageHelper

  TITLE = Translations.ukmv_value 'single.receiverAddress.postcode.results.heading'
  INTRO = Translations.ukmv_value 'single.receiverAddress.postcode.results.intro'
  MANUAL_LINK = Translations.ukmv_value 'single.receiverAddress.manualLinkShort'

  INTRO.gsub!('{count}', '6')

  def check_page_displayed
    expect(self).to have_css 'h1', text: TITLE, exact_text: true
  end

  def check_page_translation
    expect(self).to have_text INTRO.gsub!('{postcode}', 'AL3 8QE')
    expect(self).to have_text MANUAL_LINK
  end

end
