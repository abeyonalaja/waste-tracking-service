# frozen_string_literal: true

# this page is for view cookies page details
class ViewCookiesPage < GenericPage

  TITLE = Translations.value 'cookie.page.title'
  PARAGRAPH1 = Translations.value 'cookie.page.p1'
  PARAGRAPH2 = Translations.value 'cookie.page.p2'
  PARAGRAPH3 = Translations.value 'cookie.page.p3'
  CHANGE_YOUR_COOKIES_SETTINGS = Translations.value 'cookie.page.essentialHeading'
  ANALYTICS_HEADING = Translations.value 'cookie.page.analytics.heading'
  ANALYTICS_COOKIES = Translations.value 'cookie.page.changeSettings'
  ACCEPT_ANALYTICAL_BUTTON = Translations.value 'cookie.banner.button.accept'
  REJECT_ANALYTICAL_BUTTON = Translations.value 'cookie.banner.button.reject'
  HIDE_COOKIES_MESSAGE_BUTTON = Translations.value 'cookie.banner.button.hide'
  def check_page_displayed
    expect(self).to have_css 'h1', text: TITLE, exact_text: true
  end

  def check_page_translation
    expect(self).to have_text PARAGRAPH1
    expect(self).to have_text PARAGRAPH2
    expect(self).to have_text PARAGRAPH3
    expect(self).to have_text CHANGE_YOUR_COOKIES_SETTINGS
    expect(self).to have_text ANALYTICS_HEADING
    expect(self).to have_text ANALYTICS_COOKIES
  end

  def find_banner_title
    find('cookie-banner-heading')
  end

  def find_banner_first_paragraph
    find('cookie-banner-p1')
  end

  def find_banner_second_paragraph
    find('cookie-banner-p2')
  end

  def find_accept_cookies_message
    find('cookie-banner-confirmation-approved')
  end

  def find_reject_cookies_message
    find('cookie-banner-confirmation-rejected')
  end

  def accept_analytics_cookies_button
    click_button ACCEPT_ANALYTICAL_BUTTON
  end

  def reject_analytics_cookies_button
    click_button REJECT_ANALYTICAL_BUTTON
  end

  def hide_cookies_message_button
    click_button HIDE_COOKIES_MESSAGE_BUTTON
  end
end
