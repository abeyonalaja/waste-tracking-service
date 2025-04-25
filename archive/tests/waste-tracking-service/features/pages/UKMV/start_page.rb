# frozen_string_literal: true

# this page is for start page details
class StartPage < GenericPage

  TITLE = Translations.ukmv_value 'startPage.title'
  SUMMARY = Translations.ukmv_value 'startPage.summary'
  DESCRIPTION_SERVICE = Translations.ukmv_value 'startPage.serviceFeatures.description'
  TEXT_ONE = Translations.ukmv_value 'startPage.serviceFeatures.listElementOne'
  # DONT NEED THIS FOR NOW TEXT_TWO = Translations.ukmv_value 'startPage.serviceFeatures.listElementTwo'
  TEXT_THREE = Translations.ukmv_value 'startPage.serviceFeatures.listElementThree'
  TEXT_FOUR = Translations.ukmv_value 'startPage.serviceFeatures.listElementFour'
  PARAGRAPH = Translations.ukmv_value 'startPage.paragraph'

  START_BUTTON = Translations.ukmv_value 'startPage.buttonStartNow'

  BEFORE_START = Translations.ukmv_value 'startPage.beforeYouStart.title'
  BEFORE_DESCRIPTION_ONE = Translations.ukmv_value 'startPage.beforeYouStart.descriptionOne'
  BEFORE_LIST_ONE = Translations.ukmv_value 'startPage.beforeYouStart.listElementOne'
  BEFORE_LIST_TWO = Translations.ukmv_value 'startPage.beforeYouStart.listElementTwo'
  BEFORE_DESCRIPTION_TWO = Translations.ukmv_value 'startPage.beforeYouStart.descriptionTwo'
  UNORDERED_LIST_ONE = Translations.ukmv_value 'startPage.beforeYouStart.unorderedListElementOne'
  UNORDERED_LIST_TWO = Translations.ukmv_value 'startPage.beforeYouStart.unorderedListElementTwo'
  INSET_TEXT = Translations.ukmv_value 'startPage.beforeYouStart.insetText'
  BEFORE_DESCRIPTION_THREE = Translations.ukmv_value 'startPage.beforeYouStart.descriptionThree'
  BEFORE_DESCRIPTION_FOUR = Translations.ukmv_value 'startPage.beforeYouStart.descriptionFour'

  EXPORT_IMPORT_CONTROLS_TITLE = Translations.ukmv_value 'startPage.exportImportControls.title'
  EXPORT_IMPORT_CONTROLS_DESCRIPTION_ONE = Translations.ukmv_value 'startPage.exportImportControls.descriptionOne'
  EXPORT_IMPORT_CONTROLS_DESCRIPTION_TWO = Translations.ukmv_value 'startPage.exportImportControls.descriptionTwo'
  EXPORT_IMPORT_CONTROLS_LINK_ONE = Translations.ukmv_value 'startPage.exportImportControls.linkOne'
  EXPORT_IMPORT_CONTROLS_LINK_TWO = Translations.ukmv_value 'startPage.exportImportControls.linkTwo'
  EXPORT_IMPORT_CONTROLS_LINK_THREE = Translations.ukmv_value 'startPage.exportImportControls.linkThree'
  EXPORT_IMPORT_CONTROLS_LINK_FOUR = Translations.ukmv_value 'startPage.exportImportControls.linkFour'

  GET_HELP_TITLE = Translations.ukmv_value 'startPage.getHelpTechnicalIssue.title'
  GET_HELP_DESCRIPTION_ONE = Translations.ukmv_value 'startPage.getHelpTechnicalIssue.descriptionOne'
  GET_HELP_EMAIL_KEY = Translations.ukmv_value 'startPage.getHelpTechnicalIssue.emailKey'
  GET_HELP_EMAIL_VALUE = Translations.ukmv_value 'startPage.getHelpTechnicalIssue.emailValue'
  GET_HELP_DESCRIPTION_TWO = Translations.ukmv_value 'startPage.getHelpTechnicalIssue.descriptionTwo'

  GET_HELP_REG_TITLE = Translations.ukmv_value 'startPage.getHelpRegulatoryIssue.title'
  GET_HELP_REG_DESCRIPTION_ONE = Translations.ukmv_value 'startPage.getHelpRegulatoryIssue.descriptionOne'
  GET_HELP_REG_DESCRIPTION_TWO = Translations.ukmv_value 'startPage.getHelpRegulatoryIssue.descriptionTwo'
  REGULATORY_LINK_ONE = Translations.ukmv_value 'startPage.getHelpRegulatoryIssue.linkOne'
  REGULATORY_LINK_TWO = Translations.ukmv_value 'startPage.getHelpRegulatoryIssue.linkTwo'
  REGULATORY_LINK_THREE = Translations.ukmv_value 'startPage.getHelpRegulatoryIssue.linkThree'
  REGULATORY_LINK_FOUR = Translations.ukmv_value 'startPage.getHelpRegulatoryIssue.linkFour'


  def check_page_displayed
    expect(self).to have_css 'h1', text: TITLE, exact_text: true
  end

  def check_page_translation
    expect(self).to have_text SUMMARY
    expect(self).to have_text DESCRIPTION_SERVICE
    expect(self).to have_text TEXT_ONE
    # DONT NEED THIS FOR NOW expect(self).to have_text TEXT_TWO
    expect(self).to have_text TEXT_THREE
    expect(self).to have_text TEXT_FOUR
    expect(self).to have_text START_BUTTON
    expect(self).to have_text BEFORE_START
    expect(self).to have_text BEFORE_DESCRIPTION_ONE
    expect(self).to have_text BEFORE_LIST_ONE
    expect(self).to have_text BEFORE_LIST_TWO
    expect(self).to have_text BEFORE_DESCRIPTION_TWO
    expect(self).to have_text UNORDERED_LIST_ONE
    expect(self).to have_text UNORDERED_LIST_TWO
    expect(self).to have_text INSET_TEXT
    expect(self).to have_text BEFORE_DESCRIPTION_THREE
    expect(self).to have_text BEFORE_DESCRIPTION_FOUR
    expect(self).to have_text EXPORT_IMPORT_CONTROLS_TITLE
    expect(self).to have_text EXPORT_IMPORT_CONTROLS_DESCRIPTION_ONE
    expect(self).to have_text EXPORT_IMPORT_CONTROLS_DESCRIPTION_TWO
    expect(self).to have_text EXPORT_IMPORT_CONTROLS_LINK_ONE
    expect(self).to have_text EXPORT_IMPORT_CONTROLS_LINK_TWO
    expect(self).to have_text EXPORT_IMPORT_CONTROLS_LINK_THREE
    expect(self).to have_text EXPORT_IMPORT_CONTROLS_LINK_FOUR
    expect(self).to have_text GET_HELP_TITLE
    expect(self).to have_text GET_HELP_DESCRIPTION_ONE
    expect(self).to have_text GET_HELP_EMAIL_KEY
    expect(self).to have_text GET_HELP_EMAIL_VALUE
    expect(self).to have_text GET_HELP_DESCRIPTION_TWO
    expect(self).to have_text GET_HELP_REG_TITLE
    expect(self).to have_text GET_HELP_REG_DESCRIPTION_ONE
    expect(self).to have_text GET_HELP_REG_DESCRIPTION_TWO
    expect(self).to have_text REGULATORY_LINK_ONE
    expect(self).to have_text REGULATORY_LINK_TWO
    expect(self).to have_text REGULATORY_LINK_THREE
    expect(self).to have_text REGULATORY_LINK_FOUR
  end

end
