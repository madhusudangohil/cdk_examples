const cdk = require('@aws-cdk/core');
const s3 = require('@aws-cdk/aws-s3');
const dynamodb = require('@aws-cdk/aws-dynamodb');
const kms = require('@aws-cdk/aws-kms');
const iam = require('@aws-cdk/aws-iam');
const sqs = require('@aws-cdk/aws-sqs')
const apiGateway = require('@aws-cdk/aws-apigateway');

class CdkStack extends cdk.Stack {
  /**
   *
   * @param {cdk.Construct} scope
   * @param {string} id
   * @param {cdk.StackProps=} props
   */
  constructor(scope, id, props) {
    super(scope, id, props);

    // The code that defines your stack goes here
    let bucket = new s3.Bucket(
      this,
      'mys3bucket',
      {
        bucketName: 'mys3bucket',

      })

    let customerTable = new dynamodb.Table(
      this,
      "customerTable",
      {
        tableName: "customerTable",
        partitionKey: {
          name: "phoneNumber",
          type: dynamodb.AttributeType.STRING
        },
        sortKey:  {
          name: "code",
          type: dynamodb.AttributeType.STRING
        },
        readCapacity: 5,
        writeCapacity: 5   
      }
    )

    let kmsPolicy = new iam.PolicyDocument({
          
    });

    let rootPolicy = new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      hasPrincipal: true,
      hasResource: true      
    })

    let servicePolicy = new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      hasPrincipal: true,
      hasResource: true      
    })

    rootPolicy.addAccountRootPrincipal();

    servicePolicy.addActions(["kms:Encrypt"])
    servicePolicy.addActions(["kms:Decrypt"])
    servicePolicy.addActions(["kms:GenerateDataKey"])
    servicePolicy.addServicePrincipal("sns.amazonaws.com")
    servicePolicy.addResources(["*"])

    kmsPolicy.addStatements(rootPolicy);
    kmsPolicy.addStatements(servicePolicy);

    let kmskey = new kms.Key(
      this, 
      "someFunctionalKMSKey", 
      {
        alias: "myAlias",
        description: "for sqs encryption",
        enableKeyRotation: true,
        policy: kmsPolicy

    })

    let myQueue = new sqs.Queue(this, 'Queue', {
      
    })


    const api = new apiGateway.RestApi(this, 'message-api');

    api.root.addMethod('ANY');

    const message = api.root.addResource('message');    
    const sqsIntegration = new apiGateway.AwsIntegration({
      service: "sqs",
      integrationHttpMethod: "POST",
      options: {
        
      },
      path: myQueue.queueArn
    });

    message.addMethod('POST', );


  }
}

module.exports = { CdkStack }
