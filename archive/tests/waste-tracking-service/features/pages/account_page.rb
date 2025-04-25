# frozen_string_literal: true

# this page is for export waste from uk page details
class AccountPage < GenericPage
  include GeneralHelpers

  TITLE = Translations.ukmv_value 'accountPage.title'
  BANNER_PART_ONE = Translations.ukmv_value 'accountPage.serviceChargeBanner.one'
  BANNER_PART_LINK = Translations.ukmv_value 'accountPage.serviceChargeBanner.link'
  BANNER_PART_TWO = Translations.ukmv_value 'accountPage.serviceChargeBanner.two'

  def check_page_displayed
    expect(self).to have_css 'h2', text: TITLE, exact_text: true
  end

  def check_payment_banner_displayed
    expect(self).to have_text BANNER_PART_ONE
    expect(self).to have_text BANNER_PART_LINK
    expect(self).to have_text BANNER_PART_TWO
  end

  def create_green_list_waste_record
    click_link('link-card-GLW')
  end

  def move_waste_in_uk_card
    click_link('link-card-UKWM')
  end

  def pay_link
    click_link BANNER_PART_LINK
  end

  def pay_header
    expect(self).to have_text 'Important'
  end
end
