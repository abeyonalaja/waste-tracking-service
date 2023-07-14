# frozen_string_literal: true

# this page is for Describe waste page details
class DescribeTheWastePage < GenericPage
  include GeneralHelpers
  include ErrorBox

  DESCRIPTION = 'description'

  def check_page_displayed
    expect(self).to have_css 'h1', text: 'Describe the waste', exact_text: true
  end

  def enter_description(description)
    fill_in DESCRIPTION, with: description, visible: false
  end

  def remaining_characters
    find('description-character-remaining-text')
  end

  def check_description
    find(DESCRIPTION).text
  end
end
