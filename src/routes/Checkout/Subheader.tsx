import {BoldText} from '@/components';
import { Theme } from '@/constants';

export default function Subheader({children}: {children: string}) {
  return (
    <BoldText style={{fontSize: 18, color: Theme.text.primary}}>{children}</BoldText>
  );
}
