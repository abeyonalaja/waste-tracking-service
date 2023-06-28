# frozen_string_literal: true

require_relative '../shared_components/general_helpers'
require_relative '../shared_components/error_box'
require_relative '../shared_components/common_components'

# this page is for recovery facility contact page details
class LaboratoryAddressPage < GenericPage
  include ErrorBox
  include CommonComponents
  include GeneralHelpers

  TITLE = Translations.value 'exportJourney.laboratorySite.addressTitle'
  SUB_TEXT = Translations.value 'exportJourney.laboratorySite.caption'
  LAB_NAME = Translations.value 'exportJourney.laboratorySite.name'
  ADDRESS = Translations.value 'address'
  COUNTRY = Translations.value 'address.country'

  def check_page_displayed
    expect(self).to have_css 'h1', text: TITLE, exact_text: true
  end

  def check_translation
    expect(self).to have_text SUB_TEXT
    expect(self).to have_text LAB_NAME
    expect(self).to have_text ADDRESS
    expect(self).to have_text COUNTRY
  end

end
