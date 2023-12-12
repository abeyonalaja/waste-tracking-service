# frozen_string_literal: true

# this page is for overview page details
class OverviewPage < GenericPage

  USER_NAME_INPUT_ID = 'user_id'
  PASSWORD_INPUT_ID = 'password'
  SUBMIT_BUTTON = 'continue'

  def check_page_displayed
    expect(self).to have_css 'h1', text: 'Green list waste overview', exact_text: true
  end

  def submit_a_single_waste_export
    click_link('Submit a single waste export')
  end

  def sign_in_or_create_an_account
    click_button 'Sign in or create an account'
  end

  def sign_in(username, password)
    expect(self).to have_css 'h1', text: 'Sign in using Government Gateway', exact_text: true
    fill_in USER_NAME_INPUT_ID, with: username, visible: false
    fill_in PASSWORD_INPUT_ID, with: password, visible: false
    click_button SUBMIT_BUTTON
  end

  def login_to_DCID(user)
    TestStatus.set_test_status(:current_user, user.to_sym)
    OverviewPage.new.sign_in_or_create_an_account
    HelperMethods.wait_for_a_sec
    case Env.test_env
    when 'LOCAL'
      OverviewPage.new.sign_in(TestData::Users.user_name(user.to_sym), TestData::Users.user_password(user.to_sym))
    when 'DEV', 'TST', 'PRE'
      OverviewPage.new.sign_in(TestData::Users.user_name(user.to_sym), TestData::Users.user_password(user.to_sym))
    else
      raise "#{Env.test_env} is an unknown environment, Please provide the correct env details"
    end
    HelperMethods.wait_for_a_sec
  end

end
