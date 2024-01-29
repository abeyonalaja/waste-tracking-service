# frozen_string_literal: true

# Title data specification
module UserData
  @users = {
    LOCAL: {
      USER1: {
        businessName: 'API Testing',
        businessUnitId: '',
        userId: '994750711256'
      }
    },
    DEV: {
      USER1: {
        businessName: 'API DEV TESTING',
        businessUnitId: '',
        userId: '774111327930'
      }
    },
    TST: {
      USER1: {
        businessName: 'API TST TESTING',
        businessUnitId: '',
        userId: '167823949853'
      }
    },
    PRE: {
      USER1: {
        businessName: 'PRE API Testing',
        businessUnitId: '',
        userId: '122023713593'
      }
    }
  }

  @email_lists = {
    LOCAL: {
      EMAIL_USER1: '{ "groupEmail":"group@defra.gov.uk",
             "businessUnitEmail":"user@business.com",
             "personalEmail":"user@persoanl.com" }'
    },
    DEV: {
      EMAIL_USER1: '{ "groupEmail":"group2@defra.gov.uk",
         "businessUnitEmail":"corres@business.com",
         "personalEmail":"cmuser1@persoanl.com"}'
    }
  }

  def self.email_address_list(user)
    @email_lists.fetch(Env.test_env.to_sym).fetch(user)
  end

  def self.users
    @users.fetch(Env.test_env.to_sym)
  end
end
