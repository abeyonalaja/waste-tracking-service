# frozen_string_literal: true

# this page is for Ukwm create multiple waste page page details
class UkwmCreateMultipleWastePage < GenericPage
  include GeneralHelpers
  include ErrorBox

  TITLE = Translations.ukmv_value 'multiples.uploadPage.title'
  HEADING = Translations.ukmv_value 'instructions.createAndUpload.heading'
  ROW_ONE_ITEM_ONE = Translations.ukmv_value 'instructions.createAndUpload.listItemOnePartOne'
  ROW_ONE_LINK = Translations.ukmv_value 'instructions.createAndUpload.listItemOneLink'
  ROW_ONE_ITEM_TWO = Translations.ukmv_value 'instructions.createAndUpload.listItemOnePartTwo'
  ROW_TWO_ITEM_ONE = Translations.ukmv_value 'instructions.createAndUpload.listItemTwoPartOne'
  ROW_TWO_LINK = Translations.ukmv_value 'instructions.createAndUpload.listItemTwoLink'
  ROW_TWO_ITEM_TWO = Translations.ukmv_value 'instructions.createAndUpload.listItemTwoPartTwo'
  ROW_THREE = Translations.ukmv_value 'instructions.createAndUpload.listItemThree'
  ROW_FOUR = Translations.ukmv_value 'instructions.createAndUpload.listItemFour'
  ROW_FOUR = Translations.ukmv_value 'instructions.createAndUpload.listItemFive'
  DOCUMENTS_HEADING = Translations.ukmv_value 'instructions.documents.heading'
  LINK_ONE = Translations.ukmv_value 'instructions.documents.linkOne'
  TEMPLATE_HEADING = Translations.ukmv_value 'instructions.documents.templateHeading'
  TEMPLATE_DESCRIPTION = Translations.ukmv_value 'instructions.documents.templateDescription'
  TEMPLATE_LINK = Translations.ukmv_value 'instructions.documents.templateLink'
  UPLOAD_HEADING = Translations.ukmv_value 'uploadForm.heading'
  UPLOAD_HINT = Translations.ukmv_value 'uploadForm.hint'
  UPLOAD_BUTTON = Translations.ukmv_value 'uploadForm.Upload'

  def check_page_displayed
    expect(self).to have_css 'h1', text: TITLE, exact_text: true
  end

  def check_page_translation
    expect(self).to have_text HEADING
    expect(self).to have_text ROW_ONE_ITEM_ONE
    expect(self).to have_text ROW_ONE_LINK
    expect(self).to have_text ROW_ONE_ITEM_TWO
    expect(self).to have_text ROW_TWO_ITEM_ONE
    expect(self).to have_text ROW_TWO_LINK
    expect(self).to have_text ROW_TWO_ITEM_TWO
    expect(self).to have_text ROW_THREE
    expect(self).to have_text ROW_FOUR
    expect(self).to have_text DOCUMENTS_HEADING
    expect(self).to have_text LINK_ONE
    expect(self).to have_text TEMPLATE_HEADING
    expect(self).to have_text TEMPLATE_DESCRIPTION
    expect(self).to have_text TEMPLATE_LINK
    expect(self).to have_text UPLOAD_HEADING
    expect(self).to have_text UPLOAD_HINT
    expect(self).to have_text UPLOAD_BUTTON
  end

end
