# frozen_string_literal: true

# this page is for overview page details
class OverviewPage < GenericPage

  def check_page_displayed
    expect(self).to have_css 'h1', text: 'Green list waste overview', exact_text: true
  end

end
