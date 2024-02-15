# frozen_string_literal: true

# this page is for Exporter details page details
class ChooseExporterAddressDetailsPage < GenericPage
  include GeneralHelpers
  include ErrorBox
  include PageHelper

  TITLE = Translations.value 'exportJourney.exporterPostcode.title'
  CAPTION = Translations.value 'exportJourney.submitAnExport.SectionTwo.exporterDetails'

  def check_page_displayed
    expect(self).to have_css 'h1', text: TITLE, exact_text: true
  end

  def check_page_translation
    expect(self).to have_text CAPTION
  end

end
