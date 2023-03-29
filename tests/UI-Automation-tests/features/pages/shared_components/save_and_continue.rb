# frozen_string_literal: true

# Provides a way of continuing from one page to the next
module SaveAndContinue
  SAVE_AND_CONTINUE_BUTTON_TEXT ||= 'Save and continue'

  def save_and_continue
    click_on SAVE_AND_CONTINUE_BUTTON_TEXT
  end
end
