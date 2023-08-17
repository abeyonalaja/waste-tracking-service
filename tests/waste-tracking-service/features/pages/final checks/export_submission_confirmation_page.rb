# frozen_string_literal: true

require_relative '../shared_components/general_helpers'
require_relative '../shared_components/error_box'
# this page is for Exporter details page details
class ExportSubmissionConfirmationPage < GenericPage
  include GeneralHelpers
  include ErrorBox
  include CommonComponents

  TITLE = 'Annex VII document submitted'

  SUBTEXT = Translations.value 'exportJourney.exportSubmitted.panel'
  TEXT1 = Translations.value 'exportJourney.exportSubmitted.statement'
  TEXT2 = Translations.value 'exportJourney.exportSubmitted.listHeader'
  TEXT3 = Translations.value 'exportJourney.exportSubmitted.listItemOne'
  TEXT4 = Translations.value 'exportJourney.exportSubmitted.listItemTwo'
  TEXT5 = Translations.value 'exportJourney.exportSubmitted.listItemThree'

  # estimated
  TEXT6 = Translations.value 'exportJourney.exportSubmitted.optionalHeading'
  TEXT7 = Translations.value 'exportJourney.exportSubmitted.secondListHeader'
  TEXT8 = Translations.value 'exportJourney.exportSubmitted.secondListItemOne'
  TEXT9 = Translations.value 'exportJourney.exportSubmitted.secondListItemTwo'
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

  def check_page_translation_estimates
    expect(self).to have_text TEXT6
    expect(self).to have_text TEXT7
    expect(self).to have_text TEXT8
    expect(self).to have_text TEXT9
    expect(self).to have_text TEXT11
  end

  def transaction_number
    find 'transaction-id'
  end

  # def check_page_translation_actual
  #   expect(self).to have_text SUBTEXT
  #   expect(self).to have_text TEXT1
  #   expect(self).to have_text TEXT2
  #   expect(self).to have_text TEXT3
  #   expect(self).to have_text TEXT4
  #   expect(self).to have_text TEXT5
  # end
end
