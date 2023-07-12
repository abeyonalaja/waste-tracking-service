# frozen_string_literal: true

require_relative '../shared_components/general_helpers'
require_relative '../shared_components/error_box'
# this page is for Exporter details page details
class CheckYourReportPage < GenericPage
  include GeneralHelpers
  include ErrorBox

  TITLE = Translations.value 'exportJourney.exporterPostcode.title'
  SUBTEXT = 'If you change any of your answers this may affect other answers in this form that you may also need to update.'

  EXPORT_REFERENCE = 'your-reference'

  def check_page_displayed
    expect(self).to have_css 'h1', text: 'Check your answers before submitting this export', exact_text: true
  end

  def check_page_translation
    expect(self).to have_text SUBTEXT
    expect(self).to have_css 'h2', text: 'Your Reference', exact_text: true
    expect(self).to have_css 'h2', text: 'About the waste', exact_text: true
    expect(self).to have_css 'h2', text: 'Exporter and importer', exact_text: true
    expect(self).to have_css 'h2', text: 'Journey of waste', exact_text: true
    expect(self).to have_css 'h2', text: 'Treatment of waste', exact_text: true
  end

  def check_export_reference
    find(EXPORT_REFERENCE).text == TestStatus.test_status(:application_reference_number)

  end
end
