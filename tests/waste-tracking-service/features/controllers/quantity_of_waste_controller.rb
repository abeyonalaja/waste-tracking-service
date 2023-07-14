# frozen_string_literal: true

# Provides a way to happy path flow
module QuantityOfWasteController
  def self.complete(option = 'Yes, I know the actual amount')
    quantity_of_waste_page = QuantityOfWastePage.new
    net_weight_page = NetWeightPage.new
    quantity_of_waste_page.choose_option option
    quantity_of_waste_page.save_and_continue
    net_weight_page.choose_option 'Weight in tonnes'
    net_weight_page.enter_weight_in_tonnes '5.25'
    net_weight_page.save_and_continue
    TestStatus.set_test_status(:quantity_of_waste_type, option)
    TestStatus.set_test_status(:weight_in_tones, 'tonnes')
    TestStatus.set_test_status(:weight_quantity_in_tones, '5.25')
    Log.info("Quantity of waste type #{option}")
    Log.info('Weight in tonnes of 5.25')
  end
end
