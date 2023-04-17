# frozen_string_literal: true

require_relative 'shared_components/general_helpers'
require_relative 'shared_components/error_box'
# this page is for Add EWC Code page details
class AddEwcCodePage < GenericPage
  include GeneralHelpers
  include ErrorBox

  def check_page_displayed
    expect(self).to have_css 'h1', text: 'EWC code pages will appear here...', exact_text: true
  end
end
