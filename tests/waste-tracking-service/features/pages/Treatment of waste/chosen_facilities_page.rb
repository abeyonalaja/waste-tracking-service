# frozen_string_literal: true

require_relative '../shared_components/general_helpers'
require_relative '../shared_components/error_box'
require_relative '../shared_components/common_components'

# this page is for recovery facility page details
class ChosenFacilitiesPage < GenericPage
  include ErrorBox
  include CommonComponents
  include GeneralHelpers

  YOUR_CHOSEN = 'h2'

  YOUR_CHOSEN_SINGLE_TITLE = Translations.value 'exportJourney.recoveryFacilities.listTitleSingle'
  FIRST_RECOVERY_FACILITY = Translations.value 'exportJourney.recoveryFacilities.cardTitle'
  FACILITY_NAME = Translations.value 'exportJourney.recoveryFacilities.name'
  COUNTRY = Translations.value 'exportJourney.importerDetails.country'
  RECOVERY_CODE = Translations.value 'exportJourney.recoveryFacilities.recoveryCode'
  MAX_RECOVERY_TEXT = Translations.value 'exportJourney.recoveryFacilities.maxReached'

  def check_page_displayed
    expect(self).to have_css 'h1', text: YOUR_CHOSEN_SINGLE_TITLE, exact_text: true
  end

  def check_translation
    expect(self).to have_text FIRST_RECOVERY_FACILITY
    expect(self).to have_text FACILITY_NAME
    expect(self).to have_text COUNTRY
    expect(self).to have_text RECOVERY_CODE
  end

  def max_facility_translation
    expect(self).to have_text MAX_RECOVERY_TEXT
  end

  def has_first_recovery_facility_title?(facility)
    facility_titles.first == facility
  end

  def first_facility_change_and_remove_link
    all(:css, '#facility-list-item-1-header > ul > li > a')
  end

  def second_facility_change_and_remove_link
    all(:css, '#facility-list-item-2-header > ul > li > a')
  end

  def facility_titles
    recovery_facility_title.map(&:text)
  end

  def recovery_facility_title
    all(:css, YOUR_CHOSEN)
  end

  def first_recovery_facility_name_tags
    all(:css, '#facility-list-item-1-content > dl >div >dt')
  end

  def first_recovery_facility_values
    all(:css, '#facility-list-item-1-content > dl >div >dd')
  end

  def second_recovery_facility_name_tags
    all(:css, '#facility-list-item-2-content > dl >div >dt')
  end

  def second_recovery_facility_values
    all(:css, '#facility-list-item-2-content > dl >div >dd')
  end

end
