# frozen_string_literal: true

# Provides a way to happy path flow
module LaboratoryAddressController
  def self.complete
    laboratory_address_page = LaboratoryAddressPage.new
    laboratory_address_page.enter_name 'laboratory_address'
    laboratory_address_page.enter_address 'laboratory_address'
    laboratory_address_page.select_laboratory_country
    laboratory_address_page.save_and_continue
    sleep 1
  end
end
