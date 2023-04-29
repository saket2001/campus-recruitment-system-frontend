import React from "react";
import MarkdownIt from "markdown-it";
import MdEditor from "react-markdown-editor-lite";
import "react-markdown-editor-lite/lib/index.css";

// Initialize a markdown parser
const mdParser = new MarkdownIt({
});

export default function MarkdownEditor({ onChange, value, name }) {
  
  return (
    <MdEditor
      name={name}
      style={{ height: "400px" }}
      renderHTML={(value) => mdParser.render(value)}
      onChange={(e) => {
        onChange(e.text);
      }}
      defaultValue={value?.toString()}
    />
  );
}
