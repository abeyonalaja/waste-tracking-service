# frozen_string_literal: true

# this page is for ukmw movement list page details
class WasteMovementRecordsListPage < GenericPage
  include GeneralHelpers
  include ErrorBox
  include CommonComponents

  # Table
  HEADER_ONE = Translations.ukmv_value 'multiples.table.headerOne'
  HEADER_TWO = Translations.ukmv_value 'multiples.table.headerTwo'
  HEADER_THREE = Translations.ukmv_value 'multiples.table.headerThree'
  HEADER_FOUR = Translations.ukmv_value 'multiples.table.headerFour'
  HEADER_FIVE = Translations.ukmv_value 'multiples.table.headerFive'
  ACTION = Translations.ukmv_value 'multiples.table.action'

  # Filters
  HEADING = Translations.ukmv_value 'multiples.submittedTable.filters.heading'
  SHOW = Translations.ukmv_value 'multiples.submittedTable.filters.show'
  HIDE = Translations.ukmv_value 'multiples.submittedTable.filters.hide'
  SHOW_ALL = Translations.ukmv_value 'multiples.submittedTable.filters.showAll'
  HIDE_ALL = Translations.ukmv_value 'multiples.submittedTable.filters.hideAll'

  COLLECTION_DATE_TITLE = Translations.ukmv_value 'multiples.submittedTable.filters.collectionDate.title'
  COLLECTION_DATE_HINT  = Translations.ukmv_value 'multiples.submittedTable.filters.collectionDate.hint'
  COLLECTION_DATE_ERROR = Translations.ukmv_value 'multiples.submittedTable.filters.collectionDate.error'
  COLLECTION_DATE_LABEL_ONE = Translations.ukmv_value 'multiples.submittedTable.filters.collectionDate.labelOne'
  COLLECTION_DATE_LABEL_TWO = Translations.ukmv_value 'multiples.submittedTable.filters.collectionDate.labelTwo'
  COLLECTION_DATE_LABEL_THREE = Translations.ukmv_value 'multiples.submittedTable.filters.collectionDate.labelThree'

  EWC_TITLE = Translations.ukmv_value 'multiples.submittedTable.filters.ewcCode.title'
  EWC_HINT = Translations.ukmv_value 'multiples.submittedTable.filters.ewcCode.hint'

  PRODUCER_NAME_TITLE = Translations.ukmv_value 'multiples.submittedTable.filters.producerName.title'
  PRODUCER_NAME_HINT = Translations.ukmv_value 'multiples.submittedTable.filters.producerName.hint'

  WASTE_MOVEMENT_TITLE = Translations.ukmv_value 'multiples.submittedTable.filters.wasteMovementId.title'
  WASTE_MOVEMENT_HINT = Translations.ukmv_value 'multiples.submittedTable.filters.wasteMovementId.hint'

  APPLY_BUTTON = Translations.ukmv_value 'multiples.submittedTable.filters.buttons.apply'
  RESET_BUTTON = Translations.ukmv_value 'multiples.submittedTable.filters.buttons.reset'

  def check_page_displayed
    title = 'Waste movement records'
    expect(self).to have_css 'h1', text: title, exact_text: true
  end

  def check_page_translation
    expect(self).to have_text HEADER_ONE
    expect(self).to have_text HEADER_TWO
    expect(self).to have_text HEADER_THREE
    expect(self).to have_text HEADER_FOUR
    expect(self).to have_text HEADER_FIVE
    expect(self).to have_text ACTION
    expect(self).to have_text HEADING
    expect(self).to have_text HIDE
    expect(self).to have_text HIDE_ALL
    expect(self).to have_text COLLECTION_DATE_TITLE
    expect(self).to have_text COLLECTION_DATE_HINT
    expect(self).to have_text COLLECTION_DATE_ERROR
    expect(self).to have_text COLLECTION_DATE_LABEL_ONE
    expect(self).to have_text COLLECTION_DATE_LABEL_TWO
    expect(self).to have_text COLLECTION_DATE_LABEL_THREE
    expect(self).to have_text EWC_TITLE
    expect(self).to have_text EWC_HINT
    expect(self).to have_text PRODUCER_NAME_TITLE
    expect(self).to have_text PRODUCER_NAME_HINT
    expect(self).to have_text WASTE_MOVEMENT_TITLE
    expect(self).to have_text WASTE_MOVEMENT_HINT
    expect(self).to have_text APPLY_BUTTON
    expect(self).to have_text RESET_BUTTON
  end

  def next_link
    find(:css, "[rel='next']>span")
  end

  def click_next_link
    click_link 'Next'
  end

  def click_previous_link
    click_link 'Previous'
  end

  def click_show_all_sections
    click_button 'show-hide-all-button'
  end
end
