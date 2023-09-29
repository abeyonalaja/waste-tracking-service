# frozen_string_literal: true

# this is for logging
module Log
  @logger = Logger.new(STDOUT)

  COLOR_ESCAPES = {
    :none => 0,
    :bright => 1,
    :black => 30,
    :red => 31,
    :green => 32,
    :yellow => 33,
    :blue => 34,
    :magenta => 35,
    :cyan => 36,
    :white => 37,
    :default => 39,
  }

  def self.c(clr, text = nil)
    "\x1B[" + (COLOR_ESCAPES[clr] || 0).to_s + 'm' + (text ? text + "\x1B[0m" : "")
  end

  def self.bc(clr, text = nil)
    "\x1B[" + ((COLOR_ESCAPES[clr] || 0) + 10).to_s + 'm' + (text ? text + "\x1B[0m" : "")
  end

  def self.info(message)
    @logger.info(c(:green, message))
  end

  def self.warn(message)
    @logger.warn(c(:yellow, message))
  end

  def self.console(message)
    puts(message)
  end
end
