import { useState } from 'react';
import { NextPage } from 'next';
import { observer } from 'mobx-react-lite';
import { navs } from './config';
import Link from 'next/link';
import styles from './index.module.scss';
import { useRouter } from 'next/router';
import { Button, Dropdown, Avatar, Menu, message } from 'antd';
import Login from 'components/Login';
import { useStore } from 'store/index';
import request from 'service/fetch';

const Navbar: NextPage = () => {
  const store = useStore();
  const { pathname, push } = useRouter();
  const [isShowLogin, setIsShowLogin] = useState(false);
  const { avatar, userId } = store.user.userInfo;

  const handleGotoEditorPage = () => {
    if (userId) {
      push('/editor/new');
    } else {
      message.warning('请先登录！');
    }
  };
  const handleLogin = () => {
    setIsShowLogin(true);
  };
  const handleClose = () => {
    setIsShowLogin(false);
  };
  const handleGotoPersonalPage = () => {
    push(`/user/${userId}`);
  };
  const handleLogout = () => {
    request.post('/api/user/logout').then((res: any) => {
      if (res?.code === 0) {
        store.user.setUserInfo({});
      }
    });
  };

  const renderDropdownMenu = () => {
    return (
      <Menu>
        <Menu.Item onClick={handleGotoPersonalPage}>个人主页</Menu.Item>
        <Menu.Item onClick={handleLogout}>退出</Menu.Item>
      </Menu>
    );
  };
  return (
    <div className={styles.navbar}>
      <section className={styles.logArea}>Blog-C</section>
      <section className={styles.linkArea}>
        {navs?.map((nav) => (
          <Link key={nav?.label} href={nav?.value}>
            <a className={pathname === nav?.value ? styles.active : ''}>
              {nav?.label}
            </a>
          </Link>
        ))}
      </section>
      <section className={styles.operationArea}>
        <Button onClick={handleGotoEditorPage}>写文章</Button>
        {userId ? (
          <Dropdown overlay={renderDropdownMenu()} placement="bottomLeft">
            <Avatar src={avatar} size={32}></Avatar>
          </Dropdown>
        ) : (
          <Button type="primary" onClick={handleLogin}>
            登录
          </Button>
        )}
      </section>
      <Login isShow={isShowLogin} onClose={handleClose} />
    </div>
  );
};
export default observer(Navbar);
