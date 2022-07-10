import { NextApiRequest, NextApiResponse } from 'next';
import { withIronSessionApiRoute } from 'iron-session/next';
import { Cookie } from 'next-cookie';
import { ironOptions } from 'config/index';
import { ISession } from 'pages/api/index';
import { setCookie } from 'utils/index';
import { prepareConnection } from 'db/index';
import { User, Article } from 'db/entity/index';
import { EXCEPTION_ARTICLE } from 'pages/api/config/codes';

export default withIronSessionApiRoute(update, ironOptions);

async function update(req: NextApiRequest, res: NextApiResponse) {
  const { title = '', content = '', id = 0 } = req.body;
  const db = await prepareConnection();
  const articleRepo = db.getRepository(Article);
  const article = await articleRepo.findOne({
    where: { id },
    relations: ['user'],
  });

  if (article) {
    article.title = title;
    article.content = content;
    article.update_time = new Date();

    const resArticle = await articleRepo.save(article);
    if (resArticle) {
      res.status(200).json({
        data: resArticle,
        code: 0,
        msg: '更新成功',
      });
    } else {
      res.status(200).json({
        ...EXCEPTION_ARTICLE.UPDATE_FAILED,
      });
    }
  } else {
    res.status(200).json({
      ...EXCEPTION_ARTICLE.NOT_FOUND,
    });
  }
}
