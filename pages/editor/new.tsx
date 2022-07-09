import '@uiw/react-md-editor/markdown-editor.css';
import '@uiw/react-markdown-preview/markdown.css';
import dynamic from 'next/dynamic';
import { useState } from 'react';
import  styles  from './index.module.scss';
import { Input ,Button,message } from 'antd';
import request from 'service/fetch';
import { observer } from 'mobx-react-lite';
import {useStore} from 'store/index'
import {useRouter} from 'next/router'

const MDEditor = dynamic(() => import('@uiw/react-md-editor'), { ssr: false });

function NewEditor() {
  const store=  useStore();
  const {push} =useRouter()
  const {  userId } = store.user.userInfo;
  const [content, setContent] = useState('**Hello world!!!**');
  const [title,setTitle]=useState('')

  const handlePublish=()=>{
    if(!title){
      message.warning('请输入标题')
      return;
    }else{
    request.post('/api/article/publish', {
      title,content
    }).then((res:any)=>{
      if(res?.code===0){
        message.success('发布成功')
        userId?push(`/user/${userId}`):push('/')
      }else{
        console.log(res);
        message.error(res?.msg||'发布失败')
      }
    })
    }
  }
  const handleTitleChange=(event: any)=>{
    setTitle(event?.target?.value)
  }

  const handContentChange=(content:any)=>{
    setContent(content)
  }

  return (
    <div className={styles.container}>
      <div className={styles.operation}>
        <Input className={styles.title} placeholder="请输入文章标题" value={title}onChange={handleTitleChange}></Input>
        <Button className={styles.button} type="primary" onClick={handlePublish}>发布</Button>
      </div>
      <MDEditor value={content} height={1080} onChange={handContentChange} />
    </div>
  );
}
(NewEditor as any).layout = null;
export default observer(NewEditor);
