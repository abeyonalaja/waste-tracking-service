# frozen_string_literal: true

# this page is for Add Reference Number page details
class EnterAnEwcCodePage < GenericPage
  include GeneralHelpers
  include ErrorBox
  include PageHelper

  EWC_CODE = 'ewc-code'
  EWC_CODE_TEXT = Translations.value 'exportJourney.nationalCode.inputLabel'

  def check_page_displayed
    expect(self).to have_css 'h1', text: 'What is the first European Waste Catalogue (EWC) code?', exact_text: true
  end

  def check_translation
    expect(self).to have_text EWC_CODE_TEXT
    expect(self).to have_text('This can also be called a list of waste (LoW) code. For more help with these codes, see the waste classification guidance (opens in new tab).')
  end

  def enter_ewc_code code
    fill_in EWC_CODE, with: code, visible: false
    TestStatus.ewc_codes code
  end

  def enter_multiple_ewc_code no_of_ewc_codes
    (1..no_of_ewc_codes).each do |i|
      HelperMethods.wait_for_a_sec
      choose_option('Yes')
      save_and_continue
      code = TestData.get_ewc_codes i
      enter_ewc_code code
      save_and_continue
    end
  end

  def ewc_code_description
    find('ewc-desc-1')
  end

end
