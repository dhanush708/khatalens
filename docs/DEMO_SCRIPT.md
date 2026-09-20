# KhataLens Demo Video Script (2 Minutes 45 Seconds)

**Target Track:** Ship It (First Commit | Bharat Builds Tour)  
**Total Runtime:** 02:45 (Strictly under 3:00)  
**Format:** Screen recording + Webcam picture-in-picture + Audio narration

---

## Shot-by-Shot Timeline & Narration

### [0:00 - 0:20] The Real Problem: The Kirana Paper Ledger
- **Visual:** Camera shows a physical spiral notebook or paper ledger with messy handwritten Hindi/English credit entries (*Bahi Khata*).
- **On Screen:** "Paper Ledgers = Lost Money & Awkward Reminders"
- **Narration:**
  > *"Across India, over 12 million small kirana store owners, tailors, and medical shops track customer credit—udhaar—in paper notebooks just like this. Every month, money gets forgotten, entries are disputed, and asking customers to pay is socially awkward. Existing apps demand manual re-typing, which is why shopkeepers abandon them. Introducing KhataLens: simply take a photo of your notebook page, and in seconds, Amazon Bedrock extracts structured debts, lets you verify every number, and drafts polite reminders in your customer's native language."*

---

### [0:20 - 1:10] The Solution: Photo Upload & Amazon Bedrock Vision Extraction
- **Visual:** Switch to screen capture of the KhataLens web app (responsive mobile viewport or clean desktop browser). Click "Upload Ledger" or tap one of the synthetic samples (e.g. *Sharma Kirana Store*).
- **On Screen:** Upload progress bar -> "Extracting with Amazon Bedrock Converse API..."
- **Narration:**
  > *"Let's watch KhataLens in action. We upload a photo of this kirana ledger page. The image is compressed in the browser and securely uploaded directly to Amazon S3 via a presigned URL. Immediately, an AWS Lambda function invokes Amazon Bedrock's Converse API using Claude 3.5 Sonnet. Notice what Bedrock has to handle: bilingual Hindi and English, informal notations like 'Jama' for payments and 'Baki' for debts, and irregular handwriting. The model returns a structured JSON schema validated against Pydantic."*

---

### [1:10 - 1:50] Human-in-the-Loop Review Screen
- **Visual:** The UI transitions into the **Review Screen**. On the left is the high-res zoomable ledger image; on the right is the editable interactive table. Row 2 has an amber warning badge ("Confidence: 78%").
- **Action:** Click into the low-confidence cell, edit the amount from ₹400 to ₹450, and toggle a customer name. Then click the large primary button **"Confirm & Save to Khata"**.
- **On Screen:** "Human-in-the-Loop Verification: Nothing touches the database without human sign-off."
- **Narration:**
  > *"This is our core product philosophy: Human-in-the-Loop. No AI is infallible with messy cursive. KhataLens puts the original notebook page side-by-side with the extracted records. Any low-confidence extraction is automatically flagged in amber. As the shopkeeper, I can pan and zoom the image, edit any cell in one tap, or add a missing entry. Nothing is saved to our database until the shopkeeper explicitly confirms. We hit 'Confirm & Save'—and the verified entries are committed to Amazon DynamoDB."*

---

### [1:50 - 2:15] Outstanding Dues Dashboard & Multilingual Reminders
- **Visual:** Dashboard loads showing:
  1. Total Outstanding Udhaar (₹4,620)
  2. Total Active Debtors (5 customers)
  3. Aging Breakdown: 0-7 Days (₹2,100), 8-30 Days (₹1,870), 30+ Days (₹650)
- **Action:** Click on customer *Ramesh Kumar (₹850 due)* -> click **"Draft Reminder"** -> select **Hindi (हिन्दी)** and **Tamil (தமிழ்)**. The Bedrock-drafted message appears. Click **"Copy Message"**.
- **Narration:**
  > *"Instantly, our Outstanding Dues Dashboard updates in real time. We see total credit, active debtor counts, and critical aging buckets—showing debts older than 30 days that need urgent attention. When it's time to collect, asking shouldn't strain the relationship. We tap 'Draft Reminder', and Bedrock generates a warm, courteous message in English, Hindi, or Tamil: 'नमस्ते रमेश जी, शर्मा किराना स्टोर का ₹850 बकाया है...' We provide a single-tap 'Copy to Clipboard' button—never auto-sending anything without merchant approval."*

---

### [2:15 - 2:40] AWS Proof: Cloud Architecture in Action
- **Visual (CRITICAL FOR JUDGING):** Rapid, crisp tour of AWS Management Console tabs:
  1. **AWS CloudFormation / SAM Stack:** Show `khatalens-stack` in `CREATE_COMPLETE` status with all resources.
  2. **Amazon CloudWatch Logs:** Show the real-time Lambda log stream showing Bedrock Converse API invocation, token usage, and latency.
  3. **Amazon DynamoDB Items:** Open `KhataLensTable` in AWS Console showing partition key `SHOP#default` and sorted entries.
  4. **Amazon S3 Bucket:** Show the private uploads bucket with presigned upload objects.
- **Narration:**
  > *"Let's look under the hood at our AWS infrastructure. KhataLens is 100% serverless, defined and deployed using AWS SAM. Our frontend is served globally via Amazon CloudFront and S3. Our backend uses Amazon API Gateway HTTP APIs routing to Python 3.12 Lambdas. High-res images land in private S3 buckets. Bedrock executes multimodal vision inference with strict schema guardrails, and persistent records are stored in Amazon DynamoDB single-table architecture. In CloudWatch, you can see our structured telemetry and sub-second execution logs."*

---

### [2:40 - 2:45] Impact & Conclusion
- **Visual:** Return to KhataLens dashboard with team name and GitHub link.
- **On Screen:** "KhataLens: Digitizing Bharat's Kirana Stores with AWS"
- **Narration:**
  > *"KhataLens transforms the oldest business habit in India into a modern digital advantage in under 30 seconds. Built with Amazon Bedrock, deployed live on AWS. Thank you!"*

---

## Captions & Accessibility Checklist
- [x] Subtitles / closed captions enabled throughout the video.
- [x] Clear text overlays highlighting key AWS services at exact timestamps.
- [x] Microphone audio normalized with zero background noise.
- [x] Video resolution set to 1080p 60fps, recorded in 16:9 aspect ratio.
- [x] Video under 3:00 (exact target: 2:45).
