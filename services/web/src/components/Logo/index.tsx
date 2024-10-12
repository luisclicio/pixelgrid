import {
  Center,
  Image,
  Text,
  type CenterProps,
  type ImageProps,
} from '@mantine/core';

export type LogoIconProps = Omit<ImageProps, 'src' | 'alt' | 'w' | 'fit'> & {
  withAlt?: boolean;
};

export type LogoWithTextProps = CenterProps;

export function LogoIcon({ h = 56, withAlt = true, ...props }: LogoIconProps) {
  return (
    <Image
      src="/pixelgrid-icon.svg"
      alt={withAlt ? 'PixelGrid' : ''}
      h={h}
      w="auto"
      fit="contain"
      {...props}
    />
  );
}

export function LogoWithText(props: LogoWithTextProps) {
  return (
    <Center {...props}>
      <LogoIcon h={44} mr="sm" withAlt={false} />

      <Text
        tt="uppercase"
        fz="h1"
        fw="bold"
        variant="gradient"
        gradient={{ from: 'blue.9', to: 'blue.3' }}
      >
        PixelGrid
      </Text>
    </Center>
  );
}
