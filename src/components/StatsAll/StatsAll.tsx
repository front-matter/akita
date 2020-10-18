import React from 'react'
import { gql, useQuery } from '@apollo/client'
import { Row, Col, Alert } from 'react-bootstrap'
import Link from 'next/link'

import Error from '../Error/Error'
import Loading from '../Loading/Loading'
import ProductionChart from '../ProductionChart/ProductionChart'
import DataSources from '../DataSources/DataSources'
import { ContentFacet } from '../WorksListing/WorksListing'

export interface Source {
  totalCount: number
  years: ContentFacet[]
}

export interface Crossref {
  totalCount: number
  totalCountFromCrossref: number
}

export interface Works {
  totalCount: number
  totalCountFromCrossref?: number
  published: ContentFacet[]
  registrationAgencies?: ContentFacet[]
}

interface WorkQueryData {
  total: Works
  claimed: Works
  cited: Works
  connected: Works
  people: Source
  organizations: Source
  publications: Works
  datasets: Works
  softwares: Works
  citedPublications: Works
  citedDatasets: Works
  citedSoftwares: Works
}

export const STATS_GQL = gql`
  query getStatsQuery {
    total: works {
      totalCount
      totalCountFromCrossref
      registrationAgencies {
        title
        count
      }
    }
    cited: works(hasCitations: 1) {
      totalCount
      registrationAgencies {
        title
        count
      }
    }
    claimed: works(hasPerson: true) {
      totalCount
      registrationAgencies {
        title
        count
      }
    }
    connected: works(
      hasOrganization: true
      hasAffiliation: true
      hasFunder: true
      hasMember: true
    ) {
      totalCount
      registrationAgencies {
        title
        count
      }
    }
    people {
      totalCount
      years {
        title
        count
      }
    }
    organizations {
      totalCount
    }
    publications: works(resourceTypeId: "Text") {
      totalCount
      published {
        title
        count
      }
    }
    citedPublications: works(
      resourceTypeId: "Text"
      hasCitations: 1
    ) {
      totalCount
      published {
        title
        count
      }
    }
    datasets: works(resourceTypeId: "Dataset") {
      totalCount
      published {
        title
        count
      }
    }
    citedDatasets: works(
      resourceTypeId: "Dataset"
      hasCitations: 1
    ) {
      totalCount
      published {
        title
        count
      }
    }
    softwares: works(resourceTypeId: "Software") {
      totalCount
      published {
        title
        count
      }
    }
    citedSoftwares: works(
      resourceTypeId: "Software"
      hasCitations: 1
    ) {
      totalCount
      published {
        title
        count
      }
    }
  }
`

const StatsAll: React.FunctionComponent = () => {
  const { loading, error, data } = useQuery<WorkQueryData>(STATS_GQL, {
    errorPolicy: 'all'
  })

  if (loading) return <Loading />

  if (error)
    return (
      <Col md={9} mdOffset={3}>
        <Error title="An error occured." message={error.message} />
      </Col>
    )

  const datacite = data.total.registrationAgencies.find(
    (element) => element.title === 'DataCite'
  )
  const crossref = data.total.registrationAgencies.find(
    (element) => element.title === 'Crossref'
  )

  const dataciteCited = data.cited.registrationAgencies.find(
    (element) => element.title === 'DataCite'
  )
  const crossrefCited = data.cited.registrationAgencies.find(
    (element) => element.title === 'Crossref'
  )

  const dataciteClaimed = data.claimed.registrationAgencies.find(
    (element) => element.title === 'DataCite'
  )

  const crossrefClaimed = data.claimed.registrationAgencies.find(
    (element) => element.title === 'Crossref'
  )

  const dataciteConnected = data.connected.registrationAgencies.find(
    (element) => element.title === 'DataCite'
  )
  const crossrefConnected = data.connected.registrationAgencies.find(
    (element) => element.title === 'Crossref'
  )

  const people = data.people.years.map((x) => ({
    title: x.title,
    count: x.count
  }))

  const renderPublications = () => {
    const publishedPublication = data.publications.published.map((x) => ({
      title: x.title,
      count: x.count
    }))

    return (
      <Col md={4}>
        <ProductionChart
          title={
            data.publications.totalCount.toLocaleString('en-US') +
            ' Publications'
          }
          data={publishedPublication}
          color={'#80b1d3'}
        ></ProductionChart>
      </Col>
    )
  }

  const renderDatasets = () => {
    const publishedDataset = data.datasets.published.map((x) => ({
      title: x.title,
      count: x.count
    }))

    return (
      <Col md={4}>
        <ProductionChart
          title={data.datasets.totalCount.toLocaleString('en-US') + ' Datasets'}
          data={publishedDataset}
          color={'#fb8072'}
        ></ProductionChart>
      </Col>
    )
  }

  const renderSoftwares = () => {
    const publishedSoftware = data.softwares.published.map((x) => ({
      title: x.title,
      count: x.count
    }))

    return (
      <Col md={4}>
        <ProductionChart
          title={
            data.softwares.totalCount.toLocaleString('en-US') + ' Software'
          }
          data={publishedSoftware}
          color={'#bebada'}
        ></ProductionChart>
      </Col>
    )
  }

  const renderCitedPublications = () => {
    const citedPublication = data.citedPublications.published.map((x) => ({
      title: x.title,
      count: x.count
    }))

    return (
      <Col md={4}>
        <ProductionChart
          title={
            data.citedPublications.totalCount.toLocaleString('en-US') + ' (' +
            ((data.citedPublications.totalCount * 100) / data.publications.totalCount).toFixed(2) + '%) Cited Publications'
          }
          data={citedPublication}
          color={'#80b1d3'}
        ></ProductionChart>
      </Col>
    )
  }

  const renderCitedDatasets = () => {
    const citedDataset = data.citedDatasets.published.map((x) => ({
      title: x.title,
      count: x.count
    }))

    return (
      <Col md={4}>
        <ProductionChart
          title={
            data.citedDatasets.totalCount.toLocaleString('en-US') + ' (' +
            ((data.citedDatasets.totalCount * 100) / data.datasets.totalCount).toFixed(2) + '%) Cited Datasets'
          }
          data={citedDataset}
          color={'#fb8072'}
        ></ProductionChart>
      </Col>
    )
  }

  const renderCitedSoftwares = () => {
    const citedSoftware = data.citedSoftwares.published.map((x) => ({
      title: x.title,
      count: x.count
    }))

    return (
      <Col md={4}>
        <ProductionChart
          title={
            data.citedSoftwares.totalCount.toLocaleString('en-US') + ' (' +
            ((data.citedSoftwares.totalCount * 100) / data.softwares.totalCount).toFixed(2) + '%) Cited Software'
          }
          data={citedSoftware}
          color={'#bebada'}
        ></ProductionChart>
      </Col>
    )
  }

  return (
    <>
      <Row>
        <Col md={9} mdOffset={3} id="intro">
          <div className="panel panel-transparent">
            <div className="panel-body">
              <h3 className="member">Statistics</h3>
              <div>
                <p>
                  This page gives an overview of the information about works,
                  people and organizations made available via DataCite Commons. Please reach out to{' '}
                  <a href="mailto:support@datacite.org">DataCite Support</a> for
                  questions or comments.
                </p>
              </div>
            </div>
          </div>
        </Col>
      </Row>
      <Row>
        <DataSources
          dataciteCount={datacite.count}
          crossrefCount={crossref.count}
          crossrefApiCount={data.total.totalCountFromCrossref}
          orcidCount={data.people.totalCount}
          rorCount={data.organizations.totalCount}
        />
      </Row>
      <Row>
        <Col md={9} mdOffset={3} id="works">
          <h3 className="member-results">Works</h3>
          <div className="panel panel-transparent">
            <div className="panel-body">
              <div className="intro">
                DataCite Commons currently includes{' '}
                {(
                  datacite.count + crossref.count
                ).toLocaleString('en-US')}{' '}
                works, with identifiers and metadata provided by DataCite and
                Crossref. For the three major work types{' '}
                <Link href="/publications">
                  <a>publication</a>
                </Link>
                ,{' '}
                <Link href="/datasets">
                  <a>dataset</a>
                </Link>{' '}
                and{' '}
                <Link href="/software">
                  <a>software</a>
                </Link>
                , the respective numbers by publication year are shown below.
              </div>
              <Row>
                {renderPublications()}
                {renderDatasets()}
                {renderSoftwares()}
              </Row>
              <Row>
                <Col md={12}>
                  <div className="panel panel-transparent">
                    <div className="panel-body">
                      <p>
                        {data.cited.totalCount.toLocaleString('en-US')} out of all{' '}
                        {data.total.totalCount.toLocaleString('en-US')} (
                        {(
                          (data.cited.totalCount * 100) /
                          data.total.totalCount
                        ).toFixed(2) + '%'}
                        ) works have been cited at least once, including{' '}
                        {((dataciteCited.count * 100) / datacite.count).toFixed(
                          2
                        ) + '%'}{' '}
                        of works registered with DataCite, and{' '}
                        {((crossrefCited.count * 100) / crossref.count).toFixed(
                          2
                        ) + '%'}{' '}
                        of works registered with Crossref.
                      </p>
                    </div>
                  </div>
                </Col>
              </Row>
              <Row>
                {renderCitedPublications()}
                {renderCitedDatasets()}
                {renderCitedSoftwares()}
              </Row>
            </div>
          </div>
        </Col>
      </Row>
      <Row>
        <Col md={9} mdOffset={3} id="people">
          <h3 className="member-results">People</h3>
          <div className="panel panel-transparent">
            <div className="panel-body">
              <div className="intro">
                <p>
                  DataCite Commons includes all{' '}
                  {data.people.totalCount.toLocaleString('en-US')}{' '}
                  <a target="_blank" rel="noreferrer" href="https://orcid.org">
                    ORCID
                  </a>{' '}
                  identifiers, and personal and employment metadata. This
                  information is retrieved live from the ORCID REST API, 
                  the respective numbers by registration year are shown below.
                </p>
              </div>
            </div>
          </div>
        </Col>
      </Row>
      <Row>
        <Col md={9} mdOffset={3} id="people-count">
          <div className="panel panel-transparent">
            <div className="panel-body">
              <Row>
                {data.people.totalCount == 0 && (
                  <Col md={12}>
                    <Alert bsStyle="warning">
                      <p>No People found.</p>
                    </Alert>
                  </Col>
                )}
                {data.people.totalCount > 0 && (
                  <Col md={4}>
                    <ProductionChart
                      title={
                        data.people.totalCount.toLocaleString('en-US') +
                        ' People'
                      }
                      data={people}
                      lowerBoundYear={2012}
                      color={'#8dd3c7'}
                    ></ProductionChart>
                  </Col>
                )}
              </Row>
            </div>
          </div>
        </Col>
      </Row>
      <Row>
        <Col md={9} mdOffset={3} id="people-count">
          <div className="panel panel-transparent">
            <div className="panel-body">
              <div className="intro">
                <p>
                  {data.claimed.totalCount.toLocaleString('en-US')} out of all{' '}
                  {data.total.totalCount.toLocaleString('en-US')} (
                  {(
                    (data.claimed.totalCount * 100) /
                    data.total.totalCount
                  ).toFixed(2) + '%'}
                  ) works have been connected to at least one ORCID record,
                  including{' '}
                  {((dataciteClaimed.count * 100) / datacite.count).toFixed(2) +
                    '%'}{' '}
                  of works registered with DataCite, and{' '}
                  {((crossrefClaimed.count * 100) / crossref.count).toFixed(2) +
                    '%'}{' '}
                  of works registered with Crossref.
                </p>
              </div>
            </div>
          </div>
        </Col>
      </Row>
      <Row>
        <Col md={9} mdOffset={3} id="intro">
          <div className="panel panel-transparent">
            <div className="panel-body">
              <h3 className="member">Organizations</h3>
              <div>
                <p>
                  DataCite Commons includes all{' '}
                  {data.organizations.totalCount.toLocaleString('en-US')}{' '}
                  Research Organization Registry (
                  <a target="_blank" rel="noreferrer" href="https://ror.org">
                    ROR
                  </a>
                  ) identifiers and metadata. This information is retrieved live
                  from the ROR REST API.
                </p>
                <p>
                  {data.connected.totalCount.toLocaleString('en-US')} out of all{' '}
                  {data.total.totalCount.toLocaleString('en-US')} (
                  {(
                    (data.connected.totalCount * 100) /
                    data.total.totalCount
                  ).toFixed(2) + '%'}
                  ) works are connected with at least one organization via ROR
                  ID or Crossref Funder ID, including{' '}
                  {((dataciteConnected.count * 100) / datacite.count).toFixed(
                    2
                  ) + '%'}{' '}
                  of works registered with DataCite, and{' '}
                  {((crossrefConnected.count * 100) / crossref.count).toFixed(
                    2
                  ) + '%'}{' '}
                  of works registered with Crossref.
                </p>
              </div>
            </div>
          </div>
        </Col>
      </Row>
    </>
  )
}

export default StatsAll
