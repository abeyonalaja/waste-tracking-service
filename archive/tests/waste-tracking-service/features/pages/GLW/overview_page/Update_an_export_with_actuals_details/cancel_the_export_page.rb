# frozen_string_literal: true

# this page is for cancel the export page
class CancelTheExportPage < GenericPage
  include CommonComponents
  include ErrorBox

  TITLE = Translations.value 'exportJourney.updateAnnexSeven.delete.title'
  CAPTION = Translations.value 'exportJourney.updateAnnexSeven.delete.caption'
  PARAGRAPH = Translations.value 'exportJourney.updateAnnexSeven.delete.paragraph'
  Q1 = Translations.value 'exportJourney.updateAnnexSeven.delete.q1'
  Q2 = Translations.value 'exportJourney.updateAnnexSeven.delete.q2'
  Q3 = Translations.value 'exportJourney.updateAnnexSeven.delete.q3'

  def check_page_displayed
    expect(self).to have_css 'h1', text: TITLE, exact_text: true
  end

  def check_page_translation
    expect(self).to have_text CAPTION
    expect(self).to have_text PARAGRAPH
    expect(self).to have_text Q1
    expect(self).to have_text Q2
    expect(self).to have_text Q3
    expect(self).to have_text TestStatus.test_status(:export_transaction_number)
  end
end
