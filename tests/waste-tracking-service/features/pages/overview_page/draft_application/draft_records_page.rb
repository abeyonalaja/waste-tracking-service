# frozen_string_literal: true

# this page is for overview page details
class DraftRecordsPage < GenericPage
  include GeneralHelpers
  include ErrorBox
  include CommonComponents

  TITLE = Translations.value 'exportJourney.incompleteAnnexSeven.title'
  CAPTION = Translations.value 'exportJourney.incompleteAnnexSeven.paragraph'
  YOUR_OWN_REF = Translations.value 'exportJourney.updateAnnexSeven.table.yourOwnReference'
  LAST_SAVED = Translations.value 'exportJourney.incompleteAnnexSeven.table.date'
  WASTE_CODE = Translations.value 'exportJourney.updateAnnexSeven.table.wasteCode'
  ACTIONS = Translations.value 'exportJourney.updateAnnexSeven.table.actions'
  SUCCESS_MESSAGE = Translations.value 'exportJourney.incompleteAnnexSeven.delete.notification'

  #bread crumbs
  # bug raised need to be checked after fix
  APP_TITLE = Translations.value 'app.title'
  PARENT_APP_TITLE = Translations.value 'app.parentTitle'

  def check_page_displayed
    expect(self).to have_css 'h1', text: TITLE, exact_text: true
  end

  def check_page_translation
    expect(self).to have_text CAPTION
    expect(self).to have_text YOUR_OWN_REF
    expect(self).to have_text LAST_SAVED
    expect(self).to have_text WASTE_CODE
    expect(self).to have_text ACTIONS
    expect(self).to have_text PARENT_APP_TITLE
    expect(self).to have_text APP_TITLE
  end

  def click_first_delete_link
    click_link('delete-link-0')
  end

  def your_own_reference
    find('your-reference-0').text
  end

  def delete_notification
    find('delete-success-banner_body').text
  end

end
