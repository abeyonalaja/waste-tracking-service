And(/^I should check exporter address is displayed with Change address link on the page$/) do
  sleep 0.5
  CheckExporterAddressPage.new.check_page_translation
  expect(CheckExporterAddressPage.new).to have_address TestStatus.test_status(:exporter_address)
  expect(CheckExporterAddressPage.new).to have_link(Translations.value('change'))
end

And(/^I navigate to Check Exporter address details page with valid postcode$/) do
  TaskListPage.new.exporter_details
  ExporterAddressPage.new.enter_postcode 'ng23lp'
  ExporterAddressPage.new.find_address
  ExporterAddressPage.new.choose_first_address
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

And(/^I enter invalid fax code$/) do
  ExporterDetailsPage.new.enter_invalid_fax '+4412 345 6789(12-34)123'
end

And(/^I enter invalid international fax code$/) do
  ExporterDetailsPage.new.enter_invalid_international_fax '+1-907-555-12(34) 1234'
end
