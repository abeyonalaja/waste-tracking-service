# frozen_string_literal: true

require_relative '../../shared_components/general_helpers'
require_relative '../../shared_components/error_box'
# this page is for What are the waste carriers contact details page details
class ChooseCollectionAddressPage < GenericPage
  include GeneralHelpers
  include ErrorBox

  TITLE = Translations.value 'exportJourney.wasteCollectionDetails.postcodeTitle'
  CAPTION = Translations.value 'exportJourney.submitAnExport.SectionTwo.exporterDetails'

  def check_page_displayed
    expect(self).to have_css 'h1', text: TITLE, exact_text: true
  end

  def check_page_translation
    expect(self).to have_text CAPTION
  end

end
