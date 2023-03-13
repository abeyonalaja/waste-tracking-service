import styled from 'styled-components'
import '../../i18n/config';
import { useTranslation } from 'react-i18next';
import {

    Breadcrumbs,
    Radio,
    Main,
    InsetText,
    Label,
    LabelText,
    HintText,
    Heading,
    Button,
    FormGroup,
    GridRow,
    GridCol,
    Input
    
  } from "govuk-react";
import {CompleteHeader} from '../../components/CompleteHeader'
import {CompleteFooter} from '../../components/CompleteFooter'
  

  const InsetTextStyled = styled(InsetText)`
  margin-left: 17px;
  border-left: 4px solid #b1b4b6;
    @media only screen and (min-width: 641px)
        {
            margin-top: 0;
            margin-bottom: 10px;
        }
`;

const InputFieldStyled = styled(Input)`

@media only screen and (min-width: 641px)
{
    width: 50%;
}
`;
  
  export function YourReference() {

    const { t } = useTranslation();

    return (
      
<div>

<CompleteHeader />
<Main>
    
    <Breadcrumbs>
      <Breadcrumbs.Link href="/">
      {t('app.title')}
      </Breadcrumbs.Link>
      <Breadcrumbs.Link href="/green-list-waste-overview">
      {t('app.channel.title')}
      </Breadcrumbs.Link>
      {t('yourReference.breadcrumb')}
    </Breadcrumbs>
  
    
  </Main>
    <Main>


    <GridRow>
        <GridCol setWidth="two-thirds">

    <Heading size="LARGE" role="heading" id='template-heading'>
      {t('yourReference.title')}
    </Heading>
    <HintText>
    {t('yourReference.description')}
    </HintText>
  
            <div>
            <FormGroup> 
    <Radio name="group1">
    {t('radio.yes')}
    </Radio>


    <InsetTextStyled id="input1">
        <Label>
            <LabelText aria-label="Enter your reference">
            {t('yourReference.input')}
            </LabelText>
            <InputFieldStyled id="input2" />
        </Label>
    </InsetTextStyled>
    <Radio name="group1">
    {t('radio.no')}
    </Radio>
    </FormGroup>
    <FormGroup>
        <Button>
        {t('yourReference.button')}
        </Button>
    </FormGroup>
            </div>
        </GridCol>
        <GridCol setWidth="one-third">
            <div>
           
            </div>
        </GridCol>
    </GridRow>



   
    <>


    </>
   
    </Main>
    <CompleteFooter />


</div>

    );
  }
  
  export default YourReference;
  