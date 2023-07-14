# frozen_string_literal: true

require_relative '../shared_components/general_helpers'
require_relative '../shared_components/error_box'
# this page is for Add Reference Number page details
class EnterAnEwcCodePage < GenericPage
  include GeneralHelpers
  include ErrorBox
  include PageHelper

  def check_page_displayed
    expect(self).to have_css 'h1', text: 'Enter an EWC code', exact_text: true
  end

  def select_option(dropdown_option)
    first('ewcCodes', minimum: 1).click
    find(ewc_code_options.fetch(dropdown_option)).select_option
  end

  def select_ewc_option(index)
    first('ewcCodes', minimum: 1).click
    find("ewcCodes__option--#{index}").select_option
    TestStatus.ewc_codes(find('ewcCodes').value)
  end

  def add_ewc_codes(ewc_code)
    (1..ewc_code).each do |i|
      index = rand(0..834)
      enter_an_ewc_code_page = EnterAnEwcCodePage.new
      ewc_code_list_page = EwcCodeListPage.new
      ewc_code_list_page.choose_option('Yes')
      ewc_code_list_page.save_and_continue
      enter_an_ewc_code_page.select_ewc_option index
      enter_an_ewc_code_page.save_and_continue
    end
  end

  def ewc_code_options
    {
      '010102: wastes from mineral non-metalliferous excavation' => 'ewcCodes__option--1',
      '010306: tailings other than those mentioned in 01 03 04 and 01 03 05' => 'ewcCodes__option--2',
      '010308: dusty and powdery wastes other than those mentioned in 01 03 07' => 'ewcCodes__option--3',
      '010309: red mud from alumina production other than the wastes mentioned in 01 03 10' => 'ewcCodes__option--4',
      '010399: wastes not otherwise specified' => 'ewcCodes__option--5',
      '010408: waste gravel and crushed rocks other than those mentioned in 01 04 07' => 'ewcCodes__option--6'
    }
  end

end
