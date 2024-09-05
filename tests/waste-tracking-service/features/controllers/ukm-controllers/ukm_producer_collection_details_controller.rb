# frozen_string_literal: true

# Provides a way to happy path flow
module UkmProducerCollectionDetailsController
  def self.complete
    whats_producer_address_page = WhatsProducerAddressPage.new
    select_address_page = SelectProducerAddressPage.new
    confirm_address_page = ConfirmProducerAddressPage.new
    sic_code_page = SicCodePage.new
    source_of_waste_page = SourceOfTheWastePage.new
    use_producer_address_page = DoYouWantToUseProducerAddressPage.new
    confirm_waste_collection_address_page = ConfirmWasteCollectionAddressPage.new
    producer_contact_details_page = ProducerContactDetailsPage.new


    whats_producer_address_page.enter_postcode 'AL3 8QE'
    whats_producer_address_page.search_postcode_button

    select_address_page.select_first_address 'producer'
    select_address_page.save_and_continue
    confirm_address_page.use_this_button_and_continue

    UkmProducerContactDetailsController.complete
    producer_contact_details_page.save_and_continue

  end
end
