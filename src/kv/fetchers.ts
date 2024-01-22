import { LinkItem } from '../configs/links'
import { myDB } from './instance'

/** dangerous it's very slow */
export const queryAllDBKeys = () => myDB.keys('*')

export const queryDBLinks = async () => await myDB.get<LinkItem[]>('site-links')
