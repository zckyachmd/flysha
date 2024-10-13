"use client";

import React, { FC } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { ActionResult, handleSignIn } from "./action";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FaSpinner } from "react-icons/fa";

interface FormSignInProps {}

const initialFormState: ActionResult = {
  errorTitle: null,
  errorDesc: [],
};

const FormSignIn: FC<FormSignInProps> = ({}) => {
  const [state, formAction] = useFormState(handleSignIn, initialFormState);

  const SubmitButton = () => {
    const { pending } = useFormStatus();

    return (
      <Button disabled={pending} className="w-full" type="submit">
        {pending ? (
          <>
            <FaSpinner className="animate-spin mr-2" /> Signing in
          </>
        ) : (
          "Sign in"
        )}
      </Button>
    );
  };

  return (
    <div className="w-full h-screen">
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-14 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
            Sign in to your account
          </h2>
        </div>

        {state.errorTitle && (
          <div className="mx-auto my-7 bg-red-500 w-[400px] p-4 rounded-lg text-white">
            <div className="font-bold">{state.errorTitle}</div>
            <ul className="mt-3 list-disc list-inside">
              {state.errorDesc?.map((value, index) => (
                <li key={index}>{value}</li>
              ))}
            </ul>
          </div>
        )}

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form action={formAction} method="POST" className="space-y-6">
            <Input type="email" placeholder="Email address" name="email" />
            <Input type="password" placeholder="Password" name="password" />
            <SubmitButton />
          </form>
        </div>
      </div>
    </div>
  );
};

export default FormSignIn;
