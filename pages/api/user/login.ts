import { NextApiRequest, NextApiResponse } from 'next';
import { withIronSessionApiRoute } from 'iron-session/next';
import { ironOptions } from 'config/index';
import { prepareConnection } from 'db/index';
import { User, UserAuth } from 'db/entity/index';
import { ISession } from 'pages/api/index';

export default withIronSessionApiRoute(login, ironOptions);

async function login(req: NextApiRequest, res: NextApiResponse) {
  const session: ISession = req.session;
  const { phone = '', verify = '', identity_type = 'phone' } = req.body;
  const db = await prepareConnection();

  const userRepo = db.getRepository(User);
  const userAuthRepo = db.getRepository(UserAuth);

  if (String(session.verifyCode) == String(verify)) {
    //用户输入了正确的验证码
    const userAuth = await userAuthRepo.findOne(
      {
        identity_type,
        identifier: phone,
      },
      {
        relations: ['user'],
      }
    );
    console.log(1111);
    console.log(userAuth);

    if (userAuth) {
      //已经注册过
      const user = userAuth.user;
      const { id, nickname, avatar } = user;

      session.id = id;
      session.nickname = nickname;
      session.avatar = avatar;

      await session.save();
      res?.status(200).json({
        code: 0,
        msg: '登陆成功',
        data: { userId: id, nickname, avatar },
      });
    } else {
      //新用户
      const user = new User();
      user.nickname = `用户_${Math.floor(Math.random() * 10000)}`;
      user.avatar = '/images/avatar.png';
      user.job = '暂无';
      user.introduce = '暂无';

      const userAuth = new UserAuth();
      userAuth.identifier = phone;
      userAuth.identity_type = identity_type;
      userAuth.credential = session.verifyCode;
      userAuth.user = user;

      const resUserAuth = await userAuthRepo.save(userAuth);
      const {
        user: { id, nickname, avatar },
      } = resUserAuth;
      session.id = id;
      session.nickname = nickname;
      session.avatar = avatar;

      await session.save();
      res?.status(200).json({
        code: 0,
        msg: '登陆成功',
        data: { userId: id, nickname, avatar },
      });
    }
  } else {
    res?.status(200).json({
      code: -1,
      msg: '验证码错误',
    });
  }
  console.log('结束');
  console.log('phone');
  console.log('verify');

  res.status(200).json({
    phone,
    verify,
    code: 0,
  });
}
