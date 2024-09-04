# frozen_string_literal: true

# this page is for sic codee list page details
class SicCodeListPage < GenericPage
  include CommonComponents
  include PageHelper
  include ErrorBox
  include GeneralHelpers

  TITLE_ONE_MULTIPLE = Translations.ukmv_value 'single.producer.sicCodes.titleMultipleOne'
  TITLE_TWO_MULTIPLE = Translations.ukmv_value 'single.producer.sicCodes.titleMultipleTwo'
  TITLE_ONE = Translations.ukmv_value 'single.producer.sicCodes.titleOne'
  REMOVE_LINK = Translations.ukmv_value 'single.producer.sicCodes.list.remove'
  YES_BUTTON = Translations.ukmv_value 'single.producer.sicCodes.yesRadio'
  def check_page_displayed
    expect(self).to have_css 'h1', text: TITLE_ONE, exact_text: true
  end

  def check_page_translation
    # expect(self).to have_text TITLE_ONE_MULTIPLE
    # expect(self).to have_text TITLE_TWO_MULTIPLE
    expect(self).to have_text REMOVE_LINK
  end
end
