import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";

export default async function Home() {
  const handleLogout = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {},
      },
    });
  };
  return (
    <>
      <Button>LogOut</Button>{" "}
    </>
  );
}
