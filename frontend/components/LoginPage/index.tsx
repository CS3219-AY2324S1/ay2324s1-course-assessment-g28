import CallToActionCard from "./cards/CallToActionCard";
import Card1 from "./cards/Card1";
import Card2 from "./cards/Card2";
import Card3 from "./cards/Card3";
import Card4 from "./cards/Card4";
import { Providers } from "./LoginButtonGroup";

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
      <CallToActionCard {...props} />
    </div>
  );
};

export default LoginPageComponent;
