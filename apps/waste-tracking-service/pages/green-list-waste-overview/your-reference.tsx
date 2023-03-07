
import {

    BackLink, Breadcrumbs, Page, H1, Footer, Paragraph, Heading, Tag, SectionBreak, Main
    
  } from "govuk-react";
  
  
  
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
  
    <Heading size="LARGE">
    Do you want to add your own reference to this export?
    </Heading>
  
    <Main>
    
  
  
   
    </Main>
    <Footer />
    </Page>
  
    
     
        
     
    );
  }
  
  export default YourReference;
  