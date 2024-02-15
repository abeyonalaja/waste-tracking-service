# frozen_string_literal: true

# this page is for confirm waste code change page details
class ChangeWasteCodePage < GenericPage
  include GeneralHelpers
  include ErrorBox

  TITLE = Translations.value 'exportJourney.checkAnswers.changeWasteCode.pageTitle'
  HEADING = Translations.value 'exportJourney.checkAnswers.changeWasteCode.heading'
  PARAGRAPH = Translations.value 'exportJourney.checkAnswers.changeWasteCode.paragraph'
  CONFIRM_BUTTON = Translations.value 'exportJourney.checkAnswers.changeWasteCode.confirmButton'

  def check_page_displayed
    expect(self).to have_css 'h1', text: TITLE, exact_text: true
  end

  def check_page_translation
    expect(self).to have_text HEADING
    expect(self).to have_text PARAGRAPH
    expect(self).to have_text TITLE
  end

  def change_waste_code_button
    click_button CONFIRM_BUTTON
  end
end
