'use client'

import React from 'react'
import { useEffect } from 'react';
import { gql, useMutation, useQuery, ApolloCache } from '@apollo/client'
import { Button } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faOrcid } from '@fortawesome/free-brands-svg-icons'

import { session } from '../../utils/session'
import { Claim as ClaimType } from 'src/data/types'
import Loading from '../Loading/Loading'
import Error from '../Error/Error'
import ClaimStatus from '../ClaimStatus/ClaimStatus'
import styles from './Claim.module.scss'

type Props = {
  doi_id: string
}

interface QueryData {
  work: {
    id
    registrationAgency: {
      id: string
    }
    claims: ClaimType[]
  }
}

interface QueryVar {
  id: string
}

const GET_CLAIM_GQL = gql`
query getDoiClaimQuery(
  $id: ID!
) {
  work(id: $id) {
    id
    registrationAgency {
      id
    }
    claims {
      id
      sourceId
      state
      claimAction
      claimed
      errorMessages {
        status
        title
      }
    }
  }
}
`

const CREATE_CLAIM_GQL = gql`
  mutation createClaim($doi: ID!, $sourceId: String!) {
    createClaim(doi: $doi, sourceId: $sourceId) {
      claim {
        id
        sourceId
        state
        claimAction
        claimed
        errorMessages {
          status
          title
        }
      }
      errors {
        status
        source
        title
      }
    }
  }
`

const DELETE_CLAIM_GQL = gql`
  mutation deleteClaim($id: ID!) {
    deleteClaim(id: $id) {
      claim {
        id
        sourceId
        state
        claimAction
        claimed
        errorMessages {
          status
          title
        }
      }
      errors {
        status
        source
        title
      }
    }
  }
`

const Claim: React.FunctionComponent<Props> = ({ doi_id }) => {

  const { loading, error, data, refetch } = useQuery<QueryData, QueryVar>(GET_CLAIM_GQL, {
    errorPolicy: 'all',
    variables: {
      id: doi_id,
    }
  })

  const addOrUpdateExistingClaim = (cache: ApolloCache<any>, updatedClaim: ClaimType) => {
    const existingClaims = cache.readQuery<QueryData, QueryVar>({ query: GET_CLAIM_GQL, variables: { id: doi_id } });

    // Add or update the claim in the cache
    let newClaims: ClaimType[] = [];
    if (existingClaims && existingClaims.work && existingClaims.work.claims.length > 0) {
      // Update existing claims with new claim
      const existingClaimsUpdated = existingClaims.work.claims.map(claim => {
        if (claim.id === updatedClaim.id) {
          return updatedClaim;
        }
        return claim;
      });

      newClaims = existingClaimsUpdated;

    } else {
        newClaims = existingClaims ? [ ...existingClaims.work.claims, updatedClaim] : [updatedClaim];
    }

    cache.writeQuery({ query: GET_CLAIM_GQL, variables: { id: doi_id }, data: { work: { ...existingClaims?.work, claims: newClaims } } });
  }

  const [createClaim] = useMutation(CREATE_CLAIM_GQL, {
    errorPolicy: 'all',
    update(cache, { data: { createClaim } }) {
      if (createClaim.claim) {
        addOrUpdateExistingClaim(cache, createClaim.claim);
      }
    }
  })

  const [deleteClaim] = useMutation(DELETE_CLAIM_GQL, {
    errorPolicy: 'all',
    update(cache, { data: { deleteClaim } }) {
      if (deleteClaim.claim) {
        addOrUpdateExistingClaim(cache, deleteClaim.claim);
      }
    }
  })

  const user = session()

  const claim: ClaimType = data?.work.claims[0] || {
    id: null,
    sourceId: null,
    state: 'ready',
    claimAction: null,
    claimed: null,
    errorMessages: null
  } as any

  const isClaimed = claim.state === 'done' && claim.claimed != null
  const isActionPossible = claim.state !== 'waiting'

  useEffect(() => {
    if (!isActionPossible) {
      const timer = setInterval(() => {
        refetch()
      }, 10000);

      return () => clearInterval(timer);
    }
  }, [isActionPossible])


  const onCreate = () => {
    createClaim({
      variables: { doi: doi_id, sourceId: 'orcid_search' }
    })
  }

  const onDelete = () => {
    deleteClaim({
      variables: { id: claim.id }
    })
  }
  


  // don't show claim option if registration agency is not datacite
  if (data?.work.registrationAgency && data.work.registrationAgency.id !== 'datacite')
    return null


  if (loading) return <Loading />
  if (error)
    return (
      <>
        <h3 className="member-results">Claim</h3>
        <div className="panel panel-transparent claim">
          <div className="panel-body">
            <Error title="An error occured." message={error.message} />
          </div>
        </div>
      </>
    )


  // don't show claim option if user is not logged in
  if (!user){
    return <Button bsStyle='primary' className={styles.claimDisabled} disabled title="Sign in to Add to ORCID record" block>
      <FontAwesomeIcon icon={faOrcid} /> Add to ORCID Record
    </Button>
  }

  return (
    <>
            {isActionPossible ? (
              <>
                {isClaimed ?
                  <Button
                    bsStyle={'warning'}
                    onClick={onDelete}
                    block
                  >
                    <FontAwesomeIcon icon={faOrcid} /> Remove Claim
                  </Button>
                  :
                  <Button
                    bsStyle='primary'
                    onClick={onCreate}
                    block
                  >
                    <FontAwesomeIcon icon={faOrcid} /> Add to ORCID Record
                  </Button>
                }
              </>
            ) : <ClaimStatus claim={claim} type={'button'} />
            }

            {!isClaimed && claim.errorMessages && claim.errorMessages.length > 0 && (
              <>
                <p>Error: {claim.errorMessages[0].title}</p>
              </>
            )}
    </>
  )
}

export default Claim
