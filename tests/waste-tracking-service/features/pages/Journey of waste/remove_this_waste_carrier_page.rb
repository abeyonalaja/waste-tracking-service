# frozen_string_literal: true

require_relative '../shared_components/general_helpers'
require_relative '../shared_components/error_box'
# this page is for remove waste carrier page details
class RemoveThisWasteCarrierPage < GenericPage
  include GeneralHelpers
  include ErrorBox

  MULTI_WASTE_TITLE = 'h2 > div'

  REMOVE_WASTE_PAGE_TITLE = Translations.value 'exportJourney.addedEwcCode.delete'

  def check_page_displayed
    expect(self).to have_css 'h1', text: 'Are you sure you want to remove this waste carrier?', exact_text: true
  end

end
