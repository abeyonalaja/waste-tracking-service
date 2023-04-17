# frozen_string_literal: true

# this page is for Describe waste page details
class DescribeWastePage < GenericPage
  include GeneralHelpers
  def check_page_displayed
    expect(self).to have_css 'h1', text: 'Describe the waste', exact_text: true
  end
end
