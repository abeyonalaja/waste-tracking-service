# frozen_string_literal: true

# Provides a way to happy path flow
module DescribeTheWasteController
  def self.complete
    describe_the_waste_page = DescribeTheWastePage.new
    description = Faker::Alphanumeric.alpha(number: 99)
    describe_the_waste_page.enter_description description
    TestStatus.set_test_status(:description_of_the_waste, description)
    Log.info("Waste describe is: #{description}")
    describe_the_waste_page.save_and_continue
  end
end
