# frozen_string_literal: true

And(/^I see Shutter '404' page correctly translated$/) do
  ShutterPage.new.check_page_displayed_404
  ShutterPage.new.check_translation_404
end

And(/^I see Shutter '500' page correctly translated$/) do
  ShutterPage.new.check_page_displayed_500
  ShutterPage.new.check_translation_500
end

Given(/^I login to waste tracking portal with link which leads to shutter page "([^"]*)"$/) do |page_code|
  visit(Env.start_shutter_pages_url(page_code))
end

Then(/^Shutter page (\d+) is displayed$/) do |arg|
  ShutterPage.new.check_page_displayed_404
end
