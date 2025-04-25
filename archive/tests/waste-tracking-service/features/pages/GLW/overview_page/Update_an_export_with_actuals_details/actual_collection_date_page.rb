# frozen_string_literal: true

# this page is for overview page details
class ActualCollectionDatePage < GenericPage
  include CommonComponents

  TITLE = Translations.value 'exportJourney.updateActualDate.title'
  SUB_TEXT = 'Enter the date, for example'

  def check_page_displayed
    expect(self).to have_css 'h1', text: TITLE, exact_text: true
  end

  def check_translation
    expect(self).to have_text SUB_TEXT
    expect(ViewSubmittedExportPage.new.transaction_id.text).to eq "Transaction number: #{TestStatus.test_status(:export_transaction_number)}"
  end
end
