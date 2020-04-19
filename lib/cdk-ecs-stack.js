const cdk = require('@aws-cdk/core');
const ecs = require('@aws-cdk/aws-ecs');
const ec2 = require('@aws-cdk/aws-ec2');
const autoscaling = require('@aws-cdk/aws-autoscaling');
const elbv2 = require('@aws-cdk/aws-elasticloadbalancingv2');

class ECSStack extends cdk.Stack {
  /**
   *
   * @param {cdk.Construct} scope
   * @param {string} id
   * @param {cdk.StackProps=} props
   */
  constructor(scope, id, props) {
    super(scope, id, props);
    let vpc = ec2.Vpc.fromLookup(this, "vpc-b3a170d8", {isDefault:true});

    // Create an ECS cluster
    const cluster = new ecs.Cluster(this, 'Cluster', {
        vpc,
    });

    const autoScalingGroup = new autoscaling.AutoScalingGroup(this, 'ASG', {
        vpc,
        instanceType: new ec2.InstanceType('t2.micro'),
        machineImage: ecs.EcsOptimizedImage.amazonLinux(),        
        // Or use Amazon ECS-Optimized Amazon Linux 2 AMI
        // machineImage: EcsOptimizedImage.amazonLinux2(),
        desiredCapacity: 3
        // ... other options here ...
      });
      
      cluster.addAutoScalingGroup(autoScalingGroup);


        const taskDefinition = new ecs.Ec2TaskDefinition(this, 'TaskDef', {
            networkMode: ecs.NetworkMode.BRIDGE
        });



        const container = taskDefinition.addContainer('DefaultContainer', {
            image: ecs.ContainerImage.fromRegistry("httpd:latest"),
            memoryLimitMiB: 512
        });

        container.addPortMappings({
            containerPort: 80,
            hostPort: 0
        })

        
        // Instantiate an Amazon ECS Service
        const ecsService = new ecs.Ec2Service(this, 'Service', {
            cluster,
            taskDefinition,
            desiredCount: 3,
            maxHealthyPercent: 200,
            minHealthyPercent: 100
        });

        const lb = new elbv2.ApplicationLoadBalancer(this, 'ALB', {
            vpc, 
            internetFacing: true
        })
       
 
        const listener = lb.addListener('Listener', {
            port: 80,        
            // 'open: true' is the default, you can leave it out if you want. Set it
            // to 'false' and use `listener.connections` if you want to be selective
            // about who can access the load balancer.
            open: true
        });
 
        listener.addTargets('ApplicationFleet', {      
            targets: [ecsService],
            port: 80
        });

        listener.connections.allowFrom(lb, ec2.Port.allTcp());



    }
}

module.exports = { ECSStack }
