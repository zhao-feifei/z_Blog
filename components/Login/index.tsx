interface IProps {
  isShow: boolean;
  onClose: Function;
}

const Login = (props: IProps) => {
  console.log(props);
  const { isShow = false } = props;
  return isShow ? <div>登录弹框</div> : null;
};
export default Login;
