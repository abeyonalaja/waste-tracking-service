# frozen_string_literal: true

require_relative '../shared_components/general_helpers'
require_relative '../shared_components/error_box'
# this page is for Exporter details page details
class CollectionDatePage < GenericPage
  include GeneralHelpers
  include ErrorBox
  include PageHelper


  TITLE = Translations.value 'exportJourney.wasteCollectionDate.title'
  SUB_TEXT = Translations.value 'exportJourney.wasteCollectionDate.intro'
  ACTUAL_DATE = Translations.value 'exportJourney.wasteCollectionDate.radioYesHint'
  ESTIMATE_DATE = Translations.value 'exportJourney.wasteCollectionDate.radioNo'
  CAPTION = Translations.value 'exportJourney.wasteCollectionDate.caption'

  def check_page_displayed
    expect(self).to have_css 'h1', text: TITLE, exact_text: true
  end

  def check_translation
    expect(self).to have_text SUB_TEXT
    expect(self).to have_text CAPTION
  end

  def check_actual_collection_translation
    expect(self).to have_text ACTUAL_DATE
  end

  def check_estimate_collection_translation
    expect(self).to have_text ESTIMATE_DATE
  end

  def enter_actual_collection_date(date)
    Log.info("Collection Actual date is: #{date}")
    TestStatus.set_test_status(:actual_collection_date, date)
    fill_in 'wasteCollActualDay', with: date.split[0]
    fill_in 'wasteCollActualMonth', with: date.split[1]
    fill_in 'wasteCollActualYear', with: date.split[2]
  end

  def enter_estimate_collection_date(date)
    Log.info("Collection Estimate date is: #{date}")
    TestStatus.set_test_status(:estimate_collection_date, date)
    fill_in 'wasteCollEstimateDay', with: date.split[0]
    fill_in 'wasteCollEstimateMonth', with: date.split[1]
    fill_in 'wasteCollEstimateYear', with: date.split[2]
  end

  def collection_date_option(option)
    find(collection_date_options.fetch(option), visible: all)
  end

  def has_estimate_collection_date?(date)
    find('wasteCollEstimateDay').value == date.split[0]
    find('wasteCollEstimateMonth').value == date.split[1]
    find('wasteCollEstimateYear').value == date.split[2]
  end

  def has_actual_collection_date?(date)
    find('wasteCollActualDay').value == date.split[0]
    find('wasteCollActualMonth').value == date.split[1]
    find('wasteCollActualYear').value == date.split[2]
  end

  def collection_date_options
    {
      'Yes, I’ll enter the actual date' => 'collectionDateKnownYes',
      'No, I’ll enter an estimate date' => 'collectionDateKnownNo'
    }
  end

end
