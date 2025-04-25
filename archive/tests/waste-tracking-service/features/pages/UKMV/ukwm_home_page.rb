# frozen_string_literal: true

# this page is for start page details
class UkwmHomePage < GenericPage

  TITLE = Translations.ukmv_value 'cards.ukwm.title'
  SUB_TITLE = Translations.ukmv_value 'newWasteMovements.title'
  PARAGRAPH = Translations.ukmv_value 'moveWastePage.newWasteMovements.description'
  SINGLE_JOURNEY_HEADER = Translations.ukmv_value 'moveWastePage.newWasteMovements.singleMovementTitle'
  SINGLE_JOURNEY_LINK = Translations.ukmv_value 'moveWastePage.newWasteMovements.singleMovementLink'
  MULTIPLE_CSV_HEADER = Translations.ukmv_value 'moveWastePage.newWasteMovements.multipleMovementTitle'
  MULTIPLE_CSV_LINK = Translations.ukmv_value 'moveWastePage.newWasteMovements.multipleMovementLink'
  REVIEW_WASTE_MOVEMENT_HEADER = Translations.ukmv_value 'moveWastePage.newWasteMovements.allMovementsTitle'
  REVIEW_WASTE_MOVEMENT_DESCRIPTION = Translations.ukmv_value 'moveWastePage.newWasteMovements.allMovementsLinkAbsent'


  def check_page_displayed
    expect(self).to have_css 'h1', text: TITLE, exact_text: true
  end

  def check_page_translation
    expect(self).to have_text PARAGRAPH
    expect(self).to have_text SINGLE_JOURNEY_HEADER
    expect(self).to have_text SINGLE_JOURNEY_LINK
    expect(self).to have_text MULTIPLE_CSV_HEADER
    expect(self).to have_text MULTIPLE_CSV_LINK
    expect(self).to have_text REVIEW_WASTE_MOVEMENT_HEADER
    expect(self).to have_text REVIEW_WASTE_MOVEMENT_DESCRIPTION
    expect(self).to have_text SUB_TITLE
  end

  def create_ukm_single_waste_movement
    click_link 'Create a new waste movement'
  end

end
