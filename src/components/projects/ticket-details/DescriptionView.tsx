import { CKEditor } from "@ckeditor/ckeditor5-react";
import {
  Bold,
  ClassicEditor,
  Essentials,
  Heading,
  Indent,
  IndentBlock,
  Italic,
  Link,
  List,
  MediaEmbed,
  Paragraph,
  Table,
  Undo,
} from "ckeditor5";

import "ckeditor5/ckeditor5.css";
import { MutableRefObject } from "react";

export const DescriptionView: React.FC<{
  description: MutableRefObject<string>;
}> = ({ description }) => {
  return (
    <CKEditor
      editor={ClassicEditor}
      config={{
        toolbar: [
          "undo",
          "redo",
          "|",
          "heading",
          "|",
          "bold",
          "italic",
          "|",
          "link",
          "|",
          "bulletedList",
          "numberedList",
          "indent",
          "outdent",
        ],
        plugins: [
          Bold,
          Essentials,
          Heading,
          Indent,
          IndentBlock,
          Italic,
          Link,
          List,
          MediaEmbed,
          Paragraph,
          Table,
          Undo,
        ],
        initialData: description.current,
      }}
      onChange={(_, editor) => {
        const data = editor.getData();
        description.current = data;
      }}
    />
  );
};

export default DescriptionView;
