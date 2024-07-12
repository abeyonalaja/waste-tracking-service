# frozen_string_literal: true

# this page is for ukmw service charge description page details
class DescriptionPage < GenericPage

  def check_page_displayed
    expect(self).to have_css 'h1', text: TITLE, exact_text: true
  end

  def check_page_translation

  end

end
