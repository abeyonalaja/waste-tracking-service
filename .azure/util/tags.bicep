@allowed([
  'APS', 'CAT', 'DEV', 'LOG', 'MST', 'OPS', 'PRD', 'PRE', 'SEC', 'SND', 'TST'
])
@description('''
  The environment that the resource runs in, according to the naming standard,
  for example _SND_, _DEV_, _TST_ or _PRD_.
''')
param environment string = 'SND'

@minLength(3)
@maxLength(3)
@description('''
  Code that uniquely identifies the service, application or product that is
  assigned by the CSC WebOps team. The Waste Tracking Service is allocated
  _WTS_.
''')
param serviceCode string = 'WTS'

@description('Descriptive name of the service.')
param serviceName string = 'Waste Tracking Service'

@allowed([ 'LOB', 'SHARED' ])
@description('Whether the service is _line of business_ or _shared_.')
param serviceType string = 'LOB'

@minLength(8)
@maxLength(8)
@description('''
  The date and time that a resource was created in the format _YYYYMMDD_.
  
  Implementation of this attribute is awkward in that Bicep aims to provide
  a reusable template which is idempotent with respect to repeated deployment;
  it is envisaged that a baseline date can be provided for the whole deployment
  and overridden for specific resources where necessary.
''')
param createdDate string

@description('''
  The region that each resource runs in. This defaulted to the primary Azure
  region and overridden for global resources or those in a secondary region.
''')
@allowed([ 'northeurope', 'westeurope', 'uksouth', 'ukwest' ])
param location string = 'uksouth'

@description('''
  A tagging baseline to apply to Azure resources, where specific values can be
  overridden.
  
  It is envisaged that most resources will require only _Name_ and _Tier_ values
  over this baseline.
''')
output defaultTags object = {
  ServiceCode: serviceCode
  ServiceName: serviceName
  ServiceType: serviceType
  CreatedDate: createdDate
  Environment: environment
  Location: location
}
