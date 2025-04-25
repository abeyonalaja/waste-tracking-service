# frozen_string_literal: true

# this page is for overview page details
class ActualVolumePage < GenericPage
  include CommonComponents

  TITLE = 'What is the actual volume of the waste?'
  SUB_TEXT = 'Only provide the net volume. Do not include the weight of the container or vehicle'
  HELPER_TEXT = Translations.value 'exportJourney.quantityValue.inputHint'
  WEIGHT_IN_TONNES = Translations.value 'exportJourney.quantityValue.weightLabel'
  WEIGHT_IN_CUBIC_METERS = Translations.value 'exportJourney.quantityValue.volumeLabel'

  def check_page_displayed
    expect(self).to have_css 'h1', text: TITLE, exact_text: true
  end

  def check_translation
    expect(self).to have_text SUB_TEXT
    expect(self).to have_text WEIGHT_IN_TONNES
    expect(self).to have_text WEIGHT_IN_CUBIC_METERS
    expect(self).to have_text HELPER_TEXT
    expect(ViewSubmittedExportPage.new.transaction_number.text).to eq "Transaction number: #{TestStatus.test_status(:export_transaction_number)}"
  end

end
