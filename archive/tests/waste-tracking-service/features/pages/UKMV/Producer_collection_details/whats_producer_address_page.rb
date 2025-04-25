# frozen_string_literal: true

# this page is for whats producer address page
class WhatsProducerAddressPage < GenericPage
  include CommonComponents
  include GeneralHelpers
  include ErrorBox
  include PageHelper

  TITLE = Translations.ukmv_value 'single.producer.postcode.search.heading'
  CAPTION = Translations.ukmv_value 'single.producer.caption'
  INTRO = Translations.ukmv_value 'single.producer.postcode.search.intro'
  SEARCH_POSTCODE_BUTTON = Translations.ukmv_value 'single.postcode.button'
  POSTCODE_FIELD_ID = 'postcode'
  BUILDING_NUMBER_ID = 'buildingNameOrNumber'

  def check_page_displayed
    expect(self).to have_css 'h1', text: TITLE, exact_text: true
  end

  def check_page_translation
    expect(self).to have_text CAPTION
    expect(self).to have_text INTRO
  end

  def enter_postcode(postcode)
    fill_in POSTCODE_FIELD_ID, with: postcode, visible: false
    TestStatus.set_test_status(:postcode, postcode)
  end

  def enter_building_number(number)
    fill_in BUILDING_NUMBER_ID, with: number, visible: false
    TestStatus.set_test_status(:building_number, number)
  end

  def search_postcode_button
    click_button SEARCH_POSTCODE_BUTTON
  end
end
