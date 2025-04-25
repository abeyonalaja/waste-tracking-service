# frozen_string_literal: true

# this page is for Exporter details page details
class LocationWasteLeavesTheUkPage < GenericPage
  include GeneralHelpers
  include ErrorBox
  include PageHelper

  TITLE = Translations.value 'exportJourney.pointOfExit.title'
  SUB_TEXT = Translations.value 'exportJourney.pointOfExit.caption'
  INTRO_TEXT = Translations.value 'exportJourney.pointOfExit.intro'
  ENTER_LOCATION = Translations.value 'exportJourney.pointOfExit.inputLabel'

  LOCATION_FIELD_ID = 'pointOfExit'

  def check_page_displayed
    expect(self).to have_css 'h1', text: TITLE, exact_text: true
  end

  def check_translation
    expect(self).to have_text SUB_TEXT
    expect(self).to have_text INTRO_TEXT
    expect(self).to have_text ENTER_LOCATION
  end

  def enter_location(location)
    fill_in LOCATION_FIELD_ID, with: location, visible: false
    TestStatus.set_test_status(:waste_leaves_UK_location, location)
  end

  def has_reference_location?(location)
    find(LOCATION_FIELD_ID).value == location
  end

  def option_checked?(selected_option)
    find(yes_or_no.fetch(selected_option), visible: false).checked?
  end

  def yes_or_no
    {
      'Yes' => 'knowsPointOfExitYes',
      'No' => 'knowsPointOfExitNo'
    }
  end
end
