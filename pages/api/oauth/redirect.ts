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
  const redirect_uri='http://localhost:3000/api/oauth/redirect'
  const githubClientID ='45179a660ee8a3a73bc603c902e22bc7f9194f2963d2fb1f9f403896ffa5abfb';
  const githubClientSecret ='943d2aeaef2b1fa6254c266cea1afdeddd870dae2f4fc2728240c6cc2bf1aa07';
  // const url = `https://github.com/login/oauth/access_token?client_id=${githubClientID}&client_secret=${githubClientSecret}&code=${code}`;
  const url = `https://gitee.com/oauth/token?grant_type=authorization_code&code=${code}&client_id=${githubClientID}&redirect_uri=${redirect_uri}&client_secret=${githubClientSecret}`;
  console.log('下面是请求的url');
  console.log(url);

 const result= await request.post(
    url,
    // {},
    // {
    //   headers: {
    //     accept: 'application/json',
    //   },
    // }
  )
  

  console.log(222222);
  console.log(result);

  const { access_token } = result as any;

  console.log(33333);
  console.log(access_token);

  // const githubUserInfo= await  request.get('https://api.github.com/user',{
  //   headers: {
  //     accept: 'application/json',
  //     Authorization:`token ${access_token}`
  //   }
  // })
  const githubUserInfo= await  request.get(`https://gitee.com/api/v5/user?access_token=${access_token}`)

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

    // res.writeHead(302,{
    //   Location:''
    // });
    res?.status(200).json({   
        msg: '登录成功',
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

 
   res?.status(200).json({   
        msg: '登录成功',
      });
  }
}
