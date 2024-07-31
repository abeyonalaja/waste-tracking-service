# frozen_string_literal: true

# this page is for whats producer address page
class WhatsProducerAddressPage < GenericPage

  TITLE = Translations.ukmv_value ''
  POSTCODE_FIELD_ID = ''

  def check_page_displayed
    expect(self).to have_css 'h1', text: TITLE, exact_text: true
  end

  def check_page_translation

  end

  def enter_postcode(postcode)
    fill_in POSTCODE_FIELD_ID, with: postcode, visible: false
  end
end
