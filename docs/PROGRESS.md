# KhataLens Progress & Verification Tracker

Track: **Ship It (First Commit | Bharat Builds Tour - WeMakeDevs x AWS Builder Center)**  
Submission Deadline: **TODAY (~8:00 PM IST)**

---

## 1. Environment & AWS Assumptions
- [x] Fresh Git repository initialized
- [x] Initial setup: `.gitignore`, `.env.example`, `LICENSE`
- [ ] AWS CLI credentials verification & active region confirmation
- [ ] Bedrock foundation models probed (Claude 3.5 Sonnet / Nova Lite / Nova Pro)
- [ ] AWS SAM CLI installed and verified

---

## 2. MUST-HAVE Deliverables (Strict Priority Order)
- [ ] **M1: Upload Pipeline (S3 Presigned URLs)**
  - [ ] Backend: Lambda function to generate secure S3 presigned PUT URL
  - [ ] Frontend: Camera capture / drag-and-drop file upload with client-side downscaling
  - [ ] S3 bucket policy & CORS configuration
- [ ] **M2: Bedrock Vision Extraction (Converse API + Structured Output)**
  - [ ] Strict Pydantic models for `LedgerEntry` (`customer`, `amount`, `date`, `type`, `confidence`, `source_note`)
  - [ ] System prompt guardrails (prompt injection defense: ledger content treated strictly as data)
  - [ ] Bedrock Converse API vision invocation with tool-use / structured JSON schema
  - [ ] Retry-on-failure validation layer
  - [ ] Local fallback / mock extractor for zero-latency testing & offline demo mode
- [ ] **M3: Review Screen (Human-in-the-Loop)**
  - [ ] Side-by-side / tabbed view: original image canvas with pan/zoom next to editable data table
  - [ ] Low-confidence row visual highlights (confidence < 0.85)
  - [ ] Inline editing for all cells, row add/delete, and running totals
  - [ ] Explicit "Confirm & Save" gate (nothing touches DynamoDB without human sign-off)
- [ ] **M4: DynamoDB Persistence & Dues Dashboard**
  - [ ] DynamoDB single-table design (`PK: SHOP#..., SK: ENTRY#... / CUSTOMER#...`)
  - [ ] Dashboard analytics: Total Outstanding Udhaar, Customer Count, Aging Buckets (0-7, 8-30, 30+ days)
  - [ ] Customer search & transaction drill-down
- [ ] **M5: Multilingual Polite Reminders (Bedrock Prompting)**
  - [ ] Bedrock prompt for respectful, non-confrontational payment reminders
  - [ ] English, Hindi (हिन्दी), and Tamil (தமிழ்) language generation
  - [ ] One-tap clipboard copy (no auto-send)
- [ ] **M6: AWS Cloud Deployment (SAM Infrastructure as Code)**
  - [ ] SAM `template.yaml` (HTTP API Gateway, Lambdas, S3 buckets, DynamoDB table, CloudFront)
  - [ ] Least-privilege IAM policies per Lambda
  - [ ] Production build of React frontend deployed to S3 + CloudFront
  - [ ] Verified live public URL

---

## 3. SHOULD-HAVE Deliverables
- [ ] Bundled Demo Mode with 5 synthetic ledger samples
- [ ] Accuracy Benchmark Panel evaluating ground truth vs. AI extraction
- [ ] CloudWatch structured logs & metrics dashboard screenshot
- [ ] API Gateway throttling / usage plan

---

## 4. Documentation & Demo Assets
- [ ] 5 synthetic handwritten-style ledger images + ground-truth JSON files in `/samples`
- [ ] `/docs/ARCHITECTURE.md` with complete Mermaid diagram and failure flows
- [ ] `/docs/DEMO_SCRIPT.md` (2:45 exact timestamped video script with shot list)
- [ ] `/docs/WRITEUP.md` (First Commit submission writeup)
- [ ] `/docs/BLOG.md` (AWS Builder Center blog post draft)
- [ ] `/docs/SUBMISSION.md` (all required submission fields prepared)
- [ ] `README.md` with full badges, architecture, AWS matrix, and AI usage disclosure

---

## 5. Pre-Upload Final Checklist (10 Gates)
- [ ] Gate 1: Clean clone and build from scratch
- [ ] Gate 2: Live URL accessible incognito with working mobile flow and demo mode
- [ ] Gate 3: Automated secret scan (no keys, tokens, or personal data)
- [ ] Gate 4: Git history sanity (fresh commits, meaningful messages)
- [ ] Gate 5: Open-source license attribution for all dependencies
- [ ] Gate 6: README links, images, and diagrams render correctly
- [ ] Gate 7: AWS proof captured (CloudWatch, DynamoDB, Bedrock, SAM stack)
- [ ] Gate 8: Demo video under 3:00 with working app + AWS console visible
- [ ] Gate 9: Cost check & teardown commands documented
- [ ] Gate 10: Submission form fields verified
