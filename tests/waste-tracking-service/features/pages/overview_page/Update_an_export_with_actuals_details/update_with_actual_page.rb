# frozen_string_literal: true

# this page is for overview page details
class UpdateWithActualPage < GenericPage
  include CommonComponents

  TITLE = Translations.value 'exportJourney.updateAnnexSeven.title'
  CAPTION = Translations.value 'exportJourney.updateAnnexSeven.caption'
  PARAGRAPH = Translations.value 'exportJourney.updateAnnexSeven.paragraph'
  PARAGRAPH = Translations.value 'exportJourney.updateAnnexSeven.paragraph'
  TRANSACTION_NUMBER = Translations.value 'exportJourney.updateAnnexSeven.table.transactionNumber'
  SUBMITTED = Translations.value 'exportJourney.updateAnnexSeven.table.submitted'
  WASTE_CODE = Translations.value 'exportJourney.updateAnnexSeven.table.wasteCode'
  OWN_REFERENCE = Translations.value 'exportJourney.updateAnnexSeven.table.yourOwnReference'
  ACTIONS = Translations.value 'exportJourney.updateAnnexSeven.table.actions'
  NOT_PROVIDED = Translations.value 'exportJourney.updateAnnexSeven.notProvided'
  NO_EXPORTS_FOR_UPDATE = Translations.value 'exportJourney.updateAnnexSeven.notResultsMessage'

  def check_page_displayed
    expect(self).to have_css 'h1', text: TITLE, exact_text: true
  end

  def check_page_displayed_no_exports
    expect(self).to have_text NO_EXPORTS_FOR_UPDATE
    expect(self).to have_text PARAGRAPH
  end

  def check_translation
    # expect(self).to have_text CAPTION
    expect(self).to have_text PARAGRAPH
    expect(self).to have_text TRANSACTION_NUMBER
    expect(self).to have_text SUBMITTED
    expect(self).to have_text WASTE_CODE
    expect(self).to have_text OWN_REFERENCE
    expect(self).to have_text ACTIONS
  end

  def submit_a_single_waste_export
    click_link('Submit a single waste export')
  end

  def first_update_link
    find('update-0').click
  end

  def update_quantity_of_waste
    find('update-estimated-quantity').click
  end

  def expand_about_waste
    find('check-answers-section-about-waste-heading-text').click
  end

  def success_title
    find('govuk-notification-banner-title')
  end

  def success_body
    find('update-banner-success_body')
  end

  def transaction_id
    find 'transaction-id'
  end

  def second_update_link
    find('collection-date-update').click
  end

  def first_cancel_link
    find('cancel-link-0').click
  end

  def cancel_notification
    find('cancel-success-banner_body').text
  end

  def update_reason(reason)
    fill_in 'reason', with: reason, visible: false
    TestStatus.set_test_status(:export_cancel_reason, reason)
  end

end
