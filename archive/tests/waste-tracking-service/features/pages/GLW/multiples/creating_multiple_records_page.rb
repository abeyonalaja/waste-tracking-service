# frozen_string_literal: true

# this page is for create multiple annex records page details
class CreateMultipleRecordsPage < GenericPage
  include GeneralHelpers
  include ErrorBox

  TITLE = Translations.value 'multiples.guidance.heading'
  SUB_TITTLE = Translations.value 'multiples.guidance.listHeading'
  ITEM_ONE_START = Translations.value 'multiples.guidance.listItemOne.start'
  ITEM_ONE_LINK = Translations.value 'multiples.guidance.listItemOne.link'
  ITEM_ONE_END = Translations.value 'multiples.guidance.listItemOne.end'
  ITEM_TWO_START = Translations.value 'multiples.guidance.listItemTwo.start'
  ITEM_TWO_LINK = Translations.value 'multiples.guidance.listItemTwo.link'
  ITEM_TWO_END = Translations.value 'multiples.guidance.listItemTwo.end'
  ITEM_THREE = Translations.value 'multiples.guidance.listItemThree'
  ITEM_FOUR = Translations.value 'multiples.guidance.listItemFour'
  ITEM_FIVE = Translations.value 'multiples.guidance.listItemFive'
  DOCUMENTS = Translations.value 'multiples.guidance.documentHeading'
  HTML = Translations.value 'multiples.guidance.document.html.sub'
  HTML_LINK = Translations.value 'multiples.guidance.document.html.link'
  MULTIPLE = Translations.value 'multiples.guidance.document.csv.heading'
  MULTIPLE_SUBTEXT = Translations.value 'multiples.guidance.document.csv.sub'
  DOWNLOAD_LINK = Translations.value 'multiples.guidance.document.csv.link'
  UPLOAD_TEXT = Translations.value 'multiples.guidance.upload.heading'
  UPLOAD_SUBTEXT = Translations.value 'multiples.guidance.upload.sub'
  UPLOAD_BUTTON = Translations.value 'multiples.guidance.upload.button'

  def check_page_displayed
    expect(self).to have_css 'h1', text: TITLE, exact_text: true
  end

  def check_page_translation
    expect(self).to have_text SUB_TITTLE
    expect(self).to have_text ITEM_ONE_START + ITEM_ONE_LINK + ITEM_ONE_END
    expect(self).to have_text ITEM_TWO_START + ITEM_TWO_LINK + ITEM_TWO_END
    expect(self).to have_text ITEM_THREE
    expect(self).to have_text ITEM_FOUR
    expect(self).to have_text ITEM_FIVE
    expect(self).to have_text DOCUMENTS
    expect(self).to have_text HTML
    expect(self).to have_text HTML_LINK
    expect(self).to have_text MULTIPLE
    expect(self).to have_text MULTIPLE_SUBTEXT
    expect(self).to have_text DOWNLOAD_LINK
    expect(self).to have_text UPLOAD_TEXT
    expect(self).to have_text UPLOAD_SUBTEXT
  end

end
