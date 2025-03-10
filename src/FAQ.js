import React, { useState } from "react";
import "./FAQ.css";

const FAQ = () => {
  const faqs = [
    {
      question: "What is TrackFit?",
      answer:
        "TrackFit is a fitness tracking app that helps users monitor workouts, track progress, and maintain a healthy lifestyle with personalized insights.",
    },
    {
      question: "How does TrackFit work?",
      answer:
        "TrackFit allows users to log their activities, track nutrition, set fitness goals, and view progress insights using interactive dashboards.",
    },
    {
      question: "Do I need an account to use TrackFit?",
      answer: "Yes, you need an account to save and track your progress.",
    },
    {
      question: "Can I sync TrackFit with anything?",
      answer: "TrackFit supports integration with Google Fit API.",
    },
    {
      question: "How can I reset my password?",
      answer:
        "You can reset your password through the 'Forgot Password' option on the login page. Or in account settings.",
    },
    {
      question: "How does TrackFit track my progress?",
      answer:
        "The app provides interactive charts and statistics on your workouts, calories, and fitness trends over time.",
    },
    {
      question: "Does TrackFit offer nutrition tracking?",
      answer:
        "Yes, you can log meals and track your calorie intake to maintain a balanced diet.",
    },
    {
      question: "What should I do if my data is not updating?",
      answer:
        "Try refreshing the app, checking your internet connection, or logging out and back in. If the issue persists, contact support.",
    },
    {
      question: "How do I contact customer support?",
      answer: "You can reach out via the support page.",
    },
    {
      question: "Is my data secure with TrackFit?",
      answer:
        "Yes, we use encryption and privacy measures to protect your personal information.",
    },
  ];

  const [openIndex, setOpenIndex] = useState(null);

  const handleToggle = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="FAQ-container FAQP">
      <div className = "background"></div>
      <h2 className="logo1"><span className="trackfit1">trackfit</span><span className="dot1">.</span></h2>
      <h2>Frequently Asked Questions</h2>
      {faqs.map((faq, index) => (
        <div className="faq" key={index}>
          <div className="faq-header" onClick={() => handleToggle(index)}>
            <h4>{faq.question}</h4>
            <span
              className={`arrow ${openIndex === index ? "rotate" : ""}`}
            >
              ▼
            </span>
          </div>
          {openIndex === index && <p>{faq.answer}</p>}
        </div>
      ))}
    </div>
  );
};

export default FAQ;
