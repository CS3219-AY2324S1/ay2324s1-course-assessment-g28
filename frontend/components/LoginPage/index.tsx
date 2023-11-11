import Card1 from "./Card1";
import Card2 from "./Card2";
import Card3 from "./Card3";
import Card4 from "./Card4";
import LoginButtonGroup, { Providers } from "./LoginButtonGroup";

type LoginPageComponentProps = {
  providers: Providers;
};

export const CALL_TO_ACTION = "call_to_action";

const LoginPageComponent = (props: LoginPageComponentProps) => {
  return (
    <div className="!scroll-smooth">
      <Card1 {...props} />
      <Card2 />
      <Card3 />
      <Card4 />
      <div className="w-full h-[200px] mb-40 text-center">
        <div id={CALL_TO_ACTION} className="text-[3em] font-semibold mb-3">
          Start coding!
        </div>
        <LoginButtonGroup {...props} />
      </div>
    </div>
  );
};

export default LoginPageComponent;
