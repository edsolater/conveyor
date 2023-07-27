import { createMemo } from 'solid-js'
import { SearchOptions, searchItems } from './core'
import { MayFn, isArray, shrinkFn } from '@edsolater/fnkit'

export function useSearch<T>(items: (() => T[]) | T[], text: MayFn<string | undefined>, options?: SearchOptions<T>) {
  const allItems = isArray(items) ? items : items()
  const searchedItems = createMemo(() => searchItems(allItems, { ...options, text: shrinkFn(text) }))
  return { searchedItems }
}
