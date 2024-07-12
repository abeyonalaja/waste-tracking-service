# frozen_string_literal: true

# this page is for ukmw service charge Success Payment page details
class SuccessPaymentPage < GenericPage

  def check_page_displayed
    expect(self).to have_css 'h1', text: TITLE, exact_text: true
  end

  def check_page_translation

  end

end
