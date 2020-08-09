// DENO

const checkEnvVar = (envVar: string) => {
  if (!Deno.env.get(envVar)) throw new Error(`${envVar} not set`);
};

const fetchAuth0ApiToken = async () => {
  const reqInit: RequestInit = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      client_id: Deno.env.get("AUTH0_MGMT_APP_CLIENT_ID"),
      client_secret: Deno.env.get("AUTH0_MGMT_APP_CLIENT_SECRET"),
      audience: `https://${AUTH0_HOST}/api/v2/`,
      grant_type: `client_credentials`,
    }),
  };

  try {
    return await (await fetch(`https://${AUTH0_HOST}/oauth/token`, reqInit))
      .json();
  } catch (error) {
    throw error;
  }
};

const fetchClientCallbacks = async (token: string) => {
  const reqInit: RequestInit = {
    headers: {
      "Content-Type": `application/json`,
      "Authorization": `Bearer ${token}`,
    },
  };

  try {
    return await (await fetch(
      `https://${AUTH0_HOST}/api/v2/clients/${AUTH0_TARGET_CLIENT_ID}?fields=callbacks`,
      reqInit,
    )).json();
  } catch (error) {
    throw error;
  }
};

const updateAuthOClientCallbacks = async (
  token: string,
  callbacks: string[],
) => {
  const reqInit: RequestInit = {
    method: "PATCH",
    headers: {
      "Content-Type": `application/json`,
      "Authorization": `Bearer ${token}`,
    },
    body: JSON.stringify({ callbacks }),
  };

  try {
    return await (await fetch(
      `https://${AUTH0_HOST}/api/v2/clients/${AUTH0_TARGET_CLIENT_ID}`,
      reqInit,
    )).json();
  } catch (error) {
    throw error;
  }
};

type Operation = "add" | "remove";

const updateAuth0Callbacks = async (
  operation: Operation,
  callbackUrls: string,
) => {
  try {
    const { access_token } = await fetchAuth0ApiToken();
    let { callbacks } = await fetchClientCallbacks(access_token);

    const urls: string[] = callbackUrls.split(",");
    if (operation === "add") {
      urls.map((url) => {
        if (!callbacks.includes(url)) callbacks.push(url);
      });
    }
    if (operation === "remove") {
      urls.map((url) => {
        callbacks = callbacks.filter((cb: string) => cb !== url);
      });
    }

    const res = await updateAuthOClientCallbacks(access_token, callbacks);
    console.log(`updated callbacks ${res.callbacks}`);
  } catch (error) {
    throw error;
  }
};

const args = Deno.args;

console.log(args.length);
if (args.length < 2) {
  console.error(
    `You need to provide a list of callbackUrl and whether to remove them
  deno run --allow-env --allow-net updateAuth0Callbacks.ts <add|remove> <comma,separated,callbackUrls>
  deno run --allow-env --allow-net updateAuth0Callbacks.ts add http://localhost:4001,http://trusted.api.com`,
  );
  throw new Error("insufficient arguments error");
}

checkEnvVar("AUTH0_MGMT_APP_CLIENT_ID");
checkEnvVar("AUTH0_MGMT_APP_CLIENT_SECRET");
// checkEnvVar('AUTH0_TARGET_CLIENT_ID');
const AUTH0_HOST = Deno.env.get("AUTH0_HOST") || `dev-ywte7knl.eu.auth0.com`;
const AUTH0_TARGET_CLIENT_ID = Deno.env.get("AUTH0_TARGET_CLIENT_ID") || "5nWwLM7ZqQOu6UxDvlj2yz9HPN5wAiG3";

updateAuth0Callbacks(args[0] as Operation, args[1]);
