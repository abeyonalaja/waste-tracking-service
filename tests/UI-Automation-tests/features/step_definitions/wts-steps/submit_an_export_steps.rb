Then(/^Submit an export page is displayed$/) do
  SubmitAnExportPage.new.check_page_displayed
end

And(/^the reference should be displayed$/) do
  pending
end

When(/^I navigate to the submit an export with reference$/) do
  click_link('Green list waste overview')
  OverviewPage.new.submit_a_single_waste_export
  AddReferenceNumberController.complete
end

Then(/^I have submission incomplete 0 of 4 sections$/) do
  expect(page).to have_text('You have completed 0 of 4 sections.')
  expect(page).to have_text("You'll be able to check and submit this export once you've completed all the sections.")
end

And(/^I see these four sections and their current statuses$/) do
  expect(page).to have_css 'h4', text: 'About the waste', exact_text: true
  expect(page).to have_css 'h4', text: 'Exporter and importer', exact_text: true
  expect(page).to have_css 'h4', text: 'Journey of waste', exact_text: true
  expect(page).to have_css 'h4', text: 'Treatment of waste', exact_text: true
end

And(/^links within each are pointing to the corresponding pages$/) do
  pending
end
