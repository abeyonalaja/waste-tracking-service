# frozen_string_literal: true

# this page is for Gov Pay Confirm your payment page details
class ConfirmYourPaymentPage < GenericPage

  TITLE = 'Confirm your payment'

  def check_page_displayed
    expect(self).to have_css 'h1', text: TITLE, exact_text: true
  end

  def payment_description
    find('#payment-description').text
  end

  def total_amount
    find('#amount').text
  end

  def card_number
    find('#card-number').text
  end

  def expiry_date
    find('#expiry-date').text
  end

  def cardholder_name
    find('#cardholder-name').text
  end

  def billing_address
    find('#address').text
  end

  def email
    find('#email').text
  end

  def confirm_payment
    click_button 'confirm'
  end

  def cancel_payment
    find('input#cancel-payment').click
  end

end
