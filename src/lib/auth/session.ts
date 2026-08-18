import { headers } from "next/headers";
import { auth } from "./index";

export const getSession = async () => {
  return auth.api.getSession({ headers: await headers() });
};
