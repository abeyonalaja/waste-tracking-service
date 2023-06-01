# frozen_string_literal: true

# Provides a way to happy path flow
module ExporterDetailsController
  def self.complete(_postcode: true)
    submit_an_export_page = SubmitAnExportPage.new
    submit_an_export_page.exporter_details
    exporter_address_page = ExporterAddressPage.new
    if _postcode
      postcode = 'ng23lq'
      exporter_address_page.enter_postcode postcode
      TestStatus.set_test_status(:exporter_post_code, postcode)
      exporter_address_page.find_address
      exporter_address_page.select_first_address
      exporter_address_page.save_and_continue
    else
      exporter_address_page.enter_address_manually
      # need to enter manual details
    end
    exporter_details_page = ExporterDetailsPage.new
    org_name = Faker::Company.name
    exporter_name = Faker::Name.name
    email = Faker::Internet.email
    exporter_phone = '08001234567'
    exporter_details_page.enter_organisation_name org_name
    exporter_details_page.enter_exporter_full_name exporter_name
    exporter_details_page.enter_exporter_email email
    exporter_details_page.exporter_phone_num exporter_phone

    TestStatus.set_test_status(:exporter_org_name, org_name)
    TestStatus.set_test_status(:exporter_name, exporter_name)
    TestStatus.set_test_status(:exporter_email, email)
    TestStatus.set_test_status(:exporter_phone, exporter_phone)
    exporter_details_page.save_and_continue
  end

end
