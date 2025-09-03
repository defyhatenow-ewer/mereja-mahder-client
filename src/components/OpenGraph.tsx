import { Helmet } from 'react-helmet';
import { IMedia } from '../types/media.types';
import config from '../config/config';

type Props = {
  meta?: {
    title?: string | null | undefined;
    image?: string | IMedia | null | undefined;
    description?: string | null;
  };
};

const OpenGraph = ({ meta }: Props) => {
  if (!meta)
    return (
      <Helmet>
        <meta property="og:url" content={window.location.href} />
      </Helmet>
    );

  return (
    <Helmet>
      <meta property="og:url" content={window.location.href} />
      {meta.title && <meta property="og:title" content={meta.title} />}
      {meta.description && (
        <meta property="og:description" content={meta.description} />
      )}
      {meta.image && (
        <meta
          property="og:image"
          content={`${config.env.apiKey}${(meta.image as IMedia).thumbnailURL}`}
        />
      )}
    </Helmet>
  );
};

export default OpenGraph;
