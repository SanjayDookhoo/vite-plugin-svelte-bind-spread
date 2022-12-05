export default (userOptions = {}) => {
  return {
    name: 'vite-plugin-svelte-bind-spread',
    enforce: 'pre',
    transform(_raw, id) {
      if (!/\.(svelte)$/.test(id)) return _raw; // if the extension of the file isnt .svelte

      try {
        // https://stackoverflow.com/a/15123777/4224964
        // remove comments
        const replaceWith = (replaced) => {
          const newLineCount = replaced.split(/\r\n|\r|\n/).length - 1;
          return '\r\n'.repeat(newLineCount); // replace with new line, so file line number references in the console will still be accurate
        };
        const raw = _raw.replaceAll(
          /\/\*[\s\S]*?\*\/|([^\\:]|^)\/\/.*|<!--[\s\S]*?-->$/g,
          replaceWith
        );
        let newRaw = raw;

        let replacingStr = ' ';

        const createReplacingStr = ({ str, matchedStr, index }) => {
          let modifiedStr = str;
          let pattern;
          let result;

          // replace x:y
          pattern = /[a-zA-Z0-9_]+\s*:\s*[a-zA-Z0-9_]+/g;
          do {
            result = pattern.exec(str);
            if (result) {
              const split = result[0].split(':');
              replacingStr += `bind:${split[0]}={${split[1]}} `;
              modifiedStr = modifiedStr.replace(result[0], ' ');
            }
          } while (result);

          //replace x
          pattern = /[a-zA-Z0-9_]+/g;
          do {
            result = pattern.exec(modifiedStr);
            if (result) {
              replacingStr += `bind:${result[0]}={${result[0]}} `;
            }
          } while (result);

          newRaw =
            newRaw.slice(0, index) +
            replacingStr +
            newRaw.slice(index + matchedStr.length);
        };

        const findObjectThatWasSpread = ({ matchedStr, obj, index }) => {
          const pattern = /const\s+[^}]+}/g;
          const newRaw = raw.slice(0, index);
          let finalResult;
          let result;
          do {
            result = pattern.exec(newRaw);
            if (result && result[0].includes(obj)) {
              finalResult = result;
            }
          } while (result);
          const str = finalResult[0]
            .replaceAll('\n', '')
            .replaceAll('\t', '')
            .replaceAll('const', '')
            .replaceAll(obj, '');

          createReplacingStr({ str, matchedStr, index });
        };

        const findAllSpreadInComponent = () => {
          let pattern, result;

          pattern = /[^$]{\.\.\.\w+}/g; // matches " {...bindProps}" in "<Test {...bindProps} />"
          do {
            result = pattern.exec(raw);
            if (result) {
              const { index } = result;
              const matchedStr = result[0];
              const obj = matchedStr
                .replace('...', '')
                .replace('{', '')
                .replace('}', '');
              findObjectThatWasSpread({ matchedStr, obj, index });
            }
          } while (result);
        };

        findAllSpreadInComponent();

        return newRaw;
      } catch (e) {
        return _raw;
      }
    },
  };
};
