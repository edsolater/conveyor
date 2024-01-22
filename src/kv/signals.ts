import { LinkItem } from '../configs/links'
import { createAsyncMemo } from '../packages/pivkit/hooks/createAsyncMemo'
import { myDB } from './instance'

export const allDBKeys = createAsyncMemo(() => myDB.keys('*'))
export const links = createAsyncMemo(() => myDB.get<LinkItem[]>('site-links'))
