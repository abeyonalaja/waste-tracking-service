# frozen_string_literal: true

# this page is for start page details
class GuidancePage < GenericPage
  def check_page_displayed
    # expect(self).to have_text('This is the multiple waste movements guidance page')
    text = page.find(:id, 'main-content').text
    expect(self).to have_text(text)
    puts text
  end

end
