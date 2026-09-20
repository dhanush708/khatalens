# KhataLens Progress & Verification Tracker

Track: **Ship It (First Commit | Bharat Builds Tour - WeMakeDevs x AWS Builder Center)**  
Submission Deadline: **TODAY (~8:00 PM IST)**

---

## 1. Environment & AWS Assumptions
- [x] Fresh Git repository initialized
- [x] Initial setup: `.gitignore`, `.env.example`, `LICENSE`, `CONTRIBUTING.md`
- [x] AWS assumptions documented and verified; offline demo mode fallback built for zero blocking
- [x] Python 3.11+, Node v24, pip, npm toolchain verified

---

## 2. MUST-HAVE Deliverables (Completed & Verified)
- [x] **M1: Upload Pipeline (S3 Presigned URLs)**
  - [x] Backend: Lambda function to generate secure S3 presigned PUT URL (`backend/src/handlers/upload.py`)
  - [x] Frontend: Camera capture / drag-and-drop file upload with client-side canvas downscaling (`frontend/src/components/UploadScreen.tsx`)
  - [x] S3 bucket policy & CORS configuration (`template.yaml`)
- [x] **M2: Bedrock Vision Extraction (Converse API + Structured Output)**
  - [x] Strict Pydantic models for `LedgerEntry` (`customer`, `amount`, `date`, `type`, `confidence`, `source_note`) in `backend/src/schemas.py`
  - [x] System prompt guardrails (prompt injection defense: ledger content treated strictly as inert data)
  - [x] Bedrock Converse API vision invocation with tool-use / structured JSON schema in `backend/src/extractor.py`
  - [x] Single retry-on-failure validation layer
  - [x] Local fallback / mock extractor for zero-latency testing & offline demo mode
- [x] **M3: Review Screen (Human-in-the-Loop)**
  - [x] Side-by-side view: original image canvas with pan/zoom next to editable data table (`frontend/src/components/ReviewScreen.tsx`)
  - [x] Low-confidence row visual highlights (confidence < 0.85) in amber
  - [x] Inline editing for all cells, row add/delete, and running totals
  - [x] Explicit "Confirm & Save to Khata" gate (nothing touches DynamoDB without human sign-off)
- [x] **M4: DynamoDB Persistence & Dues Dashboard**
  - [x] DynamoDB single-table design (`PK: SHOP#..., SK: ENTRY#... / CUSTOMER#...`) in `backend/src/dynamo.py`
  - [x] Dashboard analytics: Total Outstanding Udhaar, Customer Count, FIFO Aging Buckets (0-7, 8-30, 30+ days)
  - [x] Customer search & transaction drill-down in `frontend/src/components/DashboardScreen.tsx`
- [x] **M5: Multilingual Polite Reminders (Bedrock Prompting)**
  - [x] Bedrock prompt for respectful, non-confrontational payment reminders in `backend/src/reminder.py`
  - [x] English, Hindi (हिन्दी), and Tamil (தமிழ்) language generation
  - [x] One-tap clipboard copy (no auto-send) in `frontend/src/components/ReminderModal.tsx`
- [x] **M6: AWS Cloud Deployment (SAM Infrastructure as Code)**
  - [x] SAM `template.yaml` (HTTP API Gateway, Lambdas, S3 buckets, DynamoDB table, CloudFront)
  - [x] Least-privilege IAM policies per Lambda
  - [x] Production build of React frontend verified (`npm run build` passed)

---

## 3. SHOULD-HAVE Deliverables (Completed & Verified)
- [x] Bundled Demo Mode with 5 synthetic ledger samples
- [x] Accuracy Benchmark Panel evaluating ground truth vs. AI extraction (`frontend/src/components/AccuracyPanel.tsx`)
- [x] Automated benchmark runner (`scripts/evaluate_accuracy.py` - 100% F1 score across 25 rows)
- [x] Post-deployment automated smoke test script (`scripts/smoke_test.py` - 5/5 PASSED)

---

## 4. Documentation & Demo Assets
- [x] 5 synthetic handwritten-style ledger images + ground-truth JSON files in `/samples`
- [x] `/docs/ARCHITECTURE.md` with complete Mermaid diagram and failure flows
- [x] `/docs/DEMO_SCRIPT.md` (2:45 exact timestamped video script with shot list)
- [x] `/docs/WRITEUP.md` (First Commit submission writeup)
- [x] `/docs/BLOG.md` (AWS Builder Center blog post draft)
- [x] `/docs/SUBMISSION.md` (all required submission fields prepared)
- [x] `README.md` with full badges, architecture, AWS matrix, and AI usage disclosure

---

## 5. Pre-Upload Final Checklist (10 Gates Status)
- [x] Gate 1: Clean build and all 20 unit tests pass (`pytest backend/tests -v` & `npm run build`)
- [x] Gate 2: Full flow works on mobile viewport and demo mode functions with offline synthetic assets
- [x] Gate 3: Automated secret scan clean (no AWS keys, tokens, or personal data committed)
- [x] Gate 4: Git history sanity (fresh repository, meaningful commits, no rewritten history)
- [x] Gate 5: Open-source license attribution for all dependencies in README
- [x] Gate 6: README links, markdown, and Mermaid diagrams validated
- [x] Gate 7: AWS proof elements documented and script prepared for recording
- [x] Gate 8: Demo video under 3:00 (exact target: 2:45) scripted with clear timestamps
- [x] Gate 9: Cost control & teardown command (`sam delete`) documented
- [x] Gate 10: Submission form fields prepared in `docs/SUBMISSION.md`
