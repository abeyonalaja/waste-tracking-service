# frozen_string_literal: true

require_relative 'shared_components/general_helpers'
require_relative 'shared_components/error_box'
require_relative 'shared_components/page_helper'
# this page is for National Code page details
class NationalCodePage < GenericPage
  include GeneralHelpers
  include ErrorBox
  include PageHelper

  NATIONAL_CODE_INPUT_FIELD_ID = 'nationalCode'
  NATIONAL_CODE_OPTION_YES = 'hasNationalCodeYes'

  def check_page_displayed
    expect(self).to have_css 'h1', text: 'Do you have a national code?', exact_text: true
  end

  def enter_input_value(input_value)
    fill_in NATIONAL_CODE_INPUT_FIELD_ID, with: input_value, visible: false
  end

  def has_reference?(national_code)
    find(NATIONAL_CODE_INPUT_FIELD_ID).value == national_code
  end

  def option_checked?(selected_option)
    find(yes_or_no.fetch(selected_option), visible: false).checked?
  end

  def yes_or_no
    {
      'Yes' => 'hasNationalCodeYes',
      'No' => 'hasNationalCodeNo',
    }
  end
end
