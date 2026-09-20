export interface DemoSentence {
  text: string;
  action?: string;
  cursorTarget?: { x: number; y: number; click?: boolean };
}

export interface DemoScene {
  id: string;
  title: string;
  stepNumber: number;
  sentences: DemoSentence[];
  badge?: string;
}

export const DEMO_SCENES: DemoScene[] = [
  // 1. Intro Title Card
  {
    id: 'intro',
    title: 'KhataLens: AI Ledger Digitization',
    stepNumber: 1,
    badge: 'First Commit | Bharat Builds Tour',
    sentences: [
      {
        text: "Welcome to KhataLens. We built this for the First Commit Bharat Builds Tour hackathon.",
        cursorTarget: { x: 50, y: 50 }
      },
      {
        text: "It is an AI-powered ledger digitizer designed specifically for India's twelve million small shopkeepers.",
        cursorTarget: { x: 50, y: 55 }
      }
    ]
  },

  // 2. The Problem: Paper Ledger
  {
    id: 'problem',
    title: 'The Problem: Trapped in Paper Ledgers',
    stepNumber: 2,
    badge: 'The Grassroots Problem',
    sentences: [
      {
        text: "Across India, neighborhood kirana stores, tailors, and medical shops record customer credit, or udhaar, in paper notebooks.",
        cursorTarget: { x: 40, y: 40 }
      },
      {
        text: "Pages get torn, ink fades, and collecting pending dues is socially awkward. Existing fintech apps demand manual re-typing, which is why shopkeepers abandon them.",
        cursorTarget: { x: 50, y: 50 }
      }
    ]
  },

  // 3. Upload / Capture
  {
    id: 'upload',
    title: 'Instant Capture & S3 Presigned Upload',
    stepNumber: 3,
    badge: 'Step 1: Capture & Upload',
    sentences: [
      {
        text: "With KhataLens, the shopkeeper simply takes a photo of their notebook page.",
        cursorTarget: { x: 50, y: 42, click: true },
        action: 'select_sample'
      },
      {
        text: "The image is downscaled right inside the browser to save bandwidth, then uploaded directly to Amazon S3 through a secure pre-signed URL.",
        cursorTarget: { x: 50, y: 65 }
      }
    ]
  },

  // 4. Processing State (Vision AI)
  {
    id: 'processing',
    title: 'Multimodal Vision Extraction',
    stepNumber: 4,
    badge: 'Step 2: Bedrock Converse Vision',
    sentences: [
      {
        text: "An AWS Lambda function invokes Amazon Bedrock using the Converse API.",
        cursorTarget: { x: 50, y: 45 }
      },
      {
        text: "The vision model extracts handwritten names, amounts, and dates, distinguishing credit from payments even with mixed Hindi and English scripts.",
        cursorTarget: { x: 50, y: 55 }
      }
    ]
  },

  // 5. Review Screen (Human in the loop)
  {
    id: 'review',
    title: 'Human-in-the-Loop Verification',
    stepNumber: 5,
    badge: 'Step 3: Verify & Confirm',
    sentences: [
      {
        text: "Here is the Review Screen. On the left is the original notebook page, and on the right is the extracted table.",
        cursorTarget: { x: 30, y: 45 }
      },
      {
        text: "Our Pydantic validator flags ambiguous items in amber. Here, row two had faint handwriting with a lower confidence score.",
        cursorTarget: { x: 72, y: 42 },
        action: 'highlight_row'
      },
      {
        text: "The shopkeeper can edit any number in one tap, and clicks Confirm. Nothing touches the database without human sign-off.",
        cursorTarget: { x: 74, y: 42, click: true },
        action: 'edit_cell'
      },
      {
        text: "We click Confirm and Save, and the verified entries are committed to Amazon DynamoDB.",
        cursorTarget: { x: 88, y: 15, click: true },
        action: 'confirm_save'
      }
    ]
  },

  // 6. Dues Dashboard & Aging
  {
    id: 'dashboard',
    title: 'Outstanding Dues & Aging Dashboard',
    stepNumber: 6,
    badge: 'Step 4: Dues & Aging',
    sentences: [
      {
        text: "Our Outstanding Dues Dashboard immediately updates with total credit and active customer balances.",
        cursorTarget: { x: 25, y: 25 }
      },
      {
        text: "It computes FIFO aging buckets, clearly separating recent dues from overdue accounts older than thirty days that need attention.",
        cursorTarget: { x: 75, y: 25 }
      }
    ]
  },

  // 7. Polite Multilingual Reminders
  {
    id: 'reminders',
    title: 'Culturally Polite Reminders',
    stepNumber: 7,
    badge: 'Step 5: Multilingual Reminders',
    sentences: [
      {
        text: "When it is time to collect, asking should not damage relationships. We tap Draft Reminder on a customer.",
        cursorTarget: { x: 86, y: 52, click: true },
        action: 'open_reminder'
      },
      {
        text: "Amazon Bedrock writes a warm, respectful reminder. We can switch from English to Hindi, or to Tamil.",
        cursorTarget: { x: 58, y: 43, click: true },
        action: 'switch_language'
      },
      {
        text: "Notice we provide a copy button only. KhataLens never sends automated messages without merchant consent.",
        cursorTarget: { x: 82, y: 84, click: true },
        action: 'copy_reminder'
      }
    ]
  },

  // 8. Tech Stack & Architecture Slide
  {
    id: 'architecture',
    title: 'Architecture & Security Design',
    stepNumber: 8,
    badge: 'System Architecture',
    sentences: [
      {
        text: "Architecturally, KhataLens runs on React and TypeScript on the frontend, with Python three-twelve AWS Lambdas and a DynamoDB single-table design.",
        cursorTarget: { x: 30, y: 50 }
      },
      {
        text: "For security, our prompt-injection defense treats all ledger handwriting strictly as inert data, and Bedrock tool schemas enforce strict JSON parsing.",
        cursorTarget: { x: 70, y: 50 }
      }
    ]
  },

  // 9. How We Used AWS (Honest Scene)
  {
    id: 'aws',
    title: 'AWS Serverless Infrastructure',
    stepNumber: 9,
    badge: 'AWS Infrastructure',
    sentences: [
      {
        text: "Our entire cloud infrastructure is defined as Infrastructure as Code in AWS SAM.",
        cursorTarget: { x: 50, y: 35 }
      },
      {
        text: "The template provisions S3 buckets, HTTP API Gateway, Lambdas, DynamoDB, and CloudFront. Here in local mode, we run using SAM tooling with synthetic datasets, fully ready to deploy.",
        cursorTarget: { x: 50, y: 65 }
      }
    ]
  },

  // 10. Learning and Growth
  {
    id: 'learning',
    title: 'What We Learned',
    stepNumber: 10,
    badge: 'Execution & Learning',
    sentences: [
      {
        text: "During this build, we learned that Converse API tool schemas eliminate chatty JSON hallucinations completely.",
        cursorTarget: { x: 30, y: 40 }
      },
      {
        text: "We also saw how direct pre-signed S3 uploads avoid Lambda connection timeouts, and how FIFO aging brings true accounting accuracy to grassroots businesses.",
        cursorTarget: { x: 70, y: 60 }
      }
    ]
  },

  // 11. Closing Card & Impact
  {
    id: 'closing',
    title: 'KhataLens: Digitizing Bharat',
    stepNumber: 11,
    badge: 'First Commit | Bharat Builds Tour',
    sentences: [
      {
        text: "KhataLens brings modern AI superpower to small Indian merchants while keeping the human in complete control of every number.",
        cursorTarget: { x: 50, y: 45 }
      },
      {
        text: "Thank you for reviewing KhataLens!",
        cursorTarget: { x: 50, y: 60 }
      }
    ]
  }
];

export function calculateTotalWordCount(): number {
  return DEMO_SCENES.reduce((total, scene) => {
    const sceneWords = scene.sentences.reduce((sum, s) => sum + s.text.split(/\s+/).length, 0);
    return total + sceneWords;
  }, 0);
}
