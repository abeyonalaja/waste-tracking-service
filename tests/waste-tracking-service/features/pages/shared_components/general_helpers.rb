# frozen_string_literal: true

# Provides a way of continuing from one page to the next
module GeneralHelpers
  SAVE_AND_CONTINUE_BUTTON_TEXT ||= Translations.value 'saveButton'
  SAVE_AND_RETURN ||= Translations.value 'saveReturnButton'
  CONTINUE ||= Translations.value 'continueButton'
  FIND_ADDRESS ||= Translations.value 'postcode.findButton'
  BACK ||= Translations.value 'back'

  def save_and_continue
    click_button SAVE_AND_CONTINUE_BUTTON_TEXT
  end

  def save_and_return
    click_link SAVE_AND_RETURN
  end

  def continue
    click_button CONTINUE
  end

  def first_continue_button
    click_link(CONTINUE)
  end

  def find_address
    click_button FIND_ADDRESS
  end

  def back
    click_link BACK
  end

  def upload_file(file_type)
    raise "Unknown file type :#{file_type}." unless FileUploadHelper.file_exists?(file_type)

    file_path = FileUploadHelper.get_upload_file(file_type)
    attach_file('csvUpload', file_path)
  end
end
