import { PivChild, Piv } from '../../../piv'
import { TabsController, TabsProps } from '..'

/**
 * component plugin
 * can render tabs Thumb
 * @todo it should be plugin
 */
export function renderTabsThumb(
  renderContent: PivChild<TabsController> = ({ isChecked }) => (
    <Piv
      icss={{
        color: isChecked() ? 'dodgerblue' : 'crimson',
        width: '0.5em',
        height: '0.5em',
        backgroundColor: 'currentcolor',
        transition: '600ms',
        borderRadius: '999px',
      }}
    />
  )
): TabsProps['shadowProps'] {
  return {
    'anatomy:Thumb': {
      'render:lastChild': renderContent,
    },
  }
}
