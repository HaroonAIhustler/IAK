import type { SurveyAnswers } from "@/lib/types";

export type SurveyQuestion = {
  key: keyof SurveyAnswers;
  question: string;
  microcopy?: string;
  type: "select" | "city";
  options?: string[];
  visible?: (answers: SurveyAnswers) => boolean;
};

export const userSegmentOptions = [
  "Fresher, not started applying seriously yet",
  "Fresher, already applying but no replies",
  "0-2 of years experience",
  "2-5 of years experience"
];

export function isFresher(segment?: string) {
  return Boolean(segment?.includes("Fresher"));
}

export function isExperienced(segment?: string) {
  return Boolean(segment?.includes("0-2") || segment?.includes("2-5"));
}

function reasonForChangeOptions(segment?: string) {
  if (isExperienced(segment)) {
    return [
      "Looking for senior roles",
      "Seeking a challenging role",
      "Better salary",
      "Better company",
      "Change domain",
      "Work-life balance",
      "Job stability",
      "Location preference",
      "Other"
    ];
  }

  return [];
}

export const fieldOfStudyOptions = [
  "Commerce and finance",
  "Management and business",
  "Arts, humanities, and social sciences",
  "Science",
  "Computer applications and IT",
  "Engineering and technology",
  "Architecture, planning, and design",
  "Medical, dental, and healthcare",
  "Law",
  "Education and teaching",
  "Agriculture, veterinary, fisheries, and allied",
  "Media, journalism, and communication",
  "Hotel management, tourism, travel, and aviation",
  "Fine arts, performing arts, and creative fields",
  "Library, information, and documentation",
  "Physical education, sports, and fitness",
  "Diploma backgrounds",
  "Other"
];

export const targetFieldOptions = [
  "Accounting, Finance & Tax",
  "Sales",
  "Digital Marketing",
  "Business Development",
  "IT, Software & Technology",
  "Administration & Office Roles",
  "Human Resources & Recruitment",
  "Customer Support & BPO",
  "Engineering & Manufacturing",
  "Construction, Real Estate & Architecture",
  "Healthcare & Medical",
  "Education & Training",
  "Content, Media & Creative",
  "Legal & Compliance",
  "Retail, Store & E-commerce",
  "Logistics, Supply Chain & Transport",
  "Hospitality, Travel & Aviation",
  "Agriculture, Food & Environment",
  "Design, Fashion & Lifestyle",
  "Other"
];

export const surveyQuestions: SurveyQuestion[] = [
  {
    key: "user_segment",
    question: "What best describes you?",
    microcopy: "This helps us understand what recruiters expect from your resume.",
    type: "select",
    options: userSegmentOptions
  },
  {
    key: "reason_for_change",
    question: "Why do you want to change?",
    type: "select",
    options: [],
    visible: (answers) => isExperienced(answers.user_segment)
  },
  {
    key: "jobs_applied",
    question: "How many jobs did you apply to?",
    microcopy: "Be honest - this is where we calculate your effort vs reply gap.",
    type: "select",
    options: ["0-10 jobs", "10+ jobs", "50+ jobs", "100+ jobs", "300+ jobs", "I've lost count"]
  },
  {
    key: "replies_received",
    question: "How many replies did you get?",
    microcopy: "This helps us understand if your resume is converting into recruiter interest.",
    type: "select",
    options: ["0 replies", "1-2 replies total", "1-2 replies per week", "3-5 replies per week", "Mostly irrelevant or scam calls", "Calls, but not from good companies"]
  },
  {
    key: "application_outcome",
    question: "What happens after you apply?",
    microcopy: "This shows where your resume may be getting blocked.",
    type: "select",
    options: ["No response at all", "Rejection email after a few days", "Application gets viewed but no reply", "Recruiter calls then disappears", "I clear first call but don't move ahead", "I don't know what happens"]
  },
  {
    key: "city",
    question: "Which city are you applying from?",
    microcopy: "We'll use this to personalize your result and job-market context.",
    type: "city"
  },
  {
    key: "education_background",
    question: "What is your education?",
    type: "select",
    options: ["Bachelors Degree", "Engineering Degree", "Masters Degree", "MBA", "PhD", "Diploma", "Non-Graduate", "Other"]
  },
  {
    key: "graduation_year",
    question: "When did you graduate?",
    type: "select",
    options: Array.from({ length: 17 }, (_, index) => String(2026 - index))
  },
  {
    key: "field_of_study",
    question: "What did you study?",
    type: "select",
    options: fieldOfStudyOptions
  },
  {
    key: "target_field",
    question: "Which field do you want to work in?",
    microcopy: "Pick the field you want your resume to help you enter.",
    type: "select",
    options: targetFieldOptions
  },
  {
    key: "digital_marketing_training",
    question: "Any Digital Marketing training?",
    microcopy: "Recruiters look for proof of practical skills, especially for marketing roles.",
    type: "select",
    options: ["Yes", "No", "Studied in college", "Watched YouTube videos"],
    visible: (answers) => isFresher(answers.user_segment) && answers.target_field === "Digital Marketing"
  },
  {
    key: "resume_usage",
    question: "Same resume for every job?",
    microcopy: "This is one of the biggest reasons resumes stop getting replies.",
    type: "select",
    options: ["Yes, same resume for every job", "I change only job title or objective", "I make small edits sometimes", "I customize it properly for each role", "I don't know how to customize my resume"]
  },
  {
    key: "tried_before",
    question: "What Job application strategies have you tried",
    microcopy: "This helps us avoid giving you the same generic advice again.",
    type: "select",
    options: ["Free resume templates", "YouTube videos", "ChatGPT", "Resume advice from friends or seniors", "Paid resume service", "Nothing properly yet"]
  },
  {
    key: "ats_awareness",
    question: "Have you checked ATS fit?",
    microcopy: "Many resumes get filtered before a recruiter ever opens them.",
    type: "select",
    options: ["I don't know what ATS means", "I've heard of ATS but never checked", "I checked once but didn't understand the score", "Yes, but I still don't get replies"]
  },
  {
    key: "ai_proficiency",
    question: "How good are you with AI?",
    microcopy: "AI can help you tailor resumes faster, but only if you know how to use it correctly.",
    type: "select",
    options: ["Just starting - Beginner", "Have used ChatGPT - Need to explore other tools", "Expert in AI - Can execute live projects", "Actively using multiple AI tools"]
  }
];

export function getVisibleQuestions(answers: SurveyAnswers) {
  return surveyQuestions
    .filter((question) => !question.visible || question.visible(answers))
    .map((question) => {
      if (question.key === "reason_for_change") {
        return { ...question, options: reasonForChangeOptions(answers.user_segment) };
      }

      return question;
    });
}
