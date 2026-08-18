import { type FC } from "react";
import { SignUpForm } from "@/components";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

const SignUpPage: FC = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (session?.user?.emailVerified) {
    redirect("/dashboard");
  }

  return (
    <div>
      <SignUpForm />
    </div>
  );
};

export default SignUpPage;
