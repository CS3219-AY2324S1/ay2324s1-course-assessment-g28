import Button from "@/components/Button";
import { BuiltInProviderType } from "next-auth/providers/index";
import { ClientSafeProvider, signIn } from "next-auth/react";
import { LiteralUnion } from "react-hook-form";

export type Providers =
  | Record<LiteralUnion<BuiltInProviderType, string>, ClientSafeProvider>
  | never[];

type LoginButtonGroupProps = {
  providers?: Providers;
  displayText?: string;
};

const LoginButtonGroup = ({
  providers,
  displayText,
}: LoginButtonGroupProps) => {
  if (!providers) {
    return null;
  }

  if (Object.values(providers).length === 1) {
    const { id, name } = Object.values(providers)[0] ?? {};
    return id && name ? (
      <Button
        onClick={() => signIn(id)}
        key={id}
        color="secondary"
        className="glow text-background"
      >
        {displayText ?? `Sign in with ${name}`}
      </Button>
    ) : null;
  }

  return (
    <div className="flex justify-start">
      {Object.values(providers).map((p) => {
        const { id, name } = p ?? {};
        return id && name ? (
          <Button
            onClick={() => signIn(id)}
            key={id}
            color="secondary"
            className="text-background"
          >
            {displayText ?? `Sign in with ${name}`}
          </Button>
        ) : null;
      })}
    </div>
  );
};

export default LoginButtonGroup;
