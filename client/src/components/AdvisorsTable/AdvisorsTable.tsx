import { useState, FC, useMemo, SyntheticEvent, MouseEvent } from 'react'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableContainer from '@material-ui/core/TableContainer'
import TableRow from '@material-ui/core/TableRow'
import Paper from '@material-ui/core/Paper'
import { FormControlLabel, Switch, TextField } from '@material-ui/core'

import { EnhancedTableHead } from './AdvisorsTableHead'
import { EnhancedTableToolbar } from './AdvisorsTableToolbar'

import { getComparator, filterAdvisors, arraySort } from './utils/advisorsTable'
import { AdvisorsTableProps, Data, Order } from 'interfaces/advisors'
import { useTableStyles } from './styles/advisorsTable'

export const AdvisorsTable: FC<AdvisorsTableProps> = ({ advisors, onLoadMore, filterDataAdvisors }) => {
  const classes = useTableStyles()
  const [order, setOrder] = useState<Order>('asc')
  const [orderBy, setOrderBy] = useState<keyof Data>('name')
  const [shouldShowOnline, setShouldShowOnline] = useState(false)
  const [searchValue, setSearchValue] = useState<string>('')
  let timer: any = null
  const setSearch = (data: any) => {
    console.log(searchValue)
    clearTimeout(timer)
    timer = setTimeout(() => {
      console.log(searchValue)
      filterDataAdvisors({ searchValue, shouldShowOnline })
    }, 1000)
  }

  const filteredItems = useMemo(() => {
    const sortedAdvisors = arraySort(advisors, getComparator(order, orderBy))
    return filterAdvisors({ searchValue, shouldShowOnline }, sortedAdvisors)
  }, [advisors, searchValue, order, orderBy, shouldShowOnline])

  const handleScroll = ({ currentTarget }: SyntheticEvent) => {
    if (currentTarget.scrollTop + currentTarget.clientHeight === currentTarget.scrollHeight) {
      onLoadMore()
    }
  }

  const handleRequestSort = (event: MouseEvent<unknown>, property: keyof Data) => {
    const isAsc = orderBy === property && order === 'asc'
    setOrder(isAsc ? 'desc' : 'asc')
    setOrderBy(property)
  }

  const toggleShouldShowOnline = () => setShouldShowOnline(shouldShowOnline => !shouldShowOnline)

  return (
    <div className={classes.root} id="table-wrapper">
      <Paper className={classes.paper}>
        <EnhancedTableToolbar />
        <div className={classes.searchWrapper}>
          <TextField
            value={searchValue}
            label="Search..."
            onChange={(e: any) => setSearchValue(e.target.value)}
            onKeyUp={(e: any) => setSearch(e.target.value)}
          />
        </div>
        <TableContainer className={classes.tableContainer} onScroll={handleScroll}>
          <Table stickyHeader className={classes.table}>
            <EnhancedTableHead order={order} orderBy={orderBy} onRequestSort={handleRequestSort} />
            <TableBody>
              {filteredItems.map((row: any) => {
                return (
                  <TableRow key={row.id}>
                    <TableCell>{row.name}</TableCell>
                    <TableCell>{row.language}</TableCell>
                    <TableCell>{row.status}</TableCell>
                    <TableCell align="right">{row.reviews}</TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
      <FormControlLabel
        className={classes.formControlLabel}
        control={<Switch checked={shouldShowOnline} onChange={toggleShouldShowOnline} />}
        label="Show online advisors"
      />
    </div>
  )
}
