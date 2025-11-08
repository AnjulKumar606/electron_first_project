
``` mermaid
flowchart TD

  %% --- SECTION: Webhook and Metadata ---
  subgraph TriggerAndExtract [Webhook & Metadata]
    A[Webhook Trigger]
    B[Function: Extract metadata]
  end

  %% --- SECTION: Get PR commits ---
  subgraph GetCommits [Collect PR commits]
    C[HTTP: Get PR commits list]
    D[Function: Split in batches (size=1)]
  end

  %% --- SECTION: Per-commit processing loop ---
  subgraph PerCommitLoop [Per-commit loop]
    direction TB
    E[HTTP: Get commit details]
    F{Commit has changed files?}
    G1[Function: Append commit to store (files present)]
    H[HTTP: Get compare with parent (fallback for merges)]
    G2[Function: Append commit to store (from compare)]
  end

  %% --- SECTION: Aggregate + AI + Commit ---
  subgraph AggregateAndAI [Aggregate → AI → Commit]
    I[Function: Read & clear store (aggregate files & patches)]
    J[Function: Build AI prompt]
    K[AI: Generate changelog JSON]
    L[Function: Prepare commit payload]
    M1[HTTP GET /contents/docs/CHANGELOG.md (check exists)]
    M2[HTTP PUT /contents/docs/CHANGELOG.md (create or update)]
  end

  %% --- SECTION: End ---
  subgraph End [Done]
    Z[Done / Notify (optional)]
  end

  %% --- FLOW CONNECTIONS ---
  A --> B --> C --> D
  D --> E
  E --> F
  F -- Yes --> G1 --> D
  F -- No --> H --> G2 --> D
  D -->|All batches processed| I
  I --> J --> K --> L --> M1 --> M2 --> Z

  %% --- NOTE ---
  classDef note fill:#f9f,stroke:#333,stroke-width:1px,color:#000;
  Note1("Note: If PR number is not available, use Compare API between before...after"):::note
  B --> Note1
```