import { type FC } from "react";
import { OnboardForm } from "@/components";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

const SignInPage: FC = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (session) {
    redirect("/");
  }
  return (
    <div>
      <OnboardForm />
    </div>
  );
};

export default SignInPage;
