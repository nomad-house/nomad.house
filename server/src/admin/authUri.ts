import { APIGatewayEvent, Context, Callback } from "aws-lambda";
import { create } from "simple-oauth2";
import { generate } from "randomstring";
import { Parameters } from "../utils/Parameters";

export const handler = async (_: APIGatewayEvent, __: Context) => {
  const parameters = await Parameters.create();
  const oauth2 = create({
    client: {
      id: `${parameters.OAUTH_CLIENT_ID}`,
      secret: `${parameters.OAUTH_CLIENT_SECRET}`,
    },
    auth: {
      tokenHost: "https://github.com",
      tokenPath: "/login/oauth/access_token",
      authorizePath: "/login/oauth/authorize",
    },
  });

  const originPattern = parameters.OAUTH_ORIGIN || "";
  if (originPattern === "") {
    throw new Error(
      "Will not run without a safe ORIGIN pattern in production."
    );
  }

  // Authorization uri definition
  const Location = oauth2.authorizationCode.authorizeURL({
    // eslint-disable-next-line @typescript-eslint/camelcase
    redirect_uri: parameters.REDIRECT_URL || "http://localhost:3000/callback",
    scope: "repo,user",
    state: generate(32),
  });

  return {
    statusCode: 302,
    headers: {
      Location,
    },
  };
};
