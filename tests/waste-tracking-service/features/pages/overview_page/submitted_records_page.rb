# frozen_string_literal: true

# this page is for overview page details
class SubmittedRecordsPage < GenericPage
  include GeneralHelpers
  include ErrorBox
  include CommonComponents

  TITLE = Translations.value 'exportJourney.submittedAnnexSeven.title'
  CAPTION = Translations.value 'exportJourney.submittedAnnexSeven.paragraph'
  TRANSACTION_NUMBER = Translations.value 'exportJourney.updateAnnexSeven.table.transactionNumber'
  YOUR_OWN_REF = Translations.value 'exportJourney.updateAnnexSeven.table.yourOwnReference'
  WASTE_CODE = Translations.value 'exportJourney.updateAnnexSeven.table.wasteCode'
  ACTIONS = Translations.value 'exportJourney.updateAnnexSeven.table.actions'
  COLLECTION_DATE = Translations.value 'exportJourney.submitAnExport.SectionThree.collectionDate'

  def check_page_displayed
    expect(self).to have_css 'h1', text: TITLE, exact_text: true
  end

  def check_page_translation
    expect(self).to have_text COLLECTION_DATE
    expect(self).to have_text TRANSACTION_NUMBER
    expect(self).to have_text YOUR_OWN_REF
    expect(self).to have_text WASTE_CODE
    expect(self).to have_text CAPTION
    expect(self).to have_text ACTIONS
  end
end
