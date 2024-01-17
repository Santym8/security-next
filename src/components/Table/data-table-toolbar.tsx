"use client"

import { Cross2Icon } from "@radix-ui/react-icons"
import { ColumnFiltersState, FilterFn, Table } from "@tanstack/react-table"

import { Button } from "@/components/registry/new-york/ui/button"
import { DataTableViewOptions } from "@/components/Table/data-table-view-options"

import { statuses } from "@/components/Table/data/data"
import { DataTableFacetedFilter } from "./data-table-faceted-filter"
import React from "react"
import {
  RankingInfo,
  rankItem,
} from '@tanstack/match-sorter-utils'
import { Input } from "@/components/registry/new-york/ui/input"

interface DataTableToolbarProps<TData> {
  table: Table<TData>
}


declare module '@tanstack/table-core' {
  interface FilterFns {
    fuzzy: FilterFn<unknown>
  }
  interface FilterMeta {
    itemRank: RankingInfo
  }
}

export function DataTableToolbar<TData>({
  table,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0
  const [globalFilter, setGlobalFilter] = React.useState('')
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2 mr-4">
        <Input
          placeholder="Global Filter..."
          value={table.getState().globalFilter || ''}
          onChange={(event) => table.setGlobalFilter(event.target.value)}
          className="max-w-sm mr-5"
        />
        {table.getColumn("status") && (
          <DataTableFacetedFilter
            column={table.getColumn("status")}
            title="Status"
            options={statuses}
          />
        )}
        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => table.resetColumnFilters()}
            className="h-8 px-2 lg:px-3"
          >
            Reset
            <Cross2Icon className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
      <DataTableViewOptions table={table} />
    </div>
  )
}