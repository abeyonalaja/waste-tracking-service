# frozen_string_literal: true

require_relative '../../shared_components/general_helpers'
require_relative '../../shared_components/error_box'
require_relative '../../shared_components/common_components'

# this page is for confirmation if you want to delete an annex incomplete record
class ConfirmationDeleteAnnexRecordPage < GenericPage
  include ErrorBox
  include CommonComponents
  include GeneralHelpers
  include PageHelper


  TITLE = Translations.value 'exportJourney.incompleteAnnexSeven.delete.title'
  CONFIRM_BUTTON = Translations.value 'exportJourney.incompleteAnnexSeven.delete.button'
  REFERENCE_CAPTION = Translations.value 'exportJourney.incompleteAnnexSeven.delete.caption'
  def check_page_displayed
    expect(self).to have_css 'h1', text: TITLE, exact_text: true
  end

  def check_reference_caption
    expect(self).to have_text REFERENCE_CAPTION + TestStatus.test_status(:application_reference_number)
  end
  def confirm_button
    click_button CONFIRM_BUTTON
  end

end
