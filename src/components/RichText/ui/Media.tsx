import React, { ElementType, Fragment } from 'react';
import ImageMedia from './ImageMedia';
import VideoMedia from './VideoMedia';
import { IMedia } from '../../../types/media.types';

type Props = {
  className?: string;
  imgClassName?: string;
  htmlElement?: ElementType | null;
  resource?: IMedia | string | number | null;
  src?: string;
};

export const Media: React.FC<Props> = (props) => {
  const { className, htmlElement = 'div', resource } = props;

  const isVideo =
    typeof resource === 'object' && resource?.mimeType?.includes('video');
  const Tag = htmlElement || Fragment;

  return (
    <Tag
      {...(htmlElement !== null
        ? {
            className,
          }
        : {})}
    >
      {isVideo ? <VideoMedia {...props} /> : <ImageMedia {...props} />}
    </Tag>
  );
};
