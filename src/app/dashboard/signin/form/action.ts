"use server";

import { redirect } from "next/navigation";
import { formSchema } from "./validation";
import prisma from "../../../../../lib/prisma";
import { Bcrypt } from "oslo/password";
import { lucia } from "@/lib/auth";
import { cookies } from "next/headers";

const bycrypt = new Bcrypt();

export interface ActionResult {
  errorTitle: string | null;
  errorDesc: string[] | null;
}

export async function handleSignIn(
  prevState: any,
  formData: FormData
): Promise<ActionResult> {
  const values = formSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!values.success) {
    return {
      errorTitle: "Error!",
      errorDesc: values.error.issues.map((issue) => issue.message),
    };
  }

  const existingUser = await prisma.user.findFirst({
    where: {
      email: values.data.email,
    },
  });

  if (!existingUser) {
    return {
      errorTitle: "Error!",
      errorDesc: ["Account not found!"],
    };
  }

  const validPassword = await bycrypt.verify(
    existingUser.password,
    values.data.password
  );

  if (!validPassword) {
    return {
      errorTitle: "Error!",
      errorDesc: ["Email or password is incorrect!"],
    };
  }

  const session = await lucia.createSession(existingUser.id, {});
  const sessionCookie = lucia.createSessionCookie(session.id);

  cookies().set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes
  );

  return redirect("/dashboard");
}
