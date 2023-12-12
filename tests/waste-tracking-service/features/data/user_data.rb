# frozen_string_literal: true

# Title data specification
module UserData
  @users = {
    LOCAL: {
      USER1: {
        businessName: 'WTS Testing',
        businessUnitId: '',
        userId: '655383298578',
        password: 'WasteTracking@123'
      },
      USER2: {
        businessName: 'Wts Testing',
        username: 'Wtst testing Team member',
        businessUnitId: '',
        userId: '521578352286',
        password: 'WasteTracking@123'
      },
      USER3: {
        businessName: 'Wts Testing',
        username: 'Wtst testing Team member',
        businessUnitId: '',
        userId: '316103537967',
        password: 'wordWord1234'
      },
      EMAIL_USER1: {
        businessName: '',
        businessUnitId: '',
        userId: '',
        password: ''
      }
    },
    PRE: {
      USER1: {
        businessName: 'WTS Testing',
        businessUnitId: '',
        userId: '521578352286'
      },
      USER2: {
        businessName: 'Wts Testing',
        businessUnitId: '',
        userId: '655383298578'
      },
      USER3: {
        businessName: 'Wts Testing',
        businessUnitId: '',
        userId: '233627527051'
      },
      USER4: {
        businessName: 'Wts Testing',
        businessUnitId: '',
        userId: '560132886535'
      },
      USER5: {
        businessName: 'Wts Testing',
        businessUnitId: '',
        userId: '541873557611'
      },
      EMAIL_USER1: {
        businessName: 'aabey0@hotmail.com',
        businessUnitId: '',
        userId: '148287751353'
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
