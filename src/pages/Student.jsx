import { useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Bookmark,
  Plus,
  Trash2,
  Check,
  CalendarDays,
  Brain,
  GraduationCap,
  BookOpen,
} from "lucide-react";

import {
  careers,
  scholarships,
  resources,
  interests,
} from "../data/data";

import {
  careerService,
  scholarshipService,
  profileService,
  deadlineService,
  studyService,
  appData,
} from "../services/services";

import { get, set } from "../utils/storage";

import {
  Card,
  Button,
  Badge,
  Progress,
  Field,
  Modal,
  Search,
  Empty,
} from "../components/UI";

import Chat from "../components/Chat";

/* =========================================================
   DASHBOARD
========================================================= */

export function Dashboard() {
  const profile = profileService.get();

  const recommendedCareers = careerService
    .all()
    .filter(
      (career) =>
        profile.interests?.includes(career.category) ||
        career.skills.some((skill) => profile.skills?.includes(skill))
    )
    .slice(0, 4);

  const deadlines = deadlineService.all();

  return (
    <div>
      <Head
        title={`Good evening, ${profile.name || "there"} 👋`}
        text="Here’s a quick view of what deserves your attention today."
      />

      <Card>
        <div className="between">
          <b>Profile Completion</b>
          <strong>80%</strong>
        </div>

        <Progress value={80} />

        <small>
          Complete your profile to improve matching.
        </small>
      </Card>

      <div className="quick">
        <Link to="/student/ai">
          <span>
            <Brain />
          </span>
          <b>Ask AI</b>
          <ArrowRight size={15} />
        </Link>

        <Link to="/student/careers">
          <span>
            <GraduationCap />
          </span>
          <b>Explore Careers</b>
          <ArrowRight size={15} />
        </Link>

        <Link to="/student/scholarships">
          <span>💰</span>
          <b>Find Scholarships</b>
          <ArrowRight size={15} />
        </Link>

        <Link to="/student/study">
          <span>
            <BookOpen />
          </span>
          <b>Study Plan</b>
          <ArrowRight size={15} />
        </Link>

        <Link to="/student/deadlines">
          <span>
            <CalendarDays />
          </span>
          <b>Deadlines</b>
          <ArrowRight size={15} />
        </Link>
      </div>

      <div className="two">
        <div>
          <h2>Recommended Careers</h2>

          {recommendedCareers.length === 0 ? (
            <Empty
              title="No recommendations yet"
              text="Complete your interests and skills in your profile."
            />
          ) : (
            recommendedCareers.map((career) => (
              <Link
                className="row"
                to={`/student/careers/${career.id}`}
                key={career.id}
              >
                <span>{career.icon}</span>

                <div>
                  <b>{career.name}</b>

                  <small>
                    {career.skills.slice(0, 3).join(" • ")}
                  </small>
                </div>

                <ArrowRight size={15} />
              </Link>
            ))
          )}
        </div>

        <div>
          <h2>Upcoming Deadlines</h2>

          {deadlines.length === 0 ? (
            <Empty
              title="No deadlines"
              text="You don't have any upcoming deadlines."
            />
          ) : (
            deadlines.slice(0, 4).map((deadline) => (
              <div className="row" key={deadline.id}>
                <span>📅</span>

                <div>
                  <b>{deadline.title}</b>

                  <small>
                    {deadline.date} • {deadline.priority}
                  </small>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   CAREERS
========================================================= */

export function Careers() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");

  const careerList = careerService.all();

  const filteredCareers = careerList.filter((career) => {
    const matchesCategory =
      category === "All" || career.category === category;

    const searchableText = `
      ${career.name}
      ${career.description}
      ${career.skills?.join(" ")}
    `.toLowerCase();

    const matchesSearch = searchableText.includes(
      query.toLowerCase()
    );

    return matchesCategory && matchesSearch;
  });

  const categories = [
    ...new Set(careerList.map((career) => career.category)),
  ];

  return (
    <div>
      <Head
        title="Career Explorer"
        text="Discover career paths based on interests and skills."
      />

      <div className="toolbar">
        <Search
          value={query}
          onChange={setQuery}
          placeholder="Search careers or skills..."
        />

        <select
          value={category}
          onChange={(event) =>
            setCategory(event.target.value)
          }
        >
          <option value="All">All</option>

          {categories.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
      </div>

      {filteredCareers.length === 0 ? (
        <Empty
          title="No careers found"
          text="Try another career name, skill or category."
        />
      ) : (
        <div className="cards3">
          {filteredCareers.map((career) => (
            <Card key={career.id}>
              <span className="emoji">
                {career.icon}
              </span>

              <Badge>{career.category}</Badge>

              <h3>{career.name}</h3>

              <p>{career.description}</p>

              <div className="chips small">
                {career.skills?.map((skill) => (
                  <span key={skill}>{skill}</span>
                ))}
              </div>

              <Link
                className="link"
                to={`/student/careers/${career.id}`}
              >
                Explore Career <ArrowRight size={15} />
              </Link>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

/* =========================================================
   CAREER DETAIL
========================================================= */

export function CareerDetail() {
  const { id } = useParams();

  const career = careerService.one(id);

  if (!career) {
    return (
      <Empty
        title="Career not found"
        text="Return to the career explorer."
      />
    );
  }

  return (
    <div>
      <Link
        to="/student/careers"
        className="back"
      >
        ← Back
      </Link>

      <div className="detail">
        <div>
          <span className="emoji big">
            {career.icon}
          </span>

          <Badge>{career.category}</Badge>

          <h1>{career.name}</h1>

          <p>{career.description}</p>

          <Link
            className="btn primary"
            to={`/student/roadmaps/${career.id}`}
          >
            Start Roadmap
            <ArrowRight size={16} />
          </Link>
        </div>

        <Card>
          <b>Entry roles</b>

          <p>Junior Engineer</p>
          <p>Analyst</p>
          <p>Intern / Trainee</p>
        </Card>
      </div>

      <div className="two">
        <Card>
          <h2>Required Skills</h2>

          <div className="chips small">
            {career.skills?.map((skill) => (
              <span key={skill}>{skill}</span>
            ))}
          </div>

          <h2>What professionals do</h2>

          <p>
            Use these skills and tools to solve practical
            problems, collaborate with teams and build a
            portfolio of evidence.
          </p>
        </Card>

        <Card>
          <h2>Learning & Portfolio</h2>

          <p>
            Start with fundamentals, practise consistently,
            build a small end-to-end project and document
            your results.
          </p>
        </Card>
      </div>
    </div>
  );
}

/* =========================================================
   ROADMAP
========================================================= */

export function Roadmap() {
  const { id } = useParams();

  const career = careerService.one(id);

  const [refresh, setRefresh] = useState(0);

  if (!career) {
    return (
      <Empty
        title="Career not found"
        text="Return to the career explorer."
      />
    );
  }

  const completedSteps = get(`roadmap_${id}`, {});

  const toggleStep = (index) => {
    const updated = {
      ...completedSteps,
      [index]: !completedSteps[index],
    };

    set(`roadmap_${id}`, updated);

    setRefresh((value) => value + 1);
  };

  const completedCount = Object.values(
    completedSteps
  ).filter(Boolean).length;

  const percentage =
    career.roadmap?.length > 0
      ? Math.round(
          (completedCount / career.roadmap.length) * 100
        )
      : 0;

  return (
    <div>
      <Link
        to={`/student/careers/${id}`}
        className="back"
      >
        ← {career.name}
      </Link>

      <Head
        title={`${career.name} Roadmap`}
        text="Mark each stage complete and track your progress."
      />

      <Card>
        <div className="between">
          <b>Roadmap Progress</b>
          <strong>{percentage}%</strong>
        </div>

        <Progress value={percentage} />

        <div className="roadmap">
          {career.roadmap?.map((step, index) => (
            <div
              className={
                completedSteps[index]
                  ? "rstep done"
                  : "rstep"
              }
              key={`${step}-${index}`}
            >
              <button
                type="button"
                onClick={() => toggleStep(index)}
              >
                {completedSteps[index] ? (
                  <Check size={16} />
                ) : (
                  index + 1
                )}
              </button>

              <div>
                <b>{step}</b>

                <small>
                  Stage {index + 1} • Click the circle to
                  complete
                </small>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

/* =========================================================
   SCHOLARSHIPS
========================================================= */

export function Scholarships() {
  const [query, setQuery] = useState("");
  const [, setRefresh] = useState(0);

  const profile = profileService.get();

  const scholarshipList = scholarshipService
    .all()
    .filter((scholarship) => {
      const searchableText = `
        ${scholarship.name}
        ${scholarship.provider}
        ${scholarship.description}
      `.toLowerCase();

      return searchableText.includes(
        query.toLowerCase()
      );
    });

  const calculateMatch = (scholarship) => {
    let score = 50;

    if (
      scholarship.state === "Any" ||
      scholarship.state === profile.state
    ) {
      score += 20;
    }

    if (
      scholarship.educationLevel === "Any" ||
      scholarship.educationLevel === profile.degree ||
      scholarship.educationLevel === "Undergraduate"
    ) {
      score += 20;
    }

    if (profile.goals?.includes("Scholarship")) {
      score += 10;
    }

    return Math.min(100, score);
  };

  return (
    <div>
      <Head
        title="Scholarship Finder"
        text="Demo Scholarship Data — verify official eligibility before applying."
      />

      <div className="notice">
        ℹ️ These are demo records for the prototype, not
        verified live opportunities.
      </div>

      <Search
        value={query}
        onChange={setQuery}
        placeholder="Search scholarships..."
      />

      {scholarshipList.length === 0 ? (
        <Empty
          title="No scholarships found"
          text="Try a different search."
        />
      ) : (
        <div className="cards3">
          {scholarshipList.map((scholarship) => {
            const match =
              calculateMatch(scholarship);

            const isSaved =
              scholarshipService
                .saved()
                .includes(scholarship.id);

            return (
              <Card key={scholarship.id}>
                <div className="between">
                  <Badge tone="success">
                    {scholarship.status}
                  </Badge>

                  <button
                    type="button"
                    className="plain"
                    onClick={() => {
                      scholarshipService.toggle(
                        scholarship.id
                      );

                      setRefresh(
                        (value) => value + 1
                      );
                    }}
                  >
                    <Bookmark
                      fill={
                        isSaved
                          ? "currentColor"
                          : "none"
                      }
                    />
                  </button>
                </div>

                <h3>{scholarship.name}</h3>

                <p>{scholarship.description}</p>

                <small>
                  {scholarship.amount} • Deadline{" "}
                  {scholarship.deadline}
                </small>

                <div className="match">
                  <span>
                    Profile Match Estimate{" "}
                    <b>{match}%</b>
                  </span>

                  <Progress value={match} />
                </div>

                <Link
                  className="link"
                  to={`/student/scholarships/${scholarship.id}`}
                >
                  View details →
                </Link>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* =========================================================
   SCHOLARSHIP DETAIL
========================================================= */

export function ScholarshipDetail() {
  const { id } = useParams();

  const navigate = useNavigate();

  const scholarship =
    scholarshipService.one(id);

  if (!scholarship) {
    return (
      <Empty title="Scholarship not found" />
    );
  }

  const isSaved =
    scholarshipService.saved().includes(id);

  const addDeadline = () => {
    deadlineService.save({
      id: crypto.randomUUID(),
      title: scholarship.name,
      category: "Scholarship",
      date: scholarship.deadline,
      priority: "High",
      notes: "Verify official source.",
    });

    navigate("/student/deadlines");
  };

  const toggleSaved = () => {
    scholarshipService.toggle(id);

    window.location.reload();
  };

  return (
    <div>
      <Link
        to="/student/scholarships"
        className="back"
      >
        ← Back
      </Link>

      <div className="detail">
        <div>
          <Badge tone="success">
            {scholarship.status}
          </Badge>

          <h1>{scholarship.name}</h1>

          <p>{scholarship.description}</p>

          <div className="actions">
            <Button onClick={toggleSaved}>
              <Bookmark
                fill={
                  isSaved
                    ? "currentColor"
                    : "none"
                }
              />

              {isSaved
                ? "Saved"
                : "Save Scholarship"}
            </Button>

            <Button
              variant="soft"
              onClick={addDeadline}
            >
              <CalendarDays />
              Add Deadline
            </Button>
          </div>
        </div>

        <Card>
          <b>Profile Match Estimate</b>

          <strong className="score">
            82%
          </strong>

          <small>
            Demo matching estimate only.
          </small>
        </Card>
      </div>

      <div className="two">
        <Card>
          <h2>Eligibility</h2>

          <p>{scholarship.eligibility}</p>

          <h3>Education</h3>
          <p>{scholarship.educationLevel}</p>

          <h3>State</h3>
          <p>{scholarship.state}</p>
        </Card>

        <Card>
          <h2>Application Details</h2>

          <p>
            <b>Provider:</b>{" "}
            {scholarship.provider}
          </p>

          <p>
            <b>Deadline:</b>{" "}
            {scholarship.deadline}
          </p>

          <p>
            <b>Source:</b>{" "}
            {scholarship.source}
          </p>

          <div className="notice">
            Verify all eligibility details through
            an official source.
          </div>
        </Card>
      </div>
    </div>
  );
}

/* =========================================================
   SAVED SCHOLARSHIPS
========================================================= */

export function Saved() {
  const [, rerender] = useState(0);

  const savedScholarships =
    scholarshipService
      .all()
      .filter((scholarship) =>
        scholarshipService
          .saved()
          .includes(scholarship.id)
      );

  return (
    <div>
      <Head
        title="Saved Scholarships"
        text="Your scholarship shortlist."
      />

      {savedScholarships.length === 0 ? (
        <Empty
          title="No saved scholarships yet."
          text="Explore scholarships and save the ones that interest you."
        />
      ) : (
        <div className="cards3">
          {savedScholarships.map((scholarship) => (
            <Card key={scholarship.id}>
              <h3>{scholarship.name}</h3>

              <p>{scholarship.provider}</p>

              <div className="actions">
                <Link
                  className="btn soft"
                  to={`/student/scholarships/${scholarship.id}`}
                >
                  Open
                </Link>

                <Button
                  variant="soft"
                  onClick={() => {
                    scholarshipService.toggle(
                      scholarship.id
                    );

                    rerender(
                      (value) => value + 1
                    );
                  }}
                >
                  Remove
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

/* =========================================================
   DEADLINES
========================================================= */

export function Deadlines() {
  const [, rerender] = useState(0);

  const [open, setOpen] = useState(false);

  const [form, setForm] = useState({
    title: "",
    category: "Scholarship",
    date: "",
    priority: "Medium",
    notes: "",
  });

  const deadlines = deadlineService.all();

  const saveDeadline = () => {
    if (!form.title || !form.date) {
      return;
    }

    deadlineService.save({
      ...form,
      id: crypto.randomUUID(),
    });

    setForm({
      title: "",
      category: "Scholarship",
      date: "",
      priority: "Medium",
      notes: "",
    });

    setOpen(false);

    rerender((value) => value + 1);
  };

  return (
    <div>
      <Head
        title="Deadline Tracker"
        text="Never miss important application deadlines."
      />

      <Button onClick={() => setOpen(true)}>
        <Plus />
        Add Deadline
      </Button>

      <div className="list">
        {deadlines.length === 0 ? (
          <Empty
            title="No deadlines"
            text="Add your first deadline."
          />
        ) : (
          deadlines.map((deadline) => (
            <Card key={deadline.id}>
              <div className="between">
                <div>
                  <b>{deadline.title}</b>

                  <small>
                    {deadline.category} •{" "}
                    {deadline.date} •{" "}
                    {deadline.priority}
                  </small>
                </div>

                <button
                  type="button"
                  className="plain"
                  onClick={() => {
                    deadlineService.remove(
                      deadline.id
                    );

                    rerender(
                      (value) => value + 1
                    );
                  }}
                >
                  <Trash2 />
                </button>
              </div>
            </Card>
          ))
        )}
      </div>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Add deadline"
      >
        <Field
          label="Title"
          value={form.title}
          onChange={(event) =>
            setForm({
              ...form,
              title: event.target.value,
            })
          }
        />

        <Field
          label="Date"
          type="date"
          value={form.date}
          onChange={(event) =>
            setForm({
              ...form,
              date: event.target.value,
            })
          }
        />

        <Field
          label="Category"
          value={form.category}
          onChange={(event) =>
            setForm({
              ...form,
              category: event.target.value,
            })
          }
        />

        <Button onClick={saveDeadline}>
          Save deadline
        </Button>
      </Modal>
    </div>
  );
}

/* =========================================================
   STUDY PLANNER
========================================================= */

export function Study() {
  const [, rerender] = useState(0);

  const studyGoals = studyService.goals();

  const [form, setForm] = useState({
    name: "",
    subject: "",
    deadline: "",
    priority: "Medium",
  });

  const addGoal = () => {
    if (!form.name) {
      return;
    }

    studyService.save({
      ...form,
      id: crypto.randomUUID(),
      progress: 0,
    });

    setForm({
      name: "",
      subject: "",
      deadline: "",
      priority: "Medium",
    });

    rerender((value) => value + 1);
  };

  return (
    <div>
      <Head
        title="Study Planner"
        text="Turn big academic goals into small steps."
      />

      <Card>
        <h2>Create Study Goal</h2>

        <div className="grid2">
          <Field
            label="Goal name"
            value={form.name}
            onChange={(event) =>
              setForm({
                ...form,
                name: event.target.value,
              })
            }
          />

          <Field
            label="Subject"
            value={form.subject}
            onChange={(event) =>
              setForm({
                ...form,
                subject: event.target.value,
              })
            }
          />

          <Field
            label="Deadline"
            type="date"
            value={form.deadline}
            onChange={(event) =>
              setForm({
                ...form,
                deadline: event.target.value,
              })
            }
          />

          <Button onClick={addGoal}>
            Create Goal
          </Button>
        </div>
      </Card>

      <div className="list">
        {studyGoals.length === 0 ? (
          <Empty
            title="No study goals"
            text="Create your first study goal."
          />
        ) : (
          studyGoals.map((goal) => (
            <Card key={goal.id}>
              <div className="between">
                <div>
                  <b>{goal.name}</b>

                  <small>
                    {goal.subject} •{" "}
                    {goal.deadline}
                  </small>
                </div>

                <button
                  type="button"
                  className="plain"
                  onClick={() => {
                    studyService.remove(
                      goal.id
                    );

                    rerender(
                      (value) => value + 1
                    );
                  }}
                >
                  <Trash2 />
                </button>
              </div>

              <Progress value={goal.progress || 0} />
            </Card>
          ))
        )}
      </div>
    </div>
  );
}

/* =========================================================
   RESOURCES
========================================================= */

export function Resources() {
  return (
    <div>
      <Head
        title="Resource Hub"
        text="Public learning resources and career references."
      />

      <div className="cards3">
        {resources.map((resource) => (
          <Card key={resource.id}>
            <Badge>{resource.category}</Badge>

            <h3>{resource.title}</h3>

            <p>{resource.description}</p>

            <a
              className="link"
              href={resource.url}
              target="_blank"
              rel="noreferrer"
            >
              Open resource →
            </a>
          </Card>
        ))}
      </div>
    </div>
  );
}

/* =========================================================
   AI
========================================================= */

export function AI() {
  return (
    <div>
      <Head
        title="EduGuide AI"
        text="Frontend AI simulation — ready to be connected to a real AI API in Phase 2."
      />

      <Chat />
    </div>
  );
}

/* =========================================================
   NOTIFICATIONS
========================================================= */

export function Notifications() {
  const notifications = [
    "Scholarship deadline approaching",
    "Study goal completed",
    "Career roadmap milestone reached",
    "New resource recommendation",
  ];

  return (
    <div>
      <Head
        title="Notifications"
        text="Updates from your EduGuide workspace."
      />

      <div className="list">
        {notifications.map((notification) => (
          <Card key={notification}>
            <b>{notification}</b>

            <p>
              Demo notification for the frontend
              prototype.
            </p>
          </Card>
        ))}
      </div>
    </div>
  );
}

/* =========================================================
   PROFILE
========================================================= */

export function Profile() {
  const [profile, setProfile] = useState(
    profileService.get()
  );

  const saveProfile = () => {
    profileService.save(profile);
  };

  const toggleInterest = (interest) => {
    const currentInterests =
      profile.interests || [];

    const updatedInterests =
      currentInterests.includes(interest)
        ? currentInterests.filter(
            (item) => item !== interest
          )
        : [...currentInterests, interest];

    setProfile({
      ...profile,
      interests: updatedInterests,
    });
  };

  return (
    <div>
      <Head
        title="Profile"
        text="Keep your academic context up to date."
      />

      <Card>
        <div className="grid2">
          <Field
            label="Name"
            value={profile.name || ""}
            onChange={(event) =>
              setProfile({
                ...profile,
                name: event.target.value,
              })
            }
          />

          <Field
            label="State"
            value={profile.state || ""}
            onChange={(event) =>
              setProfile({
                ...profile,
                state: event.target.value,
              })
            }
          />

          <Field
            label="City"
            value={profile.city || ""}
            onChange={(event) =>
              setProfile({
                ...profile,
                city: event.target.value,
              })
            }
          />

          <Field
            label="Degree"
            value={profile.degree || ""}
            onChange={(event) =>
              setProfile({
                ...profile,
                degree: event.target.value,
              })
            }
          />

          <Field
            label="Branch"
            value={profile.branch || ""}
            onChange={(event) =>
              setProfile({
                ...profile,
                branch: event.target.value,
              })
            }
          />

          <Field
            label="Year"
            value={profile.year || ""}
            onChange={(event) =>
              setProfile({
                ...profile,
                year: event.target.value,
              })
            }
          />
        </div>

        <h3>Interests</h3>

        <div className="chips">
          {interests.map((interest) => (
            <button
              type="button"
              className={
                profile.interests?.includes(
                  interest
                )
                  ? "selected"
                  : ""
              }
              onClick={() =>
                toggleInterest(interest)
              }
              key={interest}
            >
              {interest}
            </button>
          ))}
        </div>

        <Button onClick={saveProfile}>
          Save Profile
        </Button>
      </Card>
    </div>
  );
}

/* =========================================================
   SETTINGS
========================================================= */

export function Settings() {
  const navigate = useNavigate();

  const toggleTheme = () => {
    const currentTheme = get(
      "theme",
      "light"
    );

    const newTheme =
      currentTheme === "dark"
        ? "light"
        : "dark";

    set("theme", newTheme);

    document.documentElement.dataset.theme =
      newTheme;

    window.location.reload();
  };

  const clearDemoData = () => {
    if (
      window.confirm(
        "Clear local EduGuide data?"
      )
    ) {
      appData.clear();

      navigate("/");
    }
  };

  const permissions =
    profileService.permissions();

  const updatePermission = (key, value) => {
    profileService.savePermissions({
      ...profileService.permissions(),
      [key]: value,
    });
  };

  return (
    <div>
      <Head
        title="Settings"
        text="Appearance, privacy and demo account controls."
      />

      <Card>
        <h3>Theme</h3>

        <Button onClick={toggleTheme}>
          Toggle Light / Dark
        </Button>

        <h3>Parent Sharing</h3>

        {[
          "interests",
          "roadmap",
          "goals",
          "ai",
          "notes",
        ].map((key) => (
          <label
            className="switch"
            key={key}
          >
            <span>
              Share {key}
            </span>

            <input
              type="checkbox"
              checked={
                permissions?.[key] || false
              }
              onChange={(event) =>
                updatePermission(
                  key,
                  event.target.checked
                )
              }
            />
          </label>
        ))}

        <h3>Demo Data</h3>

        <Button
          variant="danger"
          onClick={clearDemoData}
        >
          Clear local demo data
        </Button>
      </Card>
    </div>
  );
}

/* =========================================================
   COMMON PAGE HEADER
========================================================= */

function Head({ title, text }) {
  return (
    <div className="head">
      <div>
        <span>EDUGUIDE AI</span>

        <h1>{title}</h1>

        <p>{text}</p>
      </div>
    </div>
  );
}