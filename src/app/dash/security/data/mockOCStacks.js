// Mock OmniCloud stacks data with realistic security and drift information
export const mockCfStacks = [
  {
    id: 'arn:aws:cloudformation:us-east-1:123456789012:stack/customer-data-stack/unique-stack-id-1',
    name: 'customer-data-stack',
    status: 'CREATE_COMPLETE',
    region: 'us-east-1',
    resourceCount: 5,
    version: '1.2',
    lastUpdated: '2025-04-08T14:30:00Z',
    createdTime: '2025-03-15T10:00:00Z',
    driftStatus: 'DRIFTED',
    driftedResources: 2,
    securityIssues: 3,
    parameters: [
      { name: 'EnvironmentType', value: 'production' },
      { name: 'DatabaseName', value: 'customer-database' },
      { name: 'InstanceType', value: 't3.medium' }
    ],
    outputs: [
      { name: 'DatabaseEndpoint', value: 'customer-db-prod.rds.amazonaws.com' },
      { name: 'VPCId', value: 'vpc-0123456789abcdef0' }
    ]
  },
  {
    id: 'arn:aws:cloudformation:us-west-2:123456789012:stack/api-backend-stack/unique-stack-id-2',
    name: 'api-backend-stack',
    status: 'UPDATE_IN_PROGRESS',
    region: 'us-west-2',
    resourceCount: 8,
    version: '1.5',
    lastUpdated: '2025-04-09T11:15:00Z',
    createdTime: '2025-02-20T15:45:00Z',
    driftStatus: 'IN_SYNC',
    driftedResources: 0,
    securityIssues: 1,
    parameters: [
      { name: 'LambdaRuntime', value: 'nodejs16.x' },
      { name: 'APIGatewayType', value: 'REGIONAL' }
    ],
    outputs: [
      { name: 'APIEndpoint', value: 'https://api.example.com/v1' },
      { name: 'LambdaExecutionRole', value: 'arn:aws:iam::123456789012:role/lambda-exec-role' }
    ]
  },
  {
    id: 'arn:aws:cloudformation:us-east-1:123456789012:stack/finance-data-stack/unique-stack-id-3',
    name: 'finance-data-stack',
    status: 'CREATE_COMPLETE',
    region: 'us-east-1',
    resourceCount: 4,
    version: '1.1',
    lastUpdated: '2025-04-07T16:45:00Z',
    createdTime: '2025-03-01T09:30:00Z',
    driftStatus: 'DRIFTED',
    driftedResources: 1,
    securityIssues: 2,
    parameters: [
      { name: 'S3BucketName', value: 'finance-reports-bucket' },
      { name: 'RetentionPeriod', value: '90' }
    ],
    outputs: [
      { name: 'S3BucketArn', value: 'arn:aws:s3:::finance-reports-bucket' }
    ]
  },
  {
    id: 'arn:aws:cloudformation:global:123456789012:stack/website-hosting-stack/unique-stack-id-4',
    name: 'website-hosting-stack',
    status: 'CREATE_COMPLETE',
    region: 'global',
    resourceCount: 6,
    version: '1.3',
    lastUpdated: '2025-04-05T10:20:00Z',
    createdTime: '2025-02-15T14:00:00Z',
    driftStatus: 'IN_SYNC',
    driftedResources: 0,
    securityIssues: 0,
    parameters: [
      { name: 'DomainName', value: 'example.com' },
      { name: 'CertificateArn', value: 'arn:aws:acm:us-east-1:123456789012:certificate/unique-cert-id' }
    ],
    outputs: [
      { name: 'CloudFrontDistribution', value: 'E1BTFTF5ABCDEF' },
      { name: 'WebsiteBucket', value: 'arn:aws:s3:::website-bucket' }
    ]
  },
  {
    id: 'arn:aws:cloudformation:us-west-2:123456789012:stack/customer-api-stack/unique-stack-id-5',
    name: 'customer-api-stack',
    status: 'UPDATE_COMPLETE',
    region: 'us-west-2',
    resourceCount: 7,
    version: '1.4',
    lastUpdated: '2025-04-06T13:10:00Z',
    createdTime: '2025-02-25T11:15:00Z',
    driftStatus: 'DRIFTED',
    driftedResources: 3,
    securityIssues: 4,
    parameters: [
      { name: 'WAFEnabled', value: 'true' },
      { name: 'APIStage', value: 'prod' }
    ],
    outputs: [
      { name: 'APIGatewayId', value: 'customer-api-gateway' },
      { name: 'WebACLArn', value: 'arn:aws:wafv2:us-west-2:123456789012:regional/webacl/customer-api-protection' }
    ]
  }
];