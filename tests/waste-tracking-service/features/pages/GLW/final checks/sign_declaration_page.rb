# frozen_string_literal: true

# this page is sign declaration page details
class SignDeclarationPage < GenericPage
  include GeneralHelpers
  include ErrorBox

  TITLE = Translations.value 'exportJourney.checkAnswers.signDeclaration.title'
  PARAGRAPH = Translations.value 'exportJourney.checkAnswers.signDeclaration.paragraph'
  POINT1 = Translations.value 'exportJourney.checkAnswers.signDeclaration.listItemOne'
  POINT2 = Translations.value 'exportJourney.checkAnswers.signDeclaration.listItemTwo'
  POINT3 = Translations.value 'exportJourney.checkAnswers.signDeclaration.listItemThree'
  POINT4 = Translations.value 'exportJourney.checkAnswers.signDeclaration.listItemFour'
  CONFIRM_BUTTON = Translations.value 'exportJourney.checkAnswers.signDeclaration.confirmButton'

  def check_page_displayed
    expect(self).to have_css 'h1', text: TITLE, exact_text: true
  end

  def check_page_translation_bulk
    expect(self).to have_text TITLE
    expect(self).to have_text PARAGRAPH
    expect(self).to have_text POINT1
    expect(self).to have_text POINT2
    expect(self).to have_text POINT3
    expect(self).to have_text POINT4
  end

  def check_page_translation_small
    expect(self).to have_text TITLE
    expect(self).to have_text PARAGRAPH
    expect(self).to have_text POINT1
    expect(self).to have_no_text POINT2
    expect(self).to have_text POINT3
    expect(self).to have_text POINT4
  end

  def confirm_submit_button
    click_button CONFIRM_BUTTON
  end

  def pdf_title
    find('pdf-h1')
  end

  def pdf_intro
    find('pdf-intro')
  end
end
