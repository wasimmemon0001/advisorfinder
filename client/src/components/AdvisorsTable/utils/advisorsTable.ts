import { Data, Filters, Order } from 'interfaces/advisors'

const DESC_ORDER: Order = 'desc'

export const descendingComparator = (a: Data, b: Data, orderBy: keyof Data): number => {
  if (b[orderBy] < a[orderBy]) return -1

  if (b[orderBy] > a[orderBy]) return 1

  return 0
}

export const getComparator = (order: Order, orderBy: keyof Data): ((a: Data, b: Data) => number) => {
  return order === DESC_ORDER
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy)
}

export const arraySort = (array: Data[], comparator: (a: Data, b: Data) => number): Data[] => {
  const arrayCopy = [...array]
  arrayCopy.sort((a, b) => comparator(a, b))
  return arrayCopy
}

const ONLINE_STATUS = 'online'

export const filterAdvisors = (filters: Filters, advisors: Data[]): Data[] => {
  console.log(filters)
  return advisors
  // const { searchValue, shouldShowOnline } = filters
  // if (!searchValue || searchValue.length === 0)
  //   return shouldShowOnline ? advisors.filter(advisor => advisor.status === ONLINE_STATUS) : advisors

  // return advisors.filter(advisor => {
  //   const { name, language, status } = advisor
  //   const indexOfNameSearchQuery = name.toLowerCase().indexOf(searchValue.trim().toLowerCase())
  //   const indexOfLanguageSearchQuery = language.toLowerCase().indexOf(searchValue.trim().toLowerCase())
  //   const isFound = indexOfNameSearchQuery !== -1 || indexOfLanguageSearchQuery !== -1
  //   return isFound && (shouldShowOnline ? status === ONLINE_STATUS : true)
  // })
}
