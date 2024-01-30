import {createIconSetFromIcoMoon} from 'react-native-vector-icons';
import iconMoonConfig from '@/assets/json/selection.json';

export function CustomIcon({
  name,
  size,
  color,
}: {
  name: string;
  size: number;
  color: string;
}) {
  const Icon = createIconSetFromIcoMoon(
    iconMoonConfig,
    'The-Icon-of',
    'The-Icon-of.ttf',
  );

  return <Icon name={name} size={size} color={color} />;
}
