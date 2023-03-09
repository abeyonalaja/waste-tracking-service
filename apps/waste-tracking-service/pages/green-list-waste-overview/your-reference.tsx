import styled from 'styled-components'
import {

    BackLink, Breadcrumbs, Page,  Footer, Radio, Heading, Tag, SectionBreak, Main, InsetText, Label, LabelText, HintText, H3, Button, FormGroup, GridRow, GridCol, Input
    
  } from "govuk-react";
  
  

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
    /*
     * Replace the elements below with your own.
     *
     * Note: The corresponding styles are in the ./index.styled-components file.
     */
    return (
      
  <Page>
   
    <Tag>
    PROTOTYPE
    </Tag>
  
    <SectionBreak
      level="LARGE"
      visible
    />
    <Breadcrumbs>
      <Breadcrumbs.Link href="/">
      Waste tracking service
      </Breadcrumbs.Link>
      <Breadcrumbs.Link href="/green-list-waste-overview">
      Green list waste overview
      </Breadcrumbs.Link>
      Your reference
    </Breadcrumbs>
  
    
  
    <Main>


    <GridRow>
        <GridCol setWidth="two-thirds">

    <H3 data-testid="template-heading">
    Do you want to add your own reference to this export?
    </H3>
    <HintText>
        Your reference number should be unique to the shipment. You can use it to find your submission.
    </HintText>
  
            <div>
            <FormGroup> 
    <Radio name="group1">
        Yes
    </Radio>
    <InsetTextStyled data-testid="input1">

        <Label>
            <LabelText aria-label="Enter your reference">
                Enter your reference
            </LabelText>
            <InputFieldStyled data-testid="input2" />
        </Label>
  
    </InsetTextStyled>
    <Radio name="group1">
        No
    </Radio>
    </FormGroup>
    <FormGroup>
        <Button>
            Save and continue
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
    <Footer />
    </Page>
  
    
     
        
     
    );
  }
  
  export default YourReference;
  