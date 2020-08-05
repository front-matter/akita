import React from 'react'
import { mount } from 'cypress-react-unit-test'
import DoiRelatedContent from './DoiRelatedContent'

const data = {
  id: "https://handle.stage.datacite.org/10.21945/xs62-rp71",
  doi: "10.21945/xs62-rp71",
  url: "http://example.com",
  types: {
    resourceTypeGeneral: "Dataset",
    resourceType: "CSV file"
  },
  titles: [{
    title: "Example title of the item"
  }],
  descriptions: [{
    description: "Example description of the item."
  }],
  creators: [{
    id: null,
    name: "Smith, John",
    givenName: "John",
    familyName: "Smith"
  }],
  publisher: "SURFsara",
  publicationYear: 2019,
  version: "1.0",
  registered: "2019-12-19T12:43:12Z",
  registrationAgency: {
    id: "datacite",
    name: "DataCite"
  },
  formattedCitation: "Gallardo-Escárate, C., Valenzuela-Muñoz, V., Núñez-Acuña, G., &amp; Haye, P. (2014). <i>Data from: SNP discovery and gene annotation in the surf clam Mesodesma donacium</i> (Version 1) [Data set]. Dryad. <a href='https://doi.org/10.5061/DRYAD.8JD18'>https://doi.org/10.5061/DRYAD.8JD18</a>",
  citationCount: 4,
  viewCount: 8,
  rights: [],
  downloadCount: 3000,
  citationsOverTime: [],
  viewsOverTime: [],
  downloadsOverTime: [],
  citations: {
    nodes: []
  },
  references: {
    nodes: [{
        id: "https://handle.stage.datacite.org/10.21945/xs62-rp71",
        doi: "10.21945/xs62-rp741",
        url: "http://example.com",
        types: {
          resourceTypeGeneral: "Dataset",
          resourceType: "CSV file 2"
        },
        titles: [{
          title: "Example title of the item"
        }],
        descriptions: [{
          description: "Example description of the item."
        }],
        creators: [{
          id: null,
          name: "Smith, Juan",
          givenName: "Juan",
          familyName: "Smith"
        }],
        publisher: "SURFsara",
        publicationYear: 2019,
        version: "1.0",
        registered: "2019-12-19T12:43:12Z",
        registrationAgency: {
          id: "datacite",
          name: "DataCite"
        },
        rights: [],
      },
      {
        id: "https://handle.stage.datacite.org/10.21945/xs62-srp71",
        doi: "10.21945/xs62-rp7s41",
        url: "http://example.com",
        types: {
          resourceTypeGeneral: "Dataset",
          resourceType: "CSV file 2"
        },
        titles: [{
          title: "Example title of the item"
        }],
        descriptions: [{
          description: "Example description of the item."
        }],
        creators: [{
          id: null,
          name: "Smith, Juan",
          givenName: "Juan",
          familyName: "Smith"
        }],
        publisher: "SURFsara",
        publicationYear: 2019,
        version: "1.0",
        registered: "2019-12-19T12:43:12Z",
        registrationAgency: {
          id: "datacite",
          name: "DataCite"
        },
        rights: [],
      }
    ]
  },
}

describe('DoiRelatedContent Component', () => {
  it('the list is displayed', () => {
    mount(<DoiRelatedContent dois={data.references} type="references" count={2}/>)
    cy.get('div#related-content-list')
      .should('be.visible')
  })
  
  it('the list correct the right number of items', () => {
    mount(<DoiRelatedContent dois={data.references} type="references" count={2}/>)
    cy.get('div#related-content-items > div')
      .should('be.visible')
      .should('have.length', 2)
  })

})