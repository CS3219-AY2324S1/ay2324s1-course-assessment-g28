import Card1 from "./cards/Card1";
import { Providers } from "./LoginButtonGroup";

type LoginPageComponentProps = {
  providers: Providers;
};

export const CALL_TO_ACTION = "call_to_action";

const LoginPageComponent = (props: LoginPageComponentProps) => {
  return (
    <div className="!scroll-smooth">
      <Card1 {...props} />
    </div>
  );
};

export default LoginPageComponent;
