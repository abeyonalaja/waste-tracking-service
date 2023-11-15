Given(/^I login to waste tracking portal$/) do
  # refactor this when login page is implemented
  Log.info("Start url: #{Env.start_page_url}")
  TestStatus.set_test_status('Start url', Env.start_page_url)
  visit(Env.start_page_url)
  ViewCookiesPage.new.reject_analytics_cookies_button if @reset_cookies == true
end

And(/^I navigate to the overview page$/) do
  click_link('dashboard_link')
end

Then(/^I can see all the sections$/) do
  expect(page).to have_css 'h2', text: Translations.value('exportJourney.submitAnExport.title'), exact_text: true
  expect(page).to have_css 'h2', text: Translations.value('exportJourney.exportHome.card.update'), exact_text: true
  expect(page).to have_css 'h2', text: Translations.value('exportJourney.exportHome.card.submitted'), exact_text: true
  expect(page).to have_css 'h2', text: Translations.value('exportJourney.exportHome.card.templates'), exact_text: true
end

And(/^I can see links for each sections$/) do
  expect(page).to have_link Translations.value('exportJourney.submitAnExport.title')
  expect(page).to have_link Translations.value('exportJourney.incompleteAnnexSeven.title')
  expect(page).to have_link Translations.value 'exportJourney.exportSubmitted.updateAnnexRecordWithActuals'
  expect(page).to have_link Translations.value 'exportJourney.exportSubmitted.viewSubmittedRecords'
end

Then(/^Export waste from UK page is displayed$/) do
  ExportWasteFromUkPage.new.check_page_displayed
end
