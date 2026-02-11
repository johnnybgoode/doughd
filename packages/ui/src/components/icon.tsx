import { DynamicIcon, type IconName } from 'lucide-react/dynamic';
import type { LucideProps } from 'lucide-react';
export type { IconName } from 'lucide-react/dynamic';

type IconProps = {
  name: IconName;
} & LucideProps;

export const Icon = (iconProps: IconProps) => <DynamicIcon {...iconProps} />;
