Given(/^I login to waste tracking portal$/) do
  # refactor this when login page is implemented
  Log.info("Start url: #{Env.start_page_url}")
  visit(Env.start_page_url)
end

And(/^I navigate to the overview page$/) do
  click_link('Green list waste overview')
  OverviewPage.new.check_page_displayed
end

Then(/^I can see all the sections$/) do
  expect(page).to have_css 'h4', text: 'Tell us about an export', exact_text: true
  expect(page).to have_css 'h4', text: 'All exports', exact_text: true
  expect(page).to have_css 'h4', text: 'Templates', exact_text: true
end

And(/^I can see links for each sections$/) do
  expect(page).to have_link('Submit a single waste export')
  expect(page).to have_link('Submit a waste export from a template')
  expect(page).to have_link('Submit multiple exports from a CSV file')
  expect(page).to have_link('Continue a draft export')
  expect(page).to have_link('Update an export with actual details')
  expect(page).to have_link('Check all submitted exports')
  expect(page).to have_link('Create a new template')
  expect(page).to have_link('Manage your templates')
end

Then(/^Green list overview page is displayed$/) do
  OverviewPage.new.check_page_displayed
end
