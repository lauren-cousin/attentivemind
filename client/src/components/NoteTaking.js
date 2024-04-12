import React from 'react';
import { useSummary } from '../SummaryContext';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Color from '@tiptap/extension-color';
import Highlight from '@tiptap/extension-highlight';
import ListItem from '@tiptap/extension-list-item';
import TextStyle from '@tiptap/extension-text-style';
import Placeholder from '@tiptap/extension-placeholder';
import Underline from '@tiptap/extension-underline';
import BlurExtension from '../extensions/Blur';
import SharpenExtension from '../extensions/Sharpen';
import MenuBar from './MenuBar';

function NoteTaking() {
    const { generatedSummary, keyConcepts } = useSummary();
    const editor = useEditor({
      extensions: [
        StarterKit.configure({
          orderedList: {
            HTMLAttributes: {
              class: 'list-decimal pl-5',
            },
          },
          bulletList: {
            HTMLAttributes: {
              class: 'list-disc pl-5',
            },
          },
          listItem: {
          },
        }),
        Color.configure({ types: [TextStyle.name, ListItem.name] }),
        Highlight.configure({ multicolor: true }),
        TextStyle.configure({ 
            types: [ListItem.name],
            styles: {
                color: {},
                backgroundColor: {},
              },
        }),
        Underline,
        BlurExtension,
        SharpenExtension,
        Placeholder.configure({
            placeholder: 'Start taking notes here...', // Placeholder text
            showOnlyWhenEditable: true,
            showOnlyCurrent: true,
            // Fix for placeholder text: https://github.com/ueberdosis/tiptap/issues/2659
            emptyEditorClass: 'cursor-text before:content-[attr(data-placeholder)] before:absolute before:text-mauve-11 before:opacity-50 before-pointer-events-none',
          }),
      ],
      content: '',
      onUpdate: ({ editor }) => {
        const isEmpty = editor.isEmpty;
      
        if (isEmpty) {
          const defaultContent = {
            type: 'paragraph',
            content: [],
          };

          editor.commands.setContent(defaultContent);
        }
      },
    });
  
    return (
        <div className="flex flex-col md:flex-row p-4 gap-8">
          <div className="md:flex-[2_2_0%] space-y-4 mr-8">
            <h1 className="font-merriweather text-5xl">AttentiveMind</h1>
            <p className="font-manrope text-2xl">Take notes alongside your lectures with focus indicators and highlights from your summary and key concepts.</p>
            <div>
                {editor && <MenuBar editor={editor} />}
                <EditorContent 
                    editor={editor}
                    className="ProseMirror p-4 min-h-[500px] bg-white shadow rounded-lg"
                />
            </div>
          </div>
          <div className="md:flex-[1_1_0%] space-y-4 mt-4 md:mt-48">
            <div className="bg-white shadow rounded-lg p-4">
              <h2 className="text-xl font-bold mb-2">Generated Summary:</h2>
              {generatedSummary ? (<p>{generatedSummary}</p>) : (<p className="text-gray-500">No summary available. Visit <a href="/text-summarization" className="text-blue-500 hover:underline">Text Summarization</a> to generate.</p>)}
            </div>
            <div className="bg-white shadow rounded-lg p-4">
              <h2 className="text-xl font-bold mb-2">Key Concepts:</h2>
              {keyConcepts.length > 0 ? (
                <ul className="list-disc pl-5">
                    {/* Filter duplicates */}
                    {Array.from(new Set(keyConcepts.map(kp => kp.toLowerCase())))
                        .map(kp => kp.charAt(0).toUpperCase() + kp.slice(1))
                        .map((kp, index) => (
                            <li key={index}>{kp}</li>
                    ))}
                </ul>
              ) : (
                <p className="text-gray-500">No key concepts identified. Visit <a href="/text-summarization" className="text-blue-500 hover:underline">Text Summarization</a> to generate.</p>
              )}
            </div>
          </div>
        </div>
    );
}
  
  export default NoteTaking;