import { SSM, S3, CloudFormation, AWSError } from "aws-sdk";
import Serverless from "serverless";
import Aws from "serverless/plugins/aws/provider/awsProvider";
import Plugin from "serverless/classes/Plugin";
import { PromiseResult } from "aws-sdk/lib/request";
import { Parameter, processTemplateEnv } from "../lib/processTemplateEnv";
import { serviceStacksExist } from "../lib/serviceStackExists";

import { Debug } from "../lib/debug";
const debug = Debug();

const ssm = new SSM({});

module.exports = class RemoveSsm implements Plugin {
  provider: Aws;
  serviceStacksExist = serviceStacksExist.bind(this);

  removeParametersIfUnused = async () => {
    if (await this.serviceStacksExist()) {
      return;
    }
    const parameters = processTemplateEnv(
      (this.serverless.service.provider as any).environment
    );
    const Names = parameters.map(({ Name }) => Name);
    this.serverless.cli.log(
      `Deleting the following SSM Parameters:\n${Names.join("\n")}\n`
    );
    await this.provider.request("SSM", "deleteParameters", { Names });
  };

  hooks = {
    "after:remove:remove": this.removeParametersIfUnused,
  };

  constructor(
    private serverless: Serverless,
    private options: Serverless.Options
  ) {
    this.provider = this.serverless.getProvider("aws");
  }
};
