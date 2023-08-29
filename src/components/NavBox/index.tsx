import { TopMenuBar, TopMenuBarProps } from './TopMenuBar'

export type NavigatorWindowBoxProps = TopMenuBarProps

/**
 * 
 */
export function NavigatorWindowBox(props: NavigatorWindowBoxProps) {
  return <TopMenuBar {...props} />
}
