const cdk = require('@aws-cdk/core');
const s3 = require('@aws-cdk/aws-s3');
const dynamodb = require('@aws-cdk/aws-dynamodb');
const sqs = require('')

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

    let sessionTable = new dynamodb.Table(
      this,
      "customer",
      {
        tableName: "SessionRep",
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
  }
}

module.exports = { CdkStack }
