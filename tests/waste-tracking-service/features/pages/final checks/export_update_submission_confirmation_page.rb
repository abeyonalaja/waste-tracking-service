# frozen_string_literal: true

require_relative '../shared_components/general_helpers'
require_relative '../shared_components/error_box'
# this page is for export submission confirmation page
class ExportUpdateSubmissionConfirmationPage < GenericPage
  include GeneralHelpers
  include ErrorBox
  include CommonComponents

  TITLE = Translations.value 'exportJourney.exportSubmitted.panelTitleUpdate'
  SUBTEXT = Translations.value 'exportJourney.exportSubmitted.panelUpdate'

  TEXT1 = Translations.value 'exportJourney.exportSubmitted.statement'
  TEXT2 = Translations.value 'exportJourney.exportSubmitted.listHeader'
  TEXT3 = Translations.value 'exportJourney.exportSubmitted.listItemOne'
  TEXT4 = Translations.value 'exportJourney.exportSubmitted.listItemTwo'
  TEXT5 = Translations.value 'exportJourney.exportSubmitted.listItemThree'

  # PDF
  TEXT10 = Translations.value 'exportJourney.exportSubmitted.legalStatementp1'
  TEXT11 = Translations.value 'exportJourney.exportSubmitted.legalStatementp2'

  # bread crumb
  TEXT12 = Translations.value 'exportJourney.exportSubmitted.breadcrumb'
  TEXT13 = Translations.value 'dashboard.title'

  def check_page_displayed
    expect(self).to have_css 'h1', text: TITLE, exact_text: true
  end

  def check_page_translation
    expect(self).to have_text SUBTEXT
    expect(self).to have_text TEXT1
    expect(self).to have_text TEXT2
    expect(self).to have_text TEXT3
    expect(self).to have_text TEXT4
    expect(self).to have_text TEXT5
    expect(self).to have_text TEXT10
    expect(self).to have_text TEXT12
    expect(self).to have_text TEXT13
  end

end
