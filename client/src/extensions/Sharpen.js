import { Extension } from '@tiptap/core';

export const SharpenExtension = Extension.create({
  name: 'sharpen',

  addGlobalAttributes() {
    return [
      {
        types: ['textStyle'],
        attributes: {
          sharpen: {
            default: null,
            renderHTML: attributes => {
              if (!attributes.sharpen) {
                return {};
              }
              
              return {
                class: 'font-bold text-shadow',
                style: `filter: brightness(110%) contrast(110%); -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; text-rendering: optimizeLegibility;`,
              };
            },
            parseHTML: element => {
              return {
                sharpen: element.classList.contains('font-bold') && element.classList.contains('text-shadow'),
              };
            },
          },
        },
      },
    ];
  },

  addCommands() {
    return {
      toggleSharpen: () => ({ chain }) => {
        return chain().toggleMark('textStyle', { sharpen: true }).run();
      },
    };
  },
});

export default SharpenExtension;