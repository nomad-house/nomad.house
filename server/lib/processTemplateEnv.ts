import { PromiseResult } from "aws-sdk/lib/request";
import { AWSError } from "aws-sdk";

export interface Parameter {
  key: string;
  Name: string;
  WithDecryption: boolean;
  valuePromise?: Promise<void | PromiseResult<
    AWS.SSM.GetParameterResult,
    AWSError
  >>;
  Value?: string;
}

const EXTRACTOR = /^['"]?\${\s?ssm:([^~]*)(?:~(true|false|split))?\s?}['"]?$/;

export function processTemplateEnv(environment?: {
  [key: string]: string;
}): Parameter[] {
  if (!environment) return [];
  return Object.entries(environment).map(([key, value]) => {
    const [, Name, option] = EXTRACTOR.exec(value);
    if (Name.includes("${")) {
      throw new Error(
        "variables are not allowed in self:provider.environment when using sync-env-ssm plugin"
      );
    }
    const WithDecryption = option === "true";
    return { key, Name, WithDecryption };
  });
}
