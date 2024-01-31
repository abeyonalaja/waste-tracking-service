# frozen_string_literal: true

require_relative '../shared_components/general_helpers'
require_relative '../shared_components/error_box'
require_relative '../shared_components/common_components'

# this page is for recovery facility page details
class ChosenFacilitiesPage < GenericPage
  include ErrorBox
  include CommonComponents
  include GeneralHelpers
  include PageHelper

  YOUR_CHOSEN = 'h2'

  YOUR_CHOSEN_SINGLE_TITLE = Translations.value 'exportJourney.recoveryFacilities.listTitleSingle'
  FIRST_RECOVERY_FACILITY = Translations.value 'exportJourney.recoveryFacilities.cardTitle'
  FACILITY_NAME = Translations.value 'exportJourney.recoveryFacilities.name'
  COUNTRY = Translations.value 'address.country'
  RECOVERY_CODE = Translations.value 'exportJourney.recoveryFacilities.recoveryCode'
  MAX_RECOVERY_TEXT = Translations.value 'exportJourney.recoveryFacilities.maxReached'
  MAX_PAGE_TITLE = Translations.value 'exportJourney.recoveryFacilities.listTitleMultiple'
  ADD_MORE_TEXT = Translations.value 'exportJourney.recoveryFacilities.addHint'

  def check_page_displayed
    expect(self).to have_css 'h1', text: YOUR_CHOSEN_SINGLE_TITLE, exact_text: true
  end

  def check_translation
    expect(self).to have_text FIRST_RECOVERY_FACILITY
    expect(self).to have_text FACILITY_NAME
    expect(self).to have_text COUNTRY
    expect(self).to have_text RECOVERY_CODE
    expect(self).to have_text ADD_MORE_TEXT.gsub('{{n}}', '4')
  end

  def max_facility_translation
    expect(self).to have_text MAX_PAGE_TITLE
    expect(self).to have_text MAX_RECOVERY_TEXT
  end

  def has_first_recovery_facility_title?(facility)
    facility_titles.first == facility
  end

  def facility_change_and_remove_link(item)
    all(:css, "#facility-list-item-#{item}-header > ul > li > a")
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

  def recovery_facility_name_tags(item)
    all(:css, "#facility-list-item-#{item}-content > dl >div >dt")
  end

  def recovery_facility_values(item)
    all(:css, "#facility-list-item-#{item}-content > dl >div >dd")
  end

  def facility_title(title)
    all(:css, "#facility-list-item-#{title}-title")
  end
end
