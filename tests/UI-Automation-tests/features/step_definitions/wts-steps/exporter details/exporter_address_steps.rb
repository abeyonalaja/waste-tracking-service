And(/^I should see Exporter details page correctly translated$/) do
  ExporterAddressPage.new.check_page_translation
end

And(/^I should see exporter postcode page is correctly translated$/) do
  ExporterAddressPage.new.check_postcode_translation
end
