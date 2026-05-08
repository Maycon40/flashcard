import breaksPlugin from "@bytemd/plugin-breaks";
import gemojiPlugin from "@bytemd/plugin-gemoji";
import gfmPlugin from "@bytemd/plugin-gfm";
import gfmLocale from "@bytemd/plugin-gfm/locales/pt_BR.json";
import highlightSsrPlugin from "@bytemd/plugin-highlight-ssr";
import mathPlugin from "@bytemd/plugin-math";
import mathLocale from "@bytemd/plugin-math/locales/pt_BR.json";
import mermaidPlugin from "@bytemd/plugin-mermaid";
import mermaidLocale from "@bytemd/plugin-mermaid/locales/pt_BR.json";
import { Editor as ByteMdEditor, Viewer as ByteMdViewer } from "@bytemd/react";
import byteMDLocale from "bytemd/locales/pt_BR.json";

import { externalLinksPlugin } from "./plugins/external-links";
import "bytemd/dist/index.css";

const bytemdPluginBaseList = [
  gfmPlugin({ locale: gfmLocale }),
  highlightSsrPlugin(),
  mathPlugin({
    locale: mathLocale,
    katexOptions: { output: "html" },
  }),
  breaksPlugin(),
  gemojiPlugin(),
  externalLinksPlugin(),
  mermaidPlugin({ locale: mermaidLocale }),
];

export function MarkdownViewer({ value: _value, clobberPrefix, ...props }) {
  clobberPrefix = clobberPrefix?.toLowerCase();

  return (
    <ByteMdViewer
      sanitize={sanitize({ clobberPrefix })}
      remarkRehype={{ clobberPrefix }}
      plugins={bytemdPluginBaseList}
      value={_value}
      {...props}
    />
  );
}

export function MarkdownEditor({ clobberPrefix, editorConfig = {}, ...props }) {
  clobberPrefix = clobberPrefix?.toLowerCase();

  return (
    <div
      className={`w-full border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden shadow-sm`}
    >
      {" "}
      <ByteMdEditor
        mode="split"
        plugins={bytemdPluginBaseList}
        locale={byteMDLocale}
        sanitize={sanitize({ clobberPrefix })}
        editorConfig={{
          inputStyle: "contenteditable",
          spellcheck: true,
          ...editorConfig,
        }}
        remarkRehype={{ clobberPrefix }}
        value={""}
        {...props}
      />
    </div>
  );
}

function sanitize(customSchema = {}) {
  return (defaultSchema: any) => {
    const schema = { ...defaultSchema, ...customSchema };

    schema.attributes["*"] = schema.attributes["*"].filter(
      (attr: string) => !["className", "target"].includes(attr),
    );

    schema.attributes["*"].push([
      "className",
      /^hljs|^language-|^bytemd-mermaid$|^math/,
    ]);

    return schema;
  };
}
