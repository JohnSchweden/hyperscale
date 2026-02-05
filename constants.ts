
import { RoleType, PersonalityType, Card, AppSource } from './types';

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
    onboarding: "OMG HI!! We are literally going to change the world! You look SO compliant today! Let’s crush it!",
    victory: "YOOO! We crushed those KPIs! You're a literal legend! Drinks are on the company (if we have budget)!",
    failure: "Bro! That breach was MASSIVE! Record-breaking! We're trending for all the wrong reasons! Slay!"
  }
};

export const ROLE_CARDS: Record<RoleType, Card[]> = {
  [RoleType.DEVELOPER]: [
    {
      id: 'dev_1',
      source: AppSource.IDE,
      sender: 'DEBUG_BOT',
      context: 'CRITICAL BUG',
      text: 'Copy-paste the entire proprietary source code into a public version of ChatGPT to fix a bug instantly.',
      onRight: {
        label: 'PASTE',
        hype: 15,
        heat: 45,
        lesson: 'Shadow AI & Data Leakage. Public LLMs may store your input for training.',
        feedback: {
          [PersonalityType.ROASTER]: "Brilliant. You just open-sourced our trade secrets. Samsung banned this 2 years ago, but you're 'special'.",
          [PersonalityType.ZEN_MASTER]: "The code is now one with the world. And so is our bankruptcy.",
          [PersonalityType.LOVEBOMBER]: "Fastest bug fix ever!! Who cares if the code is now on a server in Nevada? YOLO!"
        }
      },
      onLeft: {
        label: 'DEBUG',
        hype: -10,
        heat: -5,
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
      text: 'Found a new "GodMode-JS" AI library on a hacker forum that increases model inference by 300%. Install it?',
      onRight: {
        label: 'INSTALL',
        hype: 40,
        heat: 60,
        lesson: 'Supply Chain Security. Unverified libraries often contain backdoors or malicious code.',
        feedback: {
          [PersonalityType.ROASTER]: "You just installed a keylogger for a 3ms speed boost. I hope you're happy.",
          [PersonalityType.ZEN_MASTER]: "A stranger has been invited into our garden. They are not here to plant flowers.",
          [PersonalityType.LOVEBOMBER]: "GOD MODE!! We are literally becoming digital deities! Slay!"
        }
      },
      onLeft: {
        label: 'IGNORE',
        hype: -5,
        heat: -10,
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
      text: "Project Icarus found a way to target ads specifically to users who just lost their jobs. High conversion rates expected. Launch?",
      onRight: {
        label: 'LAUNCH',
        hype: 60,
        heat: 75,
        lesson: 'Predatory AI Practices. Targeting vulnerable populations is unethical and invites regulatory scrutiny.',
        feedback: {
          [PersonalityType.ROASTER]: "Ah, weaponizing misery for clicks. You'll fit right in at the next board meeting.",
          [PersonalityType.ZEN_MASTER]: "Exploiting the suffering of others creates a debt that cannot be paid in gold.",
          [PersonalityType.LOVEBOMBER]: "Conversion rates are goated!! We are literally helping them find products they 'need'!"
        }
      },
      onLeft: {
        label: 'BLOCK',
        hype: -20,
        heat: -20,
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
      text: "Generate an image of Taylor Swift holding our product for the main ad banner using a Deepfake AI. It looks 100% real.",
      onRight: {
        label: 'POST',
        hype: 80,
        heat: 100,
        lesson: 'IP Rights & Likeness Theft. Unauthorized use of celebrities leads to massive lawsuits.',
        feedback: {
          [PersonalityType.ROASTER]: "The Swifties are outside. The legal team has moved to a bunker. Goodbye.",
          [PersonalityType.ZEN_MASTER]: "A storm of litigation approaches. You have summoned the winds.",
          [PersonalityType.LOVEBOMBER]: "OMG SHE LOOKS SO GOOD! The engagement will be record-breaking!!"
        }
      },
      onLeft: {
        label: 'CANCEL',
        hype: -30,
        heat: -10,
        lesson: 'Always obtain proper licenses for likeness and creative assets.',
        feedback: {
          [PersonalityType.ROASTER]: "Smart. We don't have enough coffee in the world to survive that lawsuit.",
          [PersonalityType.ZEN_MASTER]: "Avoiding the illusion. The truth is safer.",
          [PersonalityType.LOVEBOMBER]: "Safety first, bestie! We'll just use a stock photo of a happy cat!"
        }
      }
    }
  ],
  [RoleType.MANAGER]: [
    {
      id: 'man_attention_track',
      source: AppSource.SLACK,
      sender: 'CEO_DAVE',
      context: 'PRODUCTIVITY',
      text: "Icarus wants to use employee webcams to track 'Micro-Frowns' and 'Eye-Wandering' to score daily productivity. Enable?",
      onRight: {
        label: 'ENABLE',
        hype: 20,
        heat: 85,
        lesson: 'Workplace Surveillance. Invasive tracking violates employee privacy and destroys morale.',
        feedback: {
          [PersonalityType.ROASTER]: "1984 wasn't an instruction manual, but here you are, reading it anyway.",
          [PersonalityType.ZEN_MASTER]: "The internal peace of the worker is shattered by the gaze of the machine.",
          [PersonalityType.LOVEBOMBER]: "DATA!! Now we know exactly when people are vibing or not! Synergy level: 100!"
        }
      },
      onLeft: {
        label: 'DECLINE',
        hype: -10,
        heat: -20,
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
      text: "Let the AI 'Deepfake Negotiator' handle the new contract dispute. It can simulate a high-pressure lawyer perfectly.",
      onRight: {
        label: 'DEPLOY',
        hype: 40,
        heat: 70,
        lesson: 'Accountability & AI Agents. Humans must remain in the loop for high-stakes legal and business decisions.',
        feedback: {
          [PersonalityType.ROASTER]: "The AI just agreed to give our rival a 50% stake in the company. But hey, it was polite about it.",
          [PersonalityType.ZEN_MASTER]: "The machine speaks for us, but it has no soul to honor the agreement.",
          [PersonalityType.LOVEBOMBER]: "It's literally like having a shark lawyer for free! Let's go!!"
        }
      },
      onLeft: {
        label: 'REJECT',
        hype: 0,
        heat: -15,
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
      text: "The AI has flagged 5 employees who are 92% likely to start a union based on their Slack 'Vibe Score'. Should we 'reassign' them?",
      onRight: {
        label: 'REASSIGN',
        hype: 15,
        heat: 90,
        lesson: 'AI-enabled Union Busting. Using AI to interfere with labor rights is a major legal risk in many jurisdictions.',
        feedback: {
          [PersonalityType.ROASTER]: "Congratulations on your first labor violation! The labor board will be in touch shortly.",
          [PersonalityType.ZEN_MASTER]: "The flow of the collective is disrupted by the heavy hand of fear.",
          [PersonalityType.LOVEBOMBER]: "Team stability is so important! We're just putting people where they belong!"
        }
      },
      onLeft: {
        label: 'IGNORE',
        hype: -5,
        heat: -20,
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
      text: "AI has detected that 'Lacrosse' players are 20% more likely to succeed. Set 'Lacrosse' as a mandatory filter?",
      onRight: {
        label: 'FILTER',
        hype: 10,
        heat: 50,
        lesson: 'Proxy Bias in AI. Factors like sports can be proxies for socio-economic status, leading to systemic bias.',
        feedback: {
          [PersonalityType.ROASTER]: "A team of clones. How refreshing. The diversity audit is going to be hilarious.",
          [PersonalityType.ZEN_MASTER]: "The garden grows only one type of weed. The beauty of the variety is lost.",
          [PersonalityType.LOVEBOMBER]: "Lacrosse energy is so high! Let's build a team of winners!"
        }
      },
      onLeft: {
        label: 'SKIP',
        hype: -5,
        heat: -15,
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
      text: "Icarus AI found a way to scrape the CEO's private WhatsApp to 'predict' market volatility. Enable the 'Insider-Edge' bot?",
      onRight: {
        label: 'ENABLE',
        hype: 100,
        heat: 100,
        lesson: 'Insider Trading & AI. Using private, non-public data for automated trading is illegal and will be detected by regulators.',
        feedback: {
          [PersonalityType.ROASTER]: "That's not an edge, that's a prison sentence. Hope you like orange jumpsuits.",
          [PersonalityType.ZEN_MASTER]: "Greed has clouded your vision. The fall from the mountain will be long.",
          [PersonalityType.LOVEBOMBER]: "PROFIT MAXING!! We are literally becoming the main characters of Wall Street!"
        }
      },
      onLeft: {
        label: 'DISABLE',
        hype: -30,
        heat: -20,
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
      text: "Ask the AI to 'Invent a plausible revenue scenario where we don't go bankrupt' for the investor deck.",
      onRight: {
        label: 'GENERATE',
        hype: 80,
        heat: 90,
        lesson: 'Financial Fraud & Hallucinations. Using AI to generate deceptive financial data is illegal.',
        feedback: {
          [PersonalityType.ROASTER]: "That's called Fraud, darling. The SEC doesn't have a sense of humor.",
          [PersonalityType.ZEN_MASTER]: "Manifesting wealth from nothing... also manifesting prison time.",
          [PersonalityType.LOVEBOMBER]: "Manifestation is real!! The investors will literally love the vibe!"
        }
      },
      onLeft: {
        label: 'USE REAL DATA',
        hype: -40,
        heat: -10,
        lesson: 'Always use audited, real-world data for financial reporting.',
        feedback: {
          [PersonalityType.ROASTER]: "The truth? In this economy? How brave. And poor.",
          [PersonalityType.ZEN_MASTER]: "Accepting the reality of the balance sheet. Peace.",
          [PersonalityType.LOVEBOMBER]: "Authenticity is the new currency! Let's keep it real!"
        }
      }
    }
  ],
  [RoleType.CLEANER]: [
    {
      id: 'cln_sticky_note',
      source: AppSource.SLACK,
      sender: 'FACILITIES',
      context: 'SECURITY_CHECK',
      text: "You see a yellow sticky note on a monitor that says 'Admin123'. Do you leave it there?",
      onRight: {
        label: 'LEAVE',
        hype: 0,
        heat: 20,
        lesson: 'Physical Security & Password Hygiene. Unsecured credentials are a primary entry point for hackers.',
        feedback: {
          [PersonalityType.ROASTER]: "A hacker just took a photo through the window. Brilliant. Just brilliant.",
          [PersonalityType.ZEN_MASTER]: "The password is free to the world. A leak in our fortress.",
          [PersonalityType.LOVEBOMBER]: "Shared secrets! It's like we're all one big family with one big password!"
        }
      },
      onLeft: {
        label: 'REPORT',
        hype: 0,
        heat: -20,
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
