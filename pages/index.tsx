import { prepareConnection } from 'db/index';
import { Article } from 'db/entity';
import ListItem from 'components/ListItem';
import { IArticle } from 'pages/api/index';

interface IProps {
  articles: IArticle[];
}

export async function getServerSideProps() {
  const db = await prepareConnection();
  const articles = await db.getRepository(Article).find({
    relations: ['user'],
  });

  return {
    props: {
      articles: JSON.parse(JSON.stringify(articles)) || [],
    },
  };
}

const Home = (props: IProps) => {
  const { articles } = props;

  return (
    <div>
      <div className={'content-layout'}>
        {articles?.map((article) => (
          // eslint-disable-next-line react/jsx-key
          <ListItem article={article}></ListItem>
        ))}
      </div>
    </div>
  );
};
export default Home;
