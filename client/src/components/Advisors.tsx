import { useState, FC, useRef } from 'react'
import Loader from 'react-loader-spinner'
import { useQuery, gql, ApolloQueryResult } from '@apollo/client'
import { Container, Typography } from '@material-ui/core'

import { AdvisorsTable } from './AdvisorsTable/AdvisorsTable'

import { primaryBlue } from 'theme/constants'
import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css'
import { useLoadingStyles } from 'components/AdvisorsTable/styles/advisorsTable'

export const GET_ADVISORS_QUERY = gql`
  query advisors($limit: Int, $offset: Int, $search: String, $shouldShowOnline: Boolean) {
    advisors(limit: $limit, offset: $offset, search: $search, shouldShowOnline: $shouldShowOnline) {
      id
      name
      language
      reviews
      status
    }
  }
`

const DEFAULT_OFFSET = 30
const DEFAULT_LIMIT = 30
const ERROR_TEXT = 'Error while fetching advisors :('
let init = true

let loadingInfo: any
let errorInfo: any
let dataInfo: any
let fetchMoreData: any
let loadmoreCalled = false
let currentSearch: any = ''
let shouldShowOnline = false

export const Advisors: FC = () => {
  const [offset, setOffset] = useState<number>(DEFAULT_OFFSET)
  const [totalCall, settotalCall] = useState<number>(0)
  const [shouldFetchAgain, setShouldFetchAgain] = useState<boolean>(true)
  const classes = useLoadingStyles()
  const myref: any = useRef([])

  const loaderProps = {
    className: classes.loader,
  }

  const { loading, error, data, fetchMore } = useQuery(GET_ADVISORS_QUERY, {
    variables: {
      offset: 0,
      limit: DEFAULT_LIMIT,
      search: currentSearch,
    },
  })
  loadingInfo = loading
  errorInfo = error

  fetchMoreData = fetchMore

  if (init && data) {
    dataInfo = JSON.parse(JSON.stringify(data))
    init = false
  }

  if (loadingInfo) return <Loader {...loaderProps} type="BallTriangle" color={primaryBlue} />
  if (errorInfo)
    return (
      <Typography className={classes.error} variant="caption">
        {ERROR_TEXT}
      </Typography>
    )

  const loadMoreHandler = () => {
    if (loadmoreCalled) return
    const currentLength = dataInfo.advisors.length
    loadmoreCalled = true
    fetchMoreData({
      variables: {
        offset,
        limit: DEFAULT_LIMIT,
        search: currentSearch,
        shouldShowOnline: shouldShowOnline,
      },
    })
      // eslint-disable-next-line
      .then((fetchMoreResult: ApolloQueryResult<any>) => {
        const advisors = fetchMoreResult?.data?.advisors
        if (advisors) {
          dataInfo.advisors = dataInfo.advisors.concat(advisors)
        }
        loadmoreCalled = false
        setShouldFetchAgain(advisors.length !== 0)
        setOffset(currentLength + advisors.length)
      })
      // eslint-disable-next-line
      .catch((error: any) => console.error(error.message))
  }

  const loadDataWithFilter = (data: any) => {
    if (data.searchValue !== currentSearch || shouldShowOnline !== data.shouldShowOnline) {
      setOffset(DEFAULT_OFFSET)
    }
    const currentLength = dataInfo.advisors.length
    fetchMoreData({
      variables: {
        offset: 0,
        limit: DEFAULT_LIMIT,
        search: data.searchValue,
        shouldShowOnline: data.shouldShowOnline,
      },
    })
      // eslint-disable-next-line
      .then((fetchMoreResult: ApolloQueryResult<any>) => {
        if (data.searchValue !== currentSearch || shouldShowOnline !== data.shouldShowOnline) {
          currentSearch = data.searchValue
          shouldShowOnline = data.shouldShowOnline
          dataInfo.advisors = []
          const advisors = fetchMoreResult?.data?.advisors
          if (advisors) {
            dataInfo.advisors = dataInfo.advisors.concat(advisors)
            settotalCall(totalCall + 1)
          }
          setOffset(currentLength + advisors.length)
        }
      })
      // eslint-disable-next-line
      .catch((error: any) => console.error(error.message))
  }
  return (
    <Container>
      <AdvisorsTable
        advisors={dataInfo.advisors || []}
        onLoadMore={loadMoreHandler}
        filterDataAdvisors={loadDataWithFilter}
      />
    </Container>
  )
}
