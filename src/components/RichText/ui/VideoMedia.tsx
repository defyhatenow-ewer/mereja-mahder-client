import { useEffect, useRef } from 'react';
import { IMedia } from '../../../types/media.types';
import { config } from '../../../config';
import cn from '../../../utils/cn';

type Props = {
  onClick?: () => void;
  resource?: IMedia | string | number | null; // for Payload media
  videoClassName?: string;
};

const VideoMedia: React.FC<Props> = (props) => {
  const { onClick, resource, videoClassName } = props;

  const videoRef = useRef<HTMLVideoElement>(null);
  // const [showFallback] = useState<boolean>()

  useEffect(() => {
    const { current: video } = videoRef;
    if (video) {
      video.addEventListener('suspend', () => {
        // setShowFallback(true);
        // console.warn('Video was suspended, rendering fallback image.')
      });
    }
  }, []);

  if (resource && typeof resource === 'object') {
    const { filename } = resource;

    return (
      <video
        autoPlay
        className={cn(videoClassName)}
        controls={false}
        loop
        muted
        onClick={onClick}
        playsInline
        ref={videoRef}
      >
        <source src={`${config.env.apiKey}/media/${filename}`} />
      </video>
    );
  }

  return null;
};

export default VideoMedia;
