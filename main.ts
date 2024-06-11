import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";
import * as awsx from "@pulumi/awsx";

// Create an ECR repository
const repo = new aws.ecr.Repository("my-iot-simulation-repo");

// Build and publish the Docker image to the ECR repository
const image = new awsx.ecr.Image("my-iot-simulation-image", {
  path: "./app", // Directory containing the Dockerfile and source code
  repositoryUrl: repo.repositoryUrl,
});

// Create an ECS Cluster
const cluster = new awsx.ecs.Cluster("my-iot-simulation-cluster");

// Define the ECS Task Definition using the image built previously
const taskDefinition = new awsx.ecs.FargateTaskDefinition(
  "my-iot-simulation-task",
  {
    container: {
      image: image.imageValue,
      cpu: 256,
      memory: 512,
      portMappings: [{ containerPort: 80 }],
    },
  }
);

// Deploy the Fargate Service
const service = new awsx.ecs.FargateService("my-iot-simulation-service", {
  cluster: cluster,
  taskDefinition: taskDefinition,
  desiredCount: 1,
});

// Export the URL of the service
export const url = service.endpoint.hostname;
