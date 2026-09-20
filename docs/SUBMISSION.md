# Hackathon Submission Details

**Track:** Ship It (Deployed on AWS with a live URL)  
**Event:** First Commit | Bharat Builds Tour (WeMakeDevs x AWS Builder Center)  
**Submission Deadline:** TODAY (~8:00 PM IST)

---

## Submission Form Fields

| Field | Value / Content |
| :--- | :--- |
| **Project Name** | **KhataLens** |
| **Tagline** | Instant AI-powered credit ledger digitization for India's 12M+ small shopkeepers using Amazon Bedrock vision and human-in-the-loop verification. |
| **Track** | Ship It (Deployed live on AWS) |
| **Repository URL** | *[GitHub Repository URL to be inserted upon pushing]* |
| **Live Deployed URL** | *[AWS CloudFront / S3 Public URL to be inserted upon SAM deployment]* |
| **Demo Video URL** | *[YouTube Video Link (unlisted/public, under 3:00) to be inserted]* |
| **Architecture Diagram Link** | `/docs/ARCHITECTURE.md` |
| **Demo Script & Shot List** | `/docs/DEMO_SCRIPT.md` |
| **AWS Services Genuinely Used** | 1. **Amazon Bedrock** (Converse API - Claude 3.5 Sonnet / Nova Pro vision for handwriting extraction, text generation for multilingual reminders)<br>2. **Amazon S3** (Private bucket for presigned image uploads, static website bucket for frontend SPA)<br>3. **AWS Lambda** (Python 3.12 serverless microservices for upload signing, Bedrock inference, DynamoDB transactions)<br>4. **Amazon DynamoDB** (Single-table design for ledger entries and aging metrics)<br>5. **Amazon API Gateway** (HTTP API routing and CORS handling)<br>6. **Amazon CloudFront** (Global HTTPS CDN edge distribution)<br>7. **Amazon CloudWatch** (Structured logging, telemetry, and error alarms)<br>8. **AWS SAM** (Reproducible Infrastructure-as-Code) |
| **AI Usage Disclosure** | **Antigravity** (Google DeepMind advanced agentic coding paired with Gemini 3.8 Flash), Claude 3.5 Sonnet via Amazon Bedrock Converse API for multimodal vision extraction and multilingual reminder prompting. |
| **Team Members** | Lead Engineer & AWS Builder |
| **License** | MIT License (100% open source) |
