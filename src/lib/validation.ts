import type { SurveyAnswers } from "@/lib/types";

function normalizeWhatsapp(value: string) {
  const digits = value.replace(/\D/g, "");
  const localDigits = digits.startsWith("91") ? digits.slice(2) : digits;
  if (localDigits.length === 10) return `+91${localDigits}`;
  return value;
}

export function validateContact(answers: SurveyAnswers) {
  const required = ["first_name", "last_name", "email", "whatsapp_number"] as const;
  for (const key of required) {
    if (!answers[key]?.trim()) {
      return { valid: false, message: "Please fill all contact details before calculating your score." };
    }
  }

  const email = (answers.email ?? "").trim().toLowerCase();
  if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email)) {
    return { valid: false, message: "Please enter a valid email address." };
  }

  const phone = (answers.whatsapp_number ?? "").trim();
  if (!/^\+91\s?\d{10}$/.test(phone)) {
    return { valid: false, message: "Please enter a valid WhatsApp number with +91 and exactly 10 digits." };
  }

  const phoneDigits = phone.replace(/\D/g, "").slice(2);
  if (phoneDigits.length !== 10) {
    return { valid: false, message: "WhatsApp number must have exactly 10 digits after +91." };
  }

  answers.email = email;
  answers.whatsapp_number = normalizeWhatsapp(phone);
  return { valid: true, message: "" };
}
