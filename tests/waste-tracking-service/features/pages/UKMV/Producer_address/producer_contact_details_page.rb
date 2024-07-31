# frozen_string_literal: true

# this page is for Producer Contact Details page
class ProducerContactDetailsPage < GenericPage

  TITLE = Translations.ukmv_value ''
  ORG_NAME_FIELD_ID = ''
  FULL_NAME_FIELD_ID = ''
  EMAIL_FIELD_ID = ''
  PHONE_FIELD_ID = ''

  def check_page_displayed
    expect(self).to have_css 'h1', text: TITLE, exact_text: true
  end

  def check_page_translation

  end

  def enter_org_name(org_name)
    fill_in POSTCODE_FIELD_ID, with: org_name, visible: false
  end

  def enter_full_name(full_name)
    fill_in POSTCODE_FIELD_ID, with: full_name, visible: false
  end

  def enter_email(email)
    fill_in POSTCODE_FIELD_ID, with: email, visible: false
  end

  def enter_phone(phone)
    fill_in POSTCODE_FIELD_ID, with: phone, visible: false
  end
end
