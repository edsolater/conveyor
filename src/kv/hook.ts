import { MayFn, MayPromise, shrinkFn } from '@edsolater/fnkit'
import { Accessor, createSignal } from 'solid-js'

export function useDB<V extends Exclude<any, Function>, F = undefined>(
  fetcher: () => MayPromise<V>,
  options?: { initDefaultValue?: MayFn<F>; failedFetchFallbackValue?: MayFn<F> }
): {
  data: Accessor<(undefined extends F ? V : NonNullable<V>) | F>
  isFetching: Accessor<boolean> /* TODO: abort: () => void */
} {
  const [data, setData] = createSignal<any>(shrinkFn(options?.initDefaultValue))
  const [isFetching, setIsFetching] = createSignal(true)
  Promise.resolve(fetcher())
    .then((v) => setData(() => v as any))
    .catch(() => {
      const fallbackValue = shrinkFn(options?.failedFetchFallbackValue)
      if (fallbackValue) {
        setData(() => fallbackValue)
      }
    })
    .finally(() => setIsFetching(false))
  return { data, isFetching }
}
