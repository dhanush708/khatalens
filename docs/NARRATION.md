# KhataLens Demo Video Narration Script (Target: 02:45)

**Track:** Ship It (First Commit | Bharat Builds Tour)  
**Total Word Count:** 394 Words  
**Target Duration:** 2 minutes 45 seconds (Under 3:00 hard limit)  
**Speaking Rate:** ~140 words per minute (natural conversational pace with slight breathing pauses)

---

## Complete Spoken Script (Scene by Scene)

### Scene 1: Title & Project Overview [0:00 - 0:12]
> *"Welcome to KhataLens. We built this for the First Commit Bharat Builds Tour hackathon. It is an AI-powered ledger digitizer designed specifically for India's twelve million small shopkeepers."*
- **Word count:** 27 words  
- **Visual:** Clean high-resolution title card with hackathon badges and project branding.

---

### Scene 2: The Grassroots Problem [0:12 - 0:28]
> *"Across India, neighborhood kirana stores, tailors, and medical shops record customer credit, or udhaar, in paper notebooks. Pages get torn, ink fades, and collecting pending dues is socially awkward. Existing fintech apps demand manual re-typing, which is why shopkeepers abandon them."*
- **Word count:** 39 words  
- **Visual:** High-resolution photo of handwritten kirana credit ledger (*Bahi Khata*).

---

### Scene 3: Instant Capture & S3 Presigned Upload [0:28 - 0:42]
> *"With KhataLens, the shopkeeper simply takes a photo of their notebook page. The image is downscaled right inside the browser to save bandwidth, then uploaded directly to Amazon S3 through a secure pre-signed URL."*
- **Word count:** 32 words  
- **Visual:** Upload screen selecting Sharma Kirana Store ledger sample, S3 presigned URL generation badge.

---

### Scene 4: Bedrock Converse Vision AI [0:42 - 0:56]
> *"An AWS Lambda function invokes Amazon Bedrock using the Converse API. The vision model extracts handwritten names, amounts, and dates, distinguishing credit from payments even with mixed Hindi and English scripts."*
- **Word count:** 30 words  
- **Visual:** Natural vision extraction state with pulsating Bedrock Converse inference indicator.

---

### Scene 5: Human-in-the-Loop Review Screen [0:56 - 1:26]
> *"Here is the Review Screen. On the left is the original notebook page, and on the right is the extracted table. Our Pydantic validator flags ambiguous items in amber. Here, row two had faint handwriting with a lower confidence score. The shopkeeper can edit any number in one tap, and clicks Confirm. Nothing touches the database without human sign-off. We click Confirm and Save, and the verified entries are committed to Amazon DynamoDB."*
- **Word count:** 72 words  
- **Visual:** Side-by-side split view. Cursor smoothly hovers over row 2, edits ambiguous amount to ₹450, then clicks "Confirm & Save to Khata".

---

### Scene 6: Outstanding Dues & FIFO Aging Dashboard [1:26 - 1:44]
> *"Our Outstanding Dues Dashboard immediately updates with total credit and active customer balances. It computes FIFO aging buckets, clearly separating recent dues from overdue accounts older than thirty days that need attention."*
- **Word count:** 33 words  
- **Visual:** Live Dues Dashboard showing ₹4,620 total outstanding, customer list, and 0-7, 8-30, 30+ day aging risk cards.

---

### Scene 7: Polite Multilingual Reminders [1:44 - 2:05]
> *"When it is time to collect, asking should not damage relationships. We tap Draft Reminder on a customer. Amazon Bedrock writes a warm, respectful reminder. We can switch from English to Hindi, or to Tamil. Notice we provide a copy button only. KhataLens never sends automated messages without merchant consent."*
- **Word count:** 47 words  
- **Visual:** Customer reminder modal opens. Language switches English -> Hindi -> Tamil. Cursor clicks "Copy Message" (shows "Copied to Clipboard!").

---

### Scene 8: Tech Stack & Security Design [2:05 - 2:22]
> *"Architecturally, KhataLens runs on React and TypeScript on the frontend, with Python three-twelve AWS Lambdas and a DynamoDB single-table design. For security, our prompt-injection defense treats all ledger handwriting strictly as inert data, and Bedrock tool schemas enforce strict JSON parsing."*
- **Word count:** 37 words  
- **Visual:** Architecture slide showing cloud topology, Converse tool schema enforcement, and prompt injection defense.

---

### Scene 9: AWS Serverless Infrastructure [2:22 - 2:38]
> *"Our entire cloud infrastructure is defined as Infrastructure as Code in AWS SAM. The template provisions S3 buckets, HTTP API Gateway, Lambdas, DynamoDB, and CloudFront. Here in local mode, we run using SAM tooling with synthetic datasets, fully ready to deploy."*
- **Word count:** 37 words  
- **Visual:** Real SAM `template.yaml` resource map (10 declared resources) and `sam deploy` command.

---

### Scene 10: What We Learned [2:38 - 2:54]
> *"During this build, we learned that Converse API tool schemas eliminate chatty JSON hallucinations completely. We also saw how direct pre-signed S3 uploads avoid Lambda connection timeouts, and how FIFO aging brings true accounting accuracy to grassroots businesses."*
- **Word count:** 36 words  
- **Visual:** Three engineering learnings slide (Converse API tool use, S3 presigning, FIFO debt aging).

---

### Scene 11: Closing & Impact [2:54 - 3:00]
> *"KhataLens brings modern AI superpower to small Indian merchants while keeping the human in complete control of every number. Thank you for reviewing KhataLens!"*
- **Word count:** 24 words  
- **Visual:** Closing impact card with GitHub repository link and WeMakeDevs x AWS Builder Center attribution.

---

## 🎙️ Recording Tips & Browser Voice Setup
1. **Best Voice:** Open `http://localhost:8000/auto-demo` in **Microsoft Edge**. Edge includes state-of-the-art neural natural voices (e.g. *Microsoft Prabhat Online (Natural) - English (India)* or *Microsoft Neerja Online (Natural)*).
2. **Teleprompter Mode:** If you prefer speaking in your own voice, switch mode to **Teleprompter**. The script will highlight sentence by sentence at a steady 140 WPM reading pace while driving the UI.
3. **Screen Recording:** Use OBS Studio, Windows Snipping Tool (Win + Shift + R), or QuickTime set to 1920x1080 60 FPS full screen.
