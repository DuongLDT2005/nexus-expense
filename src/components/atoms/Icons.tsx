import React, {memo} from 'react';
import {ICON_REGISTRY, isValidIconName} from './IconRegistry';

interface IconProps {
  name: string;
  size?: number;
  color?: string;
  strokeWidth?: number;
  fill?: string;
}

const Icon: React.FC<IconProps> = ({
  name,
  size = 24,
  color = '#000000',
  strokeWidth = 2,
  fill = 'none',
}) => {
  if (!isValidIconName(name)) {
    if (__DEV__) {
      console.warn(`Icon "${name}" not found in registry`);
    }
    return null;
  }

  const IconComponent = ICON_REGISTRY[name] as any;

  return (
    <IconComponent
      size={size}
      color={color}
      strokeWidth={strokeWidth}
      fill={fill}
    />
  );
};

export default memo(Icon);
export {type IconName} from './IconRegistry';
