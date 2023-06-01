# frozen_string_literal: true

# Provides a way of continuing from one page to the next
module PageHelper
  def choose_option(option)
    choose(option, visible: false)
  end

end
