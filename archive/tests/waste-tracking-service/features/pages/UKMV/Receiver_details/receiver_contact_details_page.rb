# frozen_string_literal: true

# this page is for Producer Contact Details page
class ReceiverContactDetailsPage < GenericPage
  include GeneralHelpers
  include ErrorBox
  include PageHelper
  include CommonComponents

  TITLE = Translations.ukmv_value 'single.receiverAddress.contactDetails.heading'
  CAPTION = Translations.ukmv_value 'single.receiverAddress.contactDetails.caption'
  FULL_NAME = Translations.ukmv_value 'single.receiverAddress.contactDetails.form.labelOne'
  CONTACT_PERSON = Translations.ukmv_value 'single.receiverAddress.contactDetails.form.labelTwo'
  FULL_NAME = Translations.ukmv_value 'single.receiverAddress.contactDetails.form.hintOne'
  EMAIL = Translations.ukmv_value 'single.receiverAddress.contactDetails.form.labelThree'
  PHONE = Translations.ukmv_value 'single.receiverAddress.contactDetails.form.labelFour'
  PHONE_HINT = Translations.ukmv_value 'single.receiverAddress.contactDetails.form.hintTwo'
  FAX = Translations.ukmv_value 'single.receiverAddress.contactDetails.form.labelFIVE'

  def check_page_displayed
    expect(self).to have_css 'h1', text: TITLE, exact_text: true
  end

  def check_page_translation
    expect(self).to have_text CAPTION
    expect(self).to have_text FULL_NAME
    expect(self).to have_text CONTACT_PERSON
    expect(self).to have_text FULL_NAME
    expect(self).to have_text EMAIL
    expect(self).to have_text PHONE
    expect(self).to have_text PHONE_HINT
    expect(self).to have_text FAX
  end

end
