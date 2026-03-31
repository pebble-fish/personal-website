import { useEffect, useState } from "react";

const cvSections = [
  {
    title: "Education",
    entries: [
      {
        heading: "School Name Placeholder",
        meta: "City, State",
        subheading: "Degree, major, concentration, or honors placeholder",
        detail:
          "Relevant coursework, thesis, certifications, GPA, or academic notes placeholder.",
      },
    ],
  },
  {
    title: "Skills",
    entries: [
      {
        heading: "Technical Tools",
        subheading:
          "Tool placeholder, tool placeholder, tool placeholder, tool placeholder",
        detail:
          "Languages placeholder, frameworks placeholder, platforms placeholder.",
      },
      {
        heading: "Additional Skills",
        subheading:
          "Communication placeholder, research placeholder, writing placeholder",
      },
    ],
  },
  {
    title: "Professional Experience",
    entries: [
      {
        heading: "Role Title Placeholder",
        meta: "City, State",
        subheading: "Company or Organization Placeholder",
        detail: "Month Year - Present",
        bullets: [
          "Responsibility or impact statement placeholder.",
          "Technical contribution, research contribution, or leadership detail placeholder.",
          "Result, metric, or collaboration detail placeholder.",
        ],
      },
      {
        heading: "Second Role Placeholder",
        meta: "City, State",
        subheading: "Company or Organization Placeholder",
        detail: "Month Year - Month Year",
        bullets: [
          "Responsibility or impact statement placeholder.",
          "Teamwork, execution, or ownership detail placeholder.",
        ],
      },
    ],
  },
  {
    title: "Projects",
    entries: [
      {
        heading: "Project Title Placeholder",
        meta: "Season Year",
        bullets: [
          "One-line project description placeholder.",
          "Tech stack, model, or implementation detail placeholder.",
        ],
      },
      {
        heading: "Second Project Placeholder",
        meta: "Season Year",
        bullets: [
          "One-line project description placeholder.",
          "Outcome, audience, or scope detail placeholder.",
        ],
      },
    ],
  },
  {
    title: "Programs",
    entries: [
      {
        heading: "Program Name Placeholder",
        meta: "Month Year",
        subheading: "Host, city, or organization placeholder",
      },
      {
        heading: "Program Name Placeholder",
        meta: "Month Year",
        subheading: "Host, city, or organization placeholder",
      },
    ],
  },
  {
    title: "Awards",
    entries: [
      {
        heading: "Award Title Placeholder",
        meta: "Year",
      },
      {
        heading: "Award Title Placeholder",
        meta: "Year",
      },
      {
        heading: "Award Title Placeholder",
        meta: "Year",
      },
    ],
  },
];

const contributionLevels = [
  0, 1, 2, 0, 3, 1, 0, 2, 4, 1, 0, 3, 2, 1, 0, 2, 3, 4, 1, 0, 2, 1, 3, 0, 4,
  2, 1, 0, 3, 2, 1, 4, 0, 2, 1, 3, 0, 4, 2, 1, 0, 3, 2, 1, 4, 0, 2, 1, 3, 0,
  4, 2, 1, 0, 2, 3, 1, 4, 0, 1, 2, 3, 0, 4, 1, 2, 3, 0, 1, 4, 2, 3, 1, 0, 2,
  4, 1, 3, 0, 2, 1, 4, 3,
];

const projectGroups = [
  {
    title: "Current Projects",
    items: [
      {
        name: "Current Project Placeholder",
        status: "In Progress",
        description:
          "Use this slot for the thing you are actively building right now.",
      },
      {
        name: "Second Current Project",
        status: "Iterating",
        description:
          "Add a short summary, what stage it is in, and what you are focused on next.",
      },
    ],
  },
  {
    title: "Favorite Projects",
    items: [
      {
        name: "Favorite Project Placeholder",
        status: "Featured",
        description:
          "Highlight something you are especially proud of and why it matters to you.",
      },
      {
        name: "Another Favorite",
        status: "Featured",
        description:
          "Good spot for a project with strong visuals, impact, or a fun technical story.",
      },
    ],
  },
  {
    title: "Other Projects",
    items: [
      {
        name: "Project Archive Placeholder",
        status: "Past Work",
        description:
          "Use this section for experiments, class work, prototypes, or smaller builds.",
      },
      {
        name: "Additional Project",
        status: "Past Work",
        description:
          "You can keep this category broad so the main featured work stays focused above.",
      },
    ],
  },
];

const pages = {
  home: {
    key: "home",
    label: "Home",
    eyebrow: "Personal Website Framework",
    title: "Clean, simple, and ready for your content.",
    body:
      "Replace the placeholder name, personalize each page, and you will have a polished website structure that feels easy to expand.",
    accent:
      "This homepage is now its own view, separate from the other pages in the navigation.",
  },
  about: {
    key: "about",
    label: "About Me",
    eyebrow: "About Me",
    title: "Tell people who you are.",
    body:
      "Use this page for your introduction, background, interests, and the kind of work or ideas you care about most.",
    accent:
      "A short personal statement, a headshot, or a few favorite facts would fit nicely here.",
  },
  cv: {
    key: "cv",
    label: "CV",
    eyebrow: "CV",
    title: "Highlight your experience clearly.",
    body:
      "This page is a good place for your education, roles, awards, skills, and a link to a downloadable resume.",
    accent:
      "You can also break it into sections like Experience, Education, Skills, and Publications later on.",
  },
  projects: {
    key: "projects",
    label: "Projects",
    eyebrow: "Projects",
    title: "Show what you have built.",
    body:
      "Feature selected projects, case studies, experiments, or anything you want visitors to explore in more detail.",
    accent:
      "Each project can eventually become its own card, image block, or linked detail page.",
  },
  contact: {
    key: "contact",
    label: "Contact Me",
    eyebrow: "Contact Me",
    title: "Make it easy for people to reach you.",
    body:
      "Add your email, social links, booking link, or a small contact form so visitors know the best way to connect.",
    accent:
      "This page works well with a simple call to action and just one or two clear contact options.",
  },
};

const navItems = [
  { label: "About Me", hash: "#about", page: "about" },
  { label: "CV", hash: "#cv", page: "cv" },
  { label: "Projects", hash: "#projects", page: "projects" },
  { label: "Contact Me", hash: "#contact", page: "contact" },
];

function getPageFromHash(hash) {
  const normalizedHash = hash.replace("#", "");

  if (normalizedHash in pages) {
    return normalizedHash;
  }

  return "home";
}

function CvPage() {
  return (
    <section className="resume-sheet" aria-label="Curriculum vitae">
      <header className="resume-header">
        <h1>YOUR NAME</h1>
        <p className="resume-subhead">
          phone placeholder | email placeholder | city, state placeholder
        </p>
      </header>

      <div className="resume-main">
        {cvSections.map((section) => (
          <section key={section.title} className="resume-section">
            <div className="resume-section-header">
              <h2>{section.title}</h2>
            </div>

            <div className="resume-section-body">
              {section.entries.map((entry) => (
                <article
                  key={`${section.title}-${entry.heading}-${entry.meta ?? ""}`}
                  className="resume-entry"
                >
                  <div className="resume-entry-top">
                    <h3>{entry.heading}</h3>
                    {entry.meta ? <p className="resume-meta">{entry.meta}</p> : null}
                  </div>

                  {entry.subheading ? (
                    <p className="resume-subheading">{entry.subheading}</p>
                  ) : null}

                  {entry.detail ? <p className="resume-detail">{entry.detail}</p> : null}

                  {entry.bullets ? (
                    <ul className="resume-bullets">
                      {entry.bullets.map((bullet) => (
                        <li key={bullet}>{bullet}</li>
                      ))}
                    </ul>
                  ) : null}
                </article>
              ))}
            </div>
          </section>
        ))}
      </div>
    </section>
  );
}

function ProjectsPage() {
  return (
    <>
      <section className="page-hero projects-hero">
        <p className="hero-kicker">Projects</p>
        <h1>Build a portfolio that feels active and organized.</h1>
        <p className="hero-copy">
          This layout starts with a GitHub-style activity panel, then separates
          your work into current projects, favorite projects, and everything
          else.
        </p>
      </section>

      <section className="projects-layout">
        <article className="github-card">
          <div className="github-card-header">
            <div>
              <p className="section-eyebrow">GitHub Activity</p>
              <h2>Contribution Snapshot</h2>
            </div>
            <p className="github-card-note">placeholder year view</p>
          </div>

          <div className="contribution-grid" aria-label="GitHub activity heatmap">
            {contributionLevels.map((level, index) => (
              <span
                key={`${level}-${index}`}
                className={`contribution-cell level-${level}`}
              />
            ))}
          </div>

          <div className="contribution-legend" aria-hidden="true">
            <span>Less</span>
            <div className="legend-scale">
              {[0, 1, 2, 3, 4].map((level) => (
                <span key={level} className={`contribution-cell level-${level}`} />
              ))}
            </div>
            <span>More</span>
          </div>
        </article>

        <div className="project-groups">
          {projectGroups.map((group) => (
            <section key={group.title} className="project-group">
              <div className="project-group-header">
                <p className="section-eyebrow">{group.title}</p>
                <div className="project-divider" />
              </div>

              <div className="project-card-grid">
                {group.items.map((project) => (
                  <article key={project.name} className="project-card">
                    <div className="project-card-top">
                      <h3>{project.name}</h3>
                      <span className="project-pill">{project.status}</span>
                    </div>
                    <p>{project.description}</p>
                  </article>
                ))}
              </div>
            </section>
          ))}
        </div>
      </section>
    </>
  );
}

function App() {
  const [currentPage, setCurrentPage] = useState(() =>
    getPageFromHash(window.location.hash),
  );

  useEffect(() => {
    const handleHashChange = () => {
      setCurrentPage(getPageFromHash(window.location.hash));
      window.scrollTo({ top: 0, behavior: "smooth" });
    };

    window.addEventListener("hashchange", handleHashChange);

    return () => {
      window.removeEventListener("hashchange", handleHashChange);
    };
  }, []);

  const page = pages[currentPage];

  return (
    <div className="site-shell">
      <header className="topbar">
        <a
          className={`brand ${currentPage === "home" ? "is-active" : ""}`}
          href="#home"
          aria-label="Homepage"
        >
          YOUR NAME
        </a>

        <nav className="nav" aria-label="Primary">
          {navItems.map((item) => (
            <a
              key={item.page}
              className={`nav-link ${currentPage === item.page ? "is-active" : ""}`}
              href={item.hash}
            >
              {item.label}
            </a>
          ))}
        </nav>
      </header>

      <main className="content">
        {currentPage === "cv" ? (
          <CvPage />
        ) : currentPage === "projects" ? (
          <ProjectsPage />
        ) : (
          <>
            <section className="page-hero">
              <p className="hero-kicker">{page.eyebrow}</p>
              <h1>{page.title}</h1>
              <p className="hero-copy">{page.body}</p>
            </section>

            <section className="page-panel">
              <p className="section-eyebrow">{page.label}</p>
              <div className="page-grid">
                <div className="content-card">
                  <h2>Page Overview</h2>
                  <p>{page.accent}</p>
                </div>

                <div className="content-card">
                  <h2>Next Step</h2>
                  <p>
                    Swap this placeholder copy with your real content and
                    expand the layout however you want.
                  </p>
                </div>
              </div>
            </section>
          </>
        )}
      </main>
    </div>
  );
}

export default App;
