import React from "react";
import MarkdownIt from "markdown-it";

// Initialize a markdown parser
const mdParser = new MarkdownIt({
  html: true,
  xhtmlOut: true,
});


export const RenderMarkdown = ({ data }) => {
  const result = mdParser.render(data);
  return <div className="my-2 text-justify text-base" dangerouslySetInnerHTML={{ __html: result }} />;
};
