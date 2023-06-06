# frozen_string_literal: true

require_relative '../shared_components/general_helpers'
require_relative '../shared_components/error_box'
# this page is for Exporter details page details
class MultiWasteCarriersPage < GenericPage
  include GeneralHelpers
  include ErrorBox

  MULTI_WASTE_TITLE = 'h2 > div'

  MULTI_WASTE_PAGE_TITLE = Translations.value 'exportJourney.wasteCarrier.carriersPage.title'
  MULTI_WASTE_PAGE_ORG_NAME = Translations.value 'exportJourney.exporterDetails.organisationName'
  MULTI_WASTE_PAGE_COUNTRY = Translations.value 'exportJourney.exporterManual.countryLabel'
  MULTI_WASTE_PAGE_ADD_MORE_WASTE_CARRIERS = Translations.value 'exportJourney.wasteCarrier.carriersPage.question'
  MULTI_WASTE_PAGE_ADD_4_WASTE_CARRIERS = Translations.value 'exportJourney.wasteCarrier.carriersPage.hint'
  MULTI_WASTE_PAGE_MAX_WASTE_CARRIERS = Translations.value 'exportJourney.wasteCarrier.carriersPage.noMoreCarriers'

  def check_page_displayed
    expect(self).to have_css 'h1', text: MULTI_WASTE_PAGE_TITLE, exact_text: true
  end

  def check_translation
    expect(self).to have_text MULTI_WASTE_PAGE_ORG_NAME
    expect(self).to have_text MULTI_WASTE_PAGE_COUNTRY
    expect(self).to have_text MULTI_WASTE_PAGE_ADD_MORE_WASTE_CARRIERS
    expect(self).to have_text MULTI_WASTE_PAGE_ADD_4_WASTE_CARRIERS
  end

  def check_max_carrier_translation
    expect(self).to have_text MULTI_WASTE_PAGE_MAX_WASTE_CARRIERS
  end

  def waste_carrier_title
    all(:css, MULTI_WASTE_TITLE)
  end

  def has_first_multi_waste_title?(title)
    multi_waste_title.first == title
  end

  def has_multi_waste_title?(titles)
    multi_waste_title == titles
  end

  def multi_waste_title
    waste_carrier_title.map(&:text)
  end

  def waste_carrier_org_country_name_keys
    all(:css, '.govuk-summary-list__row > dt')
  end

  def waste_carrier_org_country_name_values
    all(:css, '.govuk-summary-list__row > dd')
  end

  def waste_carrier_change_remove_link
    all(:css, '.govuk-summary-card__title-wrapper ul > li > a')
  end

end
