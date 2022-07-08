import '@uiw/react-md-editor/markdown-editor.css';
import '@uiw/react-markdown-preview/markdown.css';
import dynamic from 'next/dynamic';
import { useState } from 'react';
import { styles } from './index.module.sass';

const MDEditor = dynamic(() => import('@uiw/react-md-editor'), { ssr: false });

function NewEditor() {
  const [value, setValue] = useState('**Hello world!!!**');
  return (
    <div className={styles.container}>
      <MDEditor value={value} onChange={setValue} />
    </div>
  );
}
NewEditor.layout = null;
export default NewEditor;
