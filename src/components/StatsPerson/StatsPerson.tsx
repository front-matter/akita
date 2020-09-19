import React from 'react'
import { gql, useQuery } from '@apollo/client'
import { Row, Col, Alert } from 'react-bootstrap'

import Error from '../Error/Error'
import Loading from '../Loading/Loading'
import ProductionChart from '../ProductionChart/ProductionChart'
import { ContentFacet } from '../WorksListing/WorksListing'

export interface Source {
  totalCount: number
  years: ContentFacet[]
}

export interface Works {
  totalCount: number
  published: ContentFacet[]
  registrationAgencies?: ContentFacet[]
}

interface WorkQueryData {
  people: Source
  total: Works
  cited: Works
  viewed: Works
  downloaded: Works
  claimed: Works
}

export const STATS_GQL = gql`
  query getStatsQuery {
    people {
      totalCount
      years {
        title
        count
      }
    }
    total: works {
      totalCount
      published {
        title
        count
      }
      registrationAgencies {
        title
        count
      }
    }
    claimed: works(hasPerson: true) {
      totalCount
      published {
        title
        count
      }
      registrationAgencies {
        title
        count
      }
    }
    cited: works(hasPerson: true, hasCitations: 1) {
      totalCount
      published {
        title
        count
      }
    }
    viewed: works(hasPerson: true, hasViews: 1) {
      totalCount
      published {
        title
        count
      }
    }
    downloaded: works(hasPerson: true, hasDownloads: 1) {
      totalCount
      published {
        title
        count
      }
    }
  }
`

const StatsPerson: React.FunctionComponent = () => {
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

  const people = data.people.years.map((x) => ({
    title: x.title,
    count: x.count
  }))

  const total = data.total.published.map((x) => ({
    title: x.title,
    count: x.count
  }))

  const claimed = data.claimed.published.map((x) => ({
    title: x.title,
    count: x.count
  }))

  const cited = data.cited.published.map((x) => ({
    title: x.title,
    count: x.count
  }))

  const viewed = data.viewed.published.map((x) => ({
    title: x.title,
    count: x.count
  }))

  const downloaded = data.downloaded.published.map((x) => ({
    title: x.title,
    count: x.count
  }))

  const datacite = data.total.registrationAgencies.find(
    (element) => element.title === 'DataCite'
  )
  const crossref = data.total.registrationAgencies.find(
    (element) => element.title === 'Crossref'
  )

  const dataciteClaimed = data.claimed.registrationAgencies.find(
    (element) => element.title === 'DataCite'
  )
  const crossrefClaimed = data.claimed.registrationAgencies.find(
    (element) => element.title === 'Crossref'
  )

  return (
    <>
      <Row>
        <Col md={9} mdOffset={3} id="intro">
          <div className="panel panel-transparent">
            <div className="panel-body">
              <h3 className="member">People</h3>
              <div>
                <p>
                  DataCite Commons includes all{' '}
                  {data.people.totalCount.toLocaleString('en-US')}{' '}
                  <a target="_blank" rel="noreferrer" href="https://orcid.org">
                    ORCID
                  </a>{' '}
                  identifiers, and personal and employment metadata. This
                  information is retrieved live from the ORCID REST API.
                </p>
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
                  of works registered with Crossref.. The citations and usage
                  for these connected works are shown below.
                </p>
              </div>
            </div>
          </div>
        </Col>
      </Row>
      <Row>
        <Col md={9} mdOffset={3} id="overview">
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
                      title={'New ORCID IDs'}
                      data={people}
                      lowerBoundYear={2012}
                      color={'#8dd3c7'}
                    ></ProductionChart>
                  </Col>
                )}
              </Row>
              <Row>
                {data.total.totalCount > 0 && (
                  <>
                    <Col md={4}>
                      <ProductionChart
                        title={
                          data.total.totalCount.toLocaleString('en-US') +
                          ' Works Total'
                        }
                        data={total}
                      ></ProductionChart>
                    </Col>
                  </>
                )}
                {data.claimed.totalCount > 0 && (
                  <>
                    <Col md={4}>
                      <ProductionChart
                        title={
                          data.claimed.totalCount.toLocaleString('en-US') +
                          ' Works with People'
                        }
                        data={claimed}
                      ></ProductionChart>
                    </Col>
                  </>
                )}
              </Row>
            </div>
          </div>
        </Col>
      </Row>
      <Row>
        <Col md={9} mdOffset={3} id="citations">
          <h3 className="member-results">Citations and Usage</h3>
          <div className="panel panel-transparent">
            <div className="panel-body">
              <Row>
                {data.cited.totalCount +
                  data.viewed.totalCount +
                  data.downloaded.totalCount ==
                  0 && (
                  <Col md={12}>
                    <Alert bsStyle="warning">
                      <p>No citations and usage found.</p>
                    </Alert>
                  </Col>
                )}
                {data.cited.totalCount > 0 && (
                  <Col md={4}>
                    <ProductionChart
                      title={
                        data.cited.totalCount.toLocaleString('en-US') +
                        ' Works Cited'
                      }
                      data={cited}
                    ></ProductionChart>
                  </Col>
                )}
                {data.viewed.totalCount > 0 && (
                  <Col md={4}>
                    <ProductionChart
                      title={
                        data.viewed.totalCount.toLocaleString('en-US') +
                        ' Works Viewed'
                      }
                      data={viewed}
                    ></ProductionChart>
                  </Col>
                )}
                {data.downloaded.totalCount > 0 && (
                  <Col md={4}>
                    <ProductionChart
                      title={
                        data.downloaded.totalCount.toLocaleString('en-US') +
                        ' Works Downloaded'
                      }
                      data={downloaded}
                    ></ProductionChart>
                  </Col>
                )}
              </Row>
            </div>
          </div>
        </Col>
      </Row>
    </>
  )
}

export default StatsPerson
