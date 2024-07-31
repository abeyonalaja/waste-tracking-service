# frozen_string_literal: true

# this page is for select producer address page
class SelectProducerAddressPage < GenericPage

  TITLE = Translations.ukmv_value ''

  def check_page_displayed
    expect(self).to have_css 'h1', text: TITLE, exact_text: true
  end

  def check_page_translation

  end

end
