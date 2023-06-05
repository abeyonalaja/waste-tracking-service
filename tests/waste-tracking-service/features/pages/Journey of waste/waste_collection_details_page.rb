# frozen_string_literal: true

require_relative '../shared_components/general_helpers'
require_relative '../shared_components/error_box'
# this page is for What are the waste carriers contact details page details
class WasteCollectionDetailsPage < GenericPage
  include GeneralHelpers
  include ErrorBox


  WASTE_COLLECTION_DETAILS_TITLE = Translations.value 'exportJourney.wasteCollectionDetails.postcodeTitle'
  WASTE_COLLECTION_DETAILS_INTRO = Translations.value 'exportJourney.wasteCollectionDetails.intro'
  WASTE_COLLECTION_DETAILS_POSTCODE_LABEL = Translations.value 'postcode.label'

  COUNTRIES_LIST = '#waste-transit-country-list > div > dt'

  def check_page_displayed
    expect(self).to have_css 'h1', text: WASTE_COLLECTION_DETAILS_TITLE, exact_text: true
  end

  def check_translation
    expect(self).to have_text WASTE_COLLECTION_DETAILS_INTRO
    expect(self).to have_text WASTE_COLLECTION_DETAILS_POSTCODE_LABEL
  end


end
