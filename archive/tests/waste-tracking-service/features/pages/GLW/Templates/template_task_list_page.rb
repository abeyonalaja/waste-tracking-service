# frozen_string_literal: true

# this page is manage templates page details
class TemplateTaskListPage < GenericPage
  include GeneralHelpers
  include ErrorBox

  CAPTION = Translations.value 'templates.taskList.caption'


  MAIN_INTRO = Translations.value 'templates.taskList.intro.p1'
  INTRO1 = Translations.value 'templates.taskList.intro.li1'
  INTRO2 = Translations.value 'templates.taskList.intro.li2'
  INTRO3 = Translations.value 'templates.taskList.intro.li3'
  INTRO4 = Translations.value 'templates.taskList.intro.li4'
  INTRO5 = Translations.value 'templates.taskList.intro.li5'
  LAST_INTRO = Translations.value 'templates.taskList.intro.p2'

  # ACTIONS
  USE_TEMPLATE = Translations.value 'templates.taskList.actionLink.use'
  COPY_TEMPLATE = Translations.value 'templates.taskList.actionLink.copy'
  DELETE_TEMPLATE = Translations.value 'templates.taskList.actionLink.delete'
  MANAGE_TEMPLATES = Translations.value 'templates.taskList.actionLink.manage'

  # SECTIONS
  TEMPLATE_DETAILS = Translations.value 'templates.taskList.details'
  NAME_AND_DESCRIPTION = Translations.value 'templates.taskList.nameAndDescription'
  ABOUT_THE_WASTE = Translations.value 'exportJourney.submitAnExport.SectionOne.heading'
  WASTE_CODE_AND_DESCRIPTION = Translations.value 'exportJourney.submitAnExport.SectionOne.wasteCodesAndDescription'
  EXPORTER_IMPORTER = Translations.value 'exportJourney.submitAnExport.SectionTwo.heading'
  EXPORTER = Translations.value 'exportJourney.submitAnExport.SectionTwo.exporterDetails'
  IMPORTER = Translations.value 'exportJourney.submitAnExport.SectionTwo.importerDetails'
  JOURNEY_OF_WASTE = Translations.value 'exportJourney.submitAnExport.SectionThree.heading'
  WASTE_CARRIERS = Translations.value 'exportJourney.submitAnExport.SectionThree.wasteCarriers'
  WASTE_COLLECTION_DETAILS = Translations.value 'exportJourney.submitAnExport.SectionThree.wasteCollectionDetails'
  LOCATION_WASTE_LEAVES_UK = Translations.value 'exportJourney.submitAnExport.SectionThree.locationWasteLeavesUK'
  COUNTRIES_WASTE_TRAVEL = Translations.value 'exportJourney.submitAnExport.SectionThree.countriesWasteWillTravel'
  TREATMENT_OF_WASTE = Translations.value 'exportJourney.submitAnExport.SectionFour.heading'
  FACILITY_OR_LABORATORY = Translations.value 'exportJourney.submitAnExport.SectionFour.recoveryFacilityLaboratory'

  BANNER_BODY_ID = 'template-tasklist-banner-created_body'
  BANNER_TITTLE_ID = 'govuk-notification-banner-title'

  def check_page_displayed
    expect(self).to have_css 'p', text: MAIN_INTRO, exact_text: true
  end

  def check_page_translation
    expect(self).to have_text MAIN_INTRO
    expect(self).to have_text INTRO1
    expect(self).to have_text INTRO2
    expect(self).to have_text INTRO3
    expect(self).to have_text INTRO4
    expect(self).to have_text INTRO5
    expect(self).to have_text LAST_INTRO
    expect(self).to have_text USE_TEMPLATE
    expect(self).to have_text COPY_TEMPLATE
    expect(self).to have_text DELETE_TEMPLATE
    expect(self).to have_text MANAGE_TEMPLATES
    expect(self).to have_text ABOUT_THE_WASTE
    expect(self).to have_text WASTE_CODE_AND_DESCRIPTION
    expect(self).to have_text EXPORTER_IMPORTER
    expect(self).to have_text EXPORTER
    expect(self).to have_text IMPORTER
    expect(self).to have_text JOURNEY_OF_WASTE
    expect(self).to have_text WASTE_CARRIERS
    expect(self).to have_text WASTE_COLLECTION_DETAILS
    expect(self).to have_text LOCATION_WASTE_LEAVES_UK
    expect(self).to have_text COUNTRIES_WASTE_TRAVEL
    expect(self).to have_text TREATMENT_OF_WASTE
  end

  def find_banner_title
    find('govuk-notification-banner-title')
  end

  def find_banner_body
    find('template-tasklist-banner-created_body')
  end
end
