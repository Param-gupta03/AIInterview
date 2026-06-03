import random

from app.schemas.interview_schema import InterviewDifficulty, InterviewDomain

QUESTION_BANK = {
    InterviewDomain.dsa: [
        "Explain how you would detect a cycle in a linked list.",
        "When would you use binary search, and what are its constraints?",
        "How do you choose between BFS and DFS for a graph problem?",
        "What is a hash table and how does it handle collisions?",
        "Explain the difference between a stack and a queue.",
        "How does a merge sort algorithm work?",
        "What is the time complexity of searching in a balanced binary search tree?",
        "Explain the concept of dynamic programming with an example.",
        "What is the difference between an array and a linked list?",
        "How do you find the middle element of a linked list in one pass?",
        "Explain the working of a Min-Heap.",
        "What is the difference between a directed and an undirected graph?",
    ],
    InterviewDomain.full_stack: [
        "How would you design authentication for a web app?",
        "Explain the request flow from browser to database.",
        "How would you handle validation on both frontend and backend?",
        "What are the pros and cons of microservices vs monolith architecture?",
        "How do you handle database migrations in a production environment?",
        "Explain the difference between SQL and NoSQL databases.",
        "What is REST and how does it differ from GraphQL?",
        "How do you secure a web application against CSRF attacks?",
        "What is a CDN and how does it improve application performance?",
        "Explain the concept of server-side rendering (SSR) vs client-side rendering (CSR).",
        "How do you manage state across a large-scale frontend application?",
        "What is a message queue and when should you use it?",
    ],
    InterviewDomain.frontend: [
        "How do you reduce unnecessary React re-renders?",
        "Explain the difference between controlled and uncontrolled inputs.",
        "How would you make a dashboard responsive and accessible?",
        "What are CSS Modules and why would you use them?",
        "Explain the concept of 'lifting state up' in React.",
        "What is the Virtual DOM and how does it improve performance?",
        "How do you handle error boundaries in React?",
        "What are the differences between useMemo and useCallback?",
        "Explain the box model in CSS.",
        "How do you optimize images for the web?",
        "What is the difference between localStorage, sessionStorage, and cookies?",
        "How do you implement code splitting in a React application?",
        "Describe the latest features in React 19.",
        "How does Tailwind CSS differ from traditional CSS frameworks?",
        "What is the purpose of the 'use client' directive in Next.js?",
        "How do you handle SEO in a single-page application?",
    ],
    InterviewDomain.ai_ml: [
        "How do you detect overfitting in a model?",
        "Explain precision, recall, and when each matters more.",
        "How would you prepare messy text data for an ML model?",
        "What is the difference between supervised and unsupervised learning?",
        "Explain the concept of cross-validation.",
        "What are neural networks and how do they 'learn'?",
        "How do you handle imbalanced datasets in classification?",
        "Explain the gradient descent algorithm.",
        "What is the purpose of an activation function in a neural network?",
        "Difference between L1 and L2 regularization.",
        "How does a Random Forest algorithm work?",
        "What is PCA and when is it used?",
    ],
    InterviewDomain.data_analyst: [
        "How would you investigate a sudden drop in conversion rate?",
        "Explain the difference between correlation and causation.",
        "How would you clean a dataset with missing values?",
        "What is an A/B test and how do you determine if results are significant?",
        "Explain the concept of 'Normal Distribution'.",
        "How do you handle outliers in your data analysis?",
        "What is a pivot table and how is it used?",
        "Explain the difference between inner, left, right, and full joins in SQL.",
        "How would you visualize a trend over time for a non-technical audience?",
        "What is the purpose of exploratory data analysis (EDA)?",
        "Explain what a P-value represents in statistics.",
        "How would you handle duplicate records in a large dataset?",
    ],
}


def generate_local_questions(domain: InterviewDomain, difficulty: InterviewDifficulty) -> list[str]:
    bank = QUESTION_BANK[domain].copy()
    random.shuffle(bank)
    prefix = {
        InterviewDifficulty.beginner: "Beginner",
        InterviewDifficulty.intermediate: "Intermediate",
        InterviewDifficulty.advanced: "Advanced",
    }[difficulty]
    
    selected = bank[:10]
    return [f"{prefix}: {q}" for q in selected]


def evaluate_interview_locally(answer_text: str, answered_count: int, skipped_count: int) -> tuple[str, int]:
    if answered_count == 0:
        return "All questions were skipped, so the interview score is 0.", 0

    answered_words = len(answer_text.split())
    score = min(85, max(5, answered_words // 8 + answered_count * 6 - skipped_count * 4))
    feedback = (
        "Gemini quota is exhausted, so this is a local fallback evaluation. "
        "Only answered questions were scored. Review skipped questions and add examples."
    )
    return feedback, score
