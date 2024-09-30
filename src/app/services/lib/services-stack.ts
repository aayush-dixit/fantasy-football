import * as cdk from 'aws-cdk-lib';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import { Construct } from 'constructs';
import * as path from 'path';

export class ServicesStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const axiosLayer = new lambda.LayerVersion(this, 'AxiosLayer', {
      layerVersionName: 'AxiosLayer',
      code: lambda.Code.fromAsset(path.join(__dirname, '../layer')),
      compatibleRuntimes: [lambda.Runtime.NODEJS_20_X],
      description: 'A layer that contains axios dependency',
    });

      // Create Lambda functions
      const fetchLeagueDataLambda = new lambda.Function(this, 'FetchLeagueDataFunction', {
        runtime: lambda.Runtime.NODEJS_20_X,
        handler: 'lambdas/fetchLeagueData.handler',
        code: lambda.Code.fromAsset(path.join(__dirname, '../dist')),
              layers: [axiosLayer],
      });

    const apiGateway = new apigateway.RestApi(this, 'ApiGateway', {
      restApiName: 'FantasyFootballApi'
    });

    const fetchLeagueDataResource = apiGateway.root.addResource('fetchLeagueData');
    fetchLeagueDataResource.addMethod('GET', new apigateway.LambdaIntegration(fetchLeagueDataLambda));

  }
}
