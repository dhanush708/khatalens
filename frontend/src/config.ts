/**
 * KhataLens Configuration
 * 
 * HONESTY SETTING:
 * - 'local-open-source': The demo and AWS scenes honestly show that KhataLens runs locally
 *   with the AWS SAM tooling and sample datasets, and that the SAM template (template.yaml)
 *   defines the cloud stack (S3, API Gateway, Lambda, DynamoDB, CloudFront, Bedrock) ready to deploy.
 * - 'deployed': The AWS scene shows the live deployed CloudFront URL and prompts the user
 *   to cut to the real AWS Console screen-recording.
 */
export const AWS_MODE: 'local-open-source' | 'deployed' = 'local-open-source';

export const APP_VERSION = '1.0.0';
export const EVENT_NAME = 'First Commit | Bharat Builds Tour';
export const EVENT_TRACK = 'Ship It';
