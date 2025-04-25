# frozen_string_literal: true

# this page is for remove waste carrier page details
class RemoveThisWasteCarrierPage < GenericPage
  include GeneralHelpers
  include ErrorBox

  MULTI_WASTE_TITLE = 'h2 > div'
  TITLE = Translations.value 'exportJourney.wasteCarrier.carriersPage.removeQuestion'
  REMOVE_WASTE_PAGE_TITLE = Translations.value 'exportJourney.addedEwcCode.delete'

  def check_page_displayed
    expect(self).to have_css 'h1', text: TITLE, exact_text: true
  end

end
