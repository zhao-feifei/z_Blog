import '@uiw/react-md-editor/markdown-editor.css';
import '@uiw/react-markdown-preview/markdown.css';
import dynamic from 'next/dynamic';
import { useState } from 'react';
import  styles  from './index.module.scss';
import { Input ,Button } from 'antd';

const MDEditor = dynamic(() => import('@uiw/react-md-editor'), { ssr: false });

function NewEditor() {
  const [content, setContent] = useState('**Hello world!!!**');
  const [title,setTitle]=useState('')
  const handlePublish=()=>{

  }
  const handleTitleChange=(event)=>{
    setTitle(event?.target?.value)
  }

  return (
    <div className={styles.container}>
      <div className={styles.operation}>
        <Input className={styles.title} placeholder="请输入文章标题" value={title}onChange={handleTitleChange}></Input>
        <Button className={styles.button} type="primary" onClick={handlePublish}>发布</Button>
      </div>
      <MDEditor value={content} height={1080} onChange={setContent} />
    </div>
  );
}
(NewEditor as any).layout = null;
export default NewEditor;
