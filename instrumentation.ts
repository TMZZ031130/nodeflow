export const runtime = "nodejs";

import { setGlobalDispatcher, ProxyAgent } from "undici";

setGlobalDispatcher(new ProxyAgent("http://127.0.0.1:7897"));
