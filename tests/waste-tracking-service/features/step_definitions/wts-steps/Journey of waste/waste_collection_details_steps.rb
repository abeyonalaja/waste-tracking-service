And(/^I should see Waste collection details page correctly translated$/) do
  WasteCollectionDetailsPage.new.check_page_displayed
  WasteCollectionDetailsPage.new.check_translation
end
