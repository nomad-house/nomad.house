import Serverless from "serverless";
import Aws from "serverless/plugins/aws/provider/awsProvider";
import { Debug } from "../lib/debug";
const debug = Debug();

export const serviceStacksExist = async ({
  provider,
  serverless,
}: {
  provider: Aws;
  serverless: Serverless;
}) => {
  let marker: string | undefined;
  const stacks = [] as AWS.CloudFormation.StackSummaries;
  do {
    const { NextToken, StackSummaries = [] } = await provider.request(
      "CloudFormation",
      "listStacks",
      {
        NextToken: marker,
      }
    );
    stacks.push(...StackSummaries);
    marker = NextToken;
    debug({ marker });
  } while (!!marker);
  const serviceName = serverless.service.getServiceName();
  const serviceStacks = stacks.filter(
    (stack) =>
      stack.StackName.includes(serviceName) &&
      !stack.StackStatus.includes("DELETE")
  );
  debug({ serviceName, serviceStacks });
  const statement = serviceStacks.length
    ? "Stack(s) " +
      serviceStacks.map((stack) => stack.StackName).join(", ") +
      " still exist(s).\nSSM parameters will be deleted once all stacks are removed."
    : "All service stacks have been removed. SSM parameters are safe to delete.";
  serverless.cli.log(statement);
  return !!serviceStacks.length;
};
