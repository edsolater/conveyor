import { TopMenuBar, TopMenuBarProps } from './TopMenuBar'

export type NavBoxProps = TopMenuBarProps

/**
 * 
 */
export function NavBox(props: NavBoxProps) {
  return <TopMenuBar {...props} />
}
