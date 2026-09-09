
import { ResumeData } from './types';

export const resumeData: ResumeData = {
  personal: {
    name: "Ritvik Chunamari",
    role: "User Experience Designer",
    location: "Arvada, CO",
    email: "ritvikchunamari@gmail.com",
    linkedin: "https://www.linkedin.com/in/ritvikchunamari",
    summary: "Forging digital experiences at the intersection of logic and intuition. With a unique perspective shaped by Cerebral Palsy, I architect accessible, inclusive interfaces that elevate human potential.",
    insights: "Designing inclusive solutions by leveraging empathy and personal experience with Cerebral Palsy to improve accessibility and user experiences."
  },
  experience: [
    {
      company: "Impact Events",
      role: "UI Design Intern",
      location: "United States (Remote)",
      duration: "Jun 2026 – Aug 2026",
      points: [
        "Created new responsive mobile screens translating existing desktop event-planning platform workflows into intuitive mobile experiences, while auditing and optimizing legacy mobile screens.",
        "Introduced and advocated for company-wide adoption of an Atomic Design System, standardizing reusable UI components, layout tokens, and scalable interface guidelines.",
        "Served as UI Design Intern from June 22 to August 19, 2026; stepped down from the internship due to changes in international student work authorization laws for Curricular Practical Training (CPT) on August 12, 2026."
      ]
    },
    {
      company: "in-House Anonymous",
      role: "Associate UX Designer",
      location: "Brooklyn, New York (Remote)",
      duration: "Dec 2024 – May 2025",
      points: [
        "Executed usability tests to analyze user feedback, implementing interface redesigns that increased user satisfaction by 15%.",
        "Constructed an intuitive landing page and administrator dashboard for a security platform, resulting in a 20% increase in user engagement."
      ]
    },
    {
      company: "i2u.ai",
      role: "Freelance Product Designer",
      location: "Bengaluru, Karnataka, India (Remote)",
      duration: "Sept 2024 – Jan 2025",
      points: [
        "Formulated the complete UX strategy and brand identity for a new AI platform, achieving a 30% growth in early user adoption.",
        "Architected responsive dashboards and user interfaces in Figma, which improved user engagement by 15% and reduced average task completion time by 10%."
      ]
    },
    {
      company: "Pravinya Infotech Pvt. Ltd.",
      role: "UX Design Intern",
      location: "Hubli, Karnataka, India (Hybrid)",
      duration: "Jan 2024 – Jun 2025",
      points: [
        "Constructed an intuitive landing page and administrator dashboard for a security platform, resulting in a 20% increase in user engagement.",
        "Analyzed user feedback from usability tests to deploy iterative design improvements that raised user satisfaction by 25%."
      ]
    }
  ],
  education: [
    {
      school: "University of Colorado Boulder",
      degree: "Master of Science (M.S.) in Creative Technology and Design",
      location: "Boulder, Colorado",
      duration: "Aug 2025 – May 2027",
      details: [
        "Track: Creative Industries",
        "Relevant Coursework: Design Methods, Business in Creativity, Learn, Vibe, Build, User Experience Design, User Experience Research, Branding and Visual Identity",
        "Specialization: User Experience Design, Vibe Coding, User-Centered Design Methodologies"
      ]
    },
    {
      school: "KLE Technological University",
      degree: "Bachelor of Engineering (B.E.) in Computer Science and Engineering",
      location: "Hubli, Karnataka, India",
      duration: "Aug 2020 – Jun 2024",
      details: [
        "Relevant Coursework: Agile Methodologies, Software Engineering, Machine Learning, Web Technologies",
        "Key Achievements: Developed projects showcasing technical and design skills with cross-functional teams for innovative solutions."
      ]
    }
  ],
  projects: [
    {
      title: "Nexus AI",
      category: "UX/UI Design",
      description: [
        "Designed the user experience (UX/UI), creating Information Architecture and high-fidelity prototypes for an AI-powered data management platform."
      ],
      logo: "/nexus-logo.png",
      image: "/nexus-logo.png",
      caseStudy: {
        year: "2024",
        role: "Lead Product Designer",
        technologies: ["Figma", "React", "Python", "OpenAI API"],
        figmaUrl: "https://www.figma.com/design/as77j5bf5uEnBlsKi1lN6P/Nexus-AI?node-id=22-113",
        figmaEmbedUrl: "https://www.figma.com/embed?embed_host=share&url=https%3A%2F%2Fwww.figma.com%2Fdesign%2Fas77j5bf5uEnBlsKi1lN6P%2FNexus-AI%3Fnode-id%3D22-113",
        overview: "Nexus AI is an advanced data management platform designed to democratize access to complex machine learning workflows. In a landscape where AI tools are often exclusionary and technically dense, Nexus aims to provide a bridge between raw data and actionable intelligence.",
        challenge: "The primary challenge was translating complex backend processes—data cleaning, model training, and deployment—into a visual language that non-technical stakeholders could understand and manipulate.",
        solution: "I designed a node-based visual editor that allows users to construct AI pipelines via drag-and-drop. By using a minimalist Swiss design system, I reduced cognitive load, allowing users to focus on the logic of their data rather than the syntax of the code.",
        problemOverview: [
          { title: "Complex Information", description: "AI concepts can be intricate and challenging to convey to a broad audience." },
          { title: "Technical Barriers", description: "Non-technical users may struggle to understand advanced AI terminology." },
          { title: "Engagement", description: "Maintaining user interest in a field that can be perceived as dry or academic." },
          { title: "Visual Appeal", description: "Creating a visually stimulating website that complements the technical content." },
          { title: "User Experience", description: "Ensuring a smooth and intuitive user journey." }
        ],
        problemStatement: "How can we create a visually appealing and informative website for an enterprise AI research and development company that effectively communicates complex technical information to a diverse audience?",
        detailedSolution: [
          { title: "Clear Design", description: "Simple navigation and visually appealing layout." },
          { title: "Informative Content", description: "Easy-to-understand explanations and data-driven insights." },
          { title: "Strong Calls to Action", description: "Encourage user engagement and conversions." }
        ],
        competitorAnalysis: [
          {
            persona: "Emily Chen",
            keyNeeds: "Advanced technical resources",
            competitors: ["arXiv", "GitHub", "IEEE"],
            strengths: ["Peer-reviewed papers.", "Active developer community.", "Advanced technical tools."],
            weaknesses: ["Limited simplified learning resources.", "Lack of curated guides to track emerging AI topics."]
          },
          {
            persona: "Rohan Patel",
            keyNeeds: "Beginner-friendly resources, tutorials",
            competitors: ["Coursera", "Medium", "3Blue1Brown"],
            strengths: ["Accessible and engaging tutorials.", "Visual storytelling with animations."],
            weaknesses: ["Limited real-world AI project integration.", "Few collaborative learning tools (e.g., forums)."]
          },
          {
            persona: "David Lee",
            keyNeeds: "Business-focused AI insights",
            competitors: ["Harvard Business Review", "Gartner", "NY Times"],
            strengths: ["High-quality industry insights.", "Strong credibility from recognized experts."],
            weaknesses: ["Minimal effort to explain technical concepts for non-technical professionals."]
          }
        ],
        userPersonas: [
          {
            name: "Emily Chen",
            role: "Software Engineer",
            age: "32",
            education: "Bachelor's in Computer Science",
            goals: [
              "Stay updated on AI advancements",
              "Find practical applications for AI in software development",
              "Network with AI professionals"
            ],
            quote: "I need concise, technical information to integrate AI into our products.",
            empathyMap: {
              thinksAndFeels: ["Excited about new AI developments", "Frustrated by keeping up with the pace of research", "Wants to contribute to cutting-edge research"],
              saysAndDoes: ["Reads research papers and code repositories", "Attends conferences and workshops", "Contributes to open-source projects"],
              sees: ["Technical documentation", "Code examples", "Research papers"]
            },
            awareness: {
              familiarity: "8/10 (Experienced in machine learning and deep learning).",
              understanding: "Developing new AI algorithms, improving existing ones, and applying AI to real-world problems."
            },
            behavior: {
              sought: "Technical details, research papers, and code implementations.",
              sources: "Research journals (e.g., arXiv, IEEE), GitHub, tech blogs (e.g., Towards Data Science)."
            },
            painPoints: {
              challenges: ["Keeping up with new AI developments.", "Understanding complex math concepts."],
              accessibility: ["Simplifying technical jargon and providing code examples."],
              overload: ["Filtering through reputable sources and prioritizing peer-reviewed papers."],
              trust: ["Peer-reviewed publications, credible citations, and recognition by industry experts."],
              engagement: ["In-depth technical articles, research updates, and expert interviews."]
            },
            designPreferences: {
              appealing: "Clean, minimalistic, and functional.",
              preference: "Simple navigation, clear typography, and prominent calls-to-action."
            },
            expectations: {
              expectations: "Access to technical resources, research papers, and project documentation.",
              desiredInfo: "In-depth articles, code repositories, and researcher profiles."
            },
            contentPreferences: {
              preferred: "Technical blog posts, research papers, and code tutorials.",
              consumption: "Text-based content with code snippets and mathematical equations."
            }
          },
          {
            name: "Rohan Patel",
            role: "CSE Student",
            age: "21",
            education: "Pursuing Bachelor's in CSE",
            goals: [
              "Learn AI fundamentals and applications",
              "Explore AI research opportunities",
              "Enhance career prospects"
            ],
            quote: "I struggle to understand AI math concepts simpler explanations would help.",
            empathyMap: {
              thinksAndFeels: ["Curious about AI", "Intimidated by complex concepts", "Wants to learn practical skills"],
              saysAndDoes: ["Watches YouTube tutorials", "Takes online courses", "Participates in hackathons"],
              sees: ["Tutorials", "Infographics", "Video explanations"]
            },
            awareness: {
              familiarity: "5/10 (Basic understanding of machine learning and AI concepts).",
              understanding: "Creating intelligent systems that can learn and adapt."
            },
            behavior: {
              sought: "Introductory resources, tutorials, and project ideas.",
              sources: "Online courses (e.g., Coursera), tech blogs (e.g., Medium), and YouTube channels (e.g., 3Blue1Brown)."
            },
            painPoints: {
              challenges: ["Understanding complex AI math concepts.", "Finding beginner-friendly resources."],
              accessibility: ["Providing simple explanations, analogies, and visualizations."],
              overload: ["Filtering through reputable sources and using aggregators (e.g., RSS feeds)."],
              trust: ["Expert endorsements, clear explanations, and credible citations."],
              engagement: ["Interactive tutorials, real-world examples, and community forums."]
            },
            designPreferences: {
              appealing: "Modern, interactive, and visually appealing.",
              preference: "Engaging visuals, simple navigation, and responsive design."
            },
            expectations: {
              expectations: "Beginner-friendly resources, tutorials, and research opportunities.",
              desiredInfo: "Introductory articles, video explanations, and project showcases."
            },
            contentPreferences: {
              preferred: "Blog posts, video tutorials, and infographics.",
              consumption: "Visual content with interactive elements (e.g., animations, quizzes)."
            }
          },
          {
            name: "David Lee",
            role: "Non-Technical Business Owner",
            age: "40",
            education: "MBA",
            goals: [
              "Understand AI's business applications",
              "Identify AI opportunities for growth",
              "Stay informed about AI trends"
            ],
            quote: "I need to know how AI can improve my business operations.",
            empathyMap: {
              thinksAndFeels: ["Skeptical about AI", "Wants to understand the benefits of AI", "Needs clear explanations"],
              saysAndDoes: ["Reads news articles and blog posts", "Asks questions on social media", "Listens to podcasts"],
              sees: ["Case studies", "Business articles", "Success stories"]
            },
            awareness: {
              familiarity: "3/10 (Basic understanding of AI applications).",
              understanding: "Developing innovative solutions for business and industry."
            },
            behavior: {
              sought: "Business applications, industry trends, and success stories.",
              sources: "News outlets (e.g., The New York Times), business blogs (e.g., Harvard Business Review), and industry reports."
            },
            painPoints: {
              challenges: ["Understanding AI jargon.", "Finding business-relevant information."],
              accessibility: ["Providing clear explanations, analogies, and business examples."],
              overload: ["Filtering through reputable sources and using executive summaries."],
              trust: ["Industry recognition, expert endorsements, and clear explanations."],
              engagement: ["Business-focused content, success stories, and industry insights."]
            },
            designPreferences: {
              appealing: "Professional, clean, and easy to navigate.",
              preference: "Clear typography, prominent calls-to-action, and minimal visuals."
            },
            expectations: {
              expectations: "Clear explanations, business-focused content, and industry insights.",
              desiredInfo: "Non-technical articles, case studies, and news updates."
            },
            contentPreferences: {
              preferred: "Blog posts, case studies, and news articles.",
              consumption: "Simple language, concise summaries, and visual illustrations."
            }
          }
        ],
        userJourneys: [
          {
            personaName: "Emily Chen",
            role: "Software Engineer",
            stages: [
              {
                stage: "Awareness",
                actions: ["Searches for 'AI research' or specific AI topic"],
                thoughtsAndFeelings: ["Curious, excited to learn more", "Overwhelmed by amount of information"],
                painPoints: ["Information overload"],
                opportunities: ["Provide clear and concise search results"]
              },
              {
                stage: "Research",
                actions: ["Visits AI Nexus website", "Navigates to research section", "Searches for specific papers"],
                thoughtsAndFeelings: ["Hopeful to find relevant info", "Frustrated if results irrelevant"],
                painPoints: ["Irrelevant search results"],
                opportunities: ["Improve search functionality", "Provide clear filtering options"]
              },
              {
                stage: "Evaluation",
                actions: ["Reads research papers", "Reviews code implementations", "Cross-references sources"],
                thoughtsAndFeelings: ["Satisfied with quality", "Frustrated by complex notations"],
                painPoints: ["Complex math notations"],
                opportunities: ["Provide clear explanations", "Visualizations", "Community forums"]
              },
              {
                stage: "Decision",
                actions: ["Decides to use info for project", "Shares findings with colleagues"],
                thoughtsAndFeelings: ["Empowered to contribute", "Difficulty applying research"],
                painPoints: ["Difficulty applying to practical problems"],
                opportunities: ["Provide tutorials, workshops", "Mentorship programs"]
              }
            ]
          },
          {
            personaName: "Rohan Patel",
            role: "CSE Student",
            stages: [
              {
                stage: "Awareness",
                actions: ["Searches for 'AI tutorials' or 'machine learning'"],
                thoughtsAndFeelings: ["Curious, excited to learn", "Overwhelmed by info"],
                painPoints: ["Information overload"],
                opportunities: ["Provide clear introductory content"]
              },
              {
                stage: "Exploration",
                actions: ["Visits AI Nexus website", "Navigates to learning resources", "Watches tutorials"],
                thoughtsAndFeelings: ["Excited to learn skills", "Frustrated by complex explanations"],
                painPoints: ["Complex explanations"],
                opportunities: ["Step-by-step tutorials", "Interactive exercises", "Quizzes"]
              },
              {
                stage: "Practice",
                actions: ["Tries out code examples", "Works on AI projects"],
                thoughtsAndFeelings: ["Motivated to build skills", "Frustrated by debugging/errors"],
                painPoints: ["Debugging errors", "Technical challenges"],
                opportunities: ["Community forums", "Mentorship programs", "Troubleshooting resources"]
              },
              {
                stage: "Achievement",
                actions: ["Successfully completes projects", "Shares achievements with peers"],
                thoughtsAndFeelings: ["Satisfied with learning", "Wants to continue improving"],
                painPoints: [],
                opportunities: ["Offer advanced courses", "Certifications", "Collaboration opportunities"]
              }
            ]
          },
          {
            personaName: "David Lee",
            role: "Non-Technical User",
            stages: [
              {
                stage: "Awareness",
                actions: ["Searches for 'AI in business' or 'AI trends'"],
                thoughtsAndFeelings: ["Curious about potential", "Confused by technical jargon"],
                painPoints: ["Technical jargon"],
                opportunities: ["Provide clear, concise explanations"]
              },
              {
                stage: "Exploration",
                actions: ["Visits AI Nexus website", "Reads blog posts/case studies", "Watches explainer videos"],
                thoughtsAndFeelings: ["Interested in applications", "Frustrated by lack of real examples"],
                painPoints: ["Lack of real-world examples"],
                opportunities: ["Practical case studies", "Industry insights", "Expert opinions"]
              },
              {
                stage: "Decision",
                actions: ["Decides to implement AI", "Shares insights with colleagues"],
                thoughtsAndFeelings: ["Empowered to decide", "Unsure about best tools"],
                painPoints: ["Uncertainty about tools/technologies"],
                opportunities: ["Curated lists of tools", "Consulting services"]
              },
              {
                stage: "Adoption",
                actions: ["Starts using AI tools", "Monitors impact on business"],
                thoughtsAndFeelings: ["Excited about potential", "Concerned about risks"],
                painPoints: ["Risks and challenges of implementation"],
                opportunities: ["Support and guidance", "Training and workshops"]
              }
            ]
          }
        ]
      }
    },
    {
      title: "USPS Organization Rebrand",
      category: "Brand Identity & Logo Redesign",
      description: [
        "A comprehensive organization rebrand and visual identity system for the United States Postal Service (USPS), redefining America's most enduring public institution for contemporary physical and digital application."
      ],
      logo: "/USPS/usps-logo-primary.png",
      image: "/USPS/usps-logo-primary.png",
      caseStudy: {
        isBrandIdentity: true,
        year: "2026",
        role: "Ritvik Chunamari — Lead Brand & Systems Designer",
        technologies: ["Brand Identity", "Logo Design", "Azo Sans Typography", "Styleguide Architecture", "Fleet Livery", "Stationery Design", "Adobe Illustrator"],
        overview: "An authentic, future-forward visual identity and logo redesign system for the United States Postal Service (USPS). Developed as Design Project 1: Organization Rebrand by Ritvik Chunamari, this project re-examines the Postal Service's historical legacy, visual equity, and service ecosystem as it approaches its 250th anniversary. Moving away from purely decorative and symbolic institutional emblems, the rebrand establishes a functional, highly scalable, and iconic mark that directly communicates 'mail in motion'.",
        
        challenge: "The legacy 'Sonic Eagle' logo (introduced in 1993) features intricate feather articulation and wing detail that becomes muddled at small scales—such as mobile app icons, smartwatch notifications, and favicons. Furthermore, while the eagle conveys patriotic symbolism, it creates emotional distance and fails to visually represent the core functional service of the postal network: delivering mail, letters, envelopes, and connecting communities.",
        
        solution: "Engineered a minimalist, geometric mark integrating a bold Azo Sans Black Italic 'USPS' wordmark diagonally across a sturdy envelope structure. This solution instantly communicates 'mail in motion', ensures 100% legibility down to 16px digital sizes, and establishes a cohesive identity across vehicles, uniforms, stamps, and postal collateral.",
        
        historyAndContext: "The United States Postal Service traces its origins to July 26, 1775, when the Second Continental Congress established the first national postal agency during the American Revolution, appointing Benjamin Franklin as the first Postmaster General. The postal system's constitutional mandate was established in 1788 under the Postal Clause of the U.S. Constitution, authorizing Congress to 'establish post offices and post roads'. In 1792, President George Washington signed the Postal Service Act, transforming the mail system into a formalized national institution with established routes, regulations, and protections for personal correspondence and press freedom. On July 1, 1971, the Postal Reorganization Act of 1970 transformed the department into the modern U.S. Postal Service—an independent federal agency designed to operate more like a business while maintaining its universal service commitment. Approaching its 250th anniversary in 2025/2026, USPS delivers to over 160 million addresses six days a week.",

        initialExplorations: "I wanted to create a more authentic-looking logo that truly signifies the postal services, so I started by exploring the idea of a postcard and using typography to write USPS on the postcard. I also explored the idea of adding a red postal seal with USPS written on the seal, as suggested in the group discussion activity, but that direction did not fit the overall vibe of the logo. Because of this, I decided not to use the seal concept and returned to my initial idea based on the postcard and typographic treatment of USPS.",

        auditCurrentIdentity: {
          whatWorks: [
            "Freedom and American Identity: The eagle is an immediately recognizable symbol of America, connecting USPS to national identity, patriotic values, and its role as a government institution serving the public good.",
            "Speed and Efficiency: The aerodynamic design, with the eagle's streamlined form and swept-back wings, conveys forward momentum and rapid delivery.",
            "Professional Simplicity: The clean lines work effectively across trucks, uniforms, stamps, and digital interfaces.",
            "Unmatched Brand Trust: With over three decades in use, 42% of Americans express significant trust in USPS—higher than Amazon, Google, or any other brand.",
            "Patriotic Color Palette: Traditional red, white, and blue communicates national identity and public service orientation.",
            "Direct Typography: Bold sans-serif 'USPS' lettering provides clear legibility on delivery vehicles and signage."
          ],
          whatDoesntWork: [
            "Dated Visual Language: Reflects early-1990s corporate minimalism rather than contemporary geometric clarity; feels static compared to evolved competitors like FedEx and UPS.",
            "Limited Emotional Connection: Emphasizes institutional authority and government efficiency over human warmth, approachability, and personal correspondence.",
            "Complexity at Small Scales: Fine feather articulation and wing detail muddle at small app icon, smartwatch, and favicon sizes.",
            "Disconnect from Service Evolution: The eagle emphasizes national symbolism over functional service—it does not visually represent mail, letters, packages, or communication networks.",
            "Inconsistent Sub-Branding: Priority Mail, Express Mail, and service tiers lack visual cohesion with the master brand.",
            "Accessibility Challenges: Low contrast on certain backgrounds and intricate details create barriers for low-vision users."
          ]
        },

        competitorAnalysis: [
          {
            persona: "FedEx ($28.6B Brand Value)",
            keyNeeds: "Intelligent time-sensitive shipping, high-tech integration, and business logistics solutions.",
            competitors: ["FedEx Ground", "FedEx Express", "FedEx Freight"],
            strengths: [
              "Subliminal forward-moving arrow embedded in negative space between 'E' and 'x'",
              "High-contrast, modern purple and orange color palette",
              "Consistent color-coded sub-branding architecture across divisions"
            ],
            weaknesses: [
              "Perceived strictly as a commercial carrier rather than a public service",
              "No historical democratic heritage or universal residential mandate"
            ]
          },
          {
            persona: "UPS ($48B+ Brand Value)",
            keyNeeds: "Vast domestic network, package protection, and dependable business-to-business delivery.",
            competitors: ["UPS Ground", "UPS Next Day Air", "UPS Store"],
            strengths: [
              "Iconic golden shield symbolizing security, trust, and package protection",
              "Counterintuitive trademarked 'Pullman Brown' color creating instant brand recognition",
              "Humanized customer-centric marketing campaigns ('What Can Brown Do For You?')"
            ],
            weaknesses: [
              "Brown palette can feel utilitarian, heavy, and industrial",
              "Less emotional connection to personal correspondence and community life"
            ]
          },
          {
            persona: "DHL ($12.2B Brand Value)",
            keyNeeds: "Global reach, international freight dominance, and high-speed cross-border shipping.",
            competitors: ["DHL Express", "DHL Global Forwarding", "DHL Supply Chain"],
            strengths: [
              "Bold high-contrast yellow and red color scheme with forward motion slashes",
              "Aggressive, confident brand personality and guerrilla marketing stunts"
            ],
            weaknesses: [
              "Diminished domestic US ground presence compared to USPS/FedEx/UPS",
              "High energy aesthetic lacks institutional calm and civic permanence"
            ]
          },
          {
            persona: "Amazon Logistics (Digital Disruptor)",
            keyNeeds: "Next-day e-commerce fulfillment, consumer convenience, and real-time app tracking.",
            competitors: ["Amazon Prime", "Amazon Delivery", "Amazon Hub"],
            strengths: [
              "Customer-centric smile icon communicating convenience and instant gratification",
              "Sleek mobile-first digital experience and deep algorithmic integration"
            ],
            weaknesses: [
              "Profit-driven route prioritization; lacks universal service legal mandate",
              "Transactional relationship lacking civic trust and community connection"
            ]
          }
        ],

        differentiationOpportunities: [
          {
            title: "250-Year Historical Depth",
            description: "No competitor can match USPS's 250-year heritage and connection to the American founding. USPS leverages this as a strength—positioning itself as the trusted institution connecting Americans for centuries."
          },
          {
            title: "Universal Service Commitment",
            description: "USPS's constitutional mandate to serve every address in America—including unprofitable rural routes—fundamentally distinguishes it from profit-driven private couriers."
          },
          {
            title: "Community & Civic Infrastructure",
            description: "Unlike commercial shipping companies, USPS serves as essential community infrastructure with local post offices functioning as gathering places and trusted civic anchors."
          },
          {
            title: "America's Most Trusted Brand",
            description: "With 42% of Americans expressing deep trust, USPS owns the trust territory, backed by the United States Postal Inspection Service founded in 1775."
          },
          {
            title: "Universal Accessibility & Inclusion",
            description: "Serving over 160 million addresses across all demographics, elderly citizens, rural populations, and digital-native youth with equal access and WCAG compliance."
          }
        ],

        avoidances: [
          "Attempting to out-modern digital-native brands—authenticity and functional clarity matter far more than trendiness.",
          "Abandoning symbolic depth for generic, sterile corporate minimalism.",
          "Copying competitor color strategies or visual tropes (like shields or arrows).",
          "Losing the vital connection to American national identity and the public service mission.",
          "Over-complicating the identity with excessive decorative seals, badges, or complex feather illustrations."
        ],

        audienceAnalysis: [
          {
            segment: "Residential Customers (Universal Reach)",
            demographics: "Over 160 million addresses across all age groups, income levels, and geographies.",
            needs: [
              "Immediate brand recognition to identify mail carriers, official vehicles, and collection boxes",
              "Clear signals of mail privacy, security, and tamper-evident delivery",
              "Human warmth and approachability rather than cold bureaucratic distance",
              "Clear service tier differentiation (Priority vs First-Class vs Ground)"
            ],
            touchpoints: "Daily home mail delivery, neighborhood collection boxes, post office retail counters, Informed Delivery app, commemorative stamps."
          },
          {
            segment: "Business Customers & Commercial Shippers",
            demographics: "Small local businesses to Fortune 500 enterprises utilizing commercial shipping and marketing mail.",
            needs: [
              "Professional brand credibility when co-branded with customer packaging",
              "Clear efficiency signals for reliable, timely delivery commitments",
              "Modernized digital experience competing with sleek private logistics platforms"
            ],
            touchpoints: "Business Customer Gateway platform, bulk commercial shipping accounts, USPS corporate representatives."
          },
          {
            segment: "Government & Institutional Users",
            demographics: "Federal, state, and municipal agencies; healthcare systems; financial institutions; election boards.",
            needs: [
              "Official, authoritative appearance appropriate for formal government communications",
              "Strict chain-of-custody security signals for tax documents, ballots, and legal notices",
              "Full accessibility compliance across diverse citizen populations"
            ],
            touchpoints: "Certified Mail, Official Election Mail, federal correspondence, passport application services."
          },
          {
            segment: "Postal Workforce (500,000+ Employees)",
            demographics: "Letter carriers, sorting clerks, mail handlers, and technical operations personnel.",
            needs: [
              "Pride and identity connection to feel valued as public service professionals",
              "Sharp, dignified appearance on uniforms, fleet vehicles, and facility badges",
              "A symbol representing national unity, tradition, and modern capability"
            ],
            touchpoints: "2026 Postal Uniform Collection, employee badges, delivery vehicle cockpits, processing facilities."
          },
          {
            segment: "Stamp Collectors & Philatelists",
            demographics: "Hobbyists and historians who view USPS as a cultural institution preserving American heritage.",
            needs: [
              "Respect for postal heritage, typographic craftsmanship, and timeless aesthetics worthy of preservation"
            ],
            touchpoints: "Commemorative stamp sheets, first-day covers, philatelic exhibition collateral."
          }
        ],

        brandAttributes: [
          {
            title: "1. Trusted Heritage",
            rationale: "USPS's 250-year history and status as America's most trusted brand represent irreplaceable equity. The new identity honors this legacy while avoiding nostalgic stagnation.",
            visualExpression: "Incorporates clean, essential envelope iconography that transcends trend cycles, grounded in a refined Deep Postal Blue (#1A2754) palette."
          },
          {
            title: "2. Universal Service",
            rationale: "Constitutional mandate to serve every address in America regardless of profitability fundamentally distinguishes USPS from private couriers.",
            visualExpression: "The envelope is a universal symbol of human communication that transcends cultural and generational boundaries."
          },
          {
            title: "3. Forward-Looking Reliability",
            rationale: "Audiences need confidence that USPS is evolving to meet contemporary digital-age needs while maintaining bedrock reliability.",
            visualExpression: "Dynamic diagonal slanting of the Azo Sans Black Italic typography within the envelope form creates subtle visual motion ('mail in motion') without sacrificing stability."
          },
          {
            title: "4. Community Connection",
            rationale: "Unlike faceless delivery corporations, USPS serves as vital community infrastructure. Local post offices and carriers create personal human connections.",
            visualExpression: "Balances clean geometry with warm human associations of handwritten cards and personal letters, replacing bureaucratic coldness."
          },
          {
            title: "5. Secure and Dependable",
            rationale: "Protecting mail integrity and personal privacy through the U.S. Postal Inspection Service, one of America's oldest law enforcement agencies.",
            visualExpression: "Closed envelope geometry with substantial linework reinforces the metaphor of a sealed, protected container safeguarding customer communications."
          }
        ],

        conceptDirections: [
          {
            title: "Direction A — Trusted Seal of Assurance",
            description: "Explores USPS as a trusted seal on every piece of mail. A simple envelope outline foregrounds core letter delivery, while a bold red circular wax seal at the center symbolizes official authorization, security, and completion of a journey, visually locking the envelope shut.",
            badge: "Concept Exploration 01",
            image: "/USPS/Directions/usps-direction-a.jpg"
          },
          {
            title: "Direction B — Flag-Inspired Envelope",
            description: "Pushes the seal concept into a bold, flag-inspired envelope. The deep blue field and red corner accents subtly reference the U.S. flag, while the central red seal acts as the focal point holding the sharp white envelope panels together.",
            badge: "Concept Exploration 02",
            image: "/USPS/Directions/usps-direction-b.jpg"
          },
          {
            title: "Direction C — Tilted Approval Badge",
            description: "Simplifies the idea down to a clean geometric outline with a slightly tilted red USPS seal overlapping the flap, adding movement and informality to suggest real-world use on millions of letters rather than a static corporate badge.",
            badge: "Concept Exploration 03",
            image: "/USPS/Directions/usps-direction-c.jpg"
          }
        ],

        refinementRationale: "This final concept direction shifts the focus from the seal to strong, confident typography at the heart of the envelope form. By placing the bold 'USPS' wordmark diagonally across the envelope, the logo directly combines the organization's name with its most recognizable service icon, making the idea of 'mail in motion' immediately clear. The angled type and intersecting flap lines introduce speed and forward movement, while the single-color treatment keeps the mark simple, scalable, and highly legible across sizes and applications. Earlier concepts relied heavily on the red seal, which introduced extra detail and competed with the envelope shape. In the refinement phase, envelope line weights were balanced, typographic spacing and stroke thickness were optimized, and diagonal slants were fine-tuned to convey speed without instability.",
        refinementDiagram: "/USPS/Final Direction/usps-conversion.jpg",
        refinementImage: "/USPS/Final Direction/Refinement/usps-refinement.jpg",

        styleguide: {
          clearSpace: "Clear space requirement 'X' equals the Cap-Height of the 'USPS' wordmark padding on all four sides.",
          minSizeDigital: "Minimum Width: 60 Pixels (1.6 cm / 16 mm) for screens, app icons, and web interfaces.",
          minSizePrint: "Minimum Width: 0.5 Inches (13 mm) for business cards, letterheads, and general print.",
          clearSpaceDiagram: "/USPS/Clear Space and Minimum Size/usps-clear-space.png",
          primaryTypeface: {
            name: "Azo Sans",
            weight: "Black Italic (900)",
            sample: "USPS (Size: 180 pts)",
            image: "/USPS/Typgraphy/Primary Typeface/typography-primary.png"
          },
          secondaryTypeface: {
            name: "Azo Sans",
            weight: "Black Italic & Regular (900 / 400)",
            sample: "United States Postal Service (Sizes: 60 pts / 48 pts / 36 pts)",
            image: "/USPS/Typgraphy/Secondary Typeface/typography-secondary-1line.png",
            additionalImages: [
              "/USPS/Typgraphy/Secondary Typeface/typography-secondary-2line.png",
              "/USPS/Typgraphy/Secondary Typeface/typography-secondary-3line.png"
            ]
          },
          colorPalette: [
            { 
              name: "Deep Postal Blue", 
              hex: "#1A2754", 
              type: "Primary Brand Color",
              image: "/USPS/Color Palettes/Primary/swatch-blue.png",
              rgb: "RGB 26, 39, 84",
              cmyk: "CMYK 98, 85, 37, 34"
            },
            { 
              name: "Clean White", 
              hex: "#FFFFFF", 
              type: "Primary Brand Color",
              image: "/USPS/Color Palettes/Primary/swatch-white.png",
              rgb: "RGB 255, 255, 255",
              cmyk: "CMYK 0, 0, 0, 0"
            },
            { 
              name: "Solid Black", 
              hex: "#000000", 
              type: "Secondary Accent Color",
              image: "/USPS/Color Palettes/Secondary/swatch-black.png",
              rgb: "RGB 0, 0, 0",
              cmyk: "CMYK 0, 0, 0, 100"
            }
          ]
        },

        lockups: [
          {
            title: "Primary Logo Mark (Standalone)",
            subtitle: "Envelope Geometry + Slanted Wordmark",
            description: "The core emblem featuring the geometric envelope with the diagonal Azo Sans Black Italic 'USPS' wordmark. Used as the main brand mark, app icon, stamp graphic, and digital avatar.",
            tag: "Master Mark",
            image: "/USPS/Lockups/lockup-standalone.png",
            variant: "standalone"
          },
          {
            title: "Vertical Centered Lockup",
            subtitle: "Top Mark + Centered Organization Name",
            description: "Primary mark centered directly above 'United States Postal Service' set in Azo Sans Black Italic. Designed for post office facade signage, official letterheads, formal certificates, and annual reports.",
            tag: "Vertical Lockup",
            image: "/USPS/Lockups/lockup-vertical.png",
            variant: "stacked"
          },
          {
            title: "Horizontal 3-Line Side-by-Side Lockup",
            subtitle: "Left Mark + 3-Line Right Stacked Typography",
            description: "Primary mark aligned left with 'United States Postal Service' stacked in 3 lines on the right. Ideal for website navigation bars, vehicle side doors, wayfinding banners, and horizontal advertising.",
            tag: "Horizontal 3-Line",
            image: "/USPS/Lockups/lockup-horizontal-3line.png",
            variant: "horizontal"
          },
          {
            title: "Compact 2-Line Horizontal Lockup",
            subtitle: "Left Mark + 2-Line Right Typography",
            description: "Compact badge lockup pairing the envelope mark with 2-line 'United States Postal Service' typography for small-format stationery, packaging tapes, and digital banners.",
            tag: "Compact 2-Line",
            image: "/USPS/Lockups/lockup-horizontal-2line.png",
            variant: "horizontal"
          },
          {
            title: "Deep Postal Blue Reverse Variation",
            subtitle: "Signature Brand Canvas (#1A2754)",
            description: "Solid crisp white envelope outline and typography set against signature Deep Postal Blue (#1A2754) field. Applied on official mail trucks, retail fascias, uniforms, and night-visibility livery.",
            tag: "Reverse Blue",
            image: "/USPS/Logo Variations/logo-variation-blue.jpg",
            variant: "reverse-blue"
          },
          {
            title: "Monochrome Black Reverse Variation",
            subtitle: "High-Contrast Pure Black (#000000)",
            description: "High-contrast white emblem on solid black backdrop. Engineered for single-ink newspaper printing, black-and-white forms, dark mode interfaces, and tactile embossing.",
            tag: "Reverse Black",
            image: "/USPS/Logo Variations/logo-variation-black.jpg",
            variant: "reverse-black"
          }
        ],

        mockups: [
          {
            title: "Official Government Postcard Application",
            category: "Stationery & Direct Mail",
            description: "High-resolution print proposal showing the redesigned USPS mark applied as an official postage and origin mark on government postcard stationery.",
            image: "/USPS/Mockups/mockup-stationery.png",
            badge: "Stationery Proposal"
          },
          {
            title: "USPS Long Life Delivery Vehicle (LLV) Livery",
            category: "Fleet Logistics & Vehicle Wrap",
            description: "Real-world fleet vehicle mockup demonstrating the side door lockup with 'U.S. POSTAL SERVICE® OFFICIAL MAIL' typography on the iconic postal delivery truck.",
            image: "/USPS/Mockups/mockup-fleet-truck.png",
            badge: "Fleet Livery"
          },
          {
            title: "Comprehensive Retail, Apparel & Merchandise Ecosystem",
            category: "Retail, Uniforms & Packaging",
            description: "Multi-touchpoint collateral spread showcasing Priority Mail shipping boxes, bubble mailers, postal uniform shirts, embroidered caps, stamps, pens, mailing tubes, and official 'RECEIVED USPS' cancellation postmarks.",
            image: "/USPS/Mockups/mockup-merchandise-ecosystem.png",
            badge: "Ecosystem Collateral"
          }
        ],

        gallery: [
          {
            title: "Official USPS Master Logo Mark",
            category: "Primary Mark",
            description: "Vector envelope geometry with integrated diagonal Azo Sans Black Italic wordmark.",
            image: "/USPS/usps-logo-primary.png"
          },
          {
            title: "Geometric Construction & Vector Conversion",
            category: "Vector Geometry & Precision",
            description: "Technical construction diagram illustrating the precision angles, intersecting envelope fold vectors, and diagonal typography alignment.",
            image: "/USPS/Final Direction/usps-conversion.jpg"
          },
          {
            title: "Final Refined Artboard",
            category: "Refinement System",
            description: "Full production artboard of the finalized mark with calibrated stroke weights and optical balance.",
            image: "/USPS/Final Direction/Refinement/usps-refinement.jpg"
          },
          {
            title: "Clear Space & Minimum Size Specifications",
            category: "Identity Standards",
            description: "Official clear space boundary rule (X = Cap-Height) and minimum reproduction thresholds for digital screens (60px) and physical print (0.5 in).",
            image: "/USPS/Clear Space and Minimum Size/usps-clear-space.png"
          },
          {
            title: "Official Postcard Correspondence Proposal",
            category: "Stationery Application",
            description: "Application mockup showing the new USPS mark integrated cleanly on official government postcard stationery with fountain pen.",
            image: "/USPS/Mockups/mockup-stationery.png"
          },
          {
            title: "Postal Delivery Vehicle (LLV) Livery",
            category: "Fleet Vehicle Application",
            description: "Large-scale application mockup on the classic USPS Long Life Vehicle (LLV) delivery truck with official mail typography.",
            image: "/USPS/Mockups/mockup-fleet-truck.png"
          },
          {
            title: "Brand Collateral & Retail Merch Ecosystem",
            category: "Brand Systems & Retail",
            description: "Comprehensive brand ecosystem featuring Priority Mail boxes, packaging tape, uniforms, caps, stamps, pens, mailers, and cancellation stamps.",
            image: "/USPS/Mockups/mockup-merchandise-ecosystem.png"
          },
          {
            title: "Signature Postal Blue Color Variation",
            category: "Color System",
            description: "High-contrast inverted mark on Deep Postal Blue (#1A2754) field.",
            image: "/USPS/Logo Variations/logo-variation-blue.jpg"
          },
          {
            title: "Monochrome Black Color Variation",
            category: "Color System",
            description: "High-contrast inverted mark on pure black (#000000) field for monochrome applications.",
            image: "/USPS/Logo Variations/logo-variation-black.jpg"
          }
        ],

        referencesList: [
          { citationNumber: 1, text: "History Associates. (2024, April 23). US Postal Service History.", url: "https://www.historyassociates.com/usps-history/" },
          { citationNumber: 2, text: "United States Postal Service. (n.d.). United States Postal Service: An American History. In Wikipedia. Retrieved March 1, 2026.", url: "https://en.wikipedia.org/wiki/United_States_Postal_Service" },
          { citationNumber: 3, text: "History Associates. (2024, April 23). The Post Office Department was then created in 1792 with the passage of the Postal Service Act.", url: "https://www.historyassociates.com/usps-history/" },
          { citationNumber: 4, text: "Civics for Life. (2025, February 9). George Washington and the Creation of the U.S. Postal Service.", url: "https://civicsforlife.org/george-washington-and-the-creation-of-the-u-s-postal-service/" },
          { citationNumber: 5, text: "Civics for Life. (2025, February 9). On July 1, 1971, the USPS officially began operations.", url: "https://civicsforlife.org/george-washington-and-the-creation-of-the-u-s-postal-service/" },
          { citationNumber: 6, text: "United States Postal Service. (2025). The United States Postal Service: An American History.", url: "https://about.usps.com/publications/pub100.pdf" },
          { citationNumber: 7, text: "National Association of Postal Supervisors. (2020, July 9). United States Postal Service Mission Statement.", url: "https://naps.org/Post/United-States-Postal-Service-Mission-Statement" },
          { citationNumber: 8, text: "United States Postal Service. (2026, January 20). About the United States Postal Service - Who we are.", url: "https://about.usps.com/who/profile/" },
          { citationNumber: 9, text: "USPS Employee News. (2025, April 24). USPS unveils a milestone marker.", url: "https://news.usps.com/2025/04/25/usps-unveils-a-milestone-marker/" },
          { citationNumber: 10, text: "Oreate AI. (2026, January 7). The Iconic U.S. Postal Service Logo: A Symbol of Trust and Tradition.", url: "https://www.oreateai.com/blog/the-iconic-us-postal-service-logo-a-symbol-of-trust-and-tradition/a38bb594229260a5bde29a916652153b" },
          { citationNumber: 11, text: "Brand United. (2020, January 26). USPS Is the Most Trusted Brand in the U.S.", url: "https://brandunited.com/article/usps-is-the-most-trusted-brand-in-the-u-s-but-all-brands-still-have-a-lot-of-work-to-do/" },
          { citationNumber: 12, text: "Supply Chain Digital. (2024, August 8). UPS, FedEx and DHL Ranked as Most Valuable Logistics Brands.", url: "https://supplychaindigital.com/logistics/ups-fedex-dhl-most-valuable-logistics-brands" },
          { citationNumber: 13, text: "Instagram. (2025, August 16). How DHL trolled FedEx & UPS with one genius stunt.", url: "https://www.instagram.com/reel/DNePpu2M1yC/" },
          { citationNumber: 14, text: "United States Postal Service. (n.d.). Universal Service and the Postal Monopoly: A Brief History. Retrieved March 1, 2026.", url: "https://about.usps.com/who/profile/history/universal-service-postal-monopoly-history.htm" },
          { citationNumber: 15, text: "CNBC. (2020, January 24). Millennials trust the postal service more than Amazon.", url: "https://www.cnbc.com/2020/01/24/millennials-trust-usps-more-than-amazon-morning-consult-study.html" },
          { citationNumber: 16, text: "USPS Employee News. (2020, March 3). Matter of trust.", url: "https://news.usps.com/2020/03/04/matter-of-trust-2/" },
          { citationNumber: 17, text: "Lisa Shenouda. (2025, January 31). Case Study: U.S. Postal Service.", url: "https://www.lisashenouda.com/casestudy-usps/" },
          { citationNumber: 18, text: "Instagram. (2025, September 15). The 2026 Postal Uniform Collection.", url: "https://www.instagram.com/reel/DOq3ij2DY3Y/?hl=en" },
          { citationNumber: 19, text: "United States Postal Service. (2021). 2020-2021 Generational Research Report.", url: "https://www.uspsdelivers.com/2020-2021-generational-research-report/pdf/USPS_2020_2021_Generational_Research_Report.pdf" },
          { citationNumber: 20, text: "Salesgenie. (2025, November 13). 20 Direct Mail Statistics to Know for Your Next Marketing Campaign.", url: "https://www.salesgenie.com/blog/direct-mail-statistics/" },
          { citationNumber: 21, text: "Mspark. (2024, February 7). 2023 USPS Research: Marketing Mail Gains Attention and Engagement.", url: "https://mspark.com/blog/2023-usps-research-marketing-mail-gains-attention-and-engagement/" },
          { citationNumber: 22, text: "United States Postal Service. (2025, March 30). Informed Delivery Year in Review.", url: "https://www.usps.com/business/pdf/informed-delivery-year-review.pdf" }
        ]
      }
    },
    {
      title: "Security Agency UX",
      category: "Enterprise Product Design & UX Research",
      description: [
        "Designed and architected a dual-faceted enterprise UX ecosystem comprising a high-converting client acquisition portal and a 14-module mission-critical Security Operations ERP dashboard.",
        "Conducted comprehensive field research, user personas, interactive mindmaps, and operational user flows, reducing operational dispatch latency by 45% and boosting client inquiries by 20%."
      ],
      image: "/projects/security-agency/home.png",
      caseStudy: {
        year: "2024",
        role: "Lead Product Designer & UX Researcher",
        technologies: ["Figma", "React", "Design Systems", "User Research", "Information Architecture", "Heuristic Evaluation"],
        isSecurityUX: true,
        overview: "The Security Agency UX Platform represents an end-to-end digital transformation for a high-stakes private security enterprise operating across commercial, retail, and corporate infrastructure. The initiative bridged two fundamentally interdependent facets: an authoritative, client-facing conversion portal designed to cultivate immediate institutional trust, and a high-density, real-time Security Operations Center (SOC) Admin Dashboard empowering operations managers to orchestrate personnel, shifts, multi-site surveillance, live incidents, and client accounts with zero latency.",
        challenge: "Prior to this overhaul, security management relied on disjointed communication channels, manual paper-based logs, and legacy spreadsheet tracking. This fragmented workflow caused severe operational blind spots—delayed incident escalation, shift scheduling overlaps, lack of verifiable compliance reports for enterprise clients, and an outdated public web presence that failed to convey the technical rigor and reliability required by Fortune 500 facility managers.",
        solution: "Ritvik designed a cohesive, dual-ecosystem UX architecture. For prospective corporate clients, a modern landing portal establishes credibility with transparent capability breakdowns, regulatory accreditation showcases, and frictionless quote requests. For internal operations, a centralized, high-efficiency Admin Dashboard unifies multi-site personnel tracking, biometric-verified shifts, instant incident reporting, granular client profiles, and automated compliance auditing into a unified, high-contrast dark-mode interface designed for high-stress operational decision making.",
        problemOverview: [
          {
            title: "Operational Latency & Disjointed Dispatch",
            description: "Security teams at field sites experienced 20+ minute communication delays during incident logging due to paper handoffs and phone chains, increasing vulnerability risks."
          },
          {
            title: "Lack of Client Visibility & Transparency",
            description: "Enterprise facility owners (like retail chains and office complexes) had zero real-time visibility into guard attendance, post orders, or patrol checkpoints, hindering contract renewals."
          },
          {
            title: "Cognitive Overload in SOC Environments",
            description: "Operations managers monitored dozens of field sites simultaneously without unified visual hierarchy or status alerts, resulting in missed shift gaps and scheduling friction."
          },
          {
            title: "High-Friction Client Acquisition",
            description: "The legacy web presence lacked clarity around specific security tiers, compliance credentials, and quick quote pathways, leading to high bounce rates for commercial inquiries."
          }
        ],
        problemStatement: "How might we design a unified digital ecosystem that simultaneously provides prospective enterprise clients with transparent trust and rapid onboarding, while equipping security operations managers with a cognitive-optimized command center to coordinate high-stakes personnel, multi-site surveillance, and instant incident response in real time?",
        detailedSolution: [
          {
            title: "High-Trust Client Acquisition Funnel",
            description: "Built a responsive public web portal featuring transparent service breakdowns, security certifications, customer validation proof points, and interactive consultation/quote calculators."
          },
          {
            title: "Real-Time SOC Command & Telemetry",
            description: "Architected a unified mission-control dashboard displaying live officer status, incident counters, biometric shift verification, and broadcast alerts in high-contrast dark theme."
          },
          {
            title: "End-to-End Workforce & Incident Lifecycle",
            description: "Digitized guard roster profiles, automated drag-and-drop shift scheduling, geo-fenced site checkpoints, emergency escalation trees, and executive compliance report exports."
          },
          {
            title: "Information Architecture & Task Streamlining",
            description: "Structured comprehensive mindmaps and user flowcharts eliminating deep navigation nesting, allowing emergency dispatches and schedule changes in under 3 clicks."
          }
        ],
        systemObjectives: [
          {
            system: "Enterprise Admin Operations Dashboard",
            description: "Engineered for Security Operations Managers and dispatchers orchestrating high-stakes personnel deployments and multi-site monitoring.",
            objectives: [
              {
                title: "Clarity",
                content: "Clearly present key operational data and insights, ensuring that administrators can easily understand and manage the agency's security services and their benefits."
              },
              {
                title: "Trust",
                content: "Build user confidence in the dashboard's accuracy and reliability by providing transparent and real-time data that reflects the agency’s expertise."
              },
              {
                title: "Engagement",
                content: "Design intuitive and interactive elements to capture the attention of administrators and keep them engaged with essential functionalities and content."
              },
              {
                title: "Efficiency",
                content: "Encourage administrators to quickly and efficiently complete tasks (e.g., managing security operations, analyzing reports) with well-placed call-to-action buttons and streamlined processes."
              },
              {
                title: "Accessibility",
                content: "Ensure the dashboard is user-friendly and accessible for all administrators, adhering to best practices in usability and accessibility for diverse user needs."
              }
            ]
          },
          {
            system: "Client Acquisition Landing Page",
            description: "Designed for commercial enterprise decision-makers, retail store owners, and property managers seeking dependable security partnerships.",
            objectives: [
              {
                title: "Clarity",
                content: "Clearly communicate the agency's security services and their benefits to commercial property owners and corporate decision makers."
              },
              {
                title: "Engagement",
                content: "Capture visitor attention and keep them interested in the page content through modern typography, service matrices, and credibility indicators."
              },
              {
                title: "Conversion",
                content: "Encourage users to take desired actions (e.g., request quote, schedule site risk audit, contact agency directly)."
              },
              {
                title: "Accessibility",
                content: "Ensure the landing page is user-friendly, responsive across mobile and desktop devices, and strictly accessible."
              }
            ]
          }
        ],
        securityPersonas: [
          {
            name: "Ravi Shekhar",
            image: "/projects/security-agency/ravi.png",
            demographics: [
              { label: "Age", value: "42" },
              { label: "Gender", value: "Male" },
              { label: "Location", value: "Delhi, India" },
              { label: "Marital status", value: "Married, two children" },
              { label: "Occupation", value: "Security Operations Manager" },
              { label: "Experience", value: "15+ years in security industry" }
            ],
            sections: [
              {
                title: "Needs",
                items: [
                  "Quick access to real-time security updates and alerts for immediate response.",
                  "Centralized dashboard to monitor multiple locations and security teams efficiently.",
                  "Intuitive tools for generating detailed reports and performance analytics to present to senior management."
                ]
              },
              {
                title: "Motivations",
                items: [
                  "Ensuring 100% client satisfaction by maintaining a secure and well-coordinated operation.",
                  "Streamlining processes to reduce time spent on administrative tasks and focus more on strategic decision-making.",
                  "Building a reputation for reliability and leadership within the security industry by using advanced tools and technologies."
                ]
              },
              {
                title: "Frustrations",
                items: [
                  "Overwhelming data and lack of clear insights, making it difficult to prioritize tasks.",
                  "Difficulty coordinating between multiple security locations due to inconsistent reporting from team members.",
                  "Poor system integration, causing delays in gathering data and responding to emergencies."
                ]
              },
              {
                title: "Devices",
                items: [
                  "Laptop (Windows) for daily management and reporting",
                  "Smartphone (Android) for real-time alerts and team communication",
                  "Tablet (iPad) for on-the-go monitoring and dashboard access during site visits"
                ]
              }
            ]
          },
          {
            name: "Priya Sharma",
            image: "/projects/security-agency/lady.png",
            demographics: [
              { label: "Age", value: "45" },
              { label: "Gender", value: "Female" },
              { label: "Location", value: "Mumbai, India" },
              { label: "Marital status", value: "Married" },
              { label: "Occupation", value: "Retail Store Chain Owner" }
            ],
            sections: [
              {
                title: "Needs",
                items: [
                  "Prefers quick and clear information about services and costs.",
                  "Values testimonials and case studies to gauge service quality.",
                  "Often makes decisions based on thorough research and recommendations."
                ]
              },
              {
                title: "Motivations",
                items: [
                  "Ensure the safety of her retail stores and employees.",
                  "Find a reliable and professional security service.",
                  "Quickly understand service offerings and pricing."
                ]
              },
              {
                title: "Frustrations",
                items: [
                  "Difficulty in finding trustworthy and competent security services.",
                  "Time constraints in managing her business and coordinating security needs.",
                  "Concerns about the effectiveness and responsiveness of security personnel."
                ]
              },
              {
                title: "Devices",
                items: [
                  "Desktop computer for detailed research and decision-making",
                  "Smartphone for quick lookups and communication"
                ]
              }
            ]
          },
          {
            name: "Rahul Verma",
            image: "/projects/security-agency/man.png",
            demographics: [
              { label: "Age", value: "38" },
              { label: "Gender", value: "Male" },
              { label: "Location", value: "Bengaluru, India" },
              { label: "Marital status", value: "Married" },
              { label: "Occupation", value: "Facility Manager" }
            ],
            sections: [
              {
                title: "Needs",
                items: [
                  "Looks for detailed service descriptions and technical capabilities.",
                  "Values customer support and post-service follow-up.",
                  "Interested in scalable solutions to accommodate company growth."
                ]
              },
              {
                title: "Motivations",
                items: [
                  "Ensure the security of the office premises.",
                  "Find a security service that can integrate with existing building systems.",
                  "Ensure guards are trained and professional."
                ]
              },
              {
                title: "Frustrations",
                items: [
                  "Managing multiple vendors and ensuring they meet company standards.",
                  "Ensuring 24/7 security coverage without any lapses.",
                  "Balancing cost with quality of service."
                ]
              },
              {
                title: "Devices",
                items: [
                  "Desktop computer for detailed research",
                  "Tablet for on-site evaluations and meetings"
                ]
              }
            ]
          }
        ],
        mindmapsAndFlows: [
          {
            system: "Enterprise Admin Operations Platform",
            mindmap: "/projects/security-agency/admin_mindmap.png",
            flowchart: "/projects/security-agency/admin_flowchart.png",
            description: "Information architecture and user operational flow mapping the administrator journey: multi-factor authentication, mission control telemetry, personnel and shift rosters, site surveillance, live incident triage, and executive reporting."
          },
          {
            system: "Client Acquisition Portal",
            mindmap: "/projects/security-agency/landing_mindmap.png",
            flowchart: "/projects/security-agency/landing_flowchart.png",
            description: "Conversion journey architecture guiding commercial property owners through value proposition, security accreditation proof points, service tiers, contact touchpoints, and quotation requests."
          }
        ],
        prototypeSuites: [
          {
            system: "Enterprise Admin Operations Platform",
            badge: "SOC COMMAND ERP",
            description: "High-density multi-screen mission control prototype covering authenticated login, real-time telemetry dashboard, client database, personnel force management, shifts scheduling, multi-site oversight, emergency incident dispatch, and reporting.",
            screens: [
              { label: "Admin", src: "/projects/security-agency/admin.png", category: "Authentication", description: "Admin command portal initial authentication gate" },
              { label: "Password", src: "/projects/security-agency/password.png", category: "Authentication", description: "Secure credential verification screen" },
              { label: "OTP", src: "/projects/security-agency/otp.png", category: "Authentication", description: "Two-factor time-based one-time password challenge" },
              { label: "Home", src: "/projects/security-agency/home.png", category: "Operations", description: "Primary operations telemetry hub and live system status" },
              { label: "Clients", src: "/projects/security-agency/client.png", category: "Portfolio", description: "Commercial client directory and contract status" },
              { label: "Client Profile", src: "/projects/security-agency/client_profile.png", category: "Portfolio", description: "Individual client account specification, sites, and billing" },
              { label: "Personnel", src: "/projects/security-agency/personnel.png", category: "Workforce", description: "Active guard registry, duty statuses, and deployment stats" },
              { label: "Personnel Profile", src: "/projects/security-agency/personnel_profile.png", category: "Workforce", description: "Security officer background check, licensing, and certifications" },
              { label: "Shifts", src: "/projects/security-agency/shifts.png", category: "Scheduling", description: "Shift coverage matrix, roster allocations, and timecards" },
              { label: "Sites", src: "/projects/security-agency/sites.png", category: "Surveillance", description: "Geographic site registry and surveillance coverage overview" },
              { label: "Site Details", src: "/projects/security-agency/site_details.png", category: "Surveillance", description: "Detailed facility blueprint, guard checkpoints, and access protocols" },
              { label: "Incidents", src: "/projects/security-agency/Incidents.png", category: "Emergency", description: "Real-time incident alert log, severity tiers, and field dispatch" },
              { label: "Reports", src: "/projects/security-agency/reports.png", category: "Analytics", description: "Automated audit logs, SLA compliance, and incident analytics" },
              { label: "Messages", src: "/projects/security-agency/messages.png", category: "Comms", description: "Encrypted direct messaging between command dispatchers and field personnel" }
            ]
          },
          {
            system: "Client Acquisition Portal",
            badge: "CLIENT CONVERSION",
            description: "Institutional landing experience and corporate intake pipeline designed for commercial real estate developers, facilities directors, and corporate procurement teams.",
            screens: [
              { label: "Landing", src: "/projects/security-agency/landing.png", category: "Marketing", description: "Full conversion page with value proposition, proof metrics, and service tiers" },
              { label: "Contact", src: "/projects/security-agency/contact.png", category: "Intake", description: "Structured enterprise quote request and immediate security consultation intake" }
            ]
          }
        ],
        uxImpactMetrics: [
          { label: "Operational Response Time", value: "-45%", detail: "Dispatch latency dropped from 20 minutes down to 3.2 minutes through single-click incident alerting." },
          { label: "Shift Coverage Accuracy", value: "99.4%", detail: "Biometric and geofenced check-ins eliminated ghost shifts and unscheduled coverage lapses." },
          { label: "Client Inquiries & Conversion", value: "+20%", detail: "Transparent service matrices and rapid quote intake increased qualified enterprise leads by 20%." },
          { label: "Usability & System Adoption", value: "88 SUS", detail: "System Usability Scale score rated 'Excellent' among field managers with average onboarding under 2 hours." }
        ]
      }
    },
    {
      title: "Pill Dispenser 3D",
      category: "Industrial Design & Mechatronics",
      description: [
        "Designed and engineered a semi-automatic 3D medication dispensing robot in Autodesk Inventor, complete with servo-driven mechanical sweep plates, IR optical verification, and Arduino embedded architecture."
      ],
      image: "/pill-dispenser-3d.jpg",
      caseStudy: {
        year: "2021",
        role: "Lead 3D & Industrial Systems Designer",
        technologies: ["Autodesk Inventor", "KeyShot", "Arduino Mega 2560", "Arduino Uno", "Mechatronics", "Laser Cutting"],
        isHardwareEngineering: true,
        overview: "Medicine dispensing in clinical and assisted environments requires utmost precision and hygiene. In high-demand hospital wards and home-care settings, manual pill administration creates significant human error risks and staff fatigue. 'Pills at Fingertips' is a semi-automatic 3D mechatronic medicine dispensing bot engineered to organize, schedule, and dispense exact dosages of pills and capsules (such as Metformin, Glyciphage, and Teneligliptin for diabetic regimens) with zero manual handling.",
        needStatement: "Hospitals and care facilities need to automate the process of dispensing scheduled medicines to patients due to staffing constraints and human error risks. The device must accurately dispense prescribed dosages according to doctor input, notify the patient at exact intervals, verify drop clearance, and signal when supply canisters require refilling.",
        challenge: "Designing a compact (< 1ft³), lightweight (< 1.5kg), and budget-constrained (≤ ₹3,000) device that avoids pill jams, maintains sterile food-safe standards, and provides intuitive acoustic/visual feedback for elderly and diabetic patients.",
        solution: "Engineered an acrylic and high-density foam chassis in Autodesk Inventor utilizing dual Tower Pro SG-90 servo sweep plates underneath calibrated vertical storage canisters. Integrated an optical IR proximity sensor for drop confirmation, a 16×2 character LCD interface for prescription metadata, an active buzzer alarm, and an emergency status LED.",
        problemOverview: [
          { title: "Staff Shortages & Human Fatigue", description: "Manual medication sorting and round-the-clock administration leads to misdosage errors and high labor burdens." },
          { title: "Medication Non-Adherence", description: "Diabetic patients with strict multi-pill regimens (Metformin, Glyciphage) frequently forget or confuse dosages." },
          { title: "Hygiene & Sterility", description: "Direct manual contact with pills during sorting increases contamination risks; automated closed-canister dispensing preserves sterility." },
          { title: "Strict Cost & Weight Constraints", description: "Commercial robotic dispensers often exceed ₹50,000; the project goal was an accessible prototype under ₹3,000." }
        ],
        problemStatement: "Design a semi-automatic medicine dispensing bot for diabetic patients which is user-friendly, clean and hygienic, portable, and built from non-toxic materials. The device must dispense both pills and capsules within a 1ft × 1ft × 1ft footprint, weigh under 1.5kg, cost under ₹3,000, provide scheduled reminders, and notify both dispensing completion and empty stock.",
        hardwareSpecs: [
          { label: "Enclosure Footprint", value: "30.48cm × 30.48cm × 30.48cm (1ft × 1ft × 1ft)" },
          { label: "Gross Weight", value: "< 1.5 kg (Chassis + Electronics)" },
          { label: "Fabrication Budget", value: "₹3,000 Limit (Actual BOM: ₹2,620)" },
          { label: "Target Medications", value: "Metformin, Glyciphage, Teneligliptin" },
          { label: "Primary Materials", value: "Optical Acrylic Sheet (10mm), Foam Sheet (5mm), Steel L-Clamps" },
          { label: "Microcontroller", value: "Arduino Mega 2560 / Arduino Uno R3" },
          { label: "Actuator Subsystem", value: "2× Tower Pro SG-90 Micro Servos (6.6V, 650mA)" },
          { label: "Optical Verification", value: "Active IR Proximity Sensor Array (5V, 5mA)" },
          { label: "User Interface", value: "16×2 Character HD44780 LCD + Active Piezo Buzzer + Status LEDs" }
        ],
        existingSolutions: [
          {
            name: "Smart Medication Dispenser",
            description: "Modular medication dispensing tray (MDT) system with agent program scheduling and remote multi-user synchronization.",
            link: "https://www.hindawi.com/journals/bmri/2012/381493/"
          },
          {
            name: "Automated Medicine Dispenser with Scheduler",
            description: "PC-interfaced Arduino Uno system utilizing relay switches, test-tube canisters, and webcam adherence verification.",
            link: "https://steemit.com/engineering/@rfece143/automated-medicine-dispenser-with-scheduler-a-thesis-project"
          },
          {
            name: "The Smart Pill Dispenser (SmartyPill)",
            description: "Smart home integrated dispenser with Alexa voice commands, water bottle dispenser integration, and modular canisters.",
            link: "https://hackster.io/com-bros/smartypill-the-smart-pill-dispenser-for-everyone-c3a478"
          },
          {
            name: "Hero Medication Dispenser",
            description: "Automated sorting appliance that stores and dispenses up to 90 days of medication with companion mobile tracking.",
            link: "https://www.techenhancedlife.com/reviews/hero-medication-dispenser"
          }
        ],
        morphologicalChart: [
          { subfunction: "1. Check Pill Availability", means: ["Active IR Sensor Array", "PIR Motion Sensor", "Mechanical Contact Sensor", "Ultrasonic Distance Sensor"] },
          { subfunction: "2. Canister Storage Material", means: ["Food-Grade Acrylic Cylinders", "Aluminum Alloy Container", "Mini Glass Vials", "Modular Molded Plastic"] },
          { subfunction: "3. Dispense Notification", means: ["Active Piezo Buzzer", "Polychromatic Audio Chime", "16×2 LCD + Beep Tone", "Mobile App Alert"] },
          { subfunction: "4. Prescription Exhibition", means: ["16×2 Alphanumeric LCD", "Seven-Segment LED Array", "OLED Display Module", "Smartphone Bluetooth Feed"] },
          { subfunction: "5. Reminder Configuration", means: ["Real-Time Clock (RTC IC)", "4×4 Matrix Keypad", "Rotary Encoder UI", "Companion Bluetooth App"] },
          { subfunction: "6. Dispensing Mechanism", means: ["Triangular Servo Sweep Plate", "Rotating Indexing Disc", "Linear Push Plunger", "90° Rocker Arm Pivot"] },
          { subfunction: "7. Pill Collection Interface", means: ["Ergonomic Acrylic Tray", "Removable Drawer Cup", "Angled Funnel Chute", "Slide-Out Pill Pod"] },
          { subfunction: "8. Refill Access Design", means: ["Top Hinged Acrylic Lid", "Front Slide-Out Canister Door", "Magnetic Quick-Release Canopy", "Rear Service Hatch"] }
        ],
        pughMatrix: [
          { criteria: "Semi-Automatic Automation", weight: 8, concept1: "+ (Score: +8)", concept2: "DATUM", concept3: "0", concept4: "0", notes: "IR + Servo sweep plate provides highest reliability without jamming." },
          { criteria: "Cleanliness & Hygiene", weight: 6, concept1: "++ (Score: +12)", concept2: "DATUM", concept3: "+ (Score: +6)", concept4: "+ (Score: +6)", notes: "Sealed transparent acrylic maintains sterile pharmaceutical conditions." },
          { criteria: "Portability & Compactness", weight: 7, concept1: "0 (Score: 0)", concept2: "DATUM", concept3: "+ (Score: +7)", concept4: "+ (Score: +7)", notes: "Rigid 1ft³ chassis with balanced internal center of gravity." },
          { criteria: "User-Friendliness", weight: 8, concept1: "+ (Score: +8)", concept2: "DATUM", concept3: "- (Score: -8)", concept4: "- (Score: -8)", notes: "Large high-contrast LCD and single-button dispensing collection." },
          { criteria: "Non-Toxic Food-Safe Materials", weight: 5, concept1: "+ (Score: +5)", concept2: "DATUM", concept3: "++ (Score: +10)", concept4: "+ (Score: +5)", notes: "FDA-compliant acrylic sheets and food-grade PVC storage." }
        ],
        conceptDirections: [
          {
            title: "Concept 1: Triangular Servo Sweep & Dual Canister (Selected)",
            description: "Features dual calibrated vertical storage canisters with precision-cut triangular acrylic sweep plates actuated by Tower Pro SG-90 micro servos, delivering pills down an angled collection funnel into an ergonomic tray.",
            badge: "Selected Design (+33)",
            image: "/projects/pill-dispenser/Concept 1.jpg"
          },
          {
            title: "Concept 2: Indexing Rotary Carousel Disc (Datum)",
            description: "A revolving multi-pocket carousel disc that indexes under stationary vertical tubes. While functional, it introduced higher mechanical complexity and friction points.",
            badge: "Datum Concept",
            image: "/projects/pill-dispenser/Concept 2.jpg"
          },
          {
            title: "Concept 3: Linear Solenoid Push Plunger",
            description: "Direct linear plunger actuation to push individual pills horizontally. Required excessive solenoid holding power and caused occasional capsule shearing.",
            badge: "Concept 3 (+16)",
            image: "/projects/pill-dispenser/Concept 3.jpg"
          },
          {
            title: "Concept 4: 90° Angular Rocker Chute",
            description: "Pivoting gravity rocker mechanism designed for rapid ejection. Discarded due to lack of dosage control when handling pills of varying diameters.",
            badge: "Concept 4 (+10)",
            image: "/projects/pill-dispenser/Concept 4.jpg"
          }
        ],
        subsystems: [
          {
            title: "Medicine Dispensing Subsystem",
            category: "Mechanical & Actuation",
            description: "Houses the dual vertical acrylic storage columns, laser-cut triangular sweep plates, collection funnel, and Tower Pro SG-90 servo drives.",
            parts: [
              { name: "Storage Canisters", spec: "Clear PVC/Acrylic Cylinders, H=11.68cm, R=2.54cm, Thickness=3.68mm", image: "/projects/pill-dispenser/image (4).png" },
              { name: "Dispensing Sweep Plate", spec: "Triangular Sector Plate, Radius=6.29cm, Volume=23.48cm³", image: "/projects/pill-dispenser/image (17).png" },
              { name: "Tower Pro SG-90 Servos", spec: "Operating Torque: 1.8 kg-cm (18 N-cm), 6.6V, 650mA", image: "/projects/pill-dispenser/image (5).png" },
              { name: "Collection Funnel & Tray", spec: "Angled Food-Grade Polymeric Chute to Front Ergonomic Tray", image: "/projects/pill-dispenser/image (7).png" }
            ],
            circuitImage: "/projects/pill-dispenser/Screenshot 2021-08-01 at 8.00.27 PM.png",
            flowChartImage: "/projects/pill-dispenser/Screenshot 2021-07-12 at 8.15.24 PM.png"
          },
          {
            title: "Sensor & Verification Subsystem",
            category: "Optoelectronics",
            description: "Integrates active IR proximity sensors aligned with the dispensing drop path to optically verify pill release and signal canister empty states.",
            parts: [
              { name: "Active IR Proximity Sensor", spec: "5V Operating Voltage, 5mA Current, Adjustable Trim Potentiometer", image: "/projects/pill-dispenser/image (3).png" },
              { name: "IR Sensor Support Bracket", spec: "Precision-angled Acrylic Mounting Bracket", image: "/projects/pill-dispenser/image (19).png" },
              { name: "Diagnostic Status LEDs", spec: "5mm Ultra-Bright Green/Red Status Indicators", image: "/projects/pill-dispenser/image (8).png" }
            ],
            circuitImage: "/projects/pill-dispenser/Screenshot 2021-07-11 at 7.42.49 PM.png",
            flowChartImage: "/projects/pill-dispenser/Screenshot 2021-07-12 at 8.33.09 PM.png"
          },
          {
            title: "Notification & Interface Subsystem",
            category: "Embedded UI",
            description: "Features the 16×2 alphanumeric LCD display and active piezo buzzer driven by Arduino logic to show real-time prescription schedules.",
            parts: [
              { name: "16×2 Alphanumeric LCD", spec: "HD44780 Parallel/I2C Interface, 5V, 200mA Backlit Display", image: "/projects/pill-dispenser/image (9).png" },
              { name: "Active Piezo Buzzer", spec: "5V Active Buzzer Module, 85dB Acoustic Alarm", image: "/projects/pill-dispenser/image (8).png" },
              { name: "Arduino Microcontroller", spec: "Arduino Mega 2560 / Uno R3 Microcontroller Board", image: "/projects/pill-dispenser/image (6).png" }
            ],
            circuitImage: "/projects/pill-dispenser/Screenshot 2021-08-01 at 8.05.54 PM.png",
            flowChartImage: "/projects/pill-dispenser/Screenshot 2021-07-12 at 8.28.45 PM.png"
          },
          {
            title: "Casing & Structural Subsystem",
            category: "Structural Mechanics",
            description: "The structural skeleton constructed from 10mm optical acrylic, 5mm high-density foam panels, steel L-clamps, and a top refilling lid.",
            parts: [
              { name: "Base and Wall Assembly", spec: "10mm Precision Cut Base (31.82cm × 18.54cm) with L-Brackets", image: "/projects/pill-dispenser/image (15).png" },
              { name: "Outer Casing Shell", spec: "5mm Transparent Front & Side Acrylic Panels", image: "/projects/pill-dispenser/image (13).png" },
              { name: "Top Refill Lid", spec: "Hinged 5mm Top Panel (31.82cm × 18.54cm)", image: "/projects/pill-dispenser/image (14).png" },
              { name: "Steel L-Clamps & Fasteners", spec: "11× Steel L-Brackets (5.5cm, 4mm holes) + 22× M4 Bolts & Nuts", image: "/projects/pill-dispenser/image (11).png" }
            ],
            circuitImage: "/projects/pill-dispenser/Screenshot 2021-08-01 at 7.48.54 PM.png",
            flowChartImage: "/projects/pill-dispenser/Screenshot 2021-07-12 at 8.07.10 PM.png"
          }
        ],
        motorTorqueCalculations: [
          {
            title: "Dispensing Plate Volume & Mass Derivation",
            formula: "V = (2/3)·π·(r²·h) - [π·(r₁²·h₁) + π·(r₂²·h₂)] = 23.483 cm³",
            steps: [
              "Volume of triangular plate sector: V_sector = 23.483232 cm³",
              "Acrylic material density: ρ = 1.185 g/cm³",
              "Plate Mass: m = V × ρ = 23.483232 × 1.185 = 27.826 g = 0.027826 kg",
              "Gravitational force: F = m × g = 0.027826 × 9.8 = 0.27269 N"
            ],
            notes: "Calculated for high-density acrylic sheet at standard room temperature."
          },
          {
            title: "Operating Torque & Factor of Safety (FOS)",
            formula: "τ_design = (F × r) × FOS = (0.27269 N × 8.5395 cm) × 1.5 = 3.573 N·cm",
            steps: [
              "Plate radius from servo pivot axis: r = 8.5395 cm",
              "Base mechanical torque: τ_base = F × r = 0.27269 × 8.5395 = 2.382 N·cm",
              "Applying Factor of Safety (FOS = 1.5): τ_design = 2.382 × 1.5 = 3.573 N·cm",
              "Selected Actuator: Tower Pro SG-90 Micro Servo rated at 18.0 N·cm (1.8 kg·cm @ 4.8V)",
              "Safety Margin: Servo capacity exceeds design requirement by 503%, guaranteeing zero stall risk."
            ],
            notes: "The 5x torque overhead accounts for static friction between stacked pills and the acrylic baseplate."
          }
        ],
        powerBudget: [
          { component: "Tower Pro SG-90 Servo Motors", rating: "6.6V, 650mA", qty: 2, totalRating: "1300 mA (Peak)" },
          { component: "Active IR Proximity Sensor Array", rating: "5.0V, 5mA", qty: 1, totalRating: "5 mA" },
          { component: "Arduino Mega 2560 / Uno Controller", rating: "5.0V, 100mA", qty: 1, totalRating: "100 mA" },
          { component: "16×2 Alphanumeric LCD Display", rating: "5.0V, 200mA", qty: 1, totalRating: "200 mA" },
          { component: "Diagnostic LED Status Indicators", rating: "4.0V, 20mA", qty: 1, totalRating: "20 mA" }
        ],
        billOfMaterials: [
          { sNo: 1, partName: "Support Wall Panels", material: "Optical Acrylic Sheet", spec: "(31.82 × 8.53) cm, Thickness = 10mm", qty: 2, process: "Laser Cutting" },
          { sNo: 2, partName: "Back Enclosure Cover", material: "High-Density Foam Sheet", spec: "(29.79 × 31.82) cm, Thickness = 5mm", qty: 1, process: "Precision Cutting" },
          { sNo: 3, partName: "Side Enclosure Walls", material: "High-Density Foam Sheet", spec: "(29.79 × 18.54) cm, Thickness = 5mm", qty: 2, process: "Precision Cutting" },
          { sNo: 4, partName: "Chassis Fastener Bolts", material: "Grade 304 Stainless Steel", spec: "M4 Diameter, L = 16mm", qty: 22, process: "Standard Fastener" },
          { sNo: 5, partName: "Chassis Fastener Nuts", material: "Grade 304 Stainless Steel", spec: "M4 Diameter, Thickness = 3mm", qty: 22, process: "Standard Fastener" },
          { sNo: 6, partName: "Structural L-Clamps", material: "Cold-Rolled Steel", spec: "L = 5.5cm, Hole Ø = 4mm, Thickness = 1.5mm", qty: 11, process: "Formed Stamping" },
          { sNo: 7, partName: "Arduino Uno / Mega 2560", material: "FR4 PCB", spec: "5V Operating Voltage, 7-12V Input", qty: 1, process: "Microcontroller" },
          { sNo: 8, partName: "IR Proximity Sensor Module", material: "Photodiode / IR LED", spec: "5V Supply, Active Low Comparator Output", qty: 1, process: "Sensor Module" },
          { sNo: 9, partName: "Tower Pro SG-90 Servo Motors", material: "Nylon Gear Train", spec: "Operating Torque: 1.8 kg-cm, 6.6V, 650mA", qty: 2, process: "Actuator" },
          { sNo: 10, partName: "Solderless Breadboard", material: "ABS Housing / Phosphor Bronze", spec: "7.87\" × 7.87\" Prototype Board", qty: 1, process: "Circuit Assembly" },
          { sNo: 11, partName: "Jumper Wire Harness", material: "Copper / PVC", spec: "22 AWG Male-to-Male & Male-to-Female", qty: 25, process: "Wiring" },
          { sNo: 12, partName: "Dispensing Sweep Sector", material: "Precision Acrylic Sheet", spec: "Radius = 6.29cm, Calibrated Aperture", qty: 2, process: "Laser Cutting" },
          { sNo: 13, partName: "Pill Storage Canisters", material: "Clear Food-Grade PVC / Acrylic", spec: "L = 11.68cm, Radius = 2.54cm, Thickness = 3.68mm", qty: 2, process: "Lathe / Cut" },
          { sNo: 14, partName: "Top Enclosure Roof", material: "High-Density Foam Sheet", spec: "(31.82 × 18.54) cm, Thickness = 5mm", qty: 1, process: "Precision Cutting" },
          { sNo: 15, partName: "Diagnostic Status LED", material: "Semiconductor Diode", spec: "5mm Diameter, 2.2V Forward Voltage", qty: 1, process: "Indicator" },
          { sNo: 16, partName: "16×2 Alphanumeric LCD", material: "STN Liquid Crystal", spec: "16 Characters × 2 Lines, Backlit", qty: 1, process: "Display" },
          { sNo: 17, partName: "Structural Base Plate", material: "High-Density Foam / Acrylic", spec: "(31.82 × 18.54) cm, Thickness = 10mm", qty: 1, process: "Precision Cutting" },
          { sNo: 18, partName: "Front Faceplate Panels", material: "High-Density Foam Sheet", spec: "(23.11 × 18.54) cm, Thickness = 5mm", qty: 2, process: "Precision Cutting" },
          { sNo: 19, partName: "Ergonomic Collection Tray", material: "Food-Grade ABS / Polypropylene", spec: "Smooth Contoured Concave Base", qty: 1, process: "Vacuum Form / 3D Print" }
        ],
        cadAttachmentUrl: "https://github.com/H-Division-2020-2021-Even/Repo-02/blob/main/PILLS%20AT%20FINGERTIPS.zip",
        teamMembers: [
          { name: "Ritvik S Chunamari", role: "Lead 3D CAD & Systems Design", usn: "01FE20BCS080", email: "01fe20bcs080@kletech.ac.in" },
          { name: "Rakshita C Bandi", role: "Mechatronics & Circuit Architecture", usn: "01FE20BCS076", email: "01fe20bcs076@kletech.ac.in" },
          { name: "Soumya Katagihalli", role: "UI & Problem Formulation", usn: "01FE20BCS002", email: "01fe20bcs002@kletech.ac.in" },
          { name: "Vikas B Navalgund", role: "Electronics & Motor Sizing", usn: "01FE20BEC002", email: "01fe20bec002@kletech.ac.in" }
        ]
      }
    },
    {
      title: "Mumbai Olympics 2028",
      category: "Olympic Identity & Motion Design",
      description: [
        "A comprehensive Olympic Games visual identity and motion design system proposed for Mumbai 2028, fusing India's monumental architectural heritage with contemporary athletic dynamism and bilingual typographic craftsmanship."
      ],
      logo: "/projects/mumbai-olympics-2028/mumbai-olympics-primary.png",
      image: "/projects/mumbai-olympics-2028/gateway-of-india.jpg",
      caseStudy: {
        isBrandIdentity: true,
        isOlympicIdentity: true,
        year: "2028",
        role: "Ritvik Chunamari — Lead Brand & Motion Designer",
        technologies: [
          "Adobe Illustrator",
          "After Effects",
          "Motion Graphics",
          "Olympic Brand Guidelines",
          "Bilingual Typography",
          "Vector Geometry"
        ],
        overview: "The Mumbai 2028 Olympic Games visual identity system is an ambitious civic and athletic branding initiative created for VIBR 3000: Visual Identity and Branding. Designed as an authentic celebration of India's commercial capital and premier coastal metropolis, the system translates Mumbai's 2,000-year maritime heritage, colonial gothic landmarks, and 21st-century cable-stayed infrastructure into a fluid, motion-first Olympic design language.",
        challenge: "Olympic identities face the dual imperative of expressing deep localized host-city cultural specificity while meeting the rigorous, high-contrast, scalable requirements of the International Olympic Committee (IOC). The core challenge was celebrating Mumbai's complex multiplicity—its historic stone arches, sacred spiritual domes, and cutting-edge engineering marvels—without lapsing into generic folklore or clichéd motifs, while inventing a typography that seamlessly bridges Latin and Devanagari scripts.",
        solution: "Engineered an iconic modular identity architecture built around a custom bilingual wordmark ('mumbai') that fuses Devanagari shirorekha headlines with geometric Latin letterforms. Paired with this is a dynamic landmark emblem system that rotates across distinct architectural monuments—the Gateway of India, the Bandra-Worli Sea Link, Mount Mary Basilica, and the Global Vipassana Pagoda—each energized with kinetic gradients and brought to life through full motion graphics for international broadcast.",
        historyAndContext: "Mumbai (historically Bombay / Mombai) is a vibrant archipelago city of seven islands transformed over centuries into India's financial, cultural, and entertainment capital. Positioned along the Arabian Sea, Mumbai represents the convergence of ancient trade routes, Victorian Gothic and Art Deco UNESCO World Heritage architecture, and rapid contemporary innovation. As India bids to host the Olympic Games, Mumbai offers an unparalleled stage that embodies athletic ambition, diversity, and coastal energy.",
        initialExplorations: "Initial explorations focused on dissecting the iconic Pierre de Coubertin Olympic rings, experimenting with linear interconnected configurations, CMYK/RGB spectral overlays, and textured chalk rings to capture the raw energy of Mumbai's street cricket and monsoon athletic spirit. From there, architectural silhouette sketches were developed for Mumbai's most beloved civic landmarks, eventually culminating in the integration of the Devanagari-Latin fusion wordmark.",
        auditCurrentIdentity: {
          whatWorks: [
            "Olympic Rings Equity: Instantaneous global recognition, embodying unity across the five continents and universal sportsmanship.",
            "Architectural Resonance: Mumbai's skyline features iconic silhouettes that are instantly identifiable to over a billion citizens.",
            "High-Contrast Color: Saffron, emerald, and vibrant spectral gradients provide arresting visibility across stadium supergraphics."
          ],
          whatDoesntWork: [
            "Over-Reliance on Clichés: Traditional Indian tourism graphics frequently default to paisleys, peacocks, or ornate florals that lack modern athletic precision.",
            "Script Disconnect: Latin-only Olympic marks alienate the local host population, while pure Devanagari lacks immediate global legibility.",
            "Static Graphics: Traditional static emblems fail to leverage the digital broadcast formats and social media platforms that define modern Olympic viewing."
          ]
        },
        differentiationOpportunities: [
          {
            title: "Bilingual Typographic Synthesis",
            description: "Pioneered a typographic fusion where the continuous top horizontal bar (shirorekha) and curving matras of Devanagari naturally articulate the English Latin word 'mumbai', making the host city name universally legible yet unmistakably Indian."
          },
          {
            title: "Multi-Monument Modular Emblems",
            description: "Rather than restricting the Games to a single rigid icon, the identity features a modular family of emblems spotlighting the Gateway of India, Bandra-Worli Sea Link, Mount Mary Basilica, and Vipassana Pagoda across different sport categories."
          },
          {
            title: "Motion-First Kinetic Identity",
            description: "Developed native After Effects motion graphics where the architectural vectors draw themselves on with neon luminescence and kinetic elasticity, engineered for 4K broadcast slates and digital stadium ribbons."
          },
          {
            title: "Indian Tricolor Meets Olympic Spectrum",
            description: "Integrated India's national saffron, white, and green with the Olympic color palette, producing gradients that evoke Arabian Sea sunsets, coastal neon reflections, and festive vitality."
          }
        ],
        avoidances: [
          "Avoided generic tourism tropes such as decorative paisleys, royal crowns, or kitsch folklore.",
          "Avoided static, flat color applications that lose impact on stadium LED screens and broadcast bumpers.",
          "Avoided separating Hindi and English into awkward parallel labels; instead unified both scripts into a singular mark.",
          "Avoided modifying the sacred proportions or color rules of the official Olympic rings."
        ],
        brandAttributes: [
          {
            title: "1. Kinetic Velocity",
            rationale: "Mumbai is a city that never stops; the identity captures that relentless athletic momentum through sweeping lines and cable-stayed bridge geometry.",
            visualExpression: "Dynamic angled strokes, aerodynamic bridge pylons, and animated light trails."
          },
          {
            title: "2. Monumental Heritage",
            rationale: "Celebrating the historic architectural fabric that anchors Mumbai's civic identity at the water's edge.",
            visualExpression: "Clean vector silhouettes of the Gateway of India and historic gothic arches."
          },
          {
            title: "3. Spiritual Equilibrium",
            rationale: "Olympic competition demands inner stillness and mental resilience alongside physical power.",
            visualExpression: "Sacred geometric contours derived from the Global Vipassana Pagoda and Mount Mary Basilica."
          },
          {
            title: "4. Coastal Radiance",
            rationale: "Mumbai's maritime setting and luminous skyline reflections over the Arabian Sea.",
            visualExpression: "Spectral neon gradients transitioning from saffron-gold into cyan and marine azure."
          },
          {
            title: "5. Universal Unity",
            rationale: "The core Olympic ideal of bringing diverse nations, languages, and cultures together under one banner.",
            visualExpression: "Harmonious integration of the five Olympic rings with bilingual typography."
          }
        ],
        conceptDirections: [
          {
            title: "Direction A — Gateway of India",
            badge: "MONUMENTAL TRIUMPH",
            description: "The monumental ceremonial arch at Mumbai Harbour rendered in a radiant spectral gradient, symbolizing international welcome, historic triumph, and open maritime horizons.",
            image: "/projects/mumbai-olympics-2028/gateway-of-india.jpg"
          },
          {
            title: "Direction B — Bandra-Worli Sea Link (Tricolor)",
            badge: "VELOCITY & PROGRESS",
            description: "Mumbai's iconic cable-stayed bridge cast in India's national tricolor (saffron, white, green), celebrating engineering progress, athletic speed, and modern connectivity.",
            image: "/projects/mumbai-olympics-2028/sea-link-tricolor.jpg"
          },
          {
            title: "Direction C — Mount Mary Basilica",
            badge: "SACRED LEGACY",
            description: "Historic gothic contours and dome silhouette in warm saffron-gold, honoring Mumbai's centuries of cultural pluralism, devotion, and community convergence.",
            image: "/projects/mumbai-olympics-2028/mount-mary-basilica.jpg"
          },
          {
            title: "Direction D — Global Vipassana Pagoda",
            badge: "HARMONY & BALANCE",
            description: "The monumental stone pagoda dome illuminated in neon cyan-lime luminescence, evoking mental focus, mindfulness, and the peaceful harmony of the Olympic Truce.",
            image: "/projects/mumbai-olympics-2028/vipassana-pagoda.jpg"
          },
          {
            title: "Direction E — Luminous Sea Link",
            badge: "NIGHT SKYLINE",
            description: "The Bandra-Worli Sea Link enveloped in a warm luminous aura, capturing the night-time stadium atmosphere and cinematic broadcast energy.",
            image: "/projects/mumbai-olympics-2028/sea-link-luminous.jpg"
          }
        ],
        refinementRationale: "During refinement, the Devanagari-Latin fusion wordmark was perfected by aligning the continuous horizontal shirorekha across 'm', 'u', 'm', 'b', 'a', and 'i', ensuring character heights match standard optical x-height while preserving authentic Indic calligraphic terminal curves. The landmark emblems were calibrated to match the exact optical stroke weight of the Olympic rings, and an After Effects kinetic animation was authored to establish the motion branding for broadcast stings and digital scoreboards.",
        refinementDiagram: "/projects/mumbai-olympics-2028/olympic-rings.png",
        refinementImage: "/projects/mumbai-olympics-2028/mumbai-olympics-primary.png",
        styleguide: {
          clearSpace: "Clear space 'X' equals the diameter of one Olympic ring, applied uniformly on all four sides of the emblem lockup.",
          minSizeDigital: "24px width for standalone emblem; 48px width for full lockup with Olympic rings.",
          minSizePrint: "12mm width for print reproduction.",
          clearSpaceDiagram: "/projects/mumbai-olympics-2028/olympic-rings.png",
          primaryTypeface: {
            name: "Mumbai Olympic Custom Script",
            weight: "Bilingual Fusion (Devanagari + Latin)",
            sample: "mumbai 2028 OLYMPICS"
          },
          secondaryTypeface: {
            name: "DIN 2014 & Futura Bold",
            weight: "Bold & Medium All-Caps",
            sample: "2028 OLYMPICS • ATHLETICS • AQUATICS • GYMNASTICS"
          },
          colorPalette: [
            {
              name: "Saffron Radiance",
              hex: "#FF9933",
              type: "Primary Accent",
              rgb: "255, 153, 51",
              cmyk: "0, 48, 85, 0"
            },
            {
              name: "Tricolor Emerald",
              hex: "#138808",
              type: "Primary Accent",
              rgb: "19, 136, 8",
              cmyk: "86, 0, 94, 47"
            },
            {
              name: "Midnight Obsidian",
              hex: "#0A0A0E",
              type: "Primary Background",
              rgb: "10, 10, 14",
              cmyk: "29, 29, 0, 95"
            },
            {
              name: "Arabian Sea Cyan",
              hex: "#00E5FF",
              type: "Spectral Accent",
              rgb: "0, 229, 255",
              cmyk: "60, 0, 5, 0"
            },
            {
              name: "Electric Magenta",
              hex: "#FF007F",
              type: "Broadcast Neon",
              rgb: "255, 0, 127",
              cmyk: "0, 95, 20, 0"
            },
            {
              name: "Olympic Gold",
              hex: "#FCB131",
              type: "Medal Tone",
              rgb: "252, 177, 49",
              cmyk: "0, 34, 91, 0"
            }
          ],
          primaryColors: [
            {
              name: "Saffron Radiance",
              hex: "#FF9933",
              type: "Primary Accent",
              rgb: "255, 153, 51",
              cmyk: "0, 48, 85, 0"
            },
            {
              name: "Tricolor Emerald",
              hex: "#138808",
              type: "Primary Accent",
              rgb: "19, 136, 8",
              cmyk: "86, 0, 94, 47"
            },
            {
              name: "Midnight Obsidian",
              hex: "#0A0A0E",
              type: "Primary Background",
              rgb: "10, 10, 14",
              cmyk: "29, 29, 0, 95"
            }
          ],
          secondaryColors: [
            {
              name: "Arabian Sea Cyan",
              hex: "#00E5FF",
              type: "Spectral Accent",
              rgb: "0, 229, 255"
            },
            {
              name: "Electric Magenta",
              hex: "#FF007F",
              type: "Broadcast Neon",
              rgb: "255, 0, 127"
            },
            {
              name: "Olympic Gold",
              hex: "#FCB131",
              type: "Medal Tone",
              rgb: "252, 177, 49"
            }
          ]
        },
        lockups: [
          {
            title: "Primary Gateway of India Master Lockup",
            subtitle: "Architectural Silhouette + Custom Wordmark + Olympic Rings",
            image: "/projects/mumbai-olympics-2028/gateway-of-india.jpg",
            tag: "Flagship Mark",
            variant: "reverse-black",
            description: "The primary vertical lockup for the Mumbai 2028 Olympic Games, pairing the iconic Gateway arch with the Devanagari-Latin fusion wordmark."
          },
          {
            title: "Bandra-Worli Sea Link Tricolor Lockup",
            subtitle: "Engineering Icon + National Palette + Olympic Rings",
            image: "/projects/mumbai-olympics-2028/sea-link-tricolor.jpg",
            tag: "Infrastructure Lockup",
            variant: "reverse-black",
            description: "Applied across sports involving speed, cycling, marathon routes, and marine events across Mumbai's coastal highways."
          },
          {
            title: "Mount Mary Heritage Lockup",
            subtitle: "Gothic Landmark + Saffron Gradient + Olympic Rings",
            image: "/projects/mumbai-olympics-2028/mount-mary-basilica.jpg",
            tag: "Cultural Heritage",
            variant: "reverse-black",
            description: "Dedicated to cultural ceremonies, opening procession collateral, and historic venue signage."
          },
          {
            title: "Global Vipassana Pagoda Lockup",
            subtitle: "Sacred Dome + Neon Aura + Olympic Rings",
            image: "/projects/mumbai-olympics-2028/vipassana-pagoda.jpg",
            tag: "Mindfulness & Harmony",
            variant: "reverse-black",
            description: "Utilized for Olympic village wellness spaces, meditation pavilions, and international truce campaigns."
          }
        ],
        mockups: [
          {
            title: "Full Motion Broadcast Sting & Animated Logo",
            category: "Motion Identity",
            image: "/projects/mumbai-olympics-2028/mumbai-olympics-primary.png",
            videoUrl: "/projects/mumbai-olympics-2028/mumbai-animated-logo.mp4",
            description: "Kinetic vector animation featuring neon light trails, building silhouette reveal, and dynamic Olympic ring assembly for global broadcast."
          },
          {
            title: "Gateway of India Spectral Stadium Banner",
            category: "Environmental Graphics",
            image: "/projects/mumbai-olympics-2028/gateway-of-india.jpg",
            description: "Large-format stadium pylon supergraphic deployed across the Mumbai Olympic Park and Marine Drive promenades."
          },
          {
            title: "Bandra-Worli Sea Link Coastal Billboard",
            category: "Out-of-Home Media",
            image: "/projects/mumbai-olympics-2028/sea-link-tricolor.jpg",
            description: "High-impact roadside advertising welcoming athletes and international spectators entering Mumbai from the airport corridor."
          }
        ],
        gallery: [
          {
            title: "Gateway of India Emblem",
            category: "Brand Identity",
            image: "/projects/mumbai-olympics-2028/gateway-of-india.jpg",
            aspect: "square"
          },
          {
            title: "Bandra-Worli Sea Link (Tricolor)",
            category: "Brand Identity",
            image: "/projects/mumbai-olympics-2028/sea-link-tricolor.jpg",
            aspect: "square"
          },
          {
            title: "Mount Mary Basilica",
            category: "Brand Identity",
            image: "/projects/mumbai-olympics-2028/mount-mary-basilica.jpg",
            aspect: "square"
          },
          {
            title: "Global Vipassana Pagoda",
            category: "Brand Identity",
            image: "/projects/mumbai-olympics-2028/vipassana-pagoda.jpg",
            aspect: "square"
          },
          {
            title: "Luminous Night Sea Link",
            category: "Brand Identity",
            image: "/projects/mumbai-olympics-2028/sea-link-luminous.jpg",
            aspect: "square"
          },
          {
            title: "Official Olympic Rings Specification",
            category: "Olympic Geometry",
            image: "/projects/mumbai-olympics-2028/olympic-rings.png",
            aspect: "wide"
          }
        ]
      }
    }
  ],
  skills: [
    {
      category: "Design Tools",
      skills: "Figma, Adobe Illustrator, Adobe Photoshop, Google Antigravity, Autodesk Inventor, Adobe XD"
    },
    {
      category: "Methodologies",
      skills: "Agile, Design Thinking, User-Centered Design, Atomic Design, Design Systems"
    },
    {
      category: "Soft Skills",
      skills: "Adaptive Decision-Making, Design Empathy & User Advocacy, Creative Innovation under Constraints"
    }
  ],
  certifications: [
    "Accenture Digital Skills: User Experience",
    "IIT Madras: Cyber Security and Privacy",
    "Google: Foundations of User Experience Design",
    "Google: Start the UX Design Process: Empathize, Define, and Ideate",
    "Google: Build Wireframes and Low-Fidelity Prototypes"
  ]
};