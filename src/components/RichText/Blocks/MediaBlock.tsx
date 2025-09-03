import RichText from '..';
import React from 'react';
import cn from '../../../utils/cn';
import { Media } from '../ui/Media';

import { IMedia as MediaBlockProps } from '../../../types/media.types';

type Props = MediaBlockProps & {
  breakout?: boolean;
  captionClassName?: string;
  className?: string;
  enableGutter?: boolean;
  imgClassName?: string;
  src?: string;
  disableInnerContainer?: boolean;
  media?: string | MediaBlockProps;
};

const MediaBlock: React.FC<Props> = (props) => {
  const {
    captionClassName,
    className,
    enableGutter = true,
    imgClassName,
    media,
    src,
    disableInnerContainer,
  } = props;

  let caption;
  if (media && typeof media === 'object') caption = media.caption;

  return (
    <div
      className={cn(
        '',
        {
          container: enableGutter,
        },
        className
      )}
    >
      {(media || src) && (
        <Media
          imgClassName={cn(
            'border border-border rounded-[0.8rem]',
            imgClassName
          )}
          resource={media}
          src={src}
        />
      )}
      {caption && (
        <div
          className={cn(
            'mt-6',
            {
              container: !disableInnerContainer,
            },
            captionClassName
          )}
        >
          <RichText data={caption} enableGutter={false} />
        </div>
      )}
    </div>
  );
};

export default MediaBlock;
