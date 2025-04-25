# frozen_string_literal: true

# Provides a way to navigate through the
module UkmProducerAddressController
  def self.complete
    sleep 1
    whats_producer_address_page = WhatsProducerAddressPage.new
    whats_producer_address_page.enter_postcode 'AL3 8QE'
    whats_producer_address_page.search_postcode_button
    SelectProducerAddressPage.new.select_first_address 'producer'
    SelectProducerAddressPage.new.save_and_continue
    ConfirmProducerAddressPage.new.check_page_displayed
    ConfirmProducerAddressPage.new.use_this_button_and_continue
    ConfirmProducerAddressPage.new.wait_for_text Translations.ukmv_value 'single.producer.contactDetails.heading'
    ConfirmProducerAddressPage.new.save_and_return
  end
end
