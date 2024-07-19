# frozen_string_literal: true

# this page is for ukmw service charge description page details
class DescriptionPage < GenericPage
  include PageHelper

  TITLE = Translations.ukmv_value 'charge.guidance.title'
  PARAGRAPH_ONE = Translations.ukmv_value 'charge.guidance.paragraphOne'
  PARAGRAPH_TWO = Translations.ukmv_value 'charge.guidance.paragraphTwo'
  LIST_ONE_ITEM_ONE = Translations.ukmv_value 'charge.guidance.listOneListItemOne'
  LIST_ONE_ITEM_TWO = Translations.ukmv_value 'charge.guidance.listOneListItemTwo'
  LIST_ONE_ITEM_THREE = Translations.ukmv_value 'charge.guidance.listOneListItemThree'
  PARAGRAPH_THREE = Translations.ukmv_value 'charge.guidance.paragraphThree'
  LIST_TWO_ITEM_ONE = Translations.ukmv_value 'charge.guidance.listTwoListItemOne'
  LIST_TWO_ITEM_TWO = Translations.ukmv_value 'charge.guidance.listTwoListItemTwo'
  WARNING = Translations.ukmv_value 'charge.guidance.warning'
  PAY_BUTTON = Translations.ukmv_value 'charge.guidance.buttonPay'
  CANCEL_BUTTON = Translations.ukmv_value 'charge.guidance.buttonCancel'

  def check_page_displayed
    expect(self).to have_css 'h1', text: TITLE, exact_text: true
  end

  def check_page_translation
    expect(self).to have_text PARAGRAPH_ONE.gsub('{price}', '20')
    expect(self).to have_text PARAGRAPH_TWO
    expect(self).to have_text LIST_ONE_ITEM_ONE
    expect(self).to have_text LIST_ONE_ITEM_TWO
    expect(self).to have_text LIST_ONE_ITEM_THREE
    expect(self).to have_text PARAGRAPH_THREE
    expect(self).to have_text LIST_TWO_ITEM_ONE
    expect(self).to have_text LIST_TWO_ITEM_TWO
    expect(self).to have_text WARNING
    expect(self).to have_text PAY_BUTTON
    expect(self).to have_text CANCEL_BUTTON
  end

  def continue_no_pay_button
    click_on CANCEL_BUTTON
  end

  def pay_button
    click_on PAY_BUTTON
  end
end
