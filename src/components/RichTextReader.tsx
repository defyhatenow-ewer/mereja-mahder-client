import { RichText } from '@payloadcms/richtext-lexical/react';
import type { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical';

type Props = {
  data: SerializedEditorState;
} & React.HTMLAttributes<HTMLDivElement>;

const RichTextReader = (props: Props) => {
  const { className, ...rest } = props;
  return <RichText {...rest} className={className} />;
};

export default RichTextReader;
