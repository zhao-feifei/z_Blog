import { NextApiRequest, NextApiResponse } from 'next';
import { withIronSessionApiRoute } from 'iron-session/next';
import { format } from 'date-fns';
import md5 from 'md5';
import { encode } from 'js-base64';
import request from 'service/fetch';
import { ISession } from 'pages/api/index';
import { ironOptions } from 'config/index';

export default withIronSessionApiRoute(sendVerifyCode, ironOptions);

async function sendVerifyCode(req: NextApiRequest, res: NextApiResponse) {
  const session: ISession = req.session;
  const { to = '', templateId = 1 } = req.body;
  const AppId = '8a216da881ad97540181c81351f5047f';
  const AccountId = '8a216da881ad97540181c81351050478';
  const AuthToken = '756a3661528b40f99ffea3d525f2d4cc';
  const NowDate = format(new Date(), 'yyyyMMddHHmmss');
  const SigParameter = md5(`${AccountId}${AuthToken}${NowDate}`);
  const Authorization = encode(`${AccountId}:${NowDate}`);
  const verifyCode = Math.floor(Math.random() * (9999 - 1000)) + 1000;
  const expireMinute = '5';
  const url = `https://app.cloopen.com:8883/2013-12-26/Accounts/${AccountId}/SMS/TemplateSMS?sig=${SigParameter}`;
  console.log(url);

  const response = await request.post(
    url,
    {
      to,
      templateId,
      appId: AppId,
      datas: [verifyCode, expireMinute],
    },
    {
      headers: {
        Authorization,
      },
    }
  );
  console.log(verifyCode);
  console.log(response);
  const { statusCode, statusMsg,templateSMS } = response as any;
  if (statusCode === '000000') {
    session.verifyCode = verifyCode;
    await session.save();
      res.status(200).json({
      code:0,
      mag:statusMsg,
      data:{
       templateSMS
      }
    })
  }else {
    res.status(200).json({
      code:statusCode,
      mag:statusMsg
    })
  }

}
