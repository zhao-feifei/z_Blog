import { useState } from 'react';
import styles from './index.module.scss';

interface IProps {
  isShow: boolean;
  onClose: Function;
}

const Login = (props: IProps) => {
  const { isShow = false } = props;
  const [form, setForm] = useState({
    phone: '',
    verify: '',
  });

  const handleClose = () => {};
  const handleGetVerifyCode = () => {};
  const handleLogin = () => {};
  const handleOAuthGithub = () => {};
  const handleFormChange = (e: HTMLInputElement) => {
    const { name, value } = e?.target;
    setForm({
      ...form,
      [name]: value,
    });
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
            请输入验证码
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
export default Login;
