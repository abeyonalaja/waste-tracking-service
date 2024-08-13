# frozen_string_literal: true

# this page is for Gov pay Enter Payment Details Page details
class EnterPaymentDetailsPage < GenericPage
  include ErrorBox

  TITLE = 'Enter payment details'

  def check_page_displayed
    expect(page).to have_title(TITLE)
  end

  def fill_in_payment_description(description)
    fill_in 'payment-description', with: description
  end

  def fill_in_payment_summary_breakdown_amount(amount)
    fill_in 'payment-summary-breakdown-amount', with: amount
  end

  def fill_in_payment_summary_corporate_card_fee(fee)
    fill_in 'payment-summary-corporate-card-fee', with: fee
  end

  def fill_in_amount(amount)
    fill_in 'amount', with: amount
  end

  def fill_in_card_number(card_number)
    fill_in 'card-no', with: card_number
  end

  def fill_in_expiry_month(month)
    fill_in 'expiry-month', with: month
  end

  def fill_in_expiry_year(year)
    fill_in 'expiry-year', with: year
  end

  def fill_in_cardholder_name(name)
    fill_in 'cardholder-name', with: name
  end

  def fill_in_cvc(cvc)
    fill_in 'cvc', with: cvc
  end

  def fill_in_address_line_1(address_line_1)
    fill_in 'address-line-1', with: address_line_1
  end

  def fill_in_address_line_2(address_line_2)
    fill_in 'address-line-2', with: address_line_2
  end

  def fill_in_city(city)
    fill_in 'address-city', with: city
  end

  def fill_in_country(country)
    fill_in 'address-country', with: country
  end

  def fill_in_postcode(postcode)
    fill_in 'address-postcode', with: postcode
  end

  def fill_in_email(email)
    fill_in 'email', with: email
  end

  def submit_card_details
    click_button 'submit-card-details'
  end

  def cancel_payment
    find('cancel-payment').click
  end

  def redirect_url
    find('return-url').click
  end

end
