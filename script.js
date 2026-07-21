/* =============================================================
   HEADS UP AFTERSCHOOL PROGRAM
   script.js

   PURPOSE
   -------------------------------------------------------------
   This file controls:

   - Mobile navigation
   - Desktop Explore dropdown
   - Active navigation highlighting
   - Dynamic hero wording
   - Weekly updates rendering
   - Weekly schedule rendering
   - Upcoming event rendering and filtering
   - Downloadable calendar event files
   - Update, resource, team, and policy modals
   - Gallery movement controls
   - FAQ accordion behavior
   - Contact form validation
   - Email application fallback
   - Newsletter email fallback
   - Scroll reveal effects
   - Quick-help menu
   - Back-to-top button
   - Toast notifications

   IMPORTANT STATIC WEBSITE LIMITATION
   -------------------------------------------------------------
   A browser-only HTML/CSS/JavaScript website cannot directly
   send an email without a server, backend, or form service.

   The contact form validates the message and opens the visitor's
   email application with the message already completed.

   BEFORE PUBLISHING, REPLACE:
   -------------------------------------------------------------
   - placeholder@email.com
   - (000) 000-0000
   - Placeholder Address
   - Sample weekly updates
   - Sample schedule information
   - Sample upcoming events
   - Placeholder images and biographies

   EASY CONTENT UPDATES
   -------------------------------------------------------------
   Frequently changing content is kept near the top:

   1. weeklyUpdates
   2. weeklySchedule
   3. upcomingEvents
   4. announcementMessages
============================================================= */

"use strict";


/* =============================================================
   01. EDITABLE WEEKLY UPDATES DATA

   Keep one item with featured: true.
============================================================= */

const weeklyUpdates = [

    {

        id:
            "stem-exploration-week",

        featured:
            true,

        category:
            "Featured activity",

        title:
            "Community STEM Exploration Week",

        dateLabel:
            "Updated June 9, 2026",

        audience:
            "Students, families, and volunteers",

        summary:
            "This week focuses on microscope exploration, outdoor discovery, hands-on experiments, and collaborative group projects designed to encourage curiosity, teamwork, and confidence.",

        details:
            `
                <p>
                    This featured week brings together the learning
                    experiences students responded to most positively
                    during field observations: hands-on discovery,
                    social interaction, outdoor exploration, and
                    opportunities to share what they learned.
                </p>

                <h3>
                    Planned highlights
                </h3>

                <ul>
                    <li>
                        Microscope exploration and close-up observation
                    </li>

                    <li>
                        Outdoor collection and nature discovery
                    </li>

                    <li>
                        Small-group problem-solving
                    </li>

                    <li>
                        Student reflection and project sharing
                    </li>

                    <li>
                        Community meal and conversation
                    </li>
                </ul>

                <p>
                    Replace this sample information with the approved
                    weekly activity description before publishing.
                </p>
            `

    },


    {

        id:
            "homework-club-reminder",

        featured:
            false,

        category:
            "Schedule",

        title:
            "Homework Club schedule reminder",

        dateLabel:
            "June 9, 2026",

        audience:
            "Families",

        summary:
            "Review the regular Homework Club days, program hours, and any changes for the current week.",

        details:
            `
                <p>
                    Use this update for the most important schedule
                    reminder of the week. Include arrival times,
                    dismissal times, cancellations, transportation
                    information, or any family action needed.
                </p>

                <p>
                    The complete recurring schedule is available
                    in the <strong>Weekly Schedule</strong> tab.
                </p>
            `

    },


    {

        id:
            "family-engagement-night",

        featured:
            false,

        category:
            "Family reminder",

        title:
            "Family engagement night",

        dateLabel:
            "June 10, 2026",

        audience:
            "Parents and guardians",

        summary:
            "Families are invited to connect with mentors, review activities, and share ideas about upcoming programming.",

        details:
            `
                <p>
                    Family engagement opportunities support transparent
                    communication and help the program continue responding
                    to community needs.
                </p>

                <h3>
                    Possible discussion topics
                </h3>

                <ul>
                    <li>
                        Upcoming activities and schedules
                    </li>

                    <li>
                        What students are enjoying
                    </li>

                    <li>
                        Questions or support needs
                    </li>

                    <li>
                        Website and communication feedback
                    </li>
                </ul>
            `

    },


    {

        id:
            "volunteer-orientation",

        featured:
            false,

        category:
            "Volunteer",

        title:
            "Volunteer orientation information",

        dateLabel:
            "June 10, 2026",

        audience:
            "Volunteers and mentors",

        summary:
            "Incoming volunteers can review expectations, onboarding steps, and available participation opportunities.",

        details:
            `
                <p>
                    Use this update to communicate orientation dates,
                    required forms, meeting locations, training
                    expectations, and the correct point of contact.
                </p>

                <p>
                    Visitors can also open the Volunteer & Mentor
                    resource card for a complete onboarding overview.
                </p>
            `

    },


    {

        id:
            "student-highlight",

        featured:
            false,

        category:
            "Community highlight",

        title:
            "Student learning highlight",

        dateLabel:
            "June 11, 2026",

        audience:
            "Everyone",

        summary:
            "Share a short, approved reflection or project highlight that shows learning, collaboration, and student excitement.",

        details:
            `
                <p>
                    This space is designed for an approved student
                    project, group accomplishment, or short reflection.
                    Avoid publishing private or identifying information
                    without the required permission.
                </p>

                <p>
                    Pair the story with a consent-approved image
                    whenever possible.
                </p>
            `

    },


    {

        id:
            "resource-update",

        featured:
            false,

        category:
            "Resources",

        title:
            "Parent and community resources updated",

        dateLabel:
            "June 11, 2026",

        audience:
            "Families and community members",

        summary:
            "Program contacts, support information, forms, and common questions have been organized in the Resources section.",

        details:
            `
                <p>
                    Use this update whenever a major document,
                    form, support resource, or contact pathway changes.
                </p>

                <p>
                    Keeping resource information current supports
                    trust, transparency, and easier navigation.
                </p>
            `

    }

];


/* =============================================================
   02. EDITABLE WEEKLY SCHEDULE DATA
============================================================= */

const weeklySchedule = [

    {

        day:
            "Monday",

        time:
            "Shared privately",

        activity:
            "Homework Club",

        description:
            "Academic support and mentoring. Exact time and location should be shared through the Family Portal or approved family communication.",

        audience:
            "Students",

        privateDetails:
            true

    },


    {

        day:
            "Tuesday",

        time:
            "Shared privately",

        activity:
            "Homework Club & mentoring",

        description:
            "Homework guidance, peer learning, and mentor support. Do not place child attendance details on the public website.",

        audience:
            "Students",

        privateDetails:
            true

    },


    {

        day:
            "Wednesday",

        time:
            "Shared privately",

        activity:
            "STEM or creative activity",

        description:
            "Hands-on exploration, teamwork, and project learning. Families can sign in or contact the program for approved details.",

        audience:
            "Students & mentors",

        privateDetails:
            true

    },


    {

        day:
            "Thursday",

        time:
            "Shared privately",

        activity:
            "Homework Club & reflection",

        description:
            "Academic support followed by reflection and sharing. Exact schedule information belongs in the private portal.",

        audience:
            "Students",

        privateDetails:
            true

    },


    {

        day:
            "Friday",

        time:
            "Shared privately",

        activity:
            "Community or family event",

        description:
            "Family events and community gatherings may be announced generally on the public website, while exact details stay private.",

        audience:
            "Families & community",

        privateDetails:
            true

    }

];


/* =============================================================
   03. EDITABLE UPCOMING EVENTS DATA

   Date format:
   YYYY-MM-DD

   Time format:
   HH:MM using the 24-hour clock

   Audience values:
   - family
   - student
   - volunteer
   - everyone
============================================================= */

const upcomingEvents = [

    {

        id:
            "family-community-night",

        title:
            "Family Community Night",

        date:
            "2099-01-01",

        startTime:
            "00:00",

        endTime:
            "00:00",

        location:
            "Shared through Family Portal",

        audience:
            "family",

        audienceLabel:
            "Families",

        privateDetails:
            true,

        publicDateLabel:
            "Date shared privately",

        publicTimeLabel:
            "Time shared privately",

        publicLocationLabel:
            "Location shared privately",

        summary:
            "A family-centered gathering is planned. Approved families can receive exact time and location through the private portal or direct program communication.",

        details:
            `
                <p>
                    This event listing is public-safe by design.
                    Exact times, location, and child-related details
                    should not be published openly online.
                </p>

                <h3>
                    Public-safe information
                </h3>

                <ul>
                    <li>
                        Family connection and communication
                    </li>

                    <li>
                        Program updates and approved activity highlights
                    </li>

                    <li>
                        Questions, support needs, and feedback
                    </li>
                </ul>

                <p>
                    Families should use the Family Portal or contact the
                    program directly for approved private details.
                </p>
            `

    },


    {

        id:
            "student-stem-lab",

        title:
            "Student STEM Discovery Lab",

        date:
            "2099-01-01",

        startTime:
            "00:00",

        endTime:
            "00:00",

        location:
            "Shared through Family Portal",

        audience:
            "student",

        audienceLabel:
            "Students",

        privateDetails:
            true,

        publicDateLabel:
            "Date shared privately",

        publicTimeLabel:
            "Time shared privately",

        publicLocationLabel:
            "Location shared privately",

        summary:
            "A hands-on activity is planned for students. Public information stays general while private schedule details remain protected.",

        details:
            `
                <p>
                    This event reflects the research finding that students
                    are especially engaged during hands-on, social, and
                    exploratory learning.
                </p>

                <p>
                    Replace this public-safe description with approved
                    language. Keep exact time, location, student names,
                    and attendance information inside the private system.
                </p>
            `

    },


    {

        id:
            "volunteer-orientation-event",

        title:
            "Volunteer & Mentor Orientation",

        date:
            "2099-01-01",

        startTime:
            "00:00",

        endTime:
            "00:00",

        location:
            "Shared after approval",

        audience:
            "volunteer",

        audienceLabel:
            "Volunteers",

        privateDetails:
            true,

        publicDateLabel:
            "Date shared after approval",

        publicTimeLabel:
            "Time shared after approval",

        publicLocationLabel:
            "Location shared after approval",

        summary:
            "Orientation information is available for approved volunteers and mentors. Use the contact form or portal pathway for next steps.",

        details:
            `
                <p>
                    Volunteer onboarding can be introduced publicly,
                    but internal meeting locations, private documents,
                    and participant details should be shared only after
                    approval.
                </p>

                <h3>
                    Orientation topics
                </h3>

                <ul>
                    <li>
                        Program mission and community context
                    </li>

                    <li>
                        Mentor roles and expectations
                    </li>

                    <li>
                        Student safety and privacy
                    </li>

                    <li>
                        Communication and scheduling
                    </li>
                </ul>
            `

    },


    {

        id:
            "community-project-showcase",

        title:
            "Community Project Showcase",

        date:
            "2099-01-01",

        startTime:
            "00:00",

        endTime:
            "00:00",

        location:
            "Shared through approved communication",

        audience:
            "everyone",

        audienceLabel:
            "Everyone",

        privateDetails:
            true,

        publicDateLabel:
            "Date shared privately",

        publicTimeLabel:
            "Time shared privately",

        publicLocationLabel:
            "Location shared privately",

        summary:
            "Students may share approved projects and learning moments with families and community members. Detailed attendance information remains private.",

        details:
            `
                <p>
                    A showcase is a strong way to represent student
                    learning, excitement, and collaboration.
                </p>

                <p>
                    Only display approved student names, photos,
                    and project details. Keep exact attendance and
                    location details outside of the public source code.
                </p>
            `

    }

];


/* =============================================================
   04. IMPORTANT ANNOUNCEMENT MESSAGES
============================================================= */

const announcementMessages = [

    "Public updates stay general. Exact schedules, times, locations, and student-specific details belong in the Family Portal.",

    "Families and approved team members should use the private portal or direct program communication for detailed schedule information.",

    "Need help? Contact information and the emergency number remain easy to find throughout the website.",

    "Use only approved photos, stories, and student information before publishing community highlights."

];


/* =============================================================
   05. ROTATING HERO WORDS
============================================================= */

const heroWords = [

    "belong.",

    "learn.",

    "explore.",

    "connect.",

    "grow."

];


/* =============================================================
   06. GENERAL MODAL CONTENT
============================================================= */

const contentLibrary = {

    about: {

        eyebrow:
            "Program overview",

        title:
            "A relationship-driven learning community",

        body:
            `
                <p>
                    Heads Up functions as more than a traditional
                    afterschool program. Research and direct observation
                    show a community space where students learn by
                    interacting, exploring, asking questions, sharing
                    stories, and building relationships.
                </p>

                <h3>
                    Core focus areas
                </h3>

                <ul>
                    <li>
                        Academic success and homework support
                    </li>

                    <li>
                        Emotional well-being and stability
                    </li>

                    <li>
                        Cultural understanding and acceptance
                    </li>

                    <li>
                        Critical consciousness and community awareness
                    </li>

                    <li>
                        Mentorship, belonging, and collaborative growth
                    </li>
                </ul>

                <h3>
                    Website purpose
                </h3>

                <p>
                    The website should act as a real snapshot of
                    the program: welcoming, active, trustworthy,
                    easy to navigate, and grounded in community voices.
                </p>
            `,

        actions: [

            {

                label:
                    "See programs",

                href:
                    "#programs",

                primary:
                    true

            },

            {

                label:
                    "Contact Heads Up",

                href:
                    "#contact"

            }

        ]

    },


    homework: {

        eyebrow:
            "Program activity",

        title:
            "Homework Club",

        body:
            `
                <p>
                    Homework Club offers structured academic support
                    in a community environment where students can ask
                    questions, work alongside peers, and receive
                    guidance from mentors.
                </p>

                <h3>
                    What the website can show
                </h3>

                <ul>
                    <li>
                        Current meeting days and hours
                    </li>

                    <li>
                        Types of homework and tutoring support
                    </li>

                    <li>
                        Mentor roles and areas of experience
                    </li>

                    <li>
                        Approved student reflections or project examples
                    </li>

                    <li>
                        How families can ask questions
                    </li>
                </ul>
            `,

        actions: [

            {

                label:
                    "View weekly schedule",

                href:
                    "#events",

                primary:
                    true

            },

            {

                label:
                    "Ask a question",

                prefill:
                    "Homework Club question"

            }

        ]

    },


    stem: {

        eyebrow:
            "Program activity",

        title:
            "STEM Exploration",

        body:
            `
                <p>
                    STEM activities use hands-on discovery to encourage
                    curiosity, experimentation, teamwork, and
                    problem-solving. Field observations showed strong
                    student engagement during microscope use, outdoor
                    plant collection, and opportunities to share discoveries.
                </p>

                <h3>
                    Possible activity highlights
                </h3>

                <ul>
                    <li>
                        Microscope investigation
                    </li>

                    <li>
                        Outdoor science exploration
                    </li>

                    <li>
                        Engineering and building challenges
                    </li>

                    <li>
                        Technology demonstrations
                    </li>

                    <li>
                        Student project showcases
                    </li>
                </ul>
            `,

        actions: [

            {

                label:
                    "See gallery",

                href:
                    "#gallery",

                primary:
                    true

            },

            {

                label:
                    "View upcoming events",

                href:
                    "#events"

            }

        ]

    },


    community: {

        eyebrow:
            "Program activity",

        title:
            "Community Engagement",

        body:
            `
                <p>
                    Community engagement includes shared meals,
                    group conversation, family participation, teamwork,
                    and opportunities to build trust. These moments
                    help Heads Up feel like a dependable third space
                    beyond home and school.
                </p>

                <h3>
                    What builds belonging
                </h3>

                <ul>
                    <li>
                        Students helping one another
                    </li>

                    <li>
                        Mentors guiding rather than controlling
                    </li>

                    <li>
                        Families participating in discussions
                    </li>

                    <li>
                        Shared celebrations and meals
                    </li>

                    <li>
                        Respectful, inclusive communication
                    </li>
                </ul>
            `,

        actions: [

            {

                label:
                    "Read community stories",

                href:
                    "#stories",

                primary:
                    true

            },

            {

                label:
                    "Contact the program",

                href:
                    "#contact"

            }

        ]

    },


    creative: {

        eyebrow:
            "Program activity",

        title:
            "Creative Activities",

        body:
            `
                <p>
                    Creative activities give students ways to express
                    ideas, make choices, work together, and show families
                    what they created. These experiences may include
                    drawing, reflection, building, storytelling, or
                    interactive teamwork games.
                </p>

                <h3>
                    Website storytelling ideas
                </h3>

                <ul>
                    <li>
                        Short project descriptions
                    </li>

                    <li>
                        Approved student artwork
                    </li>

                    <li>
                        Student reflections
                    </li>

                    <li>
                        Mentor explanations of learning goals
                    </li>

                    <li>
                        Photo galleries with meaningful captions
                    </li>
                </ul>
            `,

        actions: [

            {

                label:
                    "View gallery",

                href:
                    "#gallery",

                primary:
                    true

            },

            {

                label:
                    "Share a story",

                prefill:
                    "Creative activity or student story"

            }

        ]

    },


    transparency: {

        eyebrow:
            "Trust & transparency",

        title:
            "Clear information should be easy to verify",

        body:
            `
                <p>
                    This space can provide approved program documents
                    and clear explanations of how Heads Up communicates,
                    gathers community feedback, protects privacy,
                    and updates public information.
                </p>

                <h3>
                    Recommended materials
                </h3>

                <ul>
                    <li>
                        Program mission and goals
                    </li>

                    <li>
                        Approved policies and family information
                    </li>

                    <li>
                        Research overview and engagement goals
                    </li>

                    <li>
                        Accessibility statement
                    </li>

                    <li>
                        Photo, story, and privacy guidance
                    </li>

                    <li>
                        Last-updated dates for important information
                    </li>
                </ul>

                <p>
                    Replace this explanatory content with approved
                    organizational documents and links when available.
                </p>
            `,

        actions: [

            {

                label:
                    "Research resources",

                resource:
                    "researchers",

                primary:
                    true

            },

            {

                label:
                    "Contact Heads Up",

                href:
                    "#contact"

            }

        ]

    },


    photoPolicy: {

        eyebrow:
            "Privacy & copyright",

        title:
            "Photo, story, and media guidance",

        body:
            `
                <p>
                    Community storytelling should remain authentic
                    while protecting students, families, staff,
                    volunteers, and researchers.
                </p>

                <h3>
                    Before publishing
                </h3>

                <ul>
                    <li>
                        Confirm that the image or story is approved
                        for public use.
                    </li>

                    <li>
                        Follow the correct parent or guardian
                        consent process.
                    </li>

                    <li>
                        Avoid sensitive, private, or unnecessary
                        identifying details.
                    </li>

                    <li>
                        Use original, licensed, or properly
                        credited media.
                    </li>

                    <li>
                        Confirm that captions accurately represent
                        the activity.
                    </li>

                    <li>
                        Remove outdated or withdrawn content promptly.
                    </li>
                </ul>

                <p>
                    This is a website-maintenance reminder, not a
                    replacement for approved program, university,
                    research, or legal guidance.
                </p>
            `,

        actions: [

            {

                label:
                    "Ask about media approval",

                prefill:
                    "Photo or media approval question",

                primary:
                    true

            },

            {

                label:
                    "Close",

                close:
                    true

            }

        ]

    },


    accessibility: {

        eyebrow:
            "Accessibility",

        title:
            "Designed to be clear and usable",

        body:
            `
                <p>
                    The website uses readable text, clear headings,
                    keyboard-accessible controls, strong contrast,
                    mobile-friendly layouts, descriptive labels,
                    reduced-motion support, and consistent navigation.
                </p>

                <h3>
                    Ongoing accessibility checks
                </h3>

                <ul>
                    <li>
                        Add accurate alternative text for approved images.
                    </li>

                    <li>
                        Keep headings in a logical order.
                    </li>

                    <li>
                        Use descriptive link text.
                    </li>

                    <li>
                        Test forms and navigation using a keyboard.
                    </li>

                    <li>
                        Check contrast before changing brand colors.
                    </li>

                    <li>
                        Review the site on phones, tablets, and computers.
                    </li>
                </ul>
            `,

        actions: [

            {

                label:
                    "Report an accessibility issue",

                prefill:
                    "Website accessibility issue",

                primary:
                    true

            },

            {

                label:
                    "Close",

                close:
                    true

            }

        ]

    },


    privacy: {

        eyebrow:
            "Privacy",

        title:
            "Respectful handling of community information",

        body:
            `
                <p>
                    Do not publish private contact details, protected
                    research information, sensitive family data,
                    student records, or identifying information that
                    has not been approved for public use.
                </p>

                <h3>
                    Website maintenance reminders
                </h3>

                <ul>
                    <li>
                        Collect only the information the program needs.
                    </li>

                    <li>
                        Explain how submitted information will be used.
                    </li>

                    <li>
                        Use approved storage and communication systems.
                    </li>

                    <li>
                        Remove outdated personal information.
                    </li>

                    <li>
                        Follow applicable program and research protocols.
                    </li>
                </ul>
            `,

        actions: [

            {

                label:
                    "Ask a privacy question",

                prefill:
                    "Website privacy question",

                primary:
                    true

            },

            {

                label:
                    "Close",

                close:
                    true

            }

        ]

    }

};


/* =============================================================
   07. RESOURCE MODAL CONTENT
============================================================= */

const resourceLibrary = {

    parents: {

        eyebrow:
            "Parents & guardians",

        title:
            "Family information in one clear place",

        body:
            `
                <p>
                    This pathway should help families find essential
                    information quickly without searching through
                    unrelated pages.
                </p>

                <h3>
                    Recommended parent resources
                </h3>

                <ul>
                    <li>
                        Weekly program schedule
                    </li>

                    <li>
                        Upcoming events and cancellations
                    </li>

                    <li>
                        Staff and emergency contact information
                    </li>

                    <li>
                        Safety and communication expectations
                    </li>

                    <li>
                        Program activities and learning goals
                    </li>

                    <li>
                        Frequently asked questions
                    </li>

                    <li>
                        Approved forms and participation information
                    </li>
                </ul>
            `,

        actions: [

            {

                label:
                    "View schedule",

                href:
                    "#events",

                primary:
                    true

            },

            {

                label:
                    "Contact program staff",

                prefill:
                    "Parent or guardian question"

            }

        ]

    },


    volunteers: {

        eyebrow:
            "Volunteers & mentors",

        title:
            "Get involved with clear expectations",

        body:
            `
                <p>
                    Volunteers and mentors contribute to academic
                    support, hands-on activities, relationship-building,
                    and community engagement.
                </p>

                <h3>
                    Recommended onboarding information
                </h3>

                <ul>
                    <li>
                        Available roles and responsibilities
                    </li>

                    <li>
                        Orientation and training dates
                    </li>

                    <li>
                        Program schedule and attendance expectations
                    </li>

                    <li>
                        Student-centered communication guidelines
                    </li>

                    <li>
                        Privacy, media, and safety expectations
                    </li>

                    <li>
                        Who to contact with questions
                    </li>
                </ul>
            `,

        actions: [

            {

                label:
                    "Ask to volunteer",

                prefill:
                    "Volunteer or mentor interest",

                primary:
                    true

            },

            {

                label:
                    "View events",

                href:
                    "#events"

            }

        ]

    },


    researchers: {

        eyebrow:
            "Researchers",

        title:
            "Community-centered research and transparency",

        body:
            `
                <p>
                    The research project explores how emotions,
                    motivations, direct engagement, and community voice
                    can guide the design of a user-centered website.
                </p>

                <h3>
                    Research questions
                </h3>

                <ul>
                    <li>
                        How does implementing human emotions and
                        motivations impact the user experience?
                    </li>

                    <li>
                        How does direct engagement with an afterschool
                        program shape storytelling and community
                        representation in a user-centered website?
                    </li>
                </ul>

                <h3>
                    Methods
                </h3>

                <ul>
                    <li>
                        Field observations
                    </li>

                    <li>
                        Surveys and child-friendly activities
                    </li>

                    <li>
                        Interviews and focus groups
                    </li>

                    <li>
                        Quantitative summaries and thematic analysis
                    </li>

                    <li>
                        Translation of findings into website decisions
                    </li>
                </ul>

                <p>
                    Research and public website content must continue
                    following relevant approved ethical and privacy
                    procedures.
                </p>
            `,

        actions: [

            {

                label:
                    "Contact the research team",

                prefill:
                    "Research project question",

                primary:
                    true

            },

            {

                label:
                    "View transparency notes",

                modal:
                    "transparency"

            }

        ]

    },


    incoming: {

        eyebrow:
            "Incoming team members",

        title:
            "Start with the project context",

        body:
            `
                <p>
                    New team members should understand both the
                    website structure and the community research
                    behind it before making changes.
                </p>

                <h3>
                    Suggested onboarding order
                </h3>

                <ol>
                    <li>
                        Read the project overview and research questions.
                    </li>

                    <li>
                        Review the website sitemap and user guide.
                    </li>

                    <li>
                        Understand parent, volunteer, researcher,
                        and community pathways.
                    </li>

                    <li>
                        Review privacy, photo, copyright,
                        and accessibility expectations.
                    </li>

                    <li>
                        Check current weekly updates and events.
                    </li>

                    <li>
                        Document every major website change.
                    </li>
                </ol>
            `,

        actions: [

            {

                label:
                    "Ask an onboarding question",

                prefill:
                    "Incoming team member onboarding question",

                primary:
                    true

            },

            {

                label:
                    "View program overview",

                modal:
                    "about"

            }

        ]

    },


    community: {

        eyebrow:
            "Community partners",

        title:
            "Connect, collaborate, and support",

        body:
            `
                <p>
                    Community partners can use this pathway to
                    understand the program, explore collaboration
                    opportunities, view activities, and connect
                    with program leadership.
                </p>

                <h3>
                    Possible partnership information
                </h3>

                <ul>
                    <li>
                        Program mission and community focus
                    </li>

                    <li>
                        Upcoming events
                    </li>

                    <li>
                        Volunteer or mentoring opportunities
                    </li>

                    <li>
                        Student activity support
                    </li>

                    <li>
                        Research or educational collaboration
                    </li>

                    <li>
                        Contact information
                    </li>
                </ul>
            `,

        actions: [

            {

                label:
                    "Start a partnership conversation",

                prefill:
                    "Community partnership inquiry",

                primary:
                    true

            },

            {

                label:
                    "See program stories",

                href:
                    "#stories"

            }

        ]

    }

};


/* =============================================================
   08. TEAM MODAL CONTENT
============================================================= */

const teamLibrary = {

    leadership: {

        eyebrow:
            "Program leadership",

        title:
            "Leadership, direction, and community care",

        body:
            `
                <p>
                    Add approved leadership names, roles,
                    biographies, program history, and areas
                    of responsibility here.
                </p>

                <h3>
                    Helpful profile details
                </h3>

                <ul>
                    <li>
                        Name and official role
                    </li>

                    <li>
                        Experience with Heads Up
                    </li>

                    <li>
                        Program or educational background
                    </li>

                    <li>
                        What they value about the community
                    </li>

                    <li>
                        Best approved contact pathway
                    </li>
                </ul>
            `,

        actions: [

            {

                label:
                    "Contact program leadership",

                prefill:
                    "Program leadership question",

                primary:
                    true

            },

            {

                label:
                    "Close",

                close:
                    true

            }

        ]

    },


    research: {

        eyebrow:
            "Research team",

        title:
            "Turning community feedback into design decisions",

        body:
            `
                <p>
                    Add approved researcher profiles, project
                    responsibilities, methods experience, and
                    contributions here.
                </p>

                <p>
                    Profiles can explain how surveys, observations,
                    interviews, thematic analysis, and UX design
                    support a more authentic community website.
                </p>
            `,

        actions: [

            {

                label:
                    "Research information",

                resource:
                    "researchers",

                primary:
                    true

            },

            {

                label:
                    "Contact research team",

                prefill:
                    "Research team question"

            }

        ]

    },


    volunteers: {

        eyebrow:
            "Mentors & volunteers",

        title:
            "Guidance, encouragement, and shared learning",

        body:
            `
                <p>
                    Add approved mentor and volunteer spotlights
                    showing their experience, college majors or
                    professional interests, roles in activities,
                    and what they value about working with students.
                </p>

                <p>
                    Community feedback specifically requested
                    descriptions of mentor and director experience
                    to strengthen trust.
                </p>
            `,

        actions: [

            {

                label:
                    "Volunteer information",

                resource:
                    "volunteers",

                primary:
                    true

            },

            {

                label:
                    "Ask to get involved",

                prefill:
                    "Volunteer or mentor interest"

            }

        ]

    }

};


/* =============================================================
   09. DOM HELPERS
============================================================= */

const select = (

    selector,

    parent = document

) => parent.querySelector(selector);


const selectAll = (

    selector,

    parent = document

) => [

    ...parent.querySelectorAll(selector)

];


const escapeHtml = (

    value = ""

) => String(value)

    .replaceAll(
        "&",
        "&amp;"
    )

    .replaceAll(
        "<",
        "&lt;"
    )

    .replaceAll(
        ">",
        "&gt;"
    )

    .replaceAll(
        '"',
        "&quot;"
    )

    .replaceAll(
        "'",
        "&#039;"
    );


const prefersReducedMotion = window.matchMedia(

    "(prefers-reduced-motion: reduce)"

).matches;


/* =============================================================
   10. DATE AND FORMAT HELPERS
============================================================= */

const formatEventDate = (

    dateString

) => {

    const date = new Date(

        `${dateString}T12:00:00`

    );


    if (

        Number.isNaN(date.getTime())

    ) {

        return {

            day:
                "--",

            month:
                "Date",

            long:
                dateString

        };

    }


    return {

        day:
            new Intl.DateTimeFormat(

                "en-US",

                {

                    day:
                        "numeric"

                }

            ).format(date),


        month:
            new Intl.DateTimeFormat(

                "en-US",

                {

                    month:
                        "short"

                }

            )

                .format(date)

                .toUpperCase(),


        long:
            new Intl.DateTimeFormat(

                "en-US",

                {

                    weekday:
                        "long",

                    month:
                        "long",

                    day:
                        "numeric",

                    year:
                        "numeric"

                }

            ).format(date)

    };

};


const formatTime = (

    timeString

) => {

    const [

        hours,

        minutes

    ] = timeString

        .split(":")

        .map(Number);


    const date = new Date();


    date.setHours(

        hours,

        minutes,

        0,

        0

    );


    return new Intl.DateTimeFormat(

        "en-US",

        {

            hour:
                "numeric",

            minute:
                "2-digit"

        }

    ).format(date);

};


const createLocalDate = (

    dateString,

    timeString

) => {

    return new Date(

        `${dateString}T${timeString}:00`

    );

};


const formatICSDate = (

    date

) => {

    return date

        .toISOString()

        .replace(
            /[-:]/g,
            ""
        )

        .replace(
            /\.\d{3}/,
            ""
        );

};


/* =============================================================
   11. TOAST NOTIFICATIONS
============================================================= */

const toastRegion = select(

    "#toastRegion"

);


const showToast = ({

    title =
        "Heads Up",

    message =
        "",

    type =
        "info",

    duration =
        5200

}) => {

    if (

        !toastRegion

    ) {

        return;

    }


    const toast = document.createElement(

        "div"

    );


    toast.className =

        `toast toast--${type}`;


    toast.setAttribute(

        "role",

        "status"

    );


    toast.innerHTML = `

        <div>

            <strong>

                ${escapeHtml(title)}

            </strong>

            <p>

                ${escapeHtml(message)}

            </p>

        </div>

        <button

            type="button"

            aria-label="Dismiss notification"

        >

            ×

        </button>

    `;


    const removeToast = () => {

        toast.style.opacity =

            "0";


        toast.style.transform =

            "translateX(1rem)";


        window.setTimeout(

            () => {

                toast.remove();

            },

            220

        );

    };


    select(

        "button",

        toast

    )?.addEventListener(

        "click",

        removeToast

    );


    toastRegion.appendChild(

        toast

    );


    window.setTimeout(

        removeToast,

        duration

    );

};


/* =============================================================
   12. MOBILE NAVIGATION

   The hidden attribute is the closed-state source of truth.
   This prevents the drawer from flashing, remaining focusable while
   off-screen, or reopening unexpectedly during viewport changes.
============================================================= */

const mobileMenuButton = select(

    "#mobileMenuBtn"

);


const mobileNav = select(

    "#mobileNav"

);


const mobileNavClose = select(

    "#mobileNavClose"

);


const mobileNavBackdrop = select(

    "#mobileNavBackdrop"

);


let mobileNavLastFocusedElement =

    null;


const getMobileNavFocusableElements = () => {

    if (

        !mobileNav

        || mobileNav.hidden

    ) {

        return [];

    }


    return selectAll(

        `a[href],
        button:not([disabled]),
        input:not([disabled]),
        select:not([disabled]),
        textarea:not([disabled]),
        [tabindex]:not([tabindex="-1"])`,

        mobileNav

    ).filter(

        (element) =>

            element.offsetParent !== null

    );

};


const finalizeClosedMobileNav = (

    restoreFocus = false

) => {

    if (

        !mobileNav

        || !mobileNavBackdrop

    ) {

        return;

    }


    mobileNav.classList.remove(

        "is-open"

    );


    mobileNavBackdrop.classList.remove(

        "is-open"

    );


    mobileNav.hidden =

        true;


    mobileNav.setAttribute(

        "inert",

        ""

    );


    mobileNav.setAttribute(

        "aria-hidden",

        "true"

    );


    mobileNavBackdrop.hidden =

        true;


    document.body.classList.remove(

        "nav-is-open"

    );


    if (

        restoreFocus

        && mobileNavLastFocusedElement

        instanceof HTMLElement

    ) {

        mobileNavLastFocusedElement.focus();

    }

};


const openMobileNav = () => {

    if (

        !mobileMenuButton

        || !mobileNav

        || !mobileNavBackdrop

    ) {

        return;

    }


    mobileNavLastFocusedElement =

        document.activeElement;


    mobileMenuButton.setAttribute(

        "aria-expanded",

        "true"

    );


    mobileMenuButton.setAttribute(

        "aria-label",

        "Close navigation menu"

    );


    mobileNav.setAttribute(

        "aria-hidden",

        "false"

    );


    mobileNav.removeAttribute(

        "inert"

    );


    mobileNav.classList.add(

        "is-open"

    );


    mobileNavBackdrop.classList.add(

        "is-open"

    );


    mobileNav.hidden =

        false;


    mobileNavBackdrop.hidden =

        false;


    document.body.classList.add(

        "nav-is-open"

    );


    window.setTimeout(

        () => mobileNavClose?.focus(),

        prefersReducedMotion

            ? 0

            : 80

    );

};


const closeMobileNav = ({

    restoreFocus = false

} = {}) => {

    if (

        !mobileMenuButton

    ) {

        return;

    }


    mobileMenuButton.setAttribute(

        "aria-expanded",

        "false"

    );


    mobileMenuButton.setAttribute(

        "aria-label",

        "Open navigation menu"

    );


    finalizeClosedMobileNav(

        restoreFocus

    );

};


const setMobileNavState = (

    open,

    options = {}

) => {

    if (

        open

    ) {

        openMobileNav();

    } else {

        closeMobileNav(options);

    }

};


const synchronizeMobileNavForViewport = () => {

    if (

        window.innerWidth > 1260

    ) {

        closeMobileNav();

        return;

    }


    const isOpen =

        mobileMenuButton?.getAttribute(

            "aria-expanded"

        ) === "true";


    if (

        !isOpen

    ) {

        finalizeClosedMobileNav();

    }

};


mobileMenuButton?.addEventListener(

    "click",

    () => {

        const isOpen =

            mobileMenuButton.getAttribute(

                "aria-expanded"

            ) === "true";


        setMobileNavState(

            !isOpen,

            {

                restoreFocus:
                    isOpen

            }

        );

    }

);


mobileNavClose?.addEventListener(

    "click",

    () => closeMobileNav({

        restoreFocus:
            true

    })

);


mobileNavBackdrop?.addEventListener(

    "click",

    () => closeMobileNav({

        restoreFocus:
            true

    })

);


selectAll(

    ".mobile-nav__links a"

).forEach(

    (link) => {

        link.addEventListener(

            "click",

            () => closeMobileNav()

        );

    }

);


mobileNav?.addEventListener(

    "keydown",

    (event) => {

        if (

            event.key !== "Tab"

        ) {

            return;

        }


        const focusableElements =

            getMobileNavFocusableElements();


        if (

            !focusableElements.length

        ) {

            return;

        }


        const firstElement =

            focusableElements[0];


        const lastElement =

            focusableElements[

                focusableElements.length - 1

            ];


        if (

            event.shiftKey

            && document.activeElement === firstElement

        ) {

            event.preventDefault();

            lastElement.focus();

        } else if (

            !event.shiftKey

            && document.activeElement === lastElement

        ) {

            event.preventDefault();

            firstElement.focus();

        }

    }

);


window.addEventListener(

    "resize",

    synchronizeMobileNavForViewport

);


window.addEventListener(

    "orientationchange",

    () => {

        window.setTimeout(

            synchronizeMobileNavForViewport,

            100

        );

    }

);


synchronizeMobileNavForViewport();


/* =============================================================
   13. DESKTOP EXPLORE DROPDOWN
============================================================= */

const exploreButton = select(

    "#exploreButton"

);


const exploreMenu = select(

    "#exploreMenu"

);


const exploreDropdown = select(

    "#exploreDropdown"

);


const setExploreMenuState = (

    open

) => {

    if (

        !exploreButton

        || !exploreMenu

    ) {

        return;

    }


    exploreButton.setAttribute(

        "aria-expanded",

        String(open)

    );


    exploreMenu.classList.toggle(

        "is-open",

        open

    );

};


exploreButton?.addEventListener(

    "click",

    (event) => {

        event.stopPropagation();


        const isOpen =

            exploreButton.getAttribute(

                "aria-expanded"

            ) === "true";


        setExploreMenuState(

            !isOpen

        );

    }

);


exploreMenu?.addEventListener(

    "click",

    () => setExploreMenuState(false)

);


document.addEventListener(

    "click",

    (event) => {

        if (

            exploreDropdown

            && !exploreDropdown.contains(

                event.target

            )

        ) {

            setExploreMenuState(false);

        }

    }

);


/* =============================================================
   14. HEADER SCROLL STATE
============================================================= */

const mainHeader = select(

    "#mainHeader"

);


const backToTop = select(

    "#backToTop"

);


const desktopNavigationLinks = selectAll(

    ".desktop-nav a[href^='#']"

);


const updateHeaderScrollState = () => {

    const scrolled =

        window.scrollY > 35;


    mainHeader?.classList.toggle(

        "is-scrolled",

        scrolled

    );


    backToTop?.classList.toggle(

        "is-visible",

        window.scrollY > 700

    );

};


window.addEventListener(

    "scroll",

    updateHeaderScrollState,

    {

        passive:
            true

    }

);


updateHeaderScrollState();


/* =============================================================
   15. ACTIVE NAVIGATION HIGHLIGHT
============================================================= */

const activeSectionObserver = new IntersectionObserver(

    (

        entries

    ) => {

        const visibleEntries = entries

            .filter(

                (entry) => entry.isIntersecting

            )

            .sort(

                (

                    entryA,

                    entryB

                ) =>

                    entryB.intersectionRatio

                    - entryA.intersectionRatio

            );


        if (

            !visibleEntries.length

        ) {

            return;

        }


        const activeId =

            visibleEntries[0].target.id;


        desktopNavigationLinks.forEach(

            (link) => {

                const linkHash =

                    link.getAttribute(

                        "href"

                    )?.slice(1);


                let isActive =

                    linkHash === activeId;


                if (

                    activeId === "updates"

                ) {

                    if (

                        activeHubTabName === "events"

                    ) {

                        isActive =

                            linkHash === "events";

                    } else {

                        isActive =

                            linkHash === "updates";

                    }

                }


                link.classList.toggle(

                    "is-active",

                    isActive

                );

            }

        );

    },

    {

        rootMargin:
            "-32% 0px -55% 0px",

        threshold:
            [
                0,
                0.1,
                0.25,
                0.5
            ]

    }

);


selectAll(

    "main section[id]"

).forEach(

    (section) => {

        activeSectionObserver.observe(

            section

        );

    }

);


backToTop?.addEventListener(

    "click",

    () => {

        window.scrollTo({

            top:
                0,

            behavior:
                prefersReducedMotion

                    ? "auto"

                    : "smooth"

        });

    }

);


/* =============================================================
   16. INTERNAL ANCHOR NAVIGATION
============================================================= */

const scrollToElement = (

    element

) => {

    if (

        !element

    ) {

        return;

    }


    element.scrollIntoView({

        behavior:

            prefersReducedMotion

                ? "auto"

                : "smooth",

        block:
            "start"

    });

};


const handleInternalAnchor = (

    event

) => {

    const link =

        event.currentTarget;


    const href =

        link.getAttribute(

            "href"

        );


    if (

        !href

        || !href.startsWith("#")

        || href === "#"

    ) {

        return;

    }


    if (

        href === "#events"

    ) {

        event.preventDefault();


        activateHubTab(

            "events"

        );


        scrollToElement(

            select("#updates")

        );


        history.replaceState(

            null,

            "",

            "#events"

        );


        return;

    }


    const target = select(

        href

    );


    if (

        target

    ) {

        event.preventDefault();


        scrollToElement(

            target

        );


        history.replaceState(

            null,

            "",

            href

        );

    }

};


selectAll(

    'a[href^="#"]'

).forEach(

    (link) => {

        link.addEventListener(

            "click",

            handleInternalAnchor

        );

    }

);


/* =============================================================
   17. ROTATING HERO WORDS
============================================================= */

const rotatingWord = select(

    "#rotatingWord"

);


let rotatingWordIndex =

    0;


let rotatingWordTimer =

    null;


const rotateHeroWord = () => {

    if (

        !rotatingWord

        || prefersReducedMotion

    ) {

        return;

    }


    rotatingWord.classList.add(

        "is-changing"

    );


    window.setTimeout(

        () => {

            rotatingWordIndex =

                (

                    rotatingWordIndex + 1

                ) % heroWords.length;


            rotatingWord.textContent =

                heroWords[rotatingWordIndex];


            rotatingWord.classList.remove(

                "is-changing"

            );

        },

        250

    );

};


if (

    rotatingWord

    && !prefersReducedMotion

) {

    rotatingWordTimer = window.setInterval(

        rotateHeroWord,

        3400

    );

}


/* =============================================================
   18. SUBTLE HERO PUZZLE TILT
============================================================= */

const communityPuzzle = select(

    "#communityPuzzle"

);


const supportsHover = window.matchMedia(

    "(hover: hover) and (pointer: fine)"

).matches;


if (

    communityPuzzle

    && supportsHover

    && !prefersReducedMotion

) {

    communityPuzzle.addEventListener(

        "pointermove",

        (event) => {

            const bounds =

                communityPuzzle.getBoundingClientRect();


            const x =

                (

                    event.clientX

                    - bounds.left

                )

                / bounds.width

                - 0.5;


            const y =

                (

                    event.clientY

                    - bounds.top

                )

                / bounds.height

                - 0.5;


            communityPuzzle.style.transform = `

                rotateX(${(-y * 2.4).toFixed(2)}deg)

                rotateY(${(x * 2.8).toFixed(2)}deg)

            `;

        }

    );


    communityPuzzle.addEventListener(

        "pointerleave",

        () => {

            communityPuzzle.style.transform =

                "rotateX(0deg) rotateY(0deg)";

        }

    );

}


/* =============================================================
   19. SCROLL REVEAL
============================================================= */

const revealElements = selectAll(

    ".reveal"

);


if (

    prefersReducedMotion

) {

    revealElements.forEach(

        (element) =>

            element.classList.add(

                "is-visible"

            )

    );

} else {

    const revealObserver = new IntersectionObserver(

        (

            entries,

            observer

        ) => {

            entries.forEach(

                (entry) => {

                    if (

                        entry.isIntersecting

                    ) {

                        entry.target.classList.add(

                            "is-visible"

                        );


                        observer.unobserve(

                            entry.target

                        );

                    }

                }

            );

        },

        {

            rootMargin:
                "0px 0px -10% 0px",

            threshold:
                0.08

        }

    );


    revealElements.forEach(

        (element) =>

            revealObserver.observe(

                element

            )

    );

}


/* =============================================================
   20. COMMUNICATION HUB TABS
============================================================= */

const hubTabs = selectAll(

    "[data-hub-tab]"

);


const hubPanels = selectAll(

    "[data-hub-panel]"

);


let activeHubTabName =

    "updates";


function activateHubTab(

    tabName,

    focusTab = false

) {

    activeHubTabName =

        tabName;


    hubTabs.forEach(

        (tab) => {

            const active =

                tab.dataset.hubTab

                === tabName;


            tab.classList.toggle(

                "is-active",

                active

            );


            tab.setAttribute(

                "aria-selected",

                String(active)

            );


            if (

                active

                && focusTab

            ) {

                tab.focus();

            }

        }

    );


    hubPanels.forEach(

        (panel) => {

            const active =

                panel.dataset.hubPanel

                === tabName;


            panel.classList.toggle(

                "is-active",

                active

            );


            panel.hidden =

                !active;

        }

    );


    desktopNavigationLinks.forEach(

        (link) => {

            const linkHash =

                link.getAttribute(

                    "href"

                )?.slice(1);


            if (

                tabName === "events"

            ) {

                link.classList.toggle(

                    "is-active",

                    linkHash === "events"

                );

            } else if (

                window.location.hash === "#events"

                || select("#updates")
                    ?.getBoundingClientRect()
                    .top < window.innerHeight

            ) {

                if (

                    linkHash === "events"

                    || linkHash === "updates"

                ) {

                    link.classList.toggle(

                        "is-active",

                        linkHash === "updates"

                    );

                }

            }

        }

    );

}


hubTabs.forEach(

    (

        tab,

        index

    ) => {

        tab.addEventListener(

            "click",

            () => activateHubTab(

                tab.dataset.hubTab

            )

        );


        tab.addEventListener(

            "keydown",

            (event) => {

                if (

                    ![

                        "ArrowLeft",

                        "ArrowRight",

                        "Home",

                        "End"

                    ].includes(event.key)

                ) {

                    return;

                }


                event.preventDefault();


                let targetIndex =

                    index;


                if (

                    event.key === "ArrowLeft"

                ) {

                    targetIndex =

                        (

                            index - 1

                            + hubTabs.length

                        )

                        % hubTabs.length;

                }


                if (

                    event.key === "ArrowRight"

                ) {

                    targetIndex =

                        (

                            index + 1

                        )

                        % hubTabs.length;

                }


                if (

                    event.key === "Home"

                ) {

                    targetIndex =

                        0;

                }


                if (

                    event.key === "End"

                ) {

                    targetIndex =

                        hubTabs.length - 1;

                }


                activateHubTab(

                    hubTabs[targetIndex]
                        .dataset
                        .hubTab,

                    true

                );

            }

        );

    }

);


/* =============================================================
   21. RENDER WEEKLY UPDATES
============================================================= */

const featuredUpdateContainer = select(

    "#featuredUpdate"

);


const weeklyUpdatesGrid = select(

    "#weeklyUpdatesGrid"

);


const lastUpdatedText = select(

    "#lastUpdatedText"

);


const renderWeeklyUpdates = () => {

    if (

        !featuredUpdateContainer

        || !weeklyUpdatesGrid

    ) {

        return;

    }


    const featuredUpdate =

        weeklyUpdates.find(

            (update) => update.featured

        )

        || weeklyUpdates[0];


    const secondaryUpdates =

        weeklyUpdates.filter(

            (update) =>

                update.id

                !== featuredUpdate.id

        );


    featuredUpdateContainer.innerHTML = `

        <article class="featured-update-card">

            <div class="featured-update-card__content">

                <span class="featured-update-card__badge">

                    <span

                        class="live-dot"

                        aria-hidden="true"

                    ></span>

                    ${escapeHtml(featuredUpdate.category)}

                </span>

                <h3>

                    ${escapeHtml(featuredUpdate.title)}

                </h3>

                <p>

                    ${escapeHtml(featuredUpdate.summary)}

                </p>

            </div>

            <div class="featured-update-card__meta">

                <span>

                    <svg aria-hidden="true">

                        <use href="#icon-calendar"></use>

                    </svg>

                    ${escapeHtml(featuredUpdate.dateLabel)}

                </span>

                <span>

                    <svg aria-hidden="true">

                        <use href="#icon-people"></use>

                    </svg>

                    ${escapeHtml(featuredUpdate.audience)}

                </span>

                <button

                    type="button"

                    class="button button--primary button--small"

                    data-update-id="${escapeHtml(featuredUpdate.id)}"

                >

                    Read full update

                </button>

            </div>

        </article>

    `;


    weeklyUpdatesGrid.innerHTML = secondaryUpdates

        .map(

            (update) => `

                <article class="update-card">

                    <div class="update-card__top">

                        <span class="update-card__tag">

                            ${escapeHtml(update.category)}

                        </span>

                        <span class="update-card__date">

                            ${escapeHtml(update.dateLabel)}

                        </span>

                    </div>

                    <h3>

                        ${escapeHtml(update.title)}

                    </h3>

                    <p>

                        ${escapeHtml(update.summary)}

                    </p>

                    <button

                        type="button"

                        class="card-action"

                        data-update-id="${escapeHtml(update.id)}"

                    >

                        Read details →

                    </button>

                </article>

            `

        )

        .join("");


    const latestLabel =

        weeklyUpdates[0]?.dateLabel

        || "Updated recently";


    if (

        lastUpdatedText

    ) {

        lastUpdatedText.textContent =

            latestLabel;

    }

};


/* =============================================================
   22. RENDER WEEKLY SCHEDULE
============================================================= */

const weeklyScheduleList = select(

    "#weeklyScheduleList"

);


const printScheduleButton = select(

    "#printScheduleButton"

);


const renderWeeklySchedule = () => {

    if (

        !weeklyScheduleList

    ) {

        return;

    }


    weeklyScheduleList.innerHTML = weeklySchedule

        .map(

            (item) => `

                <article class="schedule-row">

                    <div class="schedule-row__day">

                        <svg aria-hidden="true">

                            <use href="#icon-calendar"></use>

                        </svg>

                        ${escapeHtml(item.day)}

                    </div>

                    <div class="schedule-row__time">

                        ${escapeHtml(item.time)}

                    </div>

                    <div class="schedule-row__activity">

                        <strong>

                            ${escapeHtml(item.activity)}

                        </strong>

                        <small>

                            ${escapeHtml(item.description)}

                        </small>

                    </div>

                    <span class="schedule-row__audience">

                        ${escapeHtml(item.audience)}

                    </span>

                </article>

            `

        )

        .join("");

};


printScheduleButton?.addEventListener(

    "click",

    () => {

        activateHubTab(

            "schedule"

        );


        window.setTimeout(

            () => window.print(),

            100

        );

    }

);


/* =============================================================
   23. RENDER AND FILTER UPCOMING EVENTS
============================================================= */

const upcomingEventsGrid = select(

    "#upcomingEventsGrid"

);


const eventFilterButtons = selectAll(

    "[data-event-filter]"

);


let activeEventFilter =

    "all";


const renderUpcomingEvents = (

    filter = "all"

) => {

    if (

        !upcomingEventsGrid

    ) {

        return;

    }


    const filteredEvents = upcomingEvents.filter(

        (event) => {

            if (

                filter === "all"

            ) {

                return true;

            }


            if (

                event.audience === "everyone"

            ) {

                return true;

            }


            return event.audience === filter;

        }

    );


    if (

        !filteredEvents.length

    ) {

        upcomingEventsGrid.innerHTML = `

            <div class="event-card">

                <h3>

                    No events in this category yet

                </h3>

                <p>

                    Add an event in the upcomingEvents
                    array near the top of script.js.

                </p>

            </div>

        `;


        return;

    }


    upcomingEventsGrid.innerHTML = filteredEvents

        .map(

            (event) => {

                const isPrivate =

                    event.privateDetails === true;


                const date =

                    isPrivate

                        ? {

                            day:
                                "Private",

                            month:
                                "Info",

                            long:
                                event.publicDateLabel || "Shared privately"

                        }

                        : formatEventDate(

                            event.date

                        );


                const timeLabel =

                    isPrivate

                        ? event.publicTimeLabel || "Shared privately"

                        : `${formatTime(event.startTime)} – ${formatTime(event.endTime)}`;


                const locationLabel =

                    isPrivate

                        ? event.publicLocationLabel || "Shared privately"

                        : event.location;


                return `

                    <article

                        class="event-card"

                        data-audience="${escapeHtml(event.audience)}"

                    >

                        <div class="event-card__date">

                            <strong>

                                ${escapeHtml(date.day)}

                            </strong>

                            <span>

                                ${escapeHtml(date.month)}

                            </span>

                        </div>

                        <span class="event-card__audience">

                            ${escapeHtml(event.audienceLabel)}

                        </span>

                        <h3>

                            ${escapeHtml(event.title)}

                        </h3>

                        <p>

                            ${escapeHtml(event.summary)}

                        </p>

                        <div class="event-card__details">

                            <span>

                                <svg aria-hidden="true">

                                    <use href="#icon-calendar"></use>

                                </svg>

                                ${escapeHtml(date.long)}

                            </span>

                            <span>

                                <svg aria-hidden="true">

                                    <use href="#icon-clock"></use>

                                </svg>

                                ${escapeHtml(timeLabel)}

                            </span>

                            <span>

                                <svg aria-hidden="true">

                                    <use href="#icon-pin"></use>

                                </svg>

                                ${escapeHtml(locationLabel)}

                            </span>

                        </div>

                        <div class="event-card__actions">

                            <button

                                type="button"

                                data-event-details="${escapeHtml(event.id)}"

                            >

                                View details

                            </button>

                            <button

                                type="button"

                                data-private-trigger="event"

                                data-event-calendar="${escapeHtml(event.id)}"

                            >

                                Request details

                            </button>

                        </div>

                    </article>

                `;

            }

        )

        .join("");

};


eventFilterButtons.forEach(

    (button) => {

        button.addEventListener(

            "click",

            () => {

                activeEventFilter =

                    button.dataset.eventFilter;


                eventFilterButtons.forEach(

                    (otherButton) => {

                        otherButton.classList.toggle(

                            "is-active",

                            otherButton === button

                        );

                    }

                );


                renderUpcomingEvents(

                    activeEventFilter

                );

            }

        );

    }

);


/* =============================================================
   24. DOWNLOAD CALENDAR EVENT
============================================================= */

const downloadCalendarEvent = (

    eventData

) => {

    if (

        eventData.privateDetails === true

    ) {

        openFamilyPortalNotice(

            "Calendar details are intentionally private. Please use the Family Portal or contact the program for approved event details."

        );


        return;

    }


    const startDate = createLocalDate(

        eventData.date,

        eventData.startTime

    );


    const endDate = createLocalDate(

        eventData.date,

        eventData.endTime

    );


    const now = new Date();


    const icsContent = [

        "BEGIN:VCALENDAR",

        "VERSION:2.0",

        "PRODID:-//Heads Up Afterschool Program//Events//EN",

        "CALSCALE:GREGORIAN",

        "METHOD:PUBLISH",

        "BEGIN:VEVENT",

        `UID:${eventData.id}-${Date.now()}@headsup.local`,

        `DTSTAMP:${formatICSDate(now)}`,

        `DTSTART:${formatICSDate(startDate)}`,

        `DTEND:${formatICSDate(endDate)}`,

        `SUMMARY:${eventData.title.replaceAll(",", "\\,")}`,

        `DESCRIPTION:${eventData.summary
            .replaceAll("\n", "\\n")
            .replaceAll(",", "\\,")}`,

        `LOCATION:${eventData.location.replaceAll(",", "\\,")}`,

        "END:VEVENT",

        "END:VCALENDAR"

    ].join("\r\n");


    const blob = new Blob(

        [icsContent],

        {

            type:
                "text/calendar;charset=utf-8"

        }

    );


    const downloadUrl = URL.createObjectURL(

        blob

    );


    const downloadLink = document.createElement(

        "a"

    );


    downloadLink.href =

        downloadUrl;


    downloadLink.download =

        `${eventData.id}.ics`;


    document.body.appendChild(

        downloadLink

    );


    downloadLink.click();


    downloadLink.remove();


    URL.revokeObjectURL(

        downloadUrl

    );


    showToast({

        title:
            "Calendar file ready",

        message:
            "Open the downloaded file to add this event to your calendar.",

        type:
            "success"

    });

};


/* =============================================================
   25. ANNOUNCEMENT TICKER
============================================================= */

const announcementTickerText = select(

    "#announcementTickerText"

);


let announcementIndex =

    0;


const rotateAnnouncement = () => {

    if (

        !announcementTickerText

        || prefersReducedMotion

    ) {

        return;

    }


    announcementTickerText.style.opacity =

        "0";


    announcementTickerText.style.transform =

        "translateY(0.25rem)";


    window.setTimeout(

        () => {

            announcementIndex =

                (

                    announcementIndex + 1

                )

                % announcementMessages.length;


            announcementTickerText.textContent =

                announcementMessages[
                    announcementIndex
                ];


            announcementTickerText.style.opacity =

                "1";


            announcementTickerText.style.transform =

                "translateY(0)";

        },

        260

    );

};


if (

    announcementTickerText

) {

    announcementTickerText.style.transition =

        "opacity 260ms ease, transform 260ms ease";


    if (

        !prefersReducedMotion

    ) {

        window.setInterval(

            rotateAnnouncement,

            7600

        );

    }

}


/* =============================================================
   26. ACCESSIBLE MODAL SYSTEM
============================================================= */

const siteModal = select(

    "#siteModal"

);


const modalTitle = select(

    "#modalTitle"

);


const modalEyebrow = select(

    "#modalEyebrow"

);


const modalBody = select(

    "#modalBody"

);


const modalActions = select(

    "#modalActions"

);


let lastFocusedElement =

    null;


const getModalFocusableElements = () => {

    if (

        !siteModal

    ) {

        return [];

    }


    return selectAll(

        `button:not([disabled]),
        a[href],
        input:not([disabled]),
        select:not([disabled]),
        textarea:not([disabled]),
        [tabindex]:not([tabindex="-1"])`,

        siteModal

    ).filter(

        (element) =>

            !element.hidden

            && element.offsetParent !== null

    );

};


const closeModal = () => {

    if (

        !siteModal

    ) {

        return;

    }


    siteModal.hidden =

        true;


    document.body.classList.remove(

        "modal-is-open"

    );


    if (

        lastFocusedElement

        instanceof HTMLElement

    ) {

        lastFocusedElement.focus();

    }

};


const createModalAction = (

    action

) => {

    if (

        action.href

    ) {

        const link = document.createElement(

            "a"

        );


        link.href =

            action.href;


        link.textContent =

            action.label;


        if (

            action.primary

        ) {

            link.classList.add(

                "modal-primary-action"

            );

        }


        link.addEventListener(

            "click",

            (event) => {

                closeModal();


                if (

                    action.href === "#events"

                ) {

                    event.preventDefault();


                    activateHubTab(

                        "events"

                    );


                    scrollToElement(

                        select("#updates")

                    );


                    history.replaceState(

                        null,

                        "",

                        "#events"

                    );

                }

            }

        );


        return link;

    }


    const button = document.createElement(

        "button"

    );


    button.type =

        "button";


    button.textContent =

        action.label;


    if (

        action.primary

    ) {

        button.classList.add(

            "modal-primary-action"

        );

    }


    if (

        action.close

    ) {

        button.addEventListener(

            "click",

            closeModal

        );

    }


    if (

        action.prefill

    ) {

        button.addEventListener(

            "click",

            () => {

                closeModal();


                prefillContactForm(

                    action.prefill

                );

            }

        );

    }


    if (

        action.resource

    ) {

        button.addEventListener(

            "click",

            () => {

                const nextContent =

                    resourceLibrary[
                        action.resource
                    ];


                if (

                    nextContent

                ) {

                    openModal(

                        nextContent

                    );

                }

            }

        );

    }


    if (

        action.modal

    ) {

        button.addEventListener(

            "click",

            () => {

                const nextContent =

                    contentLibrary[
                        action.modal
                    ];


                if (

                    nextContent

                ) {

                    openModal(

                        nextContent

                    );

                }

            }

        );

    }


    return button;

};


function openModal(

    content

) {

    if (

        !siteModal

        || !content

    ) {

        return;

    }


    lastFocusedElement =

        document.activeElement;


    modalEyebrow.textContent =

        content.eyebrow

        || "Heads Up";


    modalTitle.textContent =

        content.title

        || "Information";


    modalBody.innerHTML =

        content.body

        || "";


    modalActions.innerHTML =

        "";


    (

        content.actions

        || [

            {

                label:
                    "Close",

                close:
                    true

            }

        ]

    ).forEach(

        (action) => {

            modalActions.appendChild(

                createModalAction(action)

            );

        }

    );


    siteModal.hidden =

        false;


    document.body.classList.add(

        "modal-is-open"

    );


    window.setTimeout(

        () => {

            select(

                ".modal__close",

                siteModal

            )?.focus();

        },

        40

    );

}


selectAll(

    "[data-close-modal]"

).forEach(

    (element) => {

        element.addEventListener(

            "click",

            closeModal

        );

    }

);


siteModal?.addEventListener(

    "keydown",

    (event) => {

        if (

            event.key === "Escape"

        ) {

            closeModal();

            return;

        }


        if (

            event.key !== "Tab"

        ) {

            return;

        }


        const focusableElements =

            getModalFocusableElements();


        if (

            !focusableElements.length

        ) {

            return;

        }


        const firstElement =

            focusableElements[0];


        const lastElement =

            focusableElements[
                focusableElements.length - 1
            ];


        if (

            event.shiftKey

            && document.activeElement === firstElement

        ) {

            event.preventDefault();


            lastElement.focus();

        } else if (

            !event.shiftKey

            && document.activeElement === lastElement

        ) {

            event.preventDefault();


            firstElement.focus();

        }

    }

);


/* =============================================================
   27. DYNAMIC BUTTON EVENT DELEGATION
============================================================= */

document.addEventListener(

    "click",

    (event) => {

        const updateButton =

            event.target.closest(

                "[data-update-id]"

            );


        const eventDetailsButton =

            event.target.closest(

                "[data-event-details]"

            );


        const eventCalendarButton =

            event.target.closest(

                "[data-event-calendar]"

            );


        const resourceButton =

            event.target.closest(

                "[data-resource]"

            );


        const teamButton =

            event.target.closest(

                "[data-team]"

            );


        const modalContentButton =

            event.target.closest(

                "[data-modal-content]"

            );


        const prefillButton =

            event.target.closest(

                "[data-prefill-subject]"

            );


        if (

            updateButton

        ) {

            const update = weeklyUpdates.find(

                (item) =>

                    item.id

                    === updateButton.dataset.updateId

            );


            if (

                update

            ) {

                openModal({

                    eyebrow:
                        update.category,

                    title:
                        update.title,

                    body:
                        `
                            <p>
                                <strong>
                                    ${escapeHtml(update.dateLabel)}
                                </strong>
                            </p>

                            <p>
                                ${escapeHtml(update.summary)}
                            </p>

                            ${update.details}
                        `,

                    actions: [

                        {

                            label:
                                "View schedule",

                            href:
                                "#events",

                            primary:
                                true

                        },

                        {

                            label:
                                "Contact Heads Up",

                            href:
                                "#contact"

                        }

                    ]

                });

            }

        }


        if (

            eventDetailsButton

        ) {

            const eventData = upcomingEvents.find(

                (item) =>

                    item.id

                    === eventDetailsButton
                        .dataset
                        .eventDetails

            );


            if (

                eventData

            ) {

                const date =

                    formatEventDate(

                        eventData.date

                    );


                openModal({

                    eyebrow:
                        `${eventData.audienceLabel} event`,

                    title:
                        eventData.title,

                    body:
                        `
                            <p>
                                <strong>
                                    ${escapeHtml(date.long)}
                                </strong>

                                <br>

                                ${escapeHtml(formatTime(eventData.startTime))}
                                –
                                ${escapeHtml(formatTime(eventData.endTime))}

                                <br>

                                ${escapeHtml(eventData.location)}
                            </p>

                            <p>
                                ${escapeHtml(eventData.summary)}
                            </p>

                            ${eventData.details}
                        `,

                    actions: [

                        {

                            label:
                                "Add to calendar",

                            primary:
                                true,

                            close:
                                false

                        },

                        {

                            label:
                                "Ask about this event",

                            prefill:
                                `Question about ${eventData.title}`

                        }

                    ]

                });


                const firstModalAction = select(

                    ".modal__actions button",

                    siteModal

                );


                firstModalAction?.addEventListener(

                    "click",

                    () => downloadCalendarEvent(

                        eventData

                    ),

                    {

                        once:
                            true

                    }

                );

            }

        }


        if (

            eventCalendarButton

        ) {

            const eventData = upcomingEvents.find(

                (item) =>

                    item.id

                    === eventCalendarButton
                        .dataset
                        .eventCalendar

            );


            if (

                eventData

            ) {

                downloadCalendarEvent(

                    eventData

                );

            }

        }


        if (

            resourceButton

        ) {

            const resource = resourceLibrary[

                resourceButton.dataset.resource

            ];


            if (

                resource

            ) {

                openModal(

                    resource

                );

            }

        }


        if (

            teamButton

        ) {

            const teamContent = teamLibrary[

                teamButton.dataset.team

            ];


            if (

                teamContent

            ) {

                openModal(

                    teamContent

                );

            }

        }


        if (

            modalContentButton

        ) {

            const modalContent = contentLibrary[

                modalContentButton
                    .dataset
                    .modalContent

            ];


            if (

                modalContent

            ) {

                openModal(

                    modalContent

                );

            }

        }


        if (

            prefillButton

        ) {

            prefillContactForm(

                prefillButton.dataset.prefillSubject

                || "Website question"

            );

        }

    }

);


/* =============================================================
   28. GALLERY CONTROLS
============================================================= */

const galleryTrack = select(

    "#galleryTrack"

);


const galleryMarquee = select(

    "#galleryMarquee"

);


const galleryToggle = select(

    "#galleryToggle"

);


const galleryPrevious = select(

    "#galleryPrevious"

);


const galleryNext = select(

    "#galleryNext"

);


const duplicateGalleryCards = () => {

    if (

        !galleryTrack

        || galleryTrack.dataset.cloned === "true"

    ) {

        return;

    }


    const originalCards = selectAll(

        ".gallery-card",

        galleryTrack

    );


    originalCards.forEach(

        (card) => {

            const clone = card.cloneNode(

                true

            );


            clone.setAttribute(

                "aria-hidden",

                "true"

            );


            clone.querySelectorAll(

                "[id]"

            ).forEach(

                (element) =>

                    element.removeAttribute("id")

            );


            galleryTrack.appendChild(

                clone

            );

        }

    );


    galleryTrack.dataset.cloned =

        "true";

};


const setGalleryPaused = (

    paused

) => {

    if (

        !galleryTrack

        || !galleryToggle

    ) {

        return;

    }


    galleryTrack.classList.toggle(

        "is-paused",

        paused

    );


    galleryToggle.setAttribute(

        "aria-pressed",

        String(paused)

    );


    galleryToggle.setAttribute(

        "aria-label",

        paused

            ? "Resume gallery movement"

            : "Pause gallery movement"

    );

};


const scrollGalleryByCard = (

    direction

) => {

    if (

        !galleryMarquee

    ) {

        return;

    }


    setGalleryPaused(

        true

    );


    const firstCard = select(

        ".gallery-card",

        galleryTrack

    );


    const cardWidth =

        firstCard
            ?.getBoundingClientRect()
            .width

        || 320;


    galleryMarquee.scrollBy({

        left:
            direction
            * (
                cardWidth
                + 16
            ),

        behavior:
            prefersReducedMotion

                ? "auto"

                : "smooth"

    });

};


duplicateGalleryCards();


galleryToggle?.addEventListener(

    "click",

    () => {

        const paused =

            galleryToggle.getAttribute(

                "aria-pressed"

            ) === "true";


        setGalleryPaused(

            !paused

        );

    }

);


galleryPrevious?.addEventListener(

    "click",

    () => scrollGalleryByCard(-1)

);


galleryNext?.addEventListener(

    "click",

    () => scrollGalleryByCard(1)

);


/* =============================================================
   29. FAQ ACCORDION
============================================================= */

selectAll(

    ".faq-question"

).forEach(

    (question) => {

        question.addEventListener(

            "click",

            () => {

                const item =

                    question.closest(

                        ".faq-item"

                    );


                const answer = select(

                    ".faq-answer",

                    item

                );


                const expanded =

                    question.getAttribute(

                        "aria-expanded"

                    ) === "true";


                question.setAttribute(

                    "aria-expanded",

                    String(!expanded)

                );


                answer.hidden =

                    expanded;

            }

        );

    }

);


/* =============================================================
   30. CONTACT FORM PREFILL
============================================================= */

const contactForm = select(

    "#contactForm"

);


const contactName = select(

    "#contactName"

);


const contactEmail = select(

    "#contactEmail"

);


const contactAudience = select(

    "#contactAudience"

);


const contactSubject = select(

    "#contactSubject"

);


const contactMessage = select(

    "#contactMessage"

);


function prefillContactForm(

    subject,

    message = ""

) {

    if (

        !contactForm

        || !contactSubject

    ) {

        return;

    }


    closeModal();


    contactSubject.value =

        subject;


    if (

        message

        && contactMessage

    ) {

        contactMessage.value =

            message;

    }


    scrollToElement(

        select("#contact")

    );


    window.setTimeout(

        () => {

            contactName?.focus();

        },

        500

    );

}


/* =============================================================
   31. CONTACT FORM VALIDATION
============================================================= */

const setFieldError = (

    field,

    errorElementId,

    message

) => {

    if (

        !field

    ) {

        return;

    }


    const formField = field.closest(

        ".form-field"

    );


    const errorElement = select(

        `#${errorElementId}`

    );


    formField?.classList.toggle(

        "has-error",

        Boolean(message)

    );


    field.setAttribute(

        "aria-invalid",

        String(Boolean(message))

    );


    if (

        message

    ) {

        field.setAttribute(

            "aria-describedby",

            errorElementId

        );

    } else {

        field.removeAttribute(

            "aria-describedby"

        );

    }


    if (

        errorElement

    ) {

        errorElement.textContent =

            message;

    }

};


const validateContactForm = () => {

    let valid =

        true;


    if (

        !contactName?.value.trim()

    ) {

        setFieldError(

            contactName,

            "contactNameError",

            "Please enter your name."

        );


        valid =

            false;

    } else {

        setFieldError(

            contactName,

            "contactNameError",

            ""

        );

    }


    const emailValue =

        contactEmail?.value.trim()

        || "";


    const emailValid =

        /^[^\s@]+@[^\s@]+\.[^\s@]+$/

            .test(emailValue);


    if (

        !emailValid

    ) {

        setFieldError(

            contactEmail,

            "contactEmailError",

            "Please enter a valid email address."

        );


        valid =

            false;

    } else {

        setFieldError(

            contactEmail,

            "contactEmailError",

            ""

        );

    }


    if (

        !contactSubject?.value.trim()

    ) {

        setFieldError(

            contactSubject,

            "contactSubjectError",

            "Please add a subject."

        );


        valid =

            false;

    } else {

        setFieldError(

            contactSubject,

            "contactSubjectError",

            ""

        );

    }


    if (

        !contactMessage?.value.trim()

    ) {

        setFieldError(

            contactMessage,

            "contactMessageError",

            "Please write a message."

        );


        valid =

            false;

    } else {

        setFieldError(

            contactMessage,

            "contactMessageError",

            ""

        );

    }


    return valid;

};


/* =============================================================
   32. CONTACT FORM EMAIL APPLICATION FALLBACK
============================================================= */

contactForm?.addEventListener(

    "submit",

    (event) => {

        event.preventDefault();


        if (

            !validateContactForm()

        ) {

            showToast({

                title:
                    "Please review the form",

                message:
                    "A few required fields need attention before your message can be prepared.",

                type:
                    "danger"

            });


            return;

        }


        const recipient =

            contactForm.dataset.recipient

            || "placeholder@email.com";


        const subject =

            `[Heads Up Website] ${contactSubject.value.trim()}`;


        const body = [

            `Name: ${contactName.value.trim()}`,

            `Email: ${contactEmail.value.trim()}`,

            `Audience: ${contactAudience.value}`,

            "",

            "Message:",

            contactMessage.value.trim()

        ].join("\n");


        const mailtoUrl =

            `mailto:${encodeURIComponent(recipient)}`

            + `?subject=${encodeURIComponent(subject)}`

            + `&body=${encodeURIComponent(body)}`;


        showToast({

            title:
                "Opening your email application",

            message:
                "Your message has been prepared. Review it in your email app before sending.",

            type:
                "success"

        });


        window.location.href =

            mailtoUrl;

    }

);


/* =============================================================
   33. NEWSLETTER EMAIL FALLBACK
============================================================= */

const newsletterForm = select(

    "#newsletterForm"

);


const newsletterEmail = select(

    "#newsletterEmail"

);


newsletterForm?.addEventListener(

    "submit",

    (event) => {

        event.preventDefault();


        const emailValue =

            newsletterEmail?.value.trim()

            || "";


        const emailValid =

            /^[^\s@]+@[^\s@]+\.[^\s@]+$/

                .test(emailValue);


        if (

            !emailValid

        ) {

            showToast({

                title:
                    "Enter a valid email",

                message:
                    "Please check the email address before continuing.",

                type:
                    "warning"

            });


            newsletterEmail?.focus();


            return;

        }


        const recipient =

            newsletterForm.dataset.recipient

            || "placeholder@email.com";


        const subject =

            "Heads Up updates subscription request";


        const body =

            `Please add this email address to the approved Heads Up updates list:\n\n${emailValue}`;


        showToast({

            title:
                "Subscription request prepared",

            message:
                "Your email application will open with a subscription request.",

            type:
                "success"

        });


        window.location.href =

            `mailto:${encodeURIComponent(recipient)}`

            + `?subject=${encodeURIComponent(subject)}`

            + `&body=${encodeURIComponent(body)}`;

    }

);


/* =============================================================
   34. FLOATING QUICK ACTION MENU
============================================================= */

const floatingActions = select(

    "#floatingActions"

);


const floatingActionsToggle = select(

    "#floatingActionsToggle"

);


const floatingActionsMenu = select(

    "#floatingActionsMenu"

);


const setFloatingActionsState = (

    open

) => {

    if (

        !floatingActionsToggle

        || !floatingActionsMenu

    ) {

        return;

    }


    floatingActionsToggle.setAttribute(

        "aria-expanded",

        String(open)

    );


    floatingActionsMenu.hidden =

        !open;

};


floatingActionsToggle?.addEventListener(

    "click",

    (event) => {

        event.stopPropagation();


        const isOpen =

            floatingActionsToggle.getAttribute(

                "aria-expanded"

            ) === "true";


        setFloatingActionsState(

            !isOpen

        );

    }

);


floatingActionsMenu?.addEventListener(

    "click",

    () => {

        setFloatingActionsState(

            false

        );

    }

);


document.addEventListener(

    "click",

    (event) => {

        if (

            floatingActions

            && !floatingActions.contains(

                event.target

            )

        ) {

            setFloatingActionsState(

                false

            );

        }

    }

);


/* =============================================================
   35. GLOBAL KEYBOARD CONTROLS
============================================================= */

document.addEventListener(

    "keydown",

    (event) => {

        if (

            event.key !== "Escape"

        ) {

            return;

        }


        setExploreMenuState(

            false

        );


        setFloatingActionsState(

            false

        );


        if (

            mobileMenuButton
                ?.getAttribute("aria-expanded")

            === "true"

        ) {

            setMobileNavState(

                false

            );


            mobileMenuButton.focus();

        }


        if (

            siteModal

            && !siteModal.hidden

        ) {

            closeModal();

        }

    }

);


/* =============================================================
   36. INITIAL HASH ROUTING
============================================================= */

const handleInitialHash = () => {

    if (

        window.location.hash === "#events"

    ) {

        activateHubTab(

            "events"

        );


        window.setTimeout(

            () => scrollToElement(

                select("#updates")

            ),

            120

        );

    }

};


/* =============================================================
   37. CURRENT YEAR
============================================================= */

const currentYear = select(

    "#currentYear"

);


if (

    currentYear

) {

    currentYear.textContent =

        String(

            new Date().getFullYear()

        );

}


/* =============================================================
   38. INITIALIZE WEBSITE
============================================================= */

const initializeWebsite = () => {

    renderWeeklyUpdates();


    renderWeeklySchedule();


    renderUpcomingEvents(

        activeEventFilter

    );


    activateHubTab(

        "updates"

    );


    handleInitialHash();

};


initializeWebsite();


/* =============================================================
   39. DEVELOPMENT CHECKS
============================================================= */

const developmentChecks = () => {

    const placeholderElements = selectAll(

        "body *"

    ).filter(

        (element) => {

            if (

                element.children.length > 0

            ) {

                return false;

            }


           const placeholderPattern =
    /placeholder@email\.com|\(000\) 000-0000|Placeholder Address/i;

return placeholderPattern.test(
    element.textContent || ""
);

        }

    );


    if (

        placeholderElements.length

    ) {

        console.info(

            "Heads Up reminder: Replace the placeholder email, phone number, address, dates, images, and approved content before publishing."

        );

    }


    const duplicateIds = selectAll(

        "[id]"

    )

        .map(

            (element) => element.id

        )

        .filter(

            (

                id,

                index,

                ids

            ) =>

                ids.indexOf(id)

                !== index

        );


    if (

        duplicateIds.length

    ) {

        console.warn(

            "Duplicate HTML IDs detected:",

            duplicateIds

        );

    }

};


developmentChecks();




/* =============================================================
   40. MOBILE QUICK DOCK ACTIVE STATE
============================================================= */

const mobileQuickDockLinks = selectAll(

    ".mobile-quick-dock__item[href^='#']"

);


if (

    mobileQuickDockLinks.length

) {

    const mobileDockSections = selectAll(

        "#home, #updates, #contact"

    );


    const mobileDockObserver = new IntersectionObserver(

        (entries) => {

            const visibleEntry = entries

                .filter((entry) => entry.isIntersecting)

                .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];


            if (

                !visibleEntry

            ) {

                return;

            }


            let activeHash =

                `#${visibleEntry.target.id}`;


            if (

                visibleEntry.target.id === "updates"

                && typeof activeHubTabName !== "undefined"

                && activeHubTabName === "events"

            ) {

                activeHash =

                    "#events";

            }


            mobileQuickDockLinks.forEach((link) => {

                const active =

                    link.getAttribute("href") === activeHash;


                link.classList.toggle(

                    "is-active",

                    active

                );


                if (

                    active

                ) {

                    link.setAttribute("aria-current", "page");

                } else {

                    link.removeAttribute("aria-current");

                }

            });

        },

        {

            rootMargin:
                "-35% 0px -55% 0px",

            threshold:
                [0, .1, .25, .5]

        }

    );


    mobileDockSections.forEach((section) => {

        mobileDockObserver.observe(section);

    });

}




/* =============================================================
   41. CHILD-SAFE PAGE ROUTING AND FAMILY PORTAL PATCH

   WHY THIS WAS ADDED
   -------------------------------------------------------------
   Feedback requested that the website should not feel like one
   endless scrolling page. This patch keeps the existing sections
   and design, but turns the major navigation links into page-like
   views. Visitors click a link and the website shows the relevant
   section instead of forcing them to scroll through everything.

   CHILD SAFETY AND PRIVACY SOLUTION
   -------------------------------------------------------------
   A public website should not contain private schedules, exact
   child-related locations, attendance information, or sensitive
   updates in HTML, CSS, or JavaScript. This frontend includes a
   Family Portal design placeholder, but the final live version
   should connect to a real authentication system and backend.
============================================================= */

const routeMap = {

    "#home": [

        "home",

        "about",

        "updates",

        "contact"

    ],

    "#about": [

        "about",

        "contact"

    ],

    "#programs": [

        "programs",

        "contact"

    ],

    "#updates": [

        "updates",

        "portal",

        "contact"

    ],

    "#events": [

        "updates",

        "portal",

        "contact"

    ],

    "#portal": [

        "portal",

        "updates",

        "contact"

    ],

    "#gallery": [

        "gallery",

        "stories",

        "contact"

    ],

    "#stories": [

        "stories",

        "gallery",

        "contact"

    ],

    "#resources": [

        "resources",

        "faq",

        "contact"

    ],

    "#team": [

        "team",

        "stories",

        "contact"

    ],

    "#faq": [

        "faq",

        "resources",

        "contact"

    ],

    "#contact": [

        "contact"

    ]

};


const pageRouteSections = selectAll(

    "main > section[id]"

);


const normalizeRouteHash = (

    hash

) => {

    if (

        !hash

        || hash === "#"

    ) {

        return "#home";

    }


    return routeMap[hash]

        ? hash

        : "#home";

};


const updateRouteVisibility = (

    hashValue = window.location.hash

) => {

    const routeHash =

        normalizeRouteHash(

            hashValue

        );


    const visibleIds =

        routeMap[routeHash];


    document.body.classList.add(

        "page-routing-enabled"

    );


    pageRouteSections.forEach(

        (section) => {

            const visible =

                visibleIds.includes(

                    section.id

                );


            section.hidden =

                !visible;


            section.classList.toggle(

                "is-route-visible",

                visible

            );


            section.classList.toggle(

                "is-route-hidden",

                !visible

            );

        }

    );


    if (

        routeHash === "#events"

    ) {

        activateHubTab(

            "events"

        );

    }


    if (

        routeHash === "#updates"

    ) {

        activateHubTab(

            "updates"

        );

    }


    if (

        routeHash === "#portal"

    ) {

        updatePortalStatus(

            "Portal access is a frontend preview. Connect a real login before publishing private schedules."

        );

    }


    const routeTarget =

        routeHash === "#events"

            ? select(

                "#updates"

            )

            : select(

                routeHash

            );


    if (

        routeTarget

    ) {

        window.setTimeout(

            () => {

                routeTarget.scrollIntoView({

                    behavior:
                        prefersReducedMotion

                            ? "auto"

                            : "smooth",

                    block:
                        "start"

                });

            },

            35

        );

    }


    updateNavigationCurrentStates(

        routeHash

    );

};


const updateNavigationCurrentStates = (

    routeHash

) => {

    const allRouteLinks = selectAll(

        "a[href^='#']"

    ).filter(

        (link) => routeMap[link.getAttribute("href")]

    );


    allRouteLinks.forEach(

        (link) => {

            const href =

                link.getAttribute(

                    "href"

                );


            const active =

                href === routeHash

                || (

                    routeHash === "#events"

                    && href === "#updates"

                );


            link.classList.toggle(

                "is-route-current",

                active

            );


            if (

                active

            ) {

                link.setAttribute(

                    "aria-current",

                    "page"

                );

            } else {

                link.removeAttribute(

                    "aria-current"

                );

            }

        }

    );

};


/* =============================================================
   42. FAMILY PORTAL FRONTEND PLACEHOLDER

   IMPORTANT:
   This is NOT a secure login. It is a visual/frontend preview
   that explains how private access should work. For a real
   deployment, do not put exact private schedule data in this file.
============================================================= */

const portalLoginForm = select(

    "#portalLoginForm"

);


const portalStatus = select(

    "#portalStatus"

);


const DEMO_PORTAL_CODE =

    "HEADSUP-DEMO";


const updatePortalStatus = (

    message,

    type = "info"

) => {

    if (

        !portalStatus

    ) {

        return;

    }


    portalStatus.textContent =

        message;


    portalStatus.dataset.status =

        type;

};


const openFamilyPortalNotice = (

    message = "Private event details should be shared through the Family Portal or approved direct communication."

) => {

    window.location.hash =

        "#portal";


    updateRouteVisibility(

        "#portal"

    );


    updatePortalStatus(

        message,

        "warning"

    );


    showToast({

        title:
            "Private details protected",

        message,

        type:
            "warning"

    });

};


portalLoginForm?.addEventListener(

    "submit",

    (event) => {

        event.preventDefault();


        const formData =

            new FormData(

                portalLoginForm

            );


        const accessCode =

            String(

                formData.get(

                    "portalAccessCode"

                ) || ""

            )

                .trim();


        if (

            accessCode === DEMO_PORTAL_CODE

        ) {

            updatePortalStatus(

                "Preview access opened. In the final website, this area should be powered by real authentication and a protected backend database.",

                "success"

            );


            showToast({

                title:
                    "Portal preview opened",

                message:
                    "This confirms the user flow only. Replace it with real authentication before publishing private details.",

                type:
                    "success"

            });

        } else {

            updatePortalStatus(

                "Access was not opened. For real use, families and approved team members should receive access through the official program process.",

                "warning"

            );


            showToast({

                title:
                    "Portal access needed",

                message:
                    "Use the official program contact path for schedule details.",

                type:
                    "warning"

            });

        }

    }

);


/* =============================================================
   43. PROTECT PRIVATE DETAIL ACTIONS
============================================================= */

document.addEventListener(

    "click",

    (event) => {

        const privateTrigger =

            event.target.closest(

                "[data-private-trigger]"

            );


        if (

            !privateTrigger

        ) {

            return;

        }


        event.preventDefault();


        openFamilyPortalNotice(

            "This action leads to private schedule information. Please use the Family Portal or contact the program for approved details."

        );

    }

);


/* =============================================================
   44. ROUTE INITIALIZATION

   This runs after the original website initialization so it
   preserves all current rendering, animations, modals, filters,
   forms, gallery controls, and existing layout behavior.
============================================================= */

window.addEventListener(

    "hashchange",

    () => updateRouteVisibility(

        window.location.hash

    )

);


selectAll(

    "a[href^='#']"

).forEach(

    (link) => {

        const href =

            link.getAttribute(

                "href"

            );


        if (

            routeMap[href]

        ) {

            link.addEventListener(

                "click",

                () => {

                    if (typeof closeMobileNavigation === 'function') { closeMobileNavigation(); }


                    window.setTimeout(

                        () => updateRouteVisibility(

                            href

                        ),

                        10

                    );

                }

            );

        }

    }

);


updateRouteVisibility(

    window.location.hash || "#home"

);


/* =============================================================
   45. FINAL SAFETY NOTE IN CONSOLE

   This helps future maintainers remember not to paste sensitive
   program details directly into public source files.
============================================================= */

console.info(

    "Heads Up privacy reminder: keep exact schedules, locations, and child-specific updates out of public source code. Use a real authenticated backend for private details."

);
