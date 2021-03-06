import { ChangeEvent, useState } from 'react';
import request from 'service/fetch';
import { message } from 'antd';
import { useStore } from 'store/index';
import styles from './index.module.scss';
import CountDown from 'components/CountDown';
import { observer } from 'mobx-react-lite';

interface IProps {
  isShow: boolean;
  onClose: Function;
}

const Login = (props: IProps) => {
  const store = useStore();
  const { isShow = false, onClose } = props;
  const [isShowVerifyCode, setIsShowVerifyCode] = useState(false);
  const [form, setForm] = useState({
    phone: '',
    verify: '',
  });

  const handleClose = () => {
    onClose && onClose();
  };
  const handleGetVerifyCode = () => {
    // setIsShowVerifyCode(true);
    if (!form?.phone) {
      message.warning('请输入手机号');
      return;
    }

    request
      .post('/api/user/sendVerifyCode', {
        to: form?.phone,
        templateId: 1,
      })
      .then((res: any) => {
        console.log(res);

        if (res?.code === 0) {
          setIsShowVerifyCode(true);
        } else {
          message.error(res?.msg || '未知错误handleGetVerifyCode');
        }
      });
  };
  const handleLogin = () => {
    request
      .post('/api/user/login', {
        ...form,
        identity_type: 'phone',
      })
      .then((res: any) => {
        if (res?.code === 0) {
          // 登录成功
          store.user.setUserInfo(res?.data);
          onClose && onClose();
        } else {
          message.error(res?.msg || '未知错误');
        }
      });
  };
  // 8ed73a12a49dfb9ff6ddefd8f3a194c6002ac140
  // 026f7585e1b658001732
  const handleOAuthGithub = async () => {
    const githubClientid =
      '45179a660ee8a3a73bc603c902e22bc7f9194f2963d2fb1f9f403896ffa5abfb';
    const redirectUrl = 'http://localhost:3000/api/oauth/redirect';

    // window.location.href = `https://gitee.com/oauth/authorize?client_id=${githubClientid}&redirect_uri=${redirectUrl}&response_type=code`;

    // window.location.href = `https://gitee.com/oauth/authorize?client_id=${githubClientid}&redirect_uri=${redirectUrl}&response_type=code`;
    window.open(
      `https://gitee.com/oauth/authorize?client_id=${githubClientid}&redirect_uri=${redirectUrl}&response_type=code`
    );
    setTimeout(() => {
      window.location.href = 'http://localhost:3000/';
    }, 3000);
  };
  const handleFormChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: value,
    });
  };
  const handelCountDownEnd = () => {
    // alert(111);
    setIsShowVerifyCode(false);
  };

  return isShow ? (
    <div className={styles.loginArea}>
      <div className={styles.loginBox}>
        <div className={styles.loginTitle}>
          <div>手机号登录</div>
          <div className={styles.close} onClick={handleClose}>
            x
          </div>
        </div>
        <input
          name="phone"
          type="text"
          placeholder="请输入手机号"
          value={form.phone}
          onChange={handleFormChange}
        />
        <div className={styles.verifyCodeArea}>
          <input
            name="verify"
            type="text"
            placeholder="请输入验证码"
            value={form.verify}
            onChange={handleFormChange}
          />
          <span className={styles.verifyCode} onClick={handleGetVerifyCode}>
            {isShowVerifyCode ? (
              <CountDown time={10} onEnd={handelCountDownEnd} />
            ) : (
              '获取验证码'
            )}
          </span>
        </div>
        <div className={styles.loginBtn} onClick={handleLogin}>
          登录
        </div>
        <div className={styles.otherLogin} onClick={handleOAuthGithub}>
          使用github登录
        </div>
        <div className={styles.loginPrivacy}>
          注册登录即表示同意
          <a href="https://github.com/" target="_blank" rel="noreferrer">
            隐私政策
          </a>
        </div>
      </div>
    </div>
  ) : null;
};

export default observer(Login);
