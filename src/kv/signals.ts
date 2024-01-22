import { createAsync } from '@solidjs/router'
import { LinkItem } from '../configs/links'
import { kvDB } from './instance'

export const links = createAsync(() => kvDB.get<LinkItem[]>('site-links'))
