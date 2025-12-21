"use client";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";

export default function Login() {
  const handleLogin = async () => {
    await authClient.signIn.social({
      provider: "github",
    });
  };
  return <Button onClick={handleLogin}>Login</Button>;
}
