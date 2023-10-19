# frozen_string_literal: true

# Module is for ruby methods
module HelperMethods
  def self.convert_date(date)
    Date.strptime(date, '%d %m %Y').strftime('%-d %B %Y')
  end

  def self.convert_date_to_short_month(date)
    Date.strptime(date, '%d %m %Y').strftime('%-d %b %Y')
  end

  def self.current_date_format(date)
    current_date = date
    day = current_date.day
    month_name = current_date.strftime("%b")
    year = current_date.year

    "#{day} #{month_name} #{year}"
  end

  def self.ordinal_indicator(number)
    case number % 100
    when 11, 12, 13 then 'th'
    else
      case number % 10
      when 1 then 'st'
      when 2 then 'nd'
      when 3 then 'rd'
      else 'th'
      end
    end
  end

  def self.address(address)
    parts = address.split(', ')
    country = parts.pop
    remaining_data = parts.join(', ')

    [country, remaining_data]
  end
end
