# frozen_string_literal: true

# this page is for interim site recovery code
class InterimSiteRecoveryCodePage < GenericPage
  include ErrorBox
  include CommonComponents
  include GeneralHelpers
  include PageHelper

  TITLE = Translations.value 'exportJourney.interimSite.codeTitle'
  CAPTION = Translations.value 'exportJourney.recoveryFacilities.caption'

  def check_page_displayed
    expect(self).to have_css 'h1', text: TITLE, exact_text: true
  end

  def check_page_translation
    expect(page).to have_text CAPTION
  end

  def option_checked?(selected_option)
    find(r12_or_r13.fetch(selected_option), visible: false).checked?
  end

  def r12_or_r13
    {
      'R12' => 'recoveryCode-R12',
      'R13' => 'recoveryCode-R13'
    }
  end

  def interim_site_link xpath
    find(:xpath, xpath).click
  end
end
