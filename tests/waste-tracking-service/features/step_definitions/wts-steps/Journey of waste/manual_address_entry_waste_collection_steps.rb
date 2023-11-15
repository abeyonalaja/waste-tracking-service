And(/^I complete the Manual entry address waste collection page$/) do
  ManualAddressEntryWasteCollectionPage.new.enter_address1 'Jeff street'
  ManualAddressEntryWasteCollectionPage.new.enter_address2 'Rainbow avenue'
  ManualAddressEntryWasteCollectionPage.new.enter_town 'London'
  ManualAddressEntryWasteCollectionPage.new.enter_postcode 'n1p3bp'
  TestStatus.set_test_status(:collection_address, 'Jeff street,Rainbow avenue,London,n1p3bp,England')
end

Then(/^I can see previously entered data pre\-populated on the manual address page$/) do
  expect(ManualAddressEntryWasteCollectionPage.new).to have_reference_address TestStatus.test_status(:address1)
  expect(ManualAddressEntryWasteCollectionPage.new).to have_reference_postcode TestStatus.test_status(:postcode)
  expect(ManualAddressEntryWasteCollectionPage.new).to have_reference_town TestStatus.test_status(:town)
  expect(ManualAddressEntryWasteCollectionPage.new.option_checked?('England')).to eq(true)
end

And(/^I should see Manual address page correctly translated$/) do
  ManualAddressEntryWasteCollectionPage.new.check_page_translation
end

And(/^I should see manually entered collection details pre\-populated$/) do
  expect(CheckTheCollectionAddressPage.new).to have_address TestStatus.test_status(:collection_address)
  expect(CheckTheCollectionAddressPage.new).to have_link(Translations.value('change'))
end
