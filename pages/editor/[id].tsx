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
import { prepareConnection } from 'db/index';
import { Article } from 'db/entity';
import { IArticle } from 'pages/api';

interface IProps {
  article: IArticle;
}

export async function getServerSideProps({ params }: any) {
  const articleId = params?.id;
  const db = await prepareConnection();
  const articleRepo = db.getRepository(Article);
  const article = await articleRepo.findOne({
    where: { id: articleId },
    relations: ['user'],
  });



  return {
    props: {
      article: JSON.parse(JSON.stringify(article)) || [],
    },
  };
}

const MDEditor = dynamic(() => import('@uiw/react-md-editor'), { ssr: false });

function ModifyEditor({article}:IProps) {
  const store=  useStore();
  const {push,query} =useRouter();
  const articleId=query.id;
  const {  userId } = store.user.userInfo;
  const [content, setContent] = useState(article?.title||'');
  const [title,setTitle]=useState(article?.content||'')

  const handlePublish=()=>{
    if(!title){
      message.warning('请输入标题')
      return;
    }else{
    request.post('/api/article/update', {
      id:articleId,
      title,content
    }).then((res:any)=>{
      if(res?.code===0){
        articleId?push(`/article/${articleId}`):push('/');
        message.success('更新成功')
       
      }else{
        console.log(res);
        message.error(res?.msg||'更新失败')
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

(ModifyEditor as any).layout = null;
export default observer(ModifyEditor);
