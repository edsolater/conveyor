import { createMemo } from 'solid-js'
import { SearchOptions, searchItems } from './core'
import { MayFn, isArray, shrinkFn } from '@edsolater/fnkit'

export function useSearch<T>(items: (() => T[]) | T[], text: MayFn<string | undefined>, options?: SearchOptions<T>) {
  const _items = isArray(items) ? items : items()
  const searchedItems = createMemo(() => searchItems(_items, { ...options, text: shrinkFn(text) }))
  return { searchedItems }
}
