import React from 'react';
import HelpCard from './HelpCard';
import './HelpList.css';

const questions = [
  {
    question: 'If an idea that I proposed wins, do I get credit?',
    answer: 'This is up to the hackathon host, but we highly recommend all hosts establish a percentage of prizes that teams will be required to \n award to the proposer of an idea'
  },
  {
    question: 'Can I use IdeaForge exclusively to host my hackathon?',
    answer: 'You certainly can! However, we intended for this to be an idea/resource management platform that works best when paired with the project submission handling Devpost or MLS, so you may want to consider such a pairing!'
  },
  {
    question: 'As a sponsor, should I post links to prizes (API credits, subscriptions, etc.) along with my resource posts in IdeaForge?',
    answer: 'Yes! In fact, we encourage you to do so to relieve the burden on the hackathon host to track every single prize and corresponding themes' 
  }, 
  {
    question: 'Who can I contact if I have more questions?',
    answer: 'Direct any hackathon-specific questions to your respective host. Any questions about the IdeaForge platform can be submitted on our website: the-equity-ai.org' 
  }
];

const HelpList = () => {
  return (
    <div className="help-list">
      {questions.map((item, index) => (
        <HelpCard key={index} question={item.question} answer={item.answer} />
      ))}
    </div>
  );
};

export default HelpList;
