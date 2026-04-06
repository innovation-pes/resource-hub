Design a modern, professional, and clean web application UI for a university academic resource platform.

The platform is intended for students to easily find curated study resources based on their department, subject, module, and topic.

🎯 Core User Flow:

User selects their Department (default option: "Computer Science and Engineering", with ability to add more later).

User selects a Subject (include subject name + subject code, e.g., "Data Structures - CS201").

User selects a Module within the subject (e.g., "Module 1: Trees").

User selects a Topic within the module (e.g., "Binary Trees").

System displays 4–5 curated resources (YouTube links, articles, GitHub repos).

🧩 UI Requirements:
1. Landing Page

Minimal, modern design

Hero section with title: “Academic Resource Hub”

Subtitle: “Find the best curated resources for your subjects instantly”

CTA button: “Get Started”

2. Selection Dashboard

Create a clean dashboard with:

Dropdown 1: Department

Dropdown 2: Subject (with subject code)

Dropdown 3: Module

Dropdown 4: Topic

Use:

Smooth transitions between selections

Disable next dropdown until previous is selected

3. Results Section

After topic selection, display:

Card-based layout (4–5 cards)

Each card includes:

Resource title

Type badge (Video / Article / GitHub)

Short description (dummy text)

“Open Resource” button

🧪 Dummy Data (for prototype only):

Department:

Computer Science and Engineering

Subjects:

Data Structures - CS201

Operating Systems - CS301

Modules:

Module 1: Trees

Module 2: Graphs

Topics:

Binary Trees

BST

Graph Traversal

Resources (example):

“Binary Trees Explained” (YouTube)

“Complete Guide to Trees” (Article)

“Tree Implementation in Java” (GitHub)

🎨 Design Style:

Clean, minimal, professional (similar to modern SaaS dashboards)

Light theme preferred

Soft shadows, rounded cards

Use consistent spacing and grid layout

Subtle animations for interactions

Icons for resource types

⚙️ Technical Notes:

This is a frontend-only design

Data should be mocked (use static/dummy data)

Keep backend/data connection as a placeholder (Google Sheets / Database will be integrated later)

📱 Responsiveness:

Fully responsive (desktop + tablet + mobile)

✨ Bonus (if possible):

Add loading state (skeleton UI)

Add search bar for topics

Add filter (Videos / Articles / Code)

The goal is to make this look like a real, production-ready academic platform that could be used by university students.