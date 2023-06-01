# frozen_string_literal: true

LOCAL = { submissions: 'http://localhost:3000' }.freeze

# Methods relating to the env details
class Env
  def self.service
    LOCAL.fetch(:submissions)
  end

end
