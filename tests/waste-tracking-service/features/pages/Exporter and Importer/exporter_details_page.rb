# frozen_string_literal: true

require_relative '../shared_components/general_helpers'
require_relative '../shared_components/error_box'
# this page is for Exporter details page details
class ExporterDetailsPage < GenericPage
  include GeneralHelpers
  include ErrorBox

  TITLE = Translations.value 'exportJourney.exporterDetails.title'
  HINT_TEXT = Translations.value 'exportJourney.submitAnExport.SectionTwo.exporterDetails'
  ORGANISATION_NAME = 'organisationName'
  FULL_NAME = 'fullName'
  EMAIL = 'email'
  PHONE = 'phone'

  def check_page_displayed
    expect(self).to have_css 'h1', text: TITLE, exact_text: true
  end

  def enter_organisation_name(org_name)
    fill_in ORGANISATION_NAME, with: org_name, visible: false
  end

  def enter_exporter_full_name(exporter_name)
    fill_in FULL_NAME, with: exporter_name, visible: false
  end

  def enter_exporter_email(email)
    fill_in EMAIL, with: email, visible: false
  end

  def exporter_phone_num(exporter_phone)
    fill_in PHONE, with: exporter_phone, visible: false
  end

  def has_organisation_name?(org_name)
    find(ORGANISATION_NAME).value == org_name
  end

  def has_full_name?(full_name)
    find(FULL_NAME).value == full_name
  end

  def has_email?(email)
    find(EMAIL).value == email
  end

  def has_phone?(phone)
    find(PHONE).value == phone
  end

end
