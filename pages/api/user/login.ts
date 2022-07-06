import { NextApiRequest, NextApiResponse } from 'next';
import { withIronSessionApiRoute } from 'iron-session/next';
import { ironOptions } from 'config/index';
import { prepareConnection } from 'db/index';
import { User } from 'db/entity/index';
import { ISession } from 'pages/api/index';

export default withIronSessionApiRoute(login, ironOptions);

async function login(req: NextApiRequest, res: NextApiResponse) {
  const session: ISession = req.session;
  const { phone = '', verify = '' } = req.body;
  const db = await prepareConnection();
  const userRepo = db.getRepository(User);
  const users = await userRepo.find();

  if (String(session.verifyCode) == String(verify)) {
    //用户输入了正确的验证码
  }
  console.log(111);
  console.log('phone');
  console.log('verify');
  console.log(users);

  res.status(200).json({
    phone,
    verify,
    code: 0,
  });
}
