import { type FC } from "react";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { CompleteProfileForm } from "@/components";

const CompleteProfilePage: FC = async () => {
  const sessionData = await auth.api.getSession({
    headers: await headers(),
  });

  if (!sessionData || !sessionData.user.emailVerified) {
    redirect("/signUp");
  }

  const { user } = sessionData;
  const { name, barId, email, id } = user;

  return (
    <div>
      <CompleteProfileForm
        name={name}
        barId={barId ?? ""}
        email={email}
        userId={id}
      />
    </div>
  );
};

export default CompleteProfilePage;
