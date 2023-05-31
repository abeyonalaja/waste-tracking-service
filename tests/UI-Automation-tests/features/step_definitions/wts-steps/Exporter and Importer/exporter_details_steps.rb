And(/^I should selected address is displayed with Change address link on the page$/) do
  expect(ExporterAddressPage.new).to have_address TestStatus.test_status(:exporter_address)
  expect(page).to have_link('Change address')
end

And(/^I navigate to Exporter details page with valid postcode$/) do
  SubmitAnExportPage.new.exporter_details
  ExporterAddressPage.new.enter_postcode 'ng23lp'
  ExporterAddressPage.new.find_address
  ExporterAddressPage.new.select_first_address
  ExporterAddressPage.new.save_and_continue
end

And(/^I complete Exporter details with valid postcode$/) do
  ExporterDetailsController.complete
end

And(/^I should see Exporter Organisation name pre-populated$/) do
  expect(ExporterDetailsPage.new).to have_organisation_name TestStatus.test_status(:exporter_org_name)

end

And(/^I should see Exporter Full name name pre-populated$/) do
  expect(ExporterDetailsPage.new).to have_full_name TestStatus.test_status(:exporter_name)
end

And(/^I should see Exporter Email address pre-populated$/) do
  expect(ExporterDetailsPage.new).to have_email TestStatus.test_status(:exporter_email)
end

And(/^I should see Exporter Phone number pre-populated$/) do
  expect(ExporterDetailsPage.new).to have_phone TestStatus.test_status(:exporter_phone)
end
