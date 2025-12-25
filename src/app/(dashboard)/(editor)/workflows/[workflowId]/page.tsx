import { requireAuth } from "@/lib/auth-utils";

const Page = async () => {
  await requireAuth();

  return <p>Page</p>;
};

export default Page;
