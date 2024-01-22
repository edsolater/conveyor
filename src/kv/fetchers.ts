import { LinkItem } from '../configs/links'
import { myDB } from './instance'

/** dangerous it's very slow */
export const queryAllKeys = () => myDB.keys('*')

export const queryLinks = async () => await myDB.get<LinkItem[]>('site-links')
