import * as cdk from 'aws-cdk-lib';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import { Construct } from 'constructs';
import * as path from 'path';
import * as events from "aws-cdk-lib/aws-events";
import * as targets from "aws-cdk-lib/aws-events-targets";
import * as dotenv from 'dotenv';
import { Table } from 'aws-cdk-lib/aws-dynamodb';
import { Duration } from 'aws-cdk-lib';

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

    const table = Table.fromTableName(
      this,
      'ImportedTable',
      process.env.PLAYER_TABLE!
    );

    const queryPlayerByIdLambda = new lambda.Function(
      this,
      'QueryPlayerByIdFunction',
      {
        runtime: lambda.Runtime.NODEJS_20_X,
        handler: 'lambdas/queryPlayerById.handler',
        code: lambda.Code.fromAsset(path.join(__dirname, '../dist')),
        layers: [axiosLayer],
        environment: {
          API_GATEWAY_URL: process.env.API_GATEWAY_URL!,
          PLAYER_TABLE: table.tableName,
        },
      }
    );

    const queryBatchPlayersLambda = new lambda.Function(
      this,
      'QueryBatchesPlayerByIdFunction',
      {
        runtime: lambda.Runtime.NODEJS_20_X,
        handler: 'lambdas/queryBatchPlayers.handler',
        code: lambda.Code.fromAsset(path.join(__dirname, '../dist')),
        layers: [axiosLayer],
        environment: {
          API_GATEWAY_URL: process.env.API_GATEWAY_URL!,
          PLAYER_TABLE: table.tableName,
        },
      }
    );

    const updateDBLambda = new lambda.Function(
      this,
      'updateDBFunction',
      {
        runtime: lambda.Runtime.NODEJS_20_X,
        handler: 'lambdas/updateDB.handler',
        code: lambda.Code.fromAsset(path.join(__dirname, '../dist')),
        environment: {
          API_GATEWAY_URL: process.env.API_GATEWAY_URL!,
          PLAYER_TABLE: table.tableName,
        },
        memorySize: 1024,
        timeout: Duration.minutes(15),
      }
    )

    table.grantReadData(queryPlayerByIdLambda);
    table.grantReadData(queryBatchPlayersLambda);
    table.grantWriteData(updateDBLambda);

    const apiGateway = new apigateway.RestApi(this, 'ApiGateway', {
      restApiName: 'FantasyFootballApi',
    });

    new events.Rule(this, "WeeklyPlayerUpdateRule", {
      schedule: events.Schedule.cron({
        minute: "0", hour: "5", weekDay: "TUE"
      }),
      targets: [new targets.LambdaFunction(updateDBLambda)],
    });

    const queryPlayerByIdResource =
      apiGateway.root.addResource('queryPlayerById');
    queryPlayerByIdResource.addMethod(
      'GET',
      new apigateway.LambdaIntegration(queryPlayerByIdLambda)
    );

    const queryBatchPlayerResource =
      apiGateway.root.addResource('queryPlayersById');
    queryBatchPlayerResource.addMethod(
      'POST',
      new apigateway.LambdaIntegration(queryBatchPlayersLambda)
    );
  }
}
