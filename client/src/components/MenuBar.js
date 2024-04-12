import React, { useRef } from 'react';
import { FaBold, FaItalic, FaUnderline, FaStrikethrough, FaCode, FaListUl, FaListOl, FaQuoteRight, FaPaintBrush, FaHighlighter, FaEraser, FaRegEyeSlash, FaRegEye, FaSun } from 'react-icons/fa';

const MenuBar = ({ editor }) => {
  const textColorPickerRef = useRef(null);
  const highlightColorPickerRef = useRef(null);

  if (!editor) {
    return null;
  }

  const updateTextColor = (event) => {
    editor.chain().focus().setColor(event.target.value).run();
  };

  const updateHighlightColor = (event) => {
    editor.chain().focus().toggleHighlight({ color: event.target.value }).run();
  };

  const buttonBaseClasses = "btn btn-xs btn-ghost flex items-center justify-center mx-1 my-1";
  const dividerBaseClasses = "self-stretch bg-gray-400 mx-1 my-1";
  const iconSize = 18;
  const isBlurred = editor.isActive('textStyle', { blur: '2' });

  const toggleBlur = () => {
    if (isBlurred) {
      editor.chain().focus().unsetBlur().run();
    } else {
      editor.chain().focus().setBlur({ blur: '2' }).run();
    }
  };

  const openColorPicker = (pickerRef) => {
    if (pickerRef && pickerRef.current) {
      pickerRef.current.click();
    }
  };

  const isSharpened = editor.isActive('textStyle', { sharpen: true });

  const toggleSharpen = () => {
    editor.chain().focus().toggleSharpen().run();
  };

  return (
    <div className="bg-gray-700 p-1 rounded-lg shadow flex flex-wrap justify-start items-center mx-auto mt-0">
      <button onClick={() => editor.chain().focus().toggleBold().run()} className={`${buttonBaseClasses} ${editor.isActive('bold') ? 'btn-active' : ''}`}>
        <FaBold size={iconSize} />
      </button>
      <div className={`${dividerBaseClasses}`} style={{ height: '24px', width: '1px', backgroundColor: '#4B5563' }}></div> {/* Divider */}
      <button onClick={() => editor.chain().focus().toggleItalic().run()} className={`${buttonBaseClasses} ${editor.isActive('italic') ? 'btn-active' : ''}`}>
        <FaItalic size={iconSize} />
      </button>
      <div className={`${dividerBaseClasses}`} style={{ height: '24px', width: '1px', backgroundColor: '#4B5563'  }}></div> {/* Divider */}
      <button
        onClick={() => editor.chain().focus().toggleUnderline().run()} className={`${buttonBaseClasses} ${editor.isActive('underline') ? 'btn-active' : ''}`}>
        <FaUnderline size={iconSize} />
      </button>
      <div className={`${dividerBaseClasses}`} style={{ height: '24px', width: '1px', backgroundColor: '#4B5563'  }}></div> {/* Divider */}
      <button onClick={() => editor.chain().focus().toggleStrike().run()} className={`${buttonBaseClasses} ${editor.isActive('strike') ? 'btn-active' : ''}`}>
        <FaStrikethrough size={iconSize} />
      </button>
      <div className={`${dividerBaseClasses}`} style={{ height: '24px', width: '1px', backgroundColor: '#4B5563'  }}></div> {/* Divider */}
      <button onClick={() => editor.chain().focus().toggleCode().run()} className={`${buttonBaseClasses} ${editor.isActive('code') ? 'btn-active' : ''}`}>
        <FaCode size={iconSize} />
      </button>
      <div className={`${dividerBaseClasses}`} style={{ height: '24px', width: '1px', backgroundColor: '#4B5563'  }}></div> {/* Divider */}
      <button onClick={() => editor.chain().focus().toggleBulletList().run()} className={`${buttonBaseClasses} ${editor.isActive('bulletList') ? 'btn-active' : ''}`}>
        <FaListUl size={iconSize} />
      </button>
      <div className={`${dividerBaseClasses}`} style={{ height: '24px', width: '1px', backgroundColor: '#4B5563'  }}></div> {/* Divider */}
      <button onClick={() => editor.chain().focus().toggleOrderedList().run()} className={`${buttonBaseClasses} ${editor.isActive('orderedList') ? 'btn-active' : ''}`}>
        <FaListOl size={iconSize} />
      </button>
      <div className={`${dividerBaseClasses}`} style={{ height: '24px', width: '1px', backgroundColor: '#4B5563'  }}></div> {/* Divider */}
      <button onClick={() => editor.chain().focus().toggleBlockquote().run()} className={`${buttonBaseClasses} ${editor.isActive('blockquote') ? 'btn-active' : ''}`}>
        <FaQuoteRight size={iconSize} />
      </button>
      <div className={`${dividerBaseClasses}`} style={{ height: '24px', width: '1px', backgroundColor: '#4B5563'  }}></div> {/* Divider */}
      <button onClick={() => openColorPicker(textColorPickerRef)} className={`${buttonBaseClasses}`}>
        <FaPaintBrush size={iconSize} />
        <input type="color" onChange={updateTextColor} ref={textColorPickerRef} className="absolute opacity-0 w-0 h-0" />
      </button>
      <div className={`${dividerBaseClasses}`} style={{ height: '24px', width: '1px', backgroundColor: '#4B5563'  }}></div> {/* Divider */}
      <button onClick={() => openColorPicker(highlightColorPickerRef)} className={`${buttonBaseClasses}`}>
        <FaHighlighter size={iconSize} />
        <input type="color" onChange={updateHighlightColor} ref={highlightColorPickerRef} className="absolute opacity-0 w-0 h-0" />
      </button>
      <div className={`${dividerBaseClasses}`} style={{ height: '24px', width: '1px', backgroundColor: '#4B5563'  }}></div> {/* Divider */}
      <button onClick={toggleBlur} className={`${buttonBaseClasses} ${isBlurred ? 'btn-active' : ''}`}>
        {isBlurred ? <FaRegEyeSlash size={iconSize} /> : <FaRegEye size={iconSize} />}
      </button>
      <div className={`${dividerBaseClasses}`} style={{ height: '24px', width: '1px', backgroundColor: '#4B5563'  }}></div> {/* Divider */}
      <button onClick={toggleSharpen} className={`${buttonBaseClasses} ${isSharpened ? 'btn-active' : ''}`}>
        <FaSun size={iconSize} />
      </button>
      <div className={`${dividerBaseClasses}`} style={{ height: '24px', width: '1px', backgroundColor: '#4B5563'  }}></div> {/* Divider */}
      <button onClick={() => editor.chain().focus().unsetAllMarks().clearNodes().run()} className={`${buttonBaseClasses}`}>
        <FaEraser size={iconSize} />
      </button>
    </div>
  );
};

export default MenuBar;