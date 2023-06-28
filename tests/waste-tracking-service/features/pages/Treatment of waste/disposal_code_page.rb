# frozen_string_literal: true

require_relative '../shared_components/general_helpers'
require_relative '../shared_components/error_box'
require_relative '../shared_components/common_components'

# this page is for recovery facility contact page details
class DisposalCodePage < GenericPage
  include ErrorBox
  include CommonComponents
  include GeneralHelpers

  TITLE = Translations.value 'exportJourney.laboratorySite.codeTitle'
  SUB_TEXT = Translations.value 'exportJourney.laboratorySite.caption'
  AUTO_HINT_TEXT = Translations.value 'autocompleteHint'

  def check_page_displayed
    expect(self).to have_css 'h1', text: TITLE, exact_text: true
  end

  def check_translation
    expect(self).to have_text SUB_TEXT
    expect(self).to have_text AUTO_HINT_TEXT
  end

  def select_first_option
    first('recoveryCode', minimum: 1).click
    first('recoveryCode__option--0', minimum: 1).select_option
    TestStatus.set_test_status(:laboratory_disposal_code, find('recoveryCode').value)
  end

  def has_disposal_code?(code)
    find('recoveryCode').value == code
  end

end
