# frozen_string_literal: true

# The box with the red border (or red and yellow, depending on browser) showing error messages at the top of the page.
module ErrorBox
  ERROR_BOX_CSS_SELECTOR ||= "[class^='ErrorSummary__StyledErrorSummary-sc-d7437b']"
  # These methods need the 'has_' prefix so that RSpec can use them as matchers.
  # rubocop:disable Naming/PredicateName
  def has_error_box?(**kwargs)
    has_css? ERROR_BOX_CSS_SELECTOR, **kwargs
  end

  def has_error_message?(message)
    expect(message).to be_a String
    has_error? &&
      has_error_link?(exact_text: message)
  end

  def has_error?(**kwargs)
    has_error_box?(**kwargs) &&
      error_box.has_css?('h2', text: 'There is a problem', exact_text: true, **kwargs)
  end

  def has_error_count?(count)
    has_error_link? count: count
  end

  def has_error_link?(**kwargs)
    error_box.has_css? 'ul li a', **kwargs
  end

  # rubocop:enable Naming/PredicateName

  def error_box
    find :css, ERROR_BOX_CSS_SELECTOR
  end

end
