# frozen_string_literal: true

# this page is for update annex record page details
class UpdateAnnexRecordPage < GenericPage
  include CommonComponents

  TITLE = Translations.value 'exportJourney.updateAnnexSeven.title'
  WARNING = Translations.value 'exportJourney.updateActual.warning'
  RETURN_TO_ALL_EXPORTS = Translations.value 'exportJourney.submittedView.button'

  def check_page_displayed
    expect(self).to have_css 'h1', text: TITLE, exact_text: true
  end

  def check_translation
    expect(self).to have_text WARNING
  end

  def no_estimate_warning_message
    expect(self).to have_no_text WARNING
  end

  def return_to_all_exports_button
    click_button RETURN_TO_ALL_EXPORTS
  end

  def waste_quantity_label
    find('check-answers-section-about-waste-tag-update-needed').text
  end

  def collection_date_label
    find('check-answers-section-journey-tag-update-needed').text
  end
end
