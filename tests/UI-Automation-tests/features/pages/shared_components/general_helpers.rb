# frozen_string_literal: true

# Provides a way of continuing from one page to the next
module GeneralHelpers
  SAVE_AND_CONTINUE_BUTTON_TEXT ||= 'Save and continue'
  SAVE_AND_RETURN_TO_DRAFT ||= 'Save and return to draft'

  def save_and_continue
    click_on SAVE_AND_CONTINUE_BUTTON_TEXT
  end

  def save_and_return_to_draft
    click_on SAVE_AND_RETURN_TO_DRAFT
  end
end
