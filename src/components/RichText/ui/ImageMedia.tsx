import { IMedia } from '../../../types/media.types';
import { config } from '../../../config';
import { breakpoints } from '../../../utils/cssVariables';
import cn from '../../../utils/cn';

type Props = {
  alt?: string;
  imgClassName?: string;
  loading?: 'lazy' | 'eager'; // for NextImage only
  priority?: boolean; // for NextImage only
  resource?: IMedia | string | number | null; // for Payload media
  size?: string; // for NextImage only
  src?: string; // for static media
};

const ImageMedia: React.FC<Props> = (props) => {
  const {
    alt: altFromProps,
    imgClassName,
    priority,
    resource,
    size: sizeFromProps,
    src: srcFromProps,
    loading: loadingFromProps,
  } = props;

  let width: number | undefined;
  let height: number | undefined;
  let alt = altFromProps;
  let src: string = srcFromProps || '';

  if (!src && resource && typeof resource === 'object') {
    const {
      alt: altFromResource,
      height: fullHeight,
      url,
      width: fullWidth,
    } = resource;

    width = fullWidth!;
    height = fullHeight!;
    alt = altFromResource || '';

    const cacheTag = resource.updatedAt;

    src = `${config.env.apiKey}${url}?${cacheTag}`;
  }

  const loading = loadingFromProps || (!priority ? 'lazy' : undefined);

  // NOTE: this is used by the browser to determine which image to download at different screen sizes
  const sizes = sizeFromProps
    ? sizeFromProps
    : Object.entries(breakpoints)
        .map(([, value]) => `(max-width: ${value}px) ${value * 2}w`)
        .join(', ');

  return (
    <picture>
      <img
        src={src}
        width={width}
        height={height}
        sizes={sizes}
        alt={alt || ''}
        className={cn(imgClassName)}
        loading={loading}
      />
    </picture>
  );
};

export default ImageMedia;
