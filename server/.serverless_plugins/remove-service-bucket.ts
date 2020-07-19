import { S3, CloudFormation } from "aws-sdk";
import Serverless from "serverless";
import Plugin from "serverless/classes/Plugin";
import { Debug } from "../lib/debug";
import Aws from "serverless/plugins/aws/provider/awsProvider";
import { serviceStacksExist } from "../lib/serviceStackExists";
const debug = Debug();

module.exports = class RemoveServiceBucket implements Plugin {
  region: string;
  provider: Aws;
  serviceStacksExist = serviceStacksExist.bind(this);
  _bucketName: string;
  get bucketName() {
    if (!this._bucketName) {
      this._bucketName = this.serverless.service.custom.bucketName;
    }
    return this._bucketName;
  }

  emptyBucket = async () => {
    this.serverless.cli.log(`Attempting to empty ${this.bucketName}`);
    const contents = [];
    let marker;
    do {
      const { Contents, Marker } = await this.provider.request(
        "S3",
        "listObjects",
        {
          Bucket: this.bucketName,
          Marker: marker,
        }
      );
      contents.push(...Contents);
      debug({ marker });
      marker = Marker;
    } while (!!marker);
    if (contents.length) {
      await Promise.all(
        contents.map(({ Key }) =>
          this.provider.request("S3", "deleteObject", {
            Bucket: this.bucketName,
            Key,
          })
        )
      );
    }
    this.serverless.cli.log(`Bucket ${this.bucketName} is empty`);
  };

  deleteBucketIfNecessary = async () => {
    if (await this.serviceStacksExist()) {
      return;
    }
    await this.emptyBucket();
    await this.provider.request("S3", "deleteBucket", {
      Bucket: this.bucketName,
    });
    this.serverless.cli.log(`Deleted bucket: ${this.bucketName}`);
  };

  hooks = {
    "after:remove:remove": this.deleteBucketIfNecessary,
  };

  constructor(
    private serverless: Serverless,
    private options: Serverless.Options
  ) {
    this.provider = this.serverless.getProvider("aws");
  }
};
