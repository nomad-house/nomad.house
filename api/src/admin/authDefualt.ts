import { APIGatewayEvent, Context, Callback } from "aws-lambda";

export const handler = (
  _: APIGatewayEvent,
  __: Context,
  callback: Callback
) => {
  callback(null, {
    statusCode: 302,
    headers: { Location: "/auth" },
  });
};
