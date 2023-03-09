import styled from 'styled-components'
import CrownIcon from '@govuk-react/icon-crown';
import {

    BackLink, Breadcrumbs, Page, H1, Footer, Paragraph, Heading, Tag, SectionBreak, Main, TopNav, 
    
  } from "govuk-react";
  
  const PageStyled = styled(Page)`
 .bottom-nav-wrapper {
    width: 100%;
 }
 .czzhCh {
    width: 100%;
 }
`;
  
  export function UpdateWithActualExport() {

    

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
      Update an export with actual details
    </Breadcrumbs>
  
    <Heading size="MEDIUM" id="template-heading">
    Update an export with actual details
    </Heading>
  
    <Page.Main>
    
  
  
   
    </Page.Main>
    <Footer />
    </Page>
  
    
     
        
     
    );
  }
  
  export default UpdateWithActualExport;
  