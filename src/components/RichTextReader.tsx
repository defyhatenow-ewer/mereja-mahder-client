import { RichText } from "@payloadcms/richtext-lexical/react";
import type { SerializedEditorState } from "@payloadcms/richtext-lexical/lexical";

const RichTextReader = ({
  data,
  className,
}: {
  data: SerializedEditorState;
  className?: string;
}) => {
  return <RichText data={data} className={className} />;
};

export default RichTextReader;
