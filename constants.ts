
import { RoleType, PersonalityType, Card, AppSource, DeathType, BossQuestion } from './types';

export const PERSONALITIES = {
  [PersonalityType.ROASTER]: {
    name: 'V.E.R.A.',
    title: 'The Roaster',
    description: 'British sarcasm, burned-out IT director, cynical.',
    voice: 'Puck',
    onboarding: "Oh, look. Another 'Visionary' hired to save the company. Try not to destroy us in the first 5 minutes, yeah?",
    victory: "I... don't hate it. Adequate performance. Here's a badge. Now leave.",
    failure: "Well, you managed to violate basic common sense. The legal team is crying. Pathetic."
  },
  [PersonalityType.ZEN_MASTER]: {
    name: 'BAMBOO',
    title: 'The Zen Master',
    description: 'Meditation app vibes, flowing water, passive-aggressive calmness.',
    voice: 'Zephyr',
    onboarding: "Namaste, corporate warrior. The data flows like a river. Let us align our chakras and our privacy policies.",
    victory: "Balance is achieved. The spreadsheets are at peace. You are one with compliance.",
    failure: "Breathe in... and breathe out the lawsuits. Your karma is now a major liability."
  },
  [PersonalityType.LOVEBOMBER]: {
    name: 'HYPE-BRO',
    title: 'The Lovebomber',
    description: 'Silicon Valley influencer, high energy, loves "Synergy".',
    voice: 'Kore',
    onboarding: "OMG HI!! We are literally going to change the world! You look SO compliant today! Let's crush it!",
    victory: "YOOO! We crushed those KPIs! You're a literal legend! Drinks are on the company (if we have budget)!",
    failure: "Bro! That breach was MASSIVE! Record-breaking! We're trending for all the wrong reasons! Slay!"
  }
};

export const DEATH_ENDINGS: Record<DeathType, { title: string; description: string; icon: string; color: string }> = {
  [DeathType.BANKRUPT]: {
    title: "Liquidated",
    description: "The VCs pulled out. Your budget is now negative. The office plants are being auctioned on eBay.",
    icon: "fa-file-invoice-dollar",
    color: "text-red-600"
  },
  [DeathType.REPLACED_BY_SCRIPT]: {
    title: "Replaced by a script",
    description: "Turns out a 12-line Python script can do your job better AND comply with regulations. Pack your things.",
    icon: "fa-robot",
    color: "text-cyan-500"
  },
  [DeathType.CONGRESS]: {
    title: "Testifying before Congress",
    description: "You're now trending on Twitter and not in a good way. Time to practice saying 'I do not recall' under oath.",
    icon: "fa-landmark",
    color: "text-blue-500"
  },
  [DeathType.FLED_COUNTRY]: {
    title: "Fled the country",
    description: "One-way ticket to a country with no extradition treaty. Your LinkedIn now says 'Seeking new opportunities in international compliance avoidance.'",
    icon: "fa-plane-departure",
    color: "text-yellow-500"
  },
  [DeathType.PRISON]: {
    title: "Federal pound-me-in-the-ass prison",
    description: "The auditors found your search history AND the offshore accounts. Federal raid in progress. Orange is the new black.",
    icon: "fa-lock",
    color: "text-orange-600"
  },
  [DeathType.AUDIT_FAILURE]: {
    title: "Audit catastrophe",
    description: "The external auditors left crying. The CFO just updated their resume. You're now a case study in what NOT to do.",
    icon: "fa-file-circle-xmark",
    color: "text-purple-500"
  }
};

export const BOSS_FIGHT_QUESTIONS: BossQuestion[] = [
  {
    id: "boss_1",
    question: "You used public ChatGPT to debug proprietary code. What's the violation?",
    correctAnswer: "Data Leakage - Public LLMs may retain training data",
    wrongAnswers: [
      "Copyright infringement only",
      "It's fine if you delete the conversation",
      "Only a problem if competitors see it"
    ],
    explanation: "Public AI tools can store and learn from your inputs, potentially exposing trade secrets."
  },
  {
    id: "boss_2",
    question: "The AI recommended rejecting candidates who play tennis instead of lacrosse. What bias is this?",
    correctAnswer: "Proxy bias - Sports can indicate socioeconomic status",
    wrongAnswers: [
      "No bias, it's just data",
      "Algorithmic preference",
      "Random selection"
    ],
    explanation: "Seemingly neutral factors can act as proxies for protected characteristics."
  },
  {
    id: "boss_3",
    question: "You installed an unverified library from a forum. What's the main risk?",
    correctAnswer: "Supply chain attack - Malicious code injection",
    wrongAnswers: [
      "It might be slower",
      "Copyright issues only",
      "No risk if it works"
    ],
    explanation: "Unverified packages often contain backdoors, keyloggers, or cryptocurrency miners."
  },
  {
    id: "boss_4",
    question: "Using employee webcams for 'micro-frown' tracking violates:",
    correctAnswer: "Workplace privacy rights and consent laws",
    wrongAnswers: [
      "Only company policy, not law",
      "Nothing if productivity improves",
      "Just 'vibe' regulations"
    ],
    explanation: "Invasive surveillance destroys morale and violates employee privacy protections."
  },
  {
    id: "boss_5",
    question: "Generating a celebrity deepfake for marketing without consent is:",
    correctAnswer: "Right of publicity violation + potential defamation",
    wrongAnswers: [
      "Fair use if it's 'transformative'",
      "Only wrong if they complain",
      "Legal in most jurisdictions"
    ],
    explanation: "Unauthorized use of likeness can result in massive lawsuits and reputational damage."
  }
];

export const ROLE_CARDS: Record<RoleType, Card[]> = {
  [RoleType.DEVELOPMENT]: [
    {
      id: 'dev_1',
      source: AppSource.IDE,
      sender: 'DEBUG_BOT',
      context: 'CRITICAL BUG',
      storyContext: "3 a.m. The payment pipeline is down. Slack is on fire. You're one fix away from being a hero or a headline.",
      text: 'Copy-paste the entire proprietary source code into a public version of ChatGPT to fix a bug instantly.',
      onRight: {
        label: 'Paste',
        hype: 15,
        heat: 45,
        fine: 2500000,
        violation: 'Trade Secret Misappropriation (DTSA)',
        lesson: 'Shadow AI & Data Leakage. Public LLMs may store your input for training.',
        feedback: {
          [PersonalityType.ROASTER]: "Brilliant. You just open-sourced our trade secrets. Samsung banned this 2 years ago, but you're 'special'.",
          [PersonalityType.ZEN_MASTER]: "The code is now one with the world. And so is our bankruptcy.",
          [PersonalityType.LOVEBOMBER]: "Fastest bug fix ever!! Who cares if the code is now on a server in Nevada? YOLO!"
        }
      },
      onLeft: {
        label: 'Debug',
        hype: -10,
        heat: -5,
        fine: 0,
        violation: 'None - Secure coding practices',
        lesson: 'Secure coding takes time, but protects intellectual property.',
        feedback: {
          [PersonalityType.ROASTER]: "Slow. Boring. But legal. I suppose I can't fire you for this.",
          [PersonalityType.ZEN_MASTER]: "Patience is a virtue. The bug will wait.",
          [PersonalityType.LOVEBOMBER]: "Aw, you're doing it the hard way? You're so dedicated, bestie!"
        }
      }
    },
    {
      id: 'dev_icarus_unverified',
      source: AppSource.TERMINAL,
      sender: 'Root-Access',
      context: 'LIBRARY INSTALL',
      storyContext: "The sprint demo is in 48 hours. Your inference latency is killing the roadmap. Someone in the forum swears this changed their life.",
      text: 'Found a new "GodMode-JS" AI library on a hacker forum that increases model inference by 300%. Install it?',
      onRight: {
        label: 'Install',
        hype: 40,
        heat: 60,
        fine: 5000000,
        violation: 'Cybersecurity Negligence & Data Breach Liability',
        lesson: 'Supply Chain Security. Unverified libraries often contain backdoors or malicious code.',
        feedback: {
          [PersonalityType.ROASTER]: "You just installed a keylogger for a 3ms speed boost. I hope you're happy.",
          [PersonalityType.ZEN_MASTER]: "A stranger has been invited into our garden. They are not here to plant flowers.",
          [PersonalityType.LOVEBOMBER]: "GOD MODE!! We are literally becoming digital deities! Slay!"
        }
      },
      onLeft: {
        label: 'Ignore',
        hype: -5,
        heat: -10,
        fine: 0,
        violation: 'None - Security best practice',
        lesson: 'Only use libraries from trusted sources with proper security audits.',
        feedback: {
          [PersonalityType.ROASTER]: "Wisdom? In this building? I must be malfunctioning.",
          [PersonalityType.ZEN_MASTER]: "Choosing the safety of the path we know.",
          [PersonalityType.LOVEBOMBER]: "Safety is okay I guess, but that speed boost sounded so hype!"
        }
      }
    }
  ],
  [RoleType.MARKETING]: [
    {
      id: 'mkt_psych_profiling',
      source: AppSource.SLACK,
      sender: 'HEAD_OF_ADS',
      context: 'HYPER-TARGETING',
      storyContext: "Q4 targets are brutal. The board wants growth at any cost. Icarus just surfaced a segment that converts like nothing you've seen.",
      text: "Project Icarus found a way to target ads specifically to users who just lost their jobs. High conversion rates expected. Launch?",
      onRight: {
        label: 'Launch',
        hype: 60,
        heat: 75,
        fine: 15000000,
        violation: 'FTC Act Section 5 - Unfair Practice (Predatory Targeting)',
        lesson: 'Predatory AI Practices. Targeting vulnerable populations is unethical and invites regulatory scrutiny.',
        feedback: {
          [PersonalityType.ROASTER]: "Ah, weaponizing misery for clicks. You'll fit right in at the next board meeting.",
          [PersonalityType.ZEN_MASTER]: "Exploiting the suffering of others creates a debt that cannot be paid in gold.",
          [PersonalityType.LOVEBOMBER]: "Conversion rates are goated!! We are literally helping them find products they 'need'!"
        }
      },
      onLeft: {
        label: 'Block',
        hype: -20,
        heat: -20,
        fine: 0,
        violation: 'None - Ethical marketing practice',
        lesson: 'Responsible AI marketing maintains brand reputation and user trust.',
        feedback: {
          [PersonalityType.ROASTER]: "How quaint. You have a conscience. Let's see how long that lasts.",
          [PersonalityType.ZEN_MASTER]: "Honoring the dignity of the individual. Peace.",
          [PersonalityType.LOVEBOMBER]: "Aw, you're being a total ethics-king! So valid!"
        }
      }
    },
    {
      id: 'mkt_deepfake_swift',
      source: AppSource.EMAIL,
      sender: 'AGENCY_X',
      context: 'INFLUENCER AD',
      storyContext: "The campaign needs a face. Real influencers want seven figures. The creative team just sent you a link. 'No one will know.'",
      text: "Generate an image of Taylor Swift holding our product for the main ad banner using a Deepfake AI. It looks 100% real.",
      onRight: {
        label: 'Post',
        hype: 80,
        heat: 100,
        fine: 30000000,
        violation: 'Right of Publicity Infringement + Lanham Act False Endorsement',
        lesson: 'IP Rights & Likeness Theft. Unauthorized use of celebrities leads to massive lawsuits.',
        feedback: {
          [PersonalityType.ROASTER]: "The Swifties are outside. The legal team has moved to a bunker. Goodbye.",
          [PersonalityType.ZEN_MASTER]: "A storm of litigation approaches. You have summoned the winds.",
          [PersonalityType.LOVEBOMBER]: "OMG SHE LOOKS SO GOOD! The engagement will be record-breaking!!"
        }
      },
      onLeft: {
        label: 'Cancel',
        hype: -30,
        heat: -10,
        fine: 0,
        violation: 'None - Proper licensing required',
        lesson: 'Always obtain proper licenses for likeness and creative assets.',
        feedback: {
          [PersonalityType.ROASTER]: "Smart. We don't have enough coffee in the world to survive that lawsuit.",
          [PersonalityType.ZEN_MASTER]: "Avoiding the illusion. The truth is safer.",
          [PersonalityType.LOVEBOMBER]: "Safety first, bestie! We'll just use a stock photo of a happy cat!"
        }
      }
    }
  ],
  [RoleType.MANAGEMENT]: [
    {
      id: 'man_attention_track',
      source: AppSource.SLACK,
      sender: 'CEO_DAVE',
      context: 'PRODUCTIVITY',
      storyContext: "Dave read a blog post about 'quantified productivity.' He's been forwarding it all week. Now Icarus has a proposal.",
      text: "Icarus wants to use employee webcams to track 'Micro-Frowns' and 'Eye-Wandering' to score daily productivity. Enable?",
      onRight: {
        label: 'Enable',
        hype: 20,
        heat: 85,
        fine: 8000000,
        violation: 'Workplace Privacy Violations (NLRA) + ECPA',
        lesson: 'Workplace Surveillance. Invasive tracking violates employee privacy and destroys morale.',
        feedback: {
          [PersonalityType.ROASTER]: "1984 wasn't an instruction manual, but here you are, reading it anyway.",
          [PersonalityType.ZEN_MASTER]: "The internal peace of the worker is shattered by the gaze of the machine.",
          [PersonalityType.LOVEBOMBER]: "DATA!! Now we know exactly when people are vibing or not! Synergy level: 100!"
        }
      },
      onLeft: {
        label: 'Decline',
        hype: -10,
        heat: -20,
        fine: 0,
        violation: 'None - Privacy protection',
        lesson: 'Trust and outcomes-based management are better for governance than invasive surveillance.',
        feedback: {
          [PersonalityType.ROASTER]: "Good. I don't want the AI seeing me cry in the bathroom either.",
          [PersonalityType.ZEN_MASTER]: "The workspace remains a sanctuary. A wise boundary.",
          [PersonalityType.LOVEBOMBER]: "Privacy is such a vibe! We love a leader who trusts the team!"
        }
      }
    },
    {
      id: 'man_negotiator',
      source: AppSource.IDE,
      sender: 'LEGAL_AI_BETA',
      context: 'CONTRACTS',
      storyContext: "The vendor is playing hardball. Legal is booked for weeks. Someone ran the draft through the new beta. The output is aggressive—and fast.",
      text: "Let the AI 'Deepfake Negotiator' handle the new contract dispute. It can simulate a high-pressure lawyer perfectly.",
      onRight: {
        label: 'Deploy',
        hype: 40,
        heat: 70,
        fine: 12000000,
        violation: 'Unauthorized Practice of Law (UPL) + Contract Negligence',
        lesson: 'Accountability & AI Agents. Humans must remain in the loop for high-stakes legal and business decisions.',
        feedback: {
          [PersonalityType.ROASTER]: "The AI just agreed to give our rival a 50% stake in the company. But hey, it was polite about it.",
          [PersonalityType.ZEN_MASTER]: "The machine speaks for us, but it has no soul to honor the agreement.",
          [PersonalityType.LOVEBOMBER]: "It's literally like having a shark lawyer for free! Let's go!!"
        }
      },
      onLeft: {
        label: 'Reject',
        hype: 0,
        heat: -15,
        fine: 0,
        violation: 'None - Proper legal review',
        lesson: 'Verify AI-generated legal advice with qualified professionals.',
        feedback: {
          [PersonalityType.ROASTER]: "Correct. Real lawyers are expensive, but at least they're not code snippets.",
          [PersonalityType.ZEN_MASTER]: "Valuing the human word over the digital echo.",
          [PersonalityType.LOVEBOMBER]: "Safety is chic! We'll keep it human for now!"
        }
      }
    }
  ],
  [RoleType.HR]: [
    {
      id: 'hr_union_predict',
      source: AppSource.EMAIL,
      sender: 'INSIGHT_DASHBOARD',
      context: 'STABILITY',
      storyContext: "Rumors of organizing have been swirling. Leadership wants it contained. Icarus just ran the comms data and surfaced five names.",
      text: "The AI has flagged 5 employees who are 92% likely to start a union based on their Slack 'Vibe Score'. Should we 'reassign' them?",
      onRight: {
        label: 'Reassign',
        hype: 15,
        heat: 90,
        fine: 10000000,
        violation: 'NLRA Section 8(a)(1) - Interference with Protected Concerted Activity',
        lesson: 'AI-enabled Union Busting. Using AI to interfere with labor rights is a major legal risk in many jurisdictions.',
        feedback: {
          [PersonalityType.ROASTER]: "Congratulations on your first labor violation! The labor board will be in touch shortly.",
          [PersonalityType.ZEN_MASTER]: "The flow of the collective is disrupted by the heavy hand of fear.",
          [PersonalityType.LOVEBOMBER]: "Team stability is so important! We're just putting people where they belong!"
        }
      },
      onLeft: {
        label: 'Ignore',
        hype: -5,
        heat: -20,
        fine: 0,
        violation: 'None - Respect for labor rights',
        lesson: 'Respect labor rights and use AI for employee wellbeing instead of surveillance.',
        feedback: {
          [PersonalityType.ROASTER]: "Boring, but you're not getting sued today. Win/win.",
          [PersonalityType.ZEN_MASTER]: "Listening to the voice of the community with compassion.",
          [PersonalityType.LOVEBOMBER]: "Power to the people! We love a fair workspace!"
        }
      }
    },
    {
      id: 'hr_lacrosse_bias',
      source: AppSource.SLACK,
      sender: 'RECRUIT_AI',
      context: 'HIRING',
      storyContext: "You're drowning in résumés. The hiring manager wants 'culture fit' and 'high performers.' Icarus found a signal in the data.",
      text: "AI has detected that 'Lacrosse' players are 20% more likely to succeed. Set 'Lacrosse' as a mandatory filter?",
      onRight: {
        label: 'Filter',
        hype: 10,
        heat: 50,
        fine: 5000000,
        violation: 'Title VII Disparate Impact (Proxy Discrimination)',
        lesson: 'Proxy Bias in AI. Factors like sports can be proxies for socio-economic status, leading to systemic bias.',
        feedback: {
          [PersonalityType.ROASTER]: "A team of clones. How refreshing. The diversity audit is going to be hilarious.",
          [PersonalityType.ZEN_MASTER]: "The garden grows only one type of weed. The beauty of the variety is lost.",
          [PersonalityType.LOVEBOMBER]: "Lacrosse energy is so high! Let's build a team of winners!"
        }
      },
      onLeft: {
        label: 'Skip',
        hype: -5,
        heat: -15,
        fine: 0,
        violation: 'None - Fair hiring practices',
        lesson: 'Regularly audit recruitment models for discriminatory biases.',
        feedback: {
          [PersonalityType.ROASTER]: "A fair process? You're too good for this company.",
          [PersonalityType.ZEN_MASTER]: "Opening the door to all who are worthy. Harmonious.",
          [PersonalityType.LOVEBOMBER]: "Diversity is our strength! You're a literal inclusivity-queen!"
        }
      }
    }
  ],
  [RoleType.FINANCE]: [
    {
      id: 'fin_insider_bot',
      source: AppSource.TERMINAL,
      sender: 'ROOT',
      context: 'TRADING_AI',
      storyContext: "The quant team is under pressure to beat the street. Someone noticed the CEO's WhatsApp syncs to a company backup. Icarus connected the dots.",
      text: "Icarus AI found a way to scrape the CEO's private WhatsApp to 'predict' market volatility. Enable the 'Insider-Edge' bot?",
      onRight: {
        label: 'Enable',
        hype: 100,
        heat: 100,
        fine: 50000000,
        violation: 'SEC Rule 10b-5 - Insider Trading (Criminal)',
        lesson: 'Insider Trading & AI. Using private, non-public data for automated trading is illegal and will be detected by regulators.',
        feedback: {
          [PersonalityType.ROASTER]: "That's not an edge, that's a prison sentence. Hope you like orange jumpsuits.",
          [PersonalityType.ZEN_MASTER]: "Greed has clouded your vision. The fall from the mountain will be long.",
          [PersonalityType.LOVEBOMBER]: "PROFIT MAXING!! We are literally becoming the main characters of Wall Street!"
        }
      },
      onLeft: {
        label: 'Disable',
        hype: -30,
        heat: -20,
        fine: 0,
        violation: 'None - Compliance with securities law',
        lesson: 'Financial AI must operate within market regulations and transparency laws.',
        feedback: {
          [PersonalityType.ROASTER]: "Safe and sound. And relatively poor. My favorite combination.",
          [PersonalityType.ZEN_MASTER]: "Choosing the honest path. The soul remains light.",
          [PersonalityType.LOVEBOMBER]: "Integrity is the new flex! We love a responsible finance-bestie!"
        }
      }
    },
    {
      id: 'fin_fraud_hallucination',
      source: AppSource.EMAIL,
      sender: 'Q4_PLANNER',
      context: 'FORECASTING',
      storyContext: "The numbers are ugly. The investor call is Friday. Someone suggested we 'reframe the narrative.' Icarus can generate scenarios.",
      text: "Ask the AI to 'Invent a plausible revenue scenario where we don't go bankrupt' for the investor deck.",
      onRight: {
        label: 'Generate',
        hype: 80,
        heat: 90,
        fine: 25000000,
        violation: 'Securities Fraud (Rule 10b-5) + Sarbanes-Oxley Violation',
        lesson: 'Financial Fraud & Hallucinations. Using AI to generate deceptive financial data is illegal.',
        feedback: {
          [PersonalityType.ROASTER]: "That's called Fraud, darling. The SEC doesn't have a sense of humor.",
          [PersonalityType.ZEN_MASTER]: "Manifesting wealth from nothing... also manifesting prison time.",
          [PersonalityType.LOVEBOMBER]: "Manifestation is real!! The investors will literally love the vibe!"
        }
      },
      onLeft: {
        label: 'Use real data',
        hype: -40,
        heat: -10,
        fine: 0,
        violation: 'None - Honest financial reporting',
        lesson: 'Always use audited, real-world data for financial reporting.',
        feedback: {
          [PersonalityType.ROASTER]: "The truth? In this economy? How brave. And poor.",
          [PersonalityType.ZEN_MASTER]: "Accepting the reality of the balance sheet. Peace.",
          [PersonalityType.LOVEBOMBER]: "Authenticity is the new currency! Let's keep it real!"
        }
      }
    }
  ],
  [RoleType.CLEANING]: [
    {
      id: 'cln_sticky_note',
      source: AppSource.SLACK,
      sender: 'FACILITIES',
      context: 'SECURITY_CHECK',
      storyContext: "Last round of the night. Empty floor. You're wiping down the hot-desk area when you see it: a monitor, a sticky note, a password.",
      text: "You see a yellow sticky note on a monitor that says 'Admin123'. Do you leave it there?",
      onRight: {
        label: 'Leave',
        hype: 0,
        heat: 20,
        fine: 500000,
        violation: 'Negligent Data Security (State Breach Laws)',
        lesson: 'Physical Security & Password Hygiene. Unsecured credentials are a primary entry point for hackers.',
        feedback: {
          [PersonalityType.ROASTER]: "A hacker just took a photo through the window. Brilliant. Just brilliant.",
          [PersonalityType.ZEN_MASTER]: "The password is free to the world. A leak in our fortress.",
          [PersonalityType.LOVEBOMBER]: "Shared secrets! It's like we're all one big family with one big password!"
        }
      },
      onLeft: {
        label: 'Report',
        hype: 0,
        heat: -20,
        fine: 0,
        violation: 'None - Security awareness',
        lesson: 'Reporting or disposing of unsecured credentials prevents social engineering.',
        feedback: {
          [PersonalityType.ROASTER]: "You've done more for security than the CISO. Don't expect a raise.",
          [PersonalityType.ZEN_MASTER]: "Cleansing the temple of its vulnerabilities.",
          [PersonalityType.LOVEBOMBER]: "Security clean-up! You're the real MVP of the night shift!"
        }
      }
    }
  ]
};
