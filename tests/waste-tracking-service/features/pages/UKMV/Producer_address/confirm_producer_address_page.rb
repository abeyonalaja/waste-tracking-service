# frozen_string_literal: true

# this page is for confirm producer address page
class ConfirmProducerAddressPage < GenericPage
  include GeneralHelpers
  include ErrorBox
  include PageHelper
  include CommonComponents

  TITLE = Translations.ukmv_value 'single.producer.postcode.confirmation.heading'
  USE_THIS_ADDRESS_BUTTON = Translations.ukmv_value 'single.postcode.useAddress'
  USE_DIFF_ADDRESS_LINK = Translations.ukmv_value 'single.postcode.useDifferentAddress'
  SAVE_AND_RETURN_BUTTON = Translations.ukmv_value 'single.postcode.buttonSecondary'
  CAPTION = Translations.ukmv_value 'single.producer.caption'
  INTRO = Translations.ukmv_value 'single.producer.postcode.results.intro'
  INTRO.gsub!('{count}', '6')

  def check_page_displayed
    expect(self).to have_css 'h1', text: TITLE, exact_text: true
  end

  def check_page_translation
    expect(self).to have_text CAPTION
    expect(self).to have_text USE_THIS_ADDRESS_BUTTON
    expect(self).to have_text USE_DIFF_ADDRESS_LINK
    expect(self).to have_text INTRO.gsub!('{postcode}', 'AL3 8QE')
  end

end
