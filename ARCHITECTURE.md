# System Architecture & Design Decisions

## High-Level Overview
The ArvyaX Journal system uses a modern full-stack architecture with Next.js serving both the UI and the API layer. Data is persisted in a local SQLite database for speed and simplicity, while complex emotional analysis is offloaded to the Groq Llama 3 LLM.

---

## 🚀 Scaling to 100k Users

To handle a scale of 100,000 users, the following transitions would be necessary:

1.  **Database Migration:** Move from local SQLite to a distributed SQL cluster like **PostgreSQL** (Managed via Supabase or AWS RDS). SQLite is excellent for concurrent reads but struggles with high concurrent write volume typical of 100k active users.
2.  **Stateless API Layer:** Deploy the Next.js application in a containerized environment (Docker/Kubernetes) behind a **Load Balancer** (Nginx/AWS ALB). This allows horizontal scaling based on traffic spikes.
3.  **Asynchronous Analysis:** Move LLM analysis to a **Background Job Queue** (e.g., BullMQ with Redis). Instead of making the user wait for the LLM response during an API call, return an "Accepted" status immediately and notify the frontend via WebSockets/SSE once analysis is complete.
4.  **Edge Caching:** Deploy on platforms like Vercel or AWS CloudFront to cache static assets and common API responses at Edge locations, reducing latency globally.

## 💰 Reducing LLM Costs

LLM tokens can become expensive at scale. Optimization strategies include:

1.  **Semantic Caching:** Before calling the LLM, check a cache (Redis) for semantically similar entries. If a user writes "I feel very peaceful by the lake," and another user previously wrote "I feel peaceful at the lake," we can reuse the results.
2.  **Model Tiering:** Use lighter, cheaper models (like Llama 3 8B or Mixtral) for simple categorization tasks and reserve high-parameter models (Llama 3 70B+) only for complex sentiment nuances.
3.  **Prompt Engineering:** Optimize system prompts to minimize output length while maintaining accuracy (e.g., forcing short JSON responses).

## ⚡ Caching Repeated Analysis

The system currently implements caching by:
- **Storing Results in DB:** Once an entry is analyzed, the emotion, keywords, and summary are saved alongside the text. Subsequent "Get Entries" calls retrieve these directly from the DB, incurring zero LLM cost.

**Future Improvement:** Implement a caching layer using a cryptographic hash (SHA-256) of the journal text. If any user submits the exact same text, the system can instantly return the cached analysis without hitting the LLM.

## 🔒 Protecting Sensitive Journal Data

Journal entries are highly personal and require top-tier security:

1.  **Encryption at Rest:** Ensure the database disk is encrypted using AES-256.
2.  **Field-Level Encryption:** Specifically encrypt the `text` field in the database using a user-derived key, so even a database leak doesn't expose the journal content.
3.  **PII Sanitization:** Implement a pre-analysis step that scrubs Personally Identifiable Information (Names, Phone Numbers, Addresses) before sending the data to the LLM (Groq/OpenAI).
4.  **Audit Logs & RBAC:** Implement Role-Based Access Control and log every instance where a journal entry is accessed to detect unauthorized behavior.
