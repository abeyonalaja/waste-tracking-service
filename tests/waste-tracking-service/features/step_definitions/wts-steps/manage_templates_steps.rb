Then(/^Manage your templates page is displayed with no records$/) do
  ManageTemplatesPage.new.check_empty_page_displayed
end

And(/^I verify that manage templates page is correctly translated$/) do
  ManageTemplatesPage.new.check_page_translation
end

And(/^I verify that create new record template page is correctly translated$/) do
  CreateNewRecordTemplatePage.new.check_page_translation
end

Then(/^I complete Create record template page$/) do
  CreateNewRecordTemplatePage.new.enter_template_name "#{Faker::Name.initials(number: 5)} #{Faker::Name.first_name} Template"
  CreateNewRecordTemplatePage.new.enter_description Faker::Alphanumeric.alpha(number: 100)
  CreateNewRecordTemplatePage.new.create_template_button
  expect(UpdateWithActualPage.new.success_title.text).to eq 'Success'
  expect(TemplateTaskListPage.new.find_banner_body.text).to eq "#{TestStatus.test_status(:template_name)} template has been created"
  @url = URI.parse(CreateNewRecordTemplatePage.new.current_url)
  Log.info("Template URL is: #{@url}")
end

Then(/^I verify that newly created template is on top of the table$/) do
  expect(ManageTemplatesPage.new.first_template_name.text).to eq TestStatus.test_status(:template_name)
end

And(/^I click Manage templates link$/) do
  click_link('template-tasklist-link-manage')
end

And(/^I verify Success banner with template name is displayed$/) do
  expect(TemplateTaskListPage.new.find_banner_title.text).to eq 'Success'
  expect(TemplateTaskListPage.new.find_banner_body.text).to eq "#{TestStatus.test_status(:template_name)} template has been created"
end

And(/^I fill out the name and description fields$/) do
  CreateNewRecordTemplatePage.new.enter_template_name "#{Faker::Name.first_name} Template"
  CreateNewRecordTemplatePage.new.enter_description Faker::Alphanumeric.alpha(number: 100)
end

Then(/^I verify that record is not created$/) do
  expect(ManageTemplatesPage.new.first_template_name.text).not_to eq TestStatus.test_status(:template_name)
end

And(/^I verify template task page is correctly translated$/) do
  TemplateTaskListPage.new.check_page_translation
end

And(/^I create a template with the same name as the previous one$/) do
  template_name_id = 'templateName'
  fill_in template_name_id, with: TestStatus.test_status(:template_name), visible: false
  CreateNewRecordTemplatePage.new.create_template_button
end

And(/^I complete the update template page$/) do
  UpdateTemplateNamePage.new.enter_new_template_name "#{Faker::Name.first_name} Template"
  CreateNewRecordTemplatePage.new.enter_description Faker::Alphanumeric.alpha(number: 100)
  UpdateTemplateNamePage.new.update_template_button
end

And(/^I verify update success banner is displayed$/) do
  expect(TemplateTaskListPage.new.find_banner_title.text).to eq 'Success'
  expect(UpdateTemplateNamePage.new.find_update_banner_body.text).to eq "#{TestStatus.test_status(:template_name)} template has been updated"
end

And(/^I verify that previously entered template details are pre\-populated$/) do
  expect(UpdateTemplateNamePage.new).to have_template_name TestStatus.test_status(:template_name)
  expect(UpdateTemplateNamePage.new).to have_template_description TestStatus.test_status(:template_description)
end

And(/^I click Make a copy link on the first template from the table$/) do
  ManageTemplatesPage.new.make_copy_link
end

And(/^I verify name of the new template page is correctly translated$/) do
  NameOfTheNewTemplatePage.new.check_page_translation
end

And(/^I complete the name of new template page$/) do
  NameOfTheNewTemplatePage.new.enter_copy_template_name "#{TestStatus.test_status(:template_name)} Copy"
  NameOfTheNewTemplatePage.new.enter_copy_description Faker::Lorem.paragraph
  NameOfTheNewTemplatePage.new.create_template_button
end

And(/^I verify copy success banner is correctly displayed$/) do
  expect(TemplateTaskListPage.new.find_banner_title.text).to eq 'Success'
  expect(NameOfTheNewTemplatePage.new.find_copied_banner_body.text).to eq 'Your chosen template has been copied'
end

Then(/^I verify that copy of the template is on top of the table$/) do
  expect(ManageTemplatesPage.new.first_template_name.text).to eq TestStatus.test_status(:copy_template_name)
end

And(/^I click delete link for the first template from the table$/) do
  ManageTemplatesPage.new.delete_link
end

And(/^I click confirm and continue button$/) do
  DeleteTemplatePage.new.confirm_button
end

And(/^I verify that template is not removed from the table$/) do
  expect(ManageTemplatesPage.new.first_template_name.text).to eq TestStatus.test_status(:template_name)
end

And(/^I verify success deletion banner is displayed$/) do
  expect(TemplateTaskListPage.new.find_banner_title.text).to eq 'Success'
  expect(DeleteTemplatePage.new.find_delete_banner_body.text).to eq 'The template has been deleted'
end

And(/^I verify template record is not present on the table$/) do
  expect(ManageTemplatesPage.new.first_template_name.text).not_to eq TestStatus.test_status(:template_name)
end

And(/^I click delete link from task list page$/) do
  click_link('template-tasklist-link-delete')
end

And(/^I enter template name containing invalid characters$/) do
  CreateNewRecordTemplatePage.new.enter_template_name "#{Faker::Name.name}-Template*!%#"
  CreateNewRecordTemplatePage.new.create_template_button
end

And(/^I complete the Waste code and description task$/) do
  WasteCodeController.complete
  EwcCodeController.complete
  NationalCodeController.complete
  DescribeTheWasteController.complete
end

Then(/^I verify previously selected waste code is pre\-selected$/) do
  expect(WhatIsTheWasteCodePage.new.has_waste_code?('B1010: Metal and metal-alloy wastes in metallic, non-dispersible form'))
  WhatIsTheWasteCodePage.new.save_and_continue
end

And(/^I complete the Journey of a waste section for templates$/) do
  JourneyOfAWasteTemplateController.complete
end

And(/^I complete the Waste code and description task with small waste$/) do
  WasteCodeController.complete(Translations.value 'notApplicable')
  EwcCodeController.complete
  NationalCodeController.complete
  DescribeTheWasteController.complete
end

And(/^I click Use this template to create record link$/) do
  click_link('template-tasklist-link-use')
end

And(/^I verify Unique reference page is correctly translated$/) do
  UniqueReferencePage.new.check_page_translation
end

And(/^I verify newly created record from template is on top of the table$/) do
  expect(UpdateWithActualPage.new.application_ref.text).to eq TestStatus.test_status(:unique_reference)
end

And(/^I verify important information banner is displayed$/) do
  expect(TaskListPage.new.find_important_banner.text).to eq 'Important'
  TaskListPage.new.check_template_task_list_page_translation
end

And(/^I verify update success banner is displayed with updated name$/) do
  expect(TemplateTaskListPage.new.find_banner_title.text).to eq 'Success'
  expect(UpdateTemplateNamePage.new.find_update_banner_body.text).to eq "#{TestStatus.test_status(:new_template_name)} template has been updated"
end

And(/^I complete create template from a submitted record page$/) do
  CreateTemplateFromSubmittedRecordPage.new.enter_template_name "#{Faker::Name.first_name} Template"
  CreateTemplateFromSubmittedRecordPage.new.enter_description Faker::Alphanumeric.alpha(number: 100)
  CreateTemplateFromSubmittedRecordPage.new.create_template_button
end

And(/^I verify use template to create a record page is correctly translated$/) do
  UseTemplateToCreateRecordPage.new.check_page_translation
end

Then(/^I click Use template link for the first record in the table$/) do
  click_link('template-link-use-0')
end

And(/^I click Use as template link for the first record$/) do
  click_link('create-from-record-link-0')
end

And(/^I click Create template button$/) do
  CreateNewRecordTemplatePage.new.create_template_button
end

And(/^I verify NOT IN TEMPLATE labels are present$/) do
  expect(CreateNewRecordTemplatePage.new.quantity_not_in_template.text).to eq (Translations.value 'templates.notInTemplate').upcase
  expect(CreateNewRecordTemplatePage.new.collection_not_in_template.text).to eq (Translations.value 'templates.notInTemplate').upcase
  expect(CreateNewRecordTemplatePage.new.mode_of_transport_not_in_template.text).to eq (Translations.value 'templates.notInTemplate').upcase
  expect(CreateNewRecordTemplatePage.new.transport_details_not_in_template.text).to eq (Translations.value 'templates.notInTemplate').upcase
end
