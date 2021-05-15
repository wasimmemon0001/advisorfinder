import { MouseEvent } from 'react'

export interface Data {
  id: number
  name: string
  language: string
  status: string
  reviews: number
}

export type Order = 'asc' | 'desc'

export interface AdvisorsTableProps {
  advisors: Data[]
  onLoadMore: () => void
  filterDataAdvisors: (data: any) => void
}

export interface EnhancedTableProps {
  onRequestSort: (event: MouseEvent<unknown>, property: keyof Data) => void
  order: Order
  orderBy: string
}

export interface HeadCell {
  id: keyof Data
  label: string
  numeric: boolean
}

export interface Filters {
  searchValue: string
  shouldShowOnline: boolean
}
