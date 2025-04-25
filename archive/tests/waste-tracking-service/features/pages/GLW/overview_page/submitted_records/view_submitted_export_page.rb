# frozen_string_literal: true

class ViewSubmittedExportPage < GenericPage
  include GeneralHelpers
  include ErrorBox
  include CommonComponents

  TITLE = Translations.value 'exportJourney.submittedAnnexSeven.title'
  TEMPLATE_LINK = Translations.value 'templates.create.fromRecord.linkUse'
  PDF_LINK =Translations.value 'exportJourney.submittedView.downloadPDF'
  PAGES = Translations.value'exportJourney.submittedView.downloadPDFinfo'
  def check_page_displayed
    expect(self).to have_css 'h1', text: TITLE, exact_text: true
  end

  def check_page_translation
    expect(self).to have_text TEMPLATE_LINK
    expect(self).to have_text PDF_LINK
    expect(self).to have_text PAGES
  end

  def transaction_number
    find('transaction-id-0')
  end
end
