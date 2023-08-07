# frozen_string_literal: true

# this page is for overview page details
class UpdateWithActualPage < GenericPage

  TITLE = Translations.value 'exportJourney.updateAnnexSeven.title'
  CAPTION = Translations.value 'exportJourney.updateAnnexSeven.caption'
  PARAGRAPH = Translations.value 'exportJourney.updateAnnexSeven.paragraph'
  PARAGRAPH = Translations.value 'exportJourney.updateAnnexSeven.paragraph'
  TRANSACTION_NUMBER = Translations.value 'exportJourney.updateAnnexSeven.table.transactionNumber'
  SUBMITTED= Translations.value 'exportJourney.updateAnnexSeven.table.submitted'
  WASTE_CODE = Translations.value 'exportJourney.updateAnnexSeven.table.wasteCode'
  OWN_REFERENCE = Translations.value 'exportJourney.updateAnnexSeven.table.yourOwnReference'
  ACTIONS = Translations.value 'exportJourney.updateAnnexSeven.table.actions'
  NOT_PROVIDED = Translations.value 'exportJourney.updateAnnexSeven.notProvided'
  NO_EXPORTS_FOR_UPDATE = Translations.value 'exportJourney.updateAnnexSeven.notResultsMessage'

  def check_page_displayed
    expect(self).to have_css 'h1', text: TITLE, exact_text: true
  end

  def check_page_displayed_no_exports
    expect(self).to have_text NO_EXPORTS_FOR_UPDATE
    expect(self).to have_text PARAGRAPH
  end

  def check_translation
    expect(self).to have_text CAPTION
    expect(self).to have_text PARAGRAPH
    expect(self).to have_text TRANSACTION_NUMBER
    expect(self).to have_text SUBMITTED
    expect(self).to have_text WASTE_CODE
    expect(self).to have_text OWN_REFERENCE
    expect(self).to have_text ACTIONS
  end

  def submit_a_single_waste_export
    click_link('Submit a single waste export')
  end

  def application_ref
    find 'your-reference-0'
  end

end
