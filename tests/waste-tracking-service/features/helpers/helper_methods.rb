# frozen_string_literal: true

# Module is for ruby methods
module HelperMethods
  def self.convert_date(date)
    Date.strptime(date, '%d %m %Y').strftime('%d %B %Y')
  end
end
