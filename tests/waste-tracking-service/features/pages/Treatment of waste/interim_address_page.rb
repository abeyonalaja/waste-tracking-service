# frozen_string_literal: true

require_relative '../shared_components/general_helpers'
require_relative '../shared_components/error_box'
require_relative '../shared_components/common_components'

# this page is for interim site address details
class InterimSiteAddressPage < GenericPage
  include ErrorBox
  include CommonComponents
  include GeneralHelpers


  TITLE = Translations.value 'exportJourney.interimSite.addressTitle'
  ADDRESS = Translations.value 'address'
  COUNTRY = Translations.value 'address.country'

  def check_page_displayed
    expect(self).to have_css 'h1', text: TITLE, exact_text: true
  end

  def check_page_translation
    expect(page).to have_text TITLE
    expect(page).to have_text ADDRESS
    expect(page).to have_text COUNTRY
  end
end
