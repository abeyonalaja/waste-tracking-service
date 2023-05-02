# frozen_string_literal: true

require_relative '../shared_components/general_helpers'
require_relative '../shared_components/error_box'
# this page is for Add EWC Code page details
class DoYouHaveEwcCodePage < GenericPage
  include GeneralHelpers
  include ErrorBox
  include PageHelper

  def check_page_displayed
    expect(self).to have_css 'h1', text: 'Do you have an EWC code?', exact_text: true
  end

  def check_translation
    expect(self).to have_text('Do you have an EWC code?')
    expect(self).to have_text('An EWC code (European Waste Catalogue code) is also known as an EC list of waste code. You must include all 6 digits.')
  end

  def select_first_option
    first('ewcCodes', minimum: 1).click
    first('ewcCodes__option--0', minimum: 1).select_option
    TestStatus.set_test_status(:ewc_code, find('ewcCodes').value)
  end

  def ewc_code
    first('ewcCodes').value
  end

  def option_checked?(selected_option)
    find(yes_or_no.fetch(selected_option), visible: false).checked?
  end

  def yes_or_no
    {
      'Yes' => 'showInput',
      'No' => 'hasEwcCodeNo'
    }
  end
end
