// Mock security findings data with CloudFormation-specific fields
export const mockSecurityFindings = [
    {
      id: 'vuln-001',
      title: 'Publicly accessible database with weak authentication',
      severity: 'critical',
      status: 'open',
      discovered: '2025-04-08',
      resourceType: 'RDS',
      resourceName: 'customer-db-prod',
      region: 'us-east-1',
      stackName: 'customer-data-stack',
      category: 'Access Control',
      cvssScore: 9.8,
      cvssVector: 'CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H',
      cve: null,
      detectionMethod: 'Cloud Security Scanner',
      cfResourceId: 'CustomerDatabase',
      cfFix: `Resources:
    CustomerDatabase:
      Type: AWS::RDS::DBInstance
      Properties:
        # Add security group that restricts access
        VPCSecurityGroups:
          - !Ref DatabaseSecurityGroup
        # Enable encryption
        StorageEncrypted: true
        # Remove public accessibility
        PubliclyAccessible: false`,
      driftDetected: false,
      description: 'A production database is publicly accessible from the internet and uses default credentials. This poses a critical risk of unauthorized access, data breach, and potential data manipulation.',
      impact: 'Unauthorized access could lead to customer data theft, database manipulation, or complete database deletion. This may result in data loss, service downtime, compliance violations, and reputational damage.',
      recommendation: [
        'Immediately remove public access to the database',
        'Implement network security groups to restrict access',
        'Change the default credentials and enforce strong password policies',
        'Enable encryption for data at rest and in transit',
        'Set up database auditing and monitoring',
        'Update CloudFormation template to enforce these settings'
      ],
      resources: [
        { name: 'customer-db-prod', type: 'database', logicalId: 'CustomerDatabase', stackName: 'customer-data-stack' },
        { name: 'db-security-group-prod', type: 'network', logicalId: 'DatabaseSecurityGroup', stackName: 'customer-data-stack' }
      ],
      bestPractices: [
        'Never expose databases directly to the internet',
        'Always use VPC security groups to restrict access to specific CIDR ranges or security groups',
        'Enable encryption for all database instances',
        'Use strong, unique passwords and rotate them regularly'
      ],
      awsSecurityHub: [
        '[RDS.2] RDS DB instances should prohibit public access',
        '[RDS.3] RDS DB instances should have encryption at rest enabled'
      ],
      complianceStandards: ['PCI DSS 3.2.1', 'HIPAA', 'SOC 2', 'NIST 800-53'],
      remediation: {
        description: 'You can automatically remediate this issue using AWS Systems Manager Automation',
        automationDocument: 'AWSConfigRemediation-RemovePublicAccessToRDSInstance'
      }
    },
    {
      id: 'vuln-002',
      title: 'Unencrypted S3 bucket containing sensitive data',
      severity: 'high',
      status: 'open',
      discovered: '2025-04-07',
      resourceType: 'S3',
      resourceName: 'finance-reports-bucket',
      region: 'us-east-1',
      stackName: 'finance-data-stack',
      category: 'Data Protection',
      cvssScore: 7.5,
      cvssVector: 'CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:N/A:N',
      cve: null,
      detectionMethod: 'Cloud Security Scanner',
      cfResourceId: 'FinanceReportsBucket',
      cfFix: `Resources:
    FinanceReportsBucket:
      Type: AWS::S3::Bucket
      Properties:
        # Add server-side encryption
        BucketEncryption:
          ServerSideEncryptionConfiguration:
            - ServerSideEncryptionByDefault:
                SSEAlgorithm: AES256
        # Add bucket policy to enforce encryption
        # Add lifecycle policy to control data retention`,
      driftDetected: true,
      driftInfo: {
        detectedAt: '2025-04-09',
        changes: [
          {
            property: 'BucketPolicy',
            expected: 'Policy requiring HTTPS',
            actual: 'No policy found'
          },
          {
            property: 'PublicAccessBlockConfiguration',
            expected: 'Block all public access',
            actual: 'Public access allowed'
          }
        ]
      },
      description: 'An S3 bucket containing sensitive financial reports is not configured with server-side encryption. Additionally, the bucket has public access configuration that differs from the CloudFormation template.',
      impact: 'Sensitive financial data is at risk of unauthorized access. If credentials are compromised, data would be exposed in plaintext.',
      recommendation: [
        'Enable default encryption for the S3 bucket',
        'Implement bucket policies to enforce encryption of uploaded objects',
        'Update CloudFormation template to include encryption settings',
        'Implement S3 Block Public Access settings',
        'Set up CloudTrail logging for bucket access'
      ],
      resources: [
        { name: 'finance-reports-bucket', type: 's3', logicalId: 'FinanceReportsBucket', stackName: 'finance-data-stack' }
      ],
      bestPractices: [
        'Enable default encryption for all S3 buckets',
        'Use bucket policies to require encrypted transfers (aws:SecureTransport)',
        'Implement least privilege access to S3 buckets',
        'Enable S3 Block Public Access at account level'
      ],
      awsSecurityHub: [
        '[S3.4] S3 buckets should have server-side encryption enabled',
        '[S3.1] S3 Block Public Access setting should be enabled'
      ],
      complianceStandards: ['PCI DSS 3.2.1', 'GDPR', 'SOC 2', 'NIST 800-53'],
      remediation: {
        description: 'You can automatically remediate this issue using AWS Systems Manager Automation',
        automationDocument: 'AWSConfigRemediation-EnableS3BucketEncryption'
      }
    },
    {
      id: 'vuln-003',
      title: 'IAM role with excessive permissions',
      severity: 'high',
      status: 'in-progress',
      discovered: '2025-04-06',
      resourceType: 'IAM',
      resourceName: 'lambda-execution-role',
      region: 'global',
      stackName: 'api-backend-stack',
      category: 'Identity & Access Management',
      cvssScore: 7.2,
      cvssVector: 'CVSS:3.1/AV:N/AC:L/PR:H/UI:N/S:U/C:H/I:H/A:H',
      cve: null,
      detectionMethod: 'IAM Analyzer',
      cfResourceId: 'LambdaExecutionRole',
      cfFix: `Resources:
    LambdaExecutionRole:
      Type: AWS::IAM::Role
      Properties:
        AssumeRolePolicyDocument:
          # No changes needed here
        ManagedPolicyArns:
          # Remove overly permissive policy
          # - arn:aws:iam::aws:policy/AdministratorAccess
          # Add least privilege policies
          - arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole
        Policies:
          - PolicyName: S3AccessPolicy
            PolicyDocument:
              Version: '2012-10-17'
              Statement:
                - Effect: Allow
                  Action: 
                    - s3:GetObject
                  Resource: 
                    # Use specific bucket ARNs for required resources
                    - arn:aws:s3:::app-data-bucket/*
                    - arn:aws:s3:::reports-bucket/*
                    # Or use Fn::ImportValue to reference outputs from other stacks`,
      driftDetected: false,
      description: 'The Lambda execution role is configured with overly permissive permissions, including administrator access. This violates the principle of least privilege and poses a significant security risk.',
      impact: 'If the Lambda function is compromised, an attacker could use the role to access or modify any resource in the account, potentially leading to data breaches, resource manipulation, or further privilege escalation.',
      recommendation: [
        'Remove administrator access from the IAM role',
        'Implement least privilege by granting only the specific permissions needed by the Lambda function',
        'Use resource-level permissions where possible',
        'Update CloudFormation template to include more restrictive IAM policies',
        'Implement regular IAM permission reviews'
      ],
      resources: [
        { name: 'lambda-execution-role', type: 'iam', logicalId: 'LambdaExecutionRole', stackName: 'api-backend-stack' }
      ],
      bestPractices: [
        'Follow the principle of least privilege for all IAM roles',
        'Avoid using managed policies with broad permissions like AdministratorAccess',
        'Use IAM Access Analyzer to identify unused permissions',
        'Regularly review and update IAM permissions'
      ],
      awsSecurityHub: [
        '[IAM.1] IAM policies should not allow full "*" administrative privileges',
        '[IAM.21] IAM customer managed policies that you create should not allow wildcard actions for services'
      ],
      complianceStandards: ['CIS AWS Foundations', 'NIST 800-53', 'SOC 2'],
      remediation: {
        description: 'You can use AWS CloudFormation Guard to automatically validate IAM policies in your templates',
        automationDocument: null
      }
    },
    {
      id: 'vuln-004',
      title: 'API Gateway without WAF protection',
      severity: 'medium',
      status: 'open',
      discovered: '2025-04-05',
      resourceType: 'APIGateway',
      resourceName: 'customer-api',
      region: 'us-west-2',
      stackName: 'customer-api-stack',
      category: 'Application Security',
      cvssScore: 6.5,
      cvssVector: 'CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:L/I:L/A:L',
      cve: null,
      detectionMethod: 'Security Configuration Analyzer',
      cfResourceId: 'CustomerAPI',
      cfFix: `Resources:
    ApiGatewayWebAcl:
      Type: AWS::WAFv2::WebACL
      Properties:
        Name: customer-api-protection
        Scope: REGIONAL
        DefaultAction:
          Allow: {}
        Rules:
          - Name: AWS-AWSManagedRulesCommonRuleSet
            Priority: 0
            OverrideAction:
              None: {}
            Statement:
              ManagedRuleGroupStatement:
                VendorName: AWS
                Name: AWSManagedRulesCommonRuleSet
            VisibilityConfig:
              SampledRequestsEnabled: true
              CloudWatchMetricsEnabled: true
              MetricName: AWS-AWSManagedRulesCommonRuleSet
        VisibilityConfig:
          CloudWatchMetricsEnabled: true
          MetricName: customer-api-protection
          SampledRequestsEnabled: true
          
    WebACLAssociation:
      Type: AWS::WAFv2::WebACLAssociation
      Properties:
        ResourceArn: !Ref CustomerAPI.RestApiArn
        WebACLArn: !GetAtt ApiGatewayWebAcl.Arn`,
      driftDetected: false,
      description: 'The API Gateway does not have AWS WAF (Web Application Firewall) protection enabled, leaving it vulnerable to common web attacks such as SQL injection, cross-site scripting (XSS), and other OWASP Top 10 vulnerabilities.',
      impact: 'Without WAF protection, the API is more vulnerable to common web application attacks, which could lead to unauthorized access, data exposure, or service disruption.',
      recommendation: [
        'Implement AWS WAF for the API Gateway',
        'Configure AWS WAF rules to protect against OWASP Top 10 vulnerabilities',
        'Update CloudFormation template to include WAF configuration and association',
        'Enable logging for WAF events',
        'Implement regular security testing for the API'
      ],
      resources: [
        { name: 'customer-api', type: 'api', logicalId: 'CustomerAPI', stackName: 'customer-api-stack' }
      ],
      bestPractices: [
        'Protect all public-facing APIs with AWS WAF',
        'Use AWS WAF managed rule groups like Core rule set (CRS) and Known bad inputs',
        'Implement rate-based rules to prevent brute force and DoS attacks',
        'Enable logging and monitoring for WAF events'
      ],
      awsSecurityHub: [
        '[APIGateway.4] API Gateway should be associated with a WAF Web ACL',
        '[APIGateway.2] API Gateway REST API stages should be configured to use SSL certificates for backend authentication'
      ],
      complianceStandards: ['OWASP API Security Top 10', 'NIST 800-53', 'PCI DSS 3.2.1'],
      remediation: {
        description: 'You can automatically create and associate a WAF Web ACL with your API Gateway',
        automationDocument: 'AWSConfigRemediation-AssociateWAFWebACLToAPIGateway'
      }
    },
    {
      id: 'vuln-005',
      title: 'CloudFront distribution without HTTPS enforcement',
      severity: 'medium',
      status: 'mitigated',
      discovered: '2025-04-03',
      resourceType: 'CloudFront',
      resourceName: 'website-distribution',
      region: 'global',
      stackName: 'website-hosting-stack',
      category: 'Network Security',
      cvssScore: 5.9,
      cvssVector: 'CVSS:3.1/AV:N/AC:H/PR:N/UI:N/S:U/C:H/I:L/A:N',
      cve: null,
      detectionMethod: 'Security Configuration Analyzer',
      cfResourceId: 'WebsiteDistribution',
      cfFix: `Resources:
    WebsiteDistribution:
      Type: AWS::CloudFront::Distribution
      Properties:
        DistributionConfig:
          # Other properties remain the same
          ViewerCertificate:
            AcmCertificateArn: !Ref Certificate
            MinimumProtocolVersion: TLSv1.2_2021
            SslSupportMethod: sni-only
          DefaultCacheBehavior:
            # Other properties remain the same
            ViewerProtocolPolicy: redirect-to-https`,
      driftDetected: false,
      description: 'The CloudFront distribution was configured to allow HTTP traffic without redirection to HTTPS, potentially exposing user data during transmission.',
      impact: 'Without HTTPS enforcement, data transmitted between users and the website could be intercepted or modified by attackers through man-in-the-middle attacks.',
      recommendation: [
        'Configure CloudFront to redirect all HTTP traffic to HTTPS',
        'Set a minimum TLS protocol version of TLSv1.2_2021',
        'Update CloudFormation template to enforce these settings',
        'Implement HTTP Strict Transport Security (HSTS)'
      ],
      resources: [
        { name: 'website-distribution', type: 'cloudfront', logicalId: 'WebsiteDistribution', stackName: 'website-hosting-stack' }
      ],
      bestPractices: [
        'Always enforce HTTPS for all web traffic',
        'Use modern TLS protocol versions (minimum TLSv1.2)',
        'Implement HSTS to prevent SSL stripping attacks',
        'Regularly rotate and update SSL/TLS certificates'
      ],
      awsSecurityHub: [
        '[CloudFront.3] CloudFront distributions should require encryption in transit',
        '[CloudFront.4] CloudFront distributions should have origin failover configured'
      ],
      complianceStandards: ['NIST 800-53', 'PCI DSS 3.2.1', 'HIPAA'],
      remediation: {
        description: 'This issue has been successfully remediated by updating the CloudFormation template',
        automationDocument: null
      }
    }
  ];