And(/^I can see page translated correctly for bulk waste$/) do
  SignDeclarationPage.new.check_page_translation_bulk
end

And(/^I click confirm and submit button$/) do
  SignDeclarationPage.new.confirm_submit_button
end

Then(/^Export submitted page displayed$/) do
  ExportSubmissionConfirmationPage.new.check_page_displayed
  TestStatus.set_test_status(:export_transaction_number, ExportSubmissionConfirmationPage.new.transaction_number.text)
  Log.info "Export transaction number is #{ExportSubmissionConfirmationPage.new.transaction_number.text}"
end

And(/^I can see page translated correctly for small waste$/) do
  SignDeclarationPage.new.check_page_translation_small
end

When(/^I navigate to the export PDF$/) do
  Log.info("export PDF url #{Env.export_pdf_url(TestStatus.test_status(:export_id))}")
  visit(Env.export_pdf_url(TestStatus.test_status(:export_id)))
  switch_to_window(windows.last)
end

Then(/^I should see pdf header details correctly loaded$/) do
  expect(SignDeclarationPage.new.pdf_title.text).to eq('ANNEX VII')
  expect(SignDeclarationPage.new.pdf_intro.text).to eq("INFORMATION ACCOMPANYING SHIPMENTS OF WASTE\nAS REFERRED TO IN ARTICLE 3 (2) AND (4)")
end

And(/^I should see section 1 exporter details correctly displayed$/) do
  within 'pdf-box-1' do
    expect(SignDeclarationPage.new).to have_text TestStatus.test_status(:exporter_org_name)
    # expect(SignDeclarationPage.new).to have_text TestStatus.test_status(:waste_collection_address)
    expect(SignDeclarationPage.new).to have_text TestStatus.test_status(:exporter_name)
    expect(SignDeclarationPage.new).to have_text TestStatus.test_status(:exporter_phone)
    expect(SignDeclarationPage.new).to have_text TestStatus.test_status(:exporter_email)
  end

end

And(/^I should see section 2 importer details correctly displayed$/) do
  within 'pdf-box-2' do
    expect(SignDeclarationPage.new).to have_text TestStatus.test_status(:importer_org_name)
    # expect(SignDeclarationPage.new).to have_text TestStatus.test_status(:waste_collection_address)
    expect(SignDeclarationPage.new).to have_text TestStatus.test_status(:importer_address)
    expect(SignDeclarationPage.new).to have_text TestStatus.test_status(:importer_org_contact)
    expect(SignDeclarationPage.new).to have_text TestStatus.test_status(:importer_phone_number)
    expect(SignDeclarationPage.new).to have_text TestStatus.test_status(:importer_fax_number)
    expect(SignDeclarationPage.new).to have_text TestStatus.test_status(:importer_email)
  end

end

And(/^I should see section 3 actual quantity details correctly displayed$/) do
  within 'pdf-box-3' do
    expect(SignDeclarationPage.new).to have_text TestStatus.test_status(:weight_in_kilograms)
  end
end

And(/^I should see section 4 actual collection date correctly displayed$/) do
  within 'pdf-box-4' do
    collection_date = TestStatus.test_status(:actual_collection_date)
    date_object = Date.parse(collection_date, '%d %m %Y')
    formatted_date = date_object.strftime('%e %B %Y')
    expect(SignDeclarationPage.new).to have_text formatted_date
  end
end

And(/^I should see section 5 first waste carrier details correctly displayed$/) do
  within 'pdf-box-5a' do
    expect(SignDeclarationPage.new).to have_text TestStatus.test_status(:waste_carrier_org_name)
    # expect(SignDeclarationPage.new).to have_text TestStatus.test_status(:waste_carrier_address)
    expect(SignDeclarationPage.new).to have_text TestStatus.test_status(:waste_carrier_org_contact)
    expect(SignDeclarationPage.new).to have_text TestStatus.test_status(:waste_carrier_phone_number)
    expect(SignDeclarationPage.new).to have_text TestStatus.test_status(:waste_carrier_email)
  end
end

And(/^I should see section 6 waste generate details correctly displayed$/) do
  within 'pdf-box-6' do
    expect(SignDeclarationPage.new).to have_text TestStatus.test_status(:waste_contact_organisation_name)
    expect(SignDeclarationPage.new).to have_text TestStatus.test_status(:waste_contact_full_name)
    expect(SignDeclarationPage.new).to have_text TestStatus.test_status(:waste_collection_address)
    expect(SignDeclarationPage.new).to have_text TestStatus.test_status(:waste_contact_phone_number)
    expect(SignDeclarationPage.new).to have_text TestStatus.test_status(:waste_contact_email)
  end
end

And(/^I should see section 7 laboratory details correctly displayed$/) do
  within 'pdf-box-7' do
    expect(SignDeclarationPage.new).to have_text '7. Laboratory'
    expect(SignDeclarationPage.new).to have_text TestStatus.test_status(:laboratory_address_name)
    expect(SignDeclarationPage.new).to have_text TestStatus.test_status(:laboratory_address_address)
    expect(SignDeclarationPage.new).to have_text TestStatus.test_status(:laboratory_contact_details_full_name)
    expect(SignDeclarationPage.new).to have_text TestStatus.test_status(:laboratory_contact_details_email)
    expect(SignDeclarationPage.new).to have_text TestStatus.test_status(:laboratory_contact_details_phone_number)
    expect(SignDeclarationPage.new).to have_text TestStatus.test_status(:laboratory_contact_details_fax_number)
  end
end

And(/^I should see section 9 waste description details correctly displayed$/) do
  within 'pdf-box-9' do
    expect(SignDeclarationPage.new).to have_text TestStatus.test_status(:description_of_the_waste)
  end
end

And(/^I should see section 10 waste identification details correctly displayed$/) do
  within 'pdf-box-10' do
    # expect(SignDeclarationPage.new).to have_text TestStatus.test_status(:waste_code)
    expect(SignDeclarationPage.new).to have_text '01 01 0'
    expect(SignDeclarationPage.new).to have_text TestStatus.test_status(:national_code_text)
  end
end

And(/^I should see section 11 countries details correctly displayed$/) do
  within 'pdf-box-11' do
    expect(SignDeclarationPage.new).to have_text TestStatus.test_status(:exporter_country)
    expect(SignDeclarationPage.new).to have_text TestStatus.countries_list[0]
    expect(SignDeclarationPage.new).to have_text TestStatus.test_status(:importer_country)
  end
end

And(/^I should see section 7 recovery facility details correctly displayed$/) do
  within 'pdf-box-7' do
    expect(SignDeclarationPage.new).to have_text '7. Recovery facility'
    expect(SignDeclarationPage.new).to have_text TestStatus.test_status(:recovery_facility_name)
    expect(SignDeclarationPage.new).to have_text TestStatus.test_status(:recovery_facility_address)
    expect(SignDeclarationPage.new).to have_text TestStatus.test_status(:recovery_facility_full_name)
    expect(SignDeclarationPage.new).to have_text TestStatus.test_status(:recovery_facility_email)
    expect(SignDeclarationPage.new).to have_text TestStatus.test_status(:recovery_facility_phone_number)
    expect(SignDeclarationPage.new).to have_text TestStatus.test_status(:laboratory_contact_details_fax_number)
  end
end

And(/^I should see section 8 small waste recovery details correctly displayed$/) do
  within 'pdf-box-8' do
    expect(SignDeclarationPage.new).to have_text 'Disposal Code: D1'
  end
end

And(/^I should see section 8 bulk waste recovery details correctly displayed$/) do
  within 'pdf-box-8' do
    expect(SignDeclarationPage.new).to have_text 'R12(Interim-site), R1'
  end
end

And(/^I should see section interim site details correctly displayed$/) do
  within 'pdf-box-7-int' do
    expect(SignDeclarationPage.new).to have_text 'Interim site:'
    expect(SignDeclarationPage.new).to have_text TestStatus.test_status(:interim_site_name_name)
    expect(SignDeclarationPage.new).to have_text TestStatus.test_status(:interim_site_name_address)
    expect(SignDeclarationPage.new).to have_text TestStatus.test_status(:interim_site_contact_name_full_name)
    expect(SignDeclarationPage.new).to have_text TestStatus.test_status(:interim_site_contact_name_email)
    expect(SignDeclarationPage.new).to have_text TestStatus.test_status(:interim_site_contact_name_phone_number)
  end
end

And(/^I should see export submitted page is correctly translated$/) do
  ExportSubmissionConfirmationPage.new.check_page_translation
end

Then(/^I should see export submitted page with estimates correctly translated$/) do
  ExportSubmissionConfirmationPage.new.check_page_translation_estimates
end

