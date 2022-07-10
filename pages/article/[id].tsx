import { Article } from 'db/entity';
import Link from 'next/link';
import { useState } from 'react';
import { prepareConnection } from 'db/index';
import { IArticle } from 'pages/api';
import styles from './index.module.scss';
import { Avatar, Input, Button, message, Divider } from 'antd';
import { observer } from 'mobx-react-lite';
import { useStore } from 'store/index';
import MarkDown from 'markdown-to-jsx';
import { format } from 'date-fns';
import request from 'service/fetch';

interface IProps {
  article: IArticle;
}

export async function getServerSideProps({ params }: any) {
  const articleId = params?.id;
  const db = await prepareConnection();
  const articleRepo = db.getRepository(Article);
  const article = await articleRepo.findOne({
    where: { id: articleId },
    relations: ['user','comments','comments.user'],
  });
  //阅读次数
  if (article) {
    article.views = article?.views + 1;
    await articleRepo.save(article);
  }

  return {
    props: {
      article: JSON.parse(JSON.stringify(article)) || [],
    },
  };
}

const ArticleDetail = (props: IProps) => {
  const store = useStore();
  const loginUserInfo = store?.user?.userInfo;
  const { article } = props;
  const {
    user: { nickname, avatar, id },
  } = article;
  const [inputVal, setInputVal] = useState('');

  const handleComment = () => {
    request
      .post('/api/comment/publish', {
        articleId: article?.id,
        content: inputVal,
      })
      .then((res: any) => {
        if (res.code === 0) {
          message.success('发表成功');
          setInputVal('');
        } else {
          message.error('发表失败');
        }
      });
  };

  return (
    <div>
      <div className="content-layout">
        <h2 className={styles.title}>{article.title}</h2>
        <div className={styles.user}>
          <Avatar src={avatar} size={50}></Avatar>
          <div className={styles.info}>
            <div className={styles.name}>{nickname}</div>
            <div className={styles.date}>
              <div>
                {format(new Date(article?.update_time), 'yyyy-MM-dd HH:mm:ss')}
              </div>
              <div>阅读{article?.views}</div>
              {Number(loginUserInfo?.userId) === Number(id) && (
                <Link href={`/editor/${article?.id}`}>编辑</Link>
              )}
            </div>
          </div>
        </div>
        <MarkDown className={styles.markdown}>{article?.content}</MarkDown>
      </div>
      <div className={styles.divider}></div>
      <div className="content-layout">
        <div className={styles.comment}>
          <h3>评论</h3>
          {loginUserInfo?.userId && (
            <div className={styles.enter}>
              <Avatar src={avatar}></Avatar>
              <div className={styles.content}>
                <Input.TextArea
                  placeholder="请输入评论"
                  rows={4}
                  value={inputVal}
                  onChange={(event) => {
                    setInputVal(event?.target.value);
                  }}
                ></Input.TextArea>
                <Button type="primary" onClick={handleComment}>
                  发表评论
                </Button>
              </div>
            </div>
          )}
          <Divider></Divider>
          <div className={}></div>
        </div>
      </div>
    </div>
  );
};

export default observer(ArticleDetail);
