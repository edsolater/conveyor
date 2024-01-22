import { LinkItem } from '../configs/links'
import { createAsyncMemo } from '../packages/pivkit/hooks/createAsyncMemo'
import { myDB } from './instance'

export const links = createAsyncMemo(() => myDB.get<LinkItem[]>('site-links'))
