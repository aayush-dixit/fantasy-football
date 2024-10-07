import * as cdk from 'aws-cdk-lib';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import { Construct } from 'constructs';
import * as path from 'path';
import * as dotenv from 'dotenv';
dotenv.config();

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
        environment: {
          API_GATEWAY_URL: process.env.API_GATEWAY_URL!,
        }
      });

      const fetchUserDataLambda = new lambda.Function(this, 'FetchUserDataFunction', {
        runtime: lambda.Runtime.NODEJS_20_X,
        handler: 'lambdas/fetchLeagueUsers.handler',
        code: lambda.Code.fromAsset(path.join(__dirname, '../dist')),
        layers: [axiosLayer],
        environment: {
          API_GATEWAY_URL: process.env.API_GATEWAY_URL!,
        }
      });

      const fetchLeagueRostersLambda = new lambda.Function(this, 'FetchLeagueRostersFunction', {
        runtime: lambda.Runtime.NODEJS_20_X,
        handler: 'lambdas/fetchLeagueRosters.handler',
        code: lambda.Code.fromAsset(path.join(__dirname, '../dist')),
        layers: [axiosLayer]
      })

      const queryPlayerByIdLambda = new lambda.Function(this, 'QueryPlayerByIdFunction', {
        runtime: lambda.Runtime.NODEJS_20_X,
        handler: 'lambdas/queryPlayerById.handler',
        code: lambda.Code.fromAsset(path.join(__dirname, '../dist')),
      })

    const apiGateway = new apigateway.RestApi(this, 'ApiGateway', {
      restApiName: 'FantasyFootballApi'
    });

    const fetchLeagueDataResource = apiGateway.root.addResource('fetchLeagueData');
    fetchLeagueDataResource.addMethod('GET', new apigateway.LambdaIntegration(fetchLeagueDataLambda));

    const fetchLeagueRostersResource = apiGateway.root.addResource('fetchLeagueRosters');
    fetchLeagueRostersResource.addMethod('GET', new apigateway.LambdaIntegration(fetchLeagueRostersLambda));

    const fetchLeagueUsersResource = apiGateway.root.addResource('fetchLeagueUser');
    fetchLeagueUsersResource.addMethod('GET', new apigateway.LambdaIntegration(fetchUserDataLambda));

    const queryPlayerByIdResource = apiGateway.root.addResource('queryPlayerById');
    queryPlayerByIdResource.addMethod('GET', new apigateway.LambdaIntegration(queryPlayerByIdLambda));

  }
}
