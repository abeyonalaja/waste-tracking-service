Given(/^I login to waste tracking portal$/) do
  Log.info("Start url: #{Env.start_page_url}")
  TestStatus.set_test_status('Test ENV', Env.test_env)
  TestStatus.set_test_status('Start url', Env.start_page_url)
  visit(Env.start_page_url)
  click_link('Start now')
  HelperMethods.wait_for_a_sec
  user = "USER#{@current_process}"
  OverviewPage.new.login_to_dcid(user)
  WasteTrackingLandingPage.new.check_page_displayed
  WasteTrackingLandingPage.new.create_green_list_waste_record
  ExportWasteFromUkPage.new.check_page_displayed
  ViewCookiesPage.new.reject_analytics_cookies_button if @reset_cookies == true
  set_feature_cookies
end

Then(/^I can see all the sections$/) do
  expect(page).to have_css 'h2', text: Translations.value('exportJourney.exportHome.card.createRecord'), exact_text: true
  expect(page).to have_css 'h2', text: Translations.value('exportJourney.exportHome.card.update'), exact_text: true
  expect(page).to have_css 'h2', text: Translations.value('exportJourney.exportHome.card.submitted'), exact_text: true
  expect(page).to have_css 'h2', text: Translations.value('exportJourney.exportHome.card.templates'), exact_text: true
  expect(page).to have_css 'h2', text: Translations.value('export.homepage.multiples.guidance.title'), exact_text: true

end

And(/^I can see links for each sections$/) do
  expect(page).to have_link Translations.value('exportJourney.submitAnExport.title')
  # expect(page).to have_text Translations.value('exportJourney.incompleteAnnexSeven.title')
  expect(page).to have_link(href: '/export/incomplete')
  expect(page).to have_link Translations.value 'exportJourney.exportSubmitted.updateAnnexRecordWithActuals'
  expect(page).to have_link Translations.value 'exportJourney.exportSubmitted.viewSubmittedRecords'
end

Then(/^Export waste from UK page is displayed$/) do
  ExportWasteFromUkPage.new.check_page_displayed
end

def set_feature_cookies
  TestStatus.feature_flag&.each do |feature, value|
    add_custom_cookie(feature, value)
  end
end

def add_custom_cookie(key, value)
  browser = page.driver.browser
  browser.manage.add_cookie name: key, value: value
end

When(/^I click the incomplete records link$/) do
  click_link(href: '/export-annex-VII-waste/incomplete')
end

And(/^I click the submitted with actual links$/) do
  click_link(href: '/export-annex-VII-waste/submitted')
end

And(/^I click the submitted with estimated links$/) do
  click_link(href: '/export-annex-VII-waste/estimated')
end

And(/^I click Manage your Annex VII record templates link$/) do
  click_link(href: '/export-annex-VII-waste/templates')
end
