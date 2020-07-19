require("dotenv").config();
import { resolve } from "path";
import { S3, AWSError, SSM } from "aws-sdk";
import { PromiseResult } from "aws-sdk/lib/request";
import YAML from "yamljs";
import { Parameter, processTemplateEnv } from "../lib/processTemplateEnv";
import { Debug } from "../lib/debug";
const debug = Debug();

const awsConfig = {
  region: process.env.REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
};
const s3 = new S3(awsConfig);
const ssm = new SSM(awsConfig);

const CONFIG_PATH = resolve(__dirname, "..", "serverless.yml");
let _config;
const config = (reload = false) => {
  if (!_config || reload) {
    debug("loading yaml");
    _config = YAML.load(CONFIG_PATH);
    debug({ _config });
  }
  return _config;
};

const uploadParam = ({
  key,
  Name,
  WithDecryption,
  Value,
  Overwrite = false,
}: Parameter & { Overwrite?: boolean }) => {
  if (Value === "") {
    throw new Error(
      `attempting to set SSM value of ${key} to an empty string. check your .env`
    );
  }
  return ssm
    .putParameter({
      Name,
      Value,
      Type: WithDecryption ? "SecureString" : "String",
      Overwrite,
    })
    .promise();
};

const syncSsm = async () => {
  debug("syncing SSM");
  const parameters = processTemplateEnv(config().provider.environment).map(
    ({ key, Name, WithDecryption }) => ({
      key,
      Name,
      WithDecryption,
      promise: ssm
        .getParameter({
          Name,
          WithDecryption,
        })
        .promise()
        .catch(() => {}),
    })
  );
  debug({ parameters });
  const uploads = [] as Promise<
    PromiseResult<AWS.SSM.PutParameterResult, AWSError>
  >[];
  for (const param of parameters) {
    const { key, promise } = param;
    const envValue = process.env[key];
    const ssmValue = await promise;
    debug({ key, envValue, ssmValue });
    if (!ssmValue) {
      if (!envValue) {
        throw new Error(`the value of ${key} is not defined in SSM nor .env`);
      }
      uploads.push(uploadParam({ ...param, Value: envValue }));
      continue;
    }
    if (envValue.length && envValue !== ssmValue.Parameter.Value) {
      uploads.push(uploadParam({ ...param, Value: envValue, Overwrite: true }));
    }
  }
  await Promise.all(uploads);
};

const preDeploy = async () => {
  const Bucket = config().service;
  try {
    await s3.headBucket({ Bucket }).promise();
    console.log("Service bucket found");
  } catch {
    await s3.createBucket({ Bucket }).promise();
    console.log(`Created bucket: ${Bucket}`);
  }
  await syncSsm();
};

if (require.main === module) {
  preDeploy();
}
