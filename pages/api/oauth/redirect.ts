import { NextApiRequest, NextApiResponse } from 'next';
import { withIronSessionApiRoute } from 'iron-session/next';
import { Cookie } from 'next-cookie';
import { ironOptions } from 'config/index';
import  request  from 'service/fetch';
import { ISession } from 'pages/api/index';
import { setCookie } from 'utils/index';
import { prepareConnection } from 'db/index';
import { User, UserAuth } from 'db/entity/index';

export default withIronSessionApiRoute(redirect, ironOptions);
// 8ed73a12a49dfb9ff6ddefd8f3a194c6002ac140
// 026f7585e1b658001732
async function redirect(req: NextApiRequest, res: NextApiResponse) {

  const session: ISession = req.session;
  const code = req.query.code || {};
  console.log(111111);
  console.log(code);
  const githubClientID ='026f7585e1b658001732';
  const githubClientSecret ='8ed73a12a49dfb9ff6ddefd8f3a194c6002ac140';
  const url = `https://github.com/login/oauth/access_token?client_id=${githubClientID}&client_secret=${githubClientSecret}&code=${code}`;
  console.log('下面是请求的url');
  console.log(url);

 const result= await request.post(
    url,
    {},
    {
      headers: {
        accept: 'application/json',
      },
    }
  )

  console.log(222222);
  console.log(result);

  const { access_token } = result as any;

  console.log(33333);
  console.log(access_token);

  const githubUserInfo= await  request.get('https://api.github.com/user',{
    headers: {
      accept: 'application/json',
      Authorization:`token ${access_token}`
    }
  })
  console.log(githubUserInfo);

  const cookies=Cookie.fromApiRoute(req,res);
  const db=await prepareConnection();
  const userAuth=await db.getRepository(UserAuth).findOne({
    identity_type:'github',
    identifier:'githubClientID'
  },{
    relations:['user']
  })

  console.log(5555);
  console.log(userAuth);

  if(userAuth){
    //之前登录过
    const user= userAuth.user;
    const {id,nickname, avatar}=user;

    console.log(6666666);
    console.log(user);

    userAuth.credential=access_token

    session.userId = id;
    session.nickname = nickname;
    session.avatar = avatar;

    await session.save();

    setCookie(cookies, { id, nickname, avatar });

    res.writeHead(302,{
      Location:'/'
    });
  }else{
    //创建新用户
   const {login,avatar_url} =githubUserInfo as any;
    const user=new User();
    user.nickname=login;
    user.avatar=avatar_url;

    const userAuth=new UserAuth();
    userAuth.identity_type='github';
    userAuth.identifier=githubClientID;
    userAuth.credential=access_token;
    userAuth.user=user;

    const userAuthRepo=db.getRepository(UserAuth)
    const resUserAuth=await userAuthRepo.save(userAuth);

    console.log(777777);
    console.log(resUserAuth);

    const {id,nickname, avatar}=resUserAuth?.user||{};
    session.userId = id;
    session.nickname = nickname;
    session.avatar = avatar;

    await session.save();

    setCookie(cookies, {id, nickname, avatar });
    console.log(88888);
    console.log('cookie设置成功');
    console.log(id,nickname,avatar);

    res.writeHead(302,{
      Location:'/'
    });
  }
}
