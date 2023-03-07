
import {

  BackLink, Breadcrumbs, Page, H1, Footer, Paragraph, Heading, Tag, SectionBreak, Main
  
} from "govuk-react";



export function Index() {
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
    
    Waste tracking service
    
  </Breadcrumbs>


  <Main>
  


                
    <Paragraph>
      [Green list waste overview](green-list-waste-overview)
    </Paragraph>        


  </Main>
  <Footer />
  </Page>

  
   
      
   
  );
}

export default Index;
