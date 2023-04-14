# frozen_string_literal: true

require_relative '../shared_components/general_helpers'
require_relative '../shared_components/error_box'
# this page is for Add Reference Number page details
class EnterAnEwcCodePage < GenericPage
  include GeneralHelpers
  include ErrorBox
  include PageHelper

  def check_page_displayed
    expect(self).to have_css 'h1', text: 'Enter an EWC code', exact_text: true
  end
end
