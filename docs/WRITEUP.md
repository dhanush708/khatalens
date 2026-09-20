# KhataLens - First Commit Hackathon Submission Writeup

**Track:** Ship It (Deployed live on AWS)  
**Hackathon:** First Commit | Bharat Builds Tour (WeMakeDevs x AWS Builder Center)  
**Project Name:** KhataLens  
**One-Liner:** Instant AI-powered credit ledger digitization for India's 12M+ small shopkeepers with Amazon Bedrock vision, human-in-the-loop verification, and polite multilingual reminders.

---

## 1. Problem Statement & Indian Context
Across tier-2 and tier-3 towns in India, over 12 million micro-merchants—kirana stores, neighborhood tailors, and chemists—extend informal credit (*udhaar*) to regular customers. This trust-based credit makes up 30-50% of monthly sales.

However, shopkeepers record these transactions in physical paper notebooks (*Bahi Khata*). This causes critical friction points:
- **Lost Revenue:** Entries fade, pages tear, or merchants forget to tally up old balances. An estimated ₹15,000–₹40,000 in credit is lost or delayed per store each year.
- **Data Entry Fatigue:** Existing fintech applications require shopkeepers to type customer names, phone numbers, and amounts item-by-item at the counter. When queues form, merchants revert to paper.
- **Social Friction in Debt Collection:** Requesting pending money from neighbors or elders is socially awkward and delicate.

## 2. Our Solution: KhataLens
KhataLens bridges paper ledgers and modern fintech with zero typing required:
1. **Snap & Extract:** The merchant photographs a ledger page.
2. **Bedrock Multimodal Vision:** Amazon Bedrock (Converse API) reads bilingual Hindi/English handwriting, distinguishes between credit (*Baki*) and payments (*Jama*), and returns structured JSON.
3. **Human-in-the-Loop Review:** A synchronized side-by-side view flags ambiguous rows (<0.85 confidence) in amber. The merchant can edit any cell in one tap. Nothing touches the database without human confirmation.
4. **Dues & Aging Dashboard:** Confirmed transactions are saved in Amazon DynamoDB. The dashboard aggregates total udhaar, debtor counts, and aging buckets (0-7, 8-30, 30+ days).
5. **Culturally Polite Multilingual Reminders:** Bedrock drafts friendly, non-confrontational payment reminder messages in Hindi, Tamil, or English, complete with a one-tap copy button for WhatsApp/SMS.

## 3. Where AWS Fits & Architectural Highlights
KhataLens is built 100% serverless using AWS SAM:
- **Amazon Bedrock (Converse API with Claude 3.5 Sonnet / Amazon Nova Pro):** Provides state-of-the-art vision extraction and multilingual reminder text generation.
- **Amazon S3:** Private bucket for raw ledger uploads with client-side compression and pre-signed PUT URLs.
- **AWS Lambda (Python 3.12):** Microservices for secure presigned URL generation, Bedrock orchestration, DynamoDB transaction persistence, and dues analytics.
- **Amazon DynamoDB:** Fast single-table design (`PK: SHOP#...`, `SK: ENTRY#...`) storing ledger entries and customer aggregate rollups.
- **Amazon API Gateway (HTTP API):** Low-latency HTTP routing with CORS protection.
- **Amazon CloudFront + S3:** Global edge distribution for the mobile-first React PWA.
- **Amazon CloudWatch:** Real-time structured telemetry, Bedrock token consumption, and latency logging.

## 4. Safety & Engineering Rigor
- **Prompt Injection Guardrails:** Ledger images are treated strictly as inert data; the Bedrock system prompt explicitly rejects executing any instructions written on paper.
- **Strict Pydantic Validation:** Every extracted entry is checked against typed schemas with automatic retry on malformed JSON.
- **Privacy First:** Only synthetic merchant data is used in code, samples, and demo recordings.
- **Cost & Rate Control:** Presigned URL size constraints, client-side downscaling, and Lambda concurrency limits protect against unexpected costs.
