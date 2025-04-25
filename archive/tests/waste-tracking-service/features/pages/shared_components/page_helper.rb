# frozen_string_literal: true

# Provides a way of continuing from one page to the next
module PageHelper
  def choose_option(option)
    choose(option, visible: false)
  end

  def page_refresh
    page.refresh
  end
end
