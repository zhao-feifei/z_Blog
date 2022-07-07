interface ICookieInfo {
  id: number;
  nickname: string;
  avatar: string;
}

export const setCookie = (
  cookies: any,
  { id, nickname, avatar }: ICookieInfo
) => {
  //登录时效 24小时
  const expires = new Date(Date.now() + 24 * 3600 * 1000);
  const path = '/';

  cookies.set('userId', id, {
    path,
    expires,
  });

  cookies.set('nickname', nickname, {
    path,
    expires,
  });

  cookies.set('avatar', avatar, {
    path,
    expires,
  });
};

export const clearCookie = (cookies: any) => {
  const expires = new Date(Date.now() + 24 * 3600 * 1000);
  const path = '/';

  cookies.set('userId', '', {
    path,
    expires,
  });

  cookies.set('nickname', '', {
    path,
    expires,
  });

  cookies.set('avatar', '', {
    path,
    expires,
  });
};
