Given(/^I login to waste tracking portal$/) do
  # refactor this when login page is implemented
  Log.info("Start url: #{Env.start_page_url}")
  TestStatus.set_test_status('Start url', Env.start_page_url)
  visit(Env.start_page_url)
end

And(/^I navigate to the overview page$/) do
  click_link('dashboard_link')
end

Then(/^I can see all the sections$/) do
  expect(page).to have_css 'h2', text: 'Create a new Annex VII record', exact_text: true
  expect(page).to have_css 'h2', text: 'Update an Annex VII record', exact_text: true
  expect(page).to have_css 'h2', text: 'Submitted Annex VII records', exact_text: true
  # expect(page).to have_css 'h2', text: 'Templates', exact_text: true
end

And(/^I can see links for each sections$/) do
  expect(page).to have_link('Create a single Annex VII record')
  expect(page).to have_link('Manage incomplete Annex VII records')
  expect(page).to have_link('Update an Annex VII record with actual details')
  expect(page).to have_link('View all submitted Annex VII records')
end

Then(/^Export waste from UK page is displayed$/) do
  ExportWasteFromUkPage.new.check_page_displayed
end

