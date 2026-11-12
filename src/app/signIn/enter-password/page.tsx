import { type FC } from "react";
import { EnterPasswordForm } from "@/components";
import { redirect } from "next/navigation";

enum ETokenType {
  INVALID_TOKEN = "INVALID_TOKEN",
}

interface EnterPasswordPageProps {
  searchParams: Promise<{
    token?: string;
    error?: ETokenType;
  }>;
}

const EnterPasswordPage: FC<EnterPasswordPageProps> = async ({
  searchParams,
}) => {
  const { token, error } = await searchParams;
  if (error === ETokenType.INVALID_TOKEN || !token) {
    redirect("/signIn/reset-password");
  }
  return (
    <div>
      <EnterPasswordForm />
    </div>
  );
};

export default EnterPasswordPage;
