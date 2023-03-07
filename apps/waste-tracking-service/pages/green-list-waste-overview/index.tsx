
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
    <Breadcrumbs.Link href="/">
    Waste tracking service
    </Breadcrumbs.Link>
    Green list waste overview
  </Breadcrumbs>

  <Heading size="LARGE">
  Green list waste overview
  </Heading>

  <Main>
  


    <Heading size="MEDIUM">
    Tell us about an export
    </Heading>
    
                
    <Paragraph>
      [Submit a single waste export](green-list-waste-overview/your-reference)
    </Paragraph>        
    <Paragraph>
      [Submit a waste export from a template](https://en.wikipedia.org/wiki/Markdown)
    </Paragraph>  
    <Paragraph>
      [Submit multiple exports from a CSV file](https://en.wikipedia.org/wiki/Markdown)
    </Paragraph>  
    <Paragraph>
      [Continue a draft export (6)](https://en.wikipedia.org/wiki/Markdown)
    </Paragraph>  

    <Heading size="MEDIUM">
      All exports
    </Heading>

    <Paragraph>
      [Update an export with actual details (6)](https://en.wikipedia.org/wiki/Markdown)
    </Paragraph>        
    <Paragraph>
      [Check all submitted exports (20)](https://en.wikipedia.org/wiki/Markdown)
    </Paragraph>  
    
    <Heading size="MEDIUM">
      Templates
    </Heading>

    <Paragraph>
      [Create a new template](https://en.wikipedia.org/wiki/Markdown)
    </Paragraph>        
    <Paragraph>
      [Manage your templates](https://en.wikipedia.org/wiki/Markdown)
    </Paragraph>  
  </Main>
  <Footer />
  </Page>

  
   
      
   
  );
}

export default Index;
