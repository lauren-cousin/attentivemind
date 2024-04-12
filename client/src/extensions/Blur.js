import { Extension } from '@tiptap/core';

export const BlurExtension = Extension.create({
  name: 'blur',

  addGlobalAttributes() {
    return [
      {
        types: ['textStyle'],
        attributes: {
          blur: {
            default: null,
            renderHTML: attributes => {
              if (!attributes.blur) {
                return {};
              }

              return { style: `filter: blur(${attributes.blur}px);` };
            },
            parseHTML: element => ({ blur: element.style.filter?.match(/blur\((\d+)px\)/)?.[1] }),
          },
        },
      },
    ];
  },

  addCommands() {
    return {
      setBlur: attributes => ({ chain }) => {
        return chain().setMark('textStyle', { blur: attributes.blur }).run();
      },
      unsetBlur: () => ({ chain }) => {
        return chain().setMark('textStyle', { blur: null }).removeEmptyTextStyle().run();
      },
    };
  },
});

export default BlurExtension;