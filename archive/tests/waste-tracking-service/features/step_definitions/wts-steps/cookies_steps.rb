And(/^I verify Cookies page is correctly translated$/) do
  ViewCookiesPage.new.check_page_translation
end

Then(/^I verify Cookie banner is displayed$/) do
  expect(ViewCookiesPage.new.find_banner_title.text).to eq Translations.value 'cookie.banner.title'
  expect(ViewCookiesPage.new.find_banner_first_paragraph.text).to eq Translations.value 'cookie.banner.p1'
  expect(ViewCookiesPage.new.find_banner_second_paragraph.text).to eq Translations.value 'cookie.banner.p2'
end

Then(/^I click Accept analytics cookies button$/) do
  ViewCookiesPage.new.accept_analytics_cookies_button
end

Then(/^Message for accepted cookies is displayed$/) do
  expect(ViewCookiesPage.new.find_accept_cookies_message.text).to eq Translations.value('cookie.banner.confirmation_accepted').gsub(/<.*?>/, '')
end

And(/^I click Reject analytics cookies button$/) do
  ViewCookiesPage.new.reject_analytics_cookies_button
end

Then(/^Message for rejected cookies is displayed$/) do
  expect(ViewCookiesPage.new.find_reject_cookies_message.text).to eq Translations.value('cookie.banner.confirmation_rejected').gsub(/<.*?>/, '')
end

And(/^I click Hide cookies message button$/) do
  ViewCookiesPage.new.hide_cookies_message_button
end

Then(/^I verify Cookie banner is not visible$/) do
  page.should have_no_selector(:id, 'cookie-banner-heading')
end
