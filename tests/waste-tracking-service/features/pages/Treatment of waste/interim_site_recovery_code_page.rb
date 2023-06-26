# frozen_string_literal: true

require_relative '../shared_components/general_helpers'
require_relative '../shared_components/error_box'
require_relative '../shared_components/common_components'

# this page is for interim site recovery code
class InterimSiteRecoveryCodePage < GenericPage
  include ErrorBox
  include CommonComponents
  include GeneralHelpers
  include PageHelper


  TITLE = Translations.value 'exportJourney.interimSite.codeTitle'

  def check_page_displayed
    expect(self).to have_css 'h1', text: TITLE, exact_text: true
  end

  def option_checked?(selected_option)
    find(r12_or_r13.fetch(selected_option), visible: false).checked?
  end

  def r12_or_r13
    {
      'R12' => 'recoveryCode-r12--exchange-of-wastes-for-submission-to-any-of-the-operations-numbered-r01-to-r11',
      'R13' => 'recoveryCode-r13--storage-of-wastes-pending-any-of-the-operations-numbered-r01-to-r12--excluding-temporary-storage--pending-collection--on-the-site-where-it-is-produced--'
    }
  end
end
