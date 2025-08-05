import { PrivyProvider as BasePrivyProvider } from "@privy-io/react-auth";
import { ReactNode } from "react";

const PRIVY_APP_ID = import.meta.env.VITE_PRIVY_APP_ID;

export const PrivyProvider = ({ children }: { children: ReactNode }) => {
  return (
    <BasePrivyProvider
      appId={PRIVY_APP_ID}
      config={{
        embeddedWallets: {
          createOnLogin: true,
        },
      } as any}
    >
      {children}
    </BasePrivyProvider>
  );
};
