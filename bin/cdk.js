#!/usr/bin/env node

const cdk = require('@aws-cdk/core');
const { CdkStack } = require('../lib/cdk-stack');
const { ECSStack } = require('../lib/cdk-ecs-stack');
const envUSA = { account: '699589633627', region: 'us-east-2'};

const app = new cdk.App();
//new CdkStack(app, 'CdkStack');
new ECSStack(app, 'ECSStack', {env:envUSA});
