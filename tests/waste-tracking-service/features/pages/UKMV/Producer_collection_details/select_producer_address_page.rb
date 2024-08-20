# frozen_string_literal: true

# this page is for select producer address page
class SelectProducerAddressPage < GenericPage
  include CommonComponents
  include GeneralHelpers
  include ErrorBox
  include PageHelper

  TITLE = Translations.ukmv_value 'single.producer.postcode.results.heading'
  INTRO = Translations.ukmv_value 'single.producer.postcode.results.intro'
  MANUAL_LINK = Translations.ukmv_value 'single.postcode.manualLinkShort'

  INTRO.gsub!('{count}', '6')

  def check_page_displayed
    expect(self).to have_css 'h1', text: TITLE, exact_text: true
  end

  def check_page_translation
    expect(self).to have_text INTRO.gsub!('{postcode}', 'AL3 8QE')
    expect(self).to have_text MANUAL_LINK
  end

  def select_first_address(page = 'producer')
    address_text = find(:css,'label[for="addressselection-radio-2"]').text
    find('addressselection-radio-2', visible: false).click
    TestStatus.set_test_status("#{page}_full_address".to_sym, address_text)
  end

  def select_second_address
    find('addressselection-radio-2', visible: false).click
  end

end
