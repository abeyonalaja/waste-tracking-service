# frozen_string_literal: true

# this page is for Exporter details page details
class MultiWasteCarriersPage < GenericPage
  include GeneralHelpers
  include ErrorBox
  include PageHelper

  MULTI_WASTE_TITLE = 'h2'

  MULTI_WASTE_PAGE_TITLE = Translations.value 'exportJourney.wasteCarrier.carriersPage.title'
  MULTI_WASTE_PAGE_ORG_NAME = Translations.value 'contact.orgName'
  MULTI_WASTE_PAGE_COUNTRY = Translations.value 'address.country'
  MULTI_WASTE_PAGE_ADD_MORE_WASTE_CARRIERS = Translations.value 'exportJourney.wasteCarrier.carriersPage.question'
  MULTI_WASTE_PAGE_ADD_4_WASTE_CARRIERS = Translations.value 'exportJourney.wasteCarrier.carriersPage.hint'
  MULTI_WASTE_PAGE_MAX_WASTE_CARRIERS = Translations.value 'exportJourney.wasteCarrier.carriersPage.noMoreCarriers'
  CAPTION = Translations.value 'exportJourney.wasteCarrierDetails.title'

  def check_page_displayed
    expect(self).to have_css 'h1', text: MULTI_WASTE_PAGE_TITLE, exact_text: true
  end

  def check_translation
    expect(self).to have_text MULTI_WASTE_PAGE_ORG_NAME
    expect(self).to have_text MULTI_WASTE_PAGE_COUNTRY
    expect(self).to have_text MULTI_WASTE_PAGE_ADD_MORE_WASTE_CARRIERS
    expect(self).to have_text MULTI_WASTE_PAGE_ADD_4_WASTE_CARRIERS.gsub('{{n}}', '4')
    expect(self).to have_text CAPTION
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

  def waste_carrier_org_name_keys(id = 0)
    find("waste-carrier-#{id}-content-0-organisation-name")
  end

  def waste_carrier_country_name_keys(id = 0)
    find("waste-carrier-#{id}-content-1-country")
  end

  def waste_carrier_org_name_value(id = 0)
    find("waste-carrier-#{id}-content-0-definition")
  end

  def waste_carrier_country_name_value(id = 0)
    find("waste-carrier-#{id}-content-1-definition")
  end

  def waste_carrier_change_link(id)
    find("carrier-list-item-#{id}-link-0")
  end

  def waste_carrier_remove_link(id)
    find("carrier-list-item-#{id}-link-1")
  end

end
