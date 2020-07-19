import { SSM } from "aws-sdk";
import { Debug } from "../../lib/debug";
const debug = Debug();
const ssm = new SSM({ region: process.env.AWS_REGION });

const PARAMETERS = {
  REDIRECT_URL: "/admin/oauth/REDIRECT_URL",
  OAUTH_ORIGIN: "/admin/oauth/OAUTH_ORIGIN",
  OAUTH_CLIENT_ID: "/admin/oauth/OAUTH_CLIENT_ID~true",
  OAUTH_CLIENT_SECRET: "/admin/oauth/OAUTH_CLIENT_SECRET~true",
};

type ParameterValues = { [key in keyof typeof PARAMETERS]: string };

export class Parameters implements ParameterValues {
  REDIRECT_URL: string;
  OAUTH_ORIGIN: string;
  OAUTH_CLIENT_ID: string;
  OAUTH_CLIENT_SECRET: string;
  private constructor(params: ParameterValues) {
    Object.assign(this, params);
  }
  static async create() {
    const paramNames = Object.values(PARAMETERS);
    debug({ PARAMETERS });
    const parameterValues = {} as ParameterValues;
    async function getParams(Names: string[], option?: "true" | "split") {
      if (!Names.length) return;
      const { Parameters: parameters } = await ssm
        .getParameters({ Names, WithDecryption: option === "true" })
        .promise();
      debug({ option: option || "string", parameters });
      parameters.forEach((param) => {
        parameterValues[param.Name.split("/").pop()] =
          option === "split" ? param.Value.split(",") : param.Value;
      });
    }
    const strings = paramNames.filter(
      (value) => !value.includes("~") || value.endsWith("~false")
    );
    const encrypted = paramNames
      .filter((name) => name.endsWith("~true"))
      .map((name) => name.replace("~true", ""));
    const lists = paramNames
      .filter((value) => value.endsWith("~split"))
      .map((name) => name.replace("~split", ""));
    debug({ strings, encrypted, lists });
    await Promise.all([
      getParams(strings),
      getParams(encrypted, "true"),
      getParams(lists, "split"),
    ]);
    return new Parameters(parameterValues);
  }
}
