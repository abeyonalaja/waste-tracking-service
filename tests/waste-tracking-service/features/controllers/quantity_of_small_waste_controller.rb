# frozen_string_literal: true

class QuantityOfSmallWasteController
  def self.complete(option = 'Yes, I know the actual amount')
    quantity_of_small_waste_page = QuantityOfSmallWastePage.new
    net_weight_page = NetWeightPage.new
    quantity_of_small_waste_page.choose_option option
    quantity_of_small_waste_page.save_and_continue
    net_weight_page.enter_weight_in_kilograms '5.25'
    net_weight_page.save_and_continue
    TestStatus.set_test_status(:quantity_of_waste_type, option)
    TestStatus.set_test_status(:weight_units, 'kilograms')
    TestStatus.set_test_status(:weight_quantity_in_kgs, '5.25')
    Log.info("Quantity of waste type #{option}")
    Log.info('Weight in kgs of 5.25')
  end
end
