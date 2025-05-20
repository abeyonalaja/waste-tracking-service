# Use case diagrams
## Moving and receiving waste - waste tracking process (majority of situations)
The Waste Movement ID is created in advance of the waste being moved and is subsequently passed downstream.

The current assumption is that job routes and waste tickets are already created ahead of time in the as-is process (before digital waste tracking is introduced). The to-be process in DWT is designed to shadow this approach, capturing the necessary data seamlessly in the background.

This methodology accommodates a broad spectrum of operational maturity, from highly advanced organisations equipped with weighbridges and automated load-lift technologies, to less technologically mature entities that rely on manually updating waste movements after the events have occurred in sequence.

### In-scope
Single waste movements where:

* producer, carrier and receiver are all the same
* producer, carrier, and receiver are *all different*
* carrier and receiver are the same, but *producer is different*

Multiple collections where:

* all parties are the same company
* all parties are different *companies*

Movements where:

* there is a rejection or part rejection before the waste is weighed
* there are brokers or dealers who operate outside the waste movement
* updates are made *after* the waste has moved

### Out-of-scope
The following scenarios will not be not be provided for in this use case:

* when one or more entities in the waste movement are digitally excluded
* rejection and part rejection *after* the waste has entered the site
* regulatory payments
* service charge payments
* undocumented waste arriving at the receiving site

### Use case diagram

[View 'moving and receiving waste' use case diagram (.jpg file)](../basic-process-flow.jpg). 

<br/>Page last updated on 20 May 2025.