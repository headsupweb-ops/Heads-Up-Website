/* =====================================================================
   HEADS UP WEBSITE — SCRIPT.JS MAINTAINER READING GUIDE
   =====================================================================

   PURPOSE
   -------
   This is now the single combined browser script. It contains:
   1. The complete original website behavior.
   2. The public-ready enhancements that previously lived in
      public-ready.js.

   EXECUTION ORDER
   ---------------
   A. Browser-safe Supabase configuration and client creation.
   B. Public content data: updates, schedules, events, modal copy.
   C. Shared DOM, formatting, toast, navigation, routing, and modal helpers.
   D. Rendering for updates, schedules, gallery, resources, FAQ, and forms.
   E. Secure contact delivery and authentication/approval portal flows.
   F. Email-based Approve/Reject review workflow.
   G. Merged public-ready IIFE, which runs after all original declarations
      and layers public copy, protected-state, calendar, and navigation
      enhancements on top of the established site.

   SECURITY BOUNDARY
   -----------------
   Browser-safe values:
   - Supabase project URL
   - Supabase publishable/anon key

   Never place here:
   - Supabase service-role or secret key
   - Database password
   - Resend API key
   - Gmail App Password or webhook secret
   - Private Google Calendar URL
   - Child records, exact attendance, health, custody, or protected data

   MAINTENANCE RULES
   -----------------
   - Preserve element ids and data-* hooks used by querySelector.
   - Preserve route hashes because navigation and Back/Forward use them.
   - Keep the public-ready code at the bottom; its timing is intentional.
   - Keep authentication and approval checks separate: verified email does
     not automatically mean approved portal access.
   - Keep private content loaded from the protected database after approval.
   - Keep error handling and fallbacks so requests are not silently lost.

   MAIN DATA EDITING AREAS
   -----------------------
   weeklyUpdates        Public-safe announcements and highlights
   weeklySchedule       General locked schedule descriptions
   upcomingEvents       Public-safe event shells
   announcementMessages Rotating public notice text
   contentLibrary       General modal content
   resourceLibrary      Resource modal content
   teamLibrary          Team modal content
   ===================================================================== */
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
   - headsupweb@gmail.com
   - Contact the program
   - Location shared privately
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
   HEADS UP PUBLIC CONFIGURATION

   These browser-safe values connect the public website to Supabase.
   Paste only the project URL and publishable/anon key here.

   NEVER place a service-role key, database password, Resend API key,
   SMTP password, private calendar URL, or protected information here.
============================================================= */

const HEADS_UP_CONFIG = Object.freeze({

    contactEmail:
        "headsupweb@gmail.com",

    supabaseUrl:
        "https://ymjcjenhlyoxvnlogwcu.supabase.co",

    supabasePublishableKey:
        "sb_publishable_7hXySkru6xB-OhRQaqYKQQ_etUVxNS-",

    contactFunctionName:
        "send-message",

    /*
       This public Edge Function validates one-time email review links,
       applies the administrator's decision, and optionally emails the
       requester. It never exposes a service-role key in the browser.
    */
    accessReviewFunctionName:
        "review-access",

    /*
       Public fallback RPC. This safely stores the message if the email
       Edge Function is temporarily unavailable, so visitor requests are
       not lost. The SQL file creates and validates this function.
    */
    contactFallbackRpcName:
        "headsup_submit_public_message",

    /* Stop waiting on an unreachable function after this many milliseconds. */
    contactFunctionTimeoutMs:
        15000,

    /*
       Optional live redirect used by verification and password-reset emails.
       Example: "https://your-site.netlify.app/#portal"
       Leave blank only while actively testing with a running local server.
    */
    authRedirectUrl:
        "https://headsupweb-ops.github.io/Heads-Up-Website/",

    /* Public-safe events only. Leave blank until approved. */
    publicGoogleCalendarEmbedUrl:
        ""

});


const isSupabaseConfigurationReady = () => {

    return Boolean(

        HEADS_UP_CONFIG.supabaseUrl

        && HEADS_UP_CONFIG.supabasePublishableKey

        && !HEADS_UP_CONFIG.supabaseUrl.includes(

            "YOUR-PROJECT"

        )

        && !HEADS_UP_CONFIG.supabasePublishableKey.includes(

            "YOUR-SUPABASE"

        )

    );

};


let headsUpSupabase =

    null;


if (

    isSupabaseConfigurationReady()

    && window.supabase?.createClient

) {

    headsUpSupabase =

        window.supabase.createClient(

            HEADS_UP_CONFIG.supabaseUrl,

            HEADS_UP_CONFIG.supabasePublishableKey,

            {

                auth: {

                    persistSession:
                        true,

                    autoRefreshToken:
                        true,

                    detectSessionInUrl:
                        true,

                    flowType:
                        "pkce"

                }

            }

        );

}



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
   15. ACTIVE ROUTE STATE AND BACK TO TOP

   Route highlighting is handled by the lightweight page router
   near the end of this file. This avoids competing scroll observers.
============================================================= */

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
   16. SCROLL HELPER

   Hash-link navigation is handled by the page router.
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
   32. SECURE WEBSITE MESSAGE DELIVERY

   Messages are sent through the Supabase Edge Function named
   "send-message". No mailto URL is used, so Outlook does not open.
============================================================= */

const setFormSubmitStatus = (

    element,

    message,

    type = "info"

) => {

    if (

        !element

    ) {

        return;

    }


    element.textContent =

        message;


    element.dataset.status =

        type;

};


const setSubmittingState = (

    form,

    submitting

) => {

    if (

        !form

    ) {

        return;

    }


    const submitButton =

        form.querySelector(

            'button[type="submit"]'

        );


    if (

        submitButton

    ) {

        submitButton.disabled =

            submitting;


        submitButton.setAttribute(

            "aria-busy",

            String(submitting)

        );


        if (

            submitting

        ) {

            if (

                !submitButton.dataset.originalHtml

            ) {

                submitButton.dataset.originalHtml =

                    submitButton.innerHTML;

            }


            submitButton.textContent =

                "Sending…";

        } else if (

            submitButton.dataset.originalHtml

        ) {

            submitButton.innerHTML =

                submitButton.dataset.originalHtml;

        }

    }

};


const createAbortControllerWithTimeout = (milliseconds) => {

    const controller = new AbortController();

    const timeoutId = window.setTimeout(

        () => controller.abort(),

        milliseconds

    );

    return {

        controller,

        clear:
            () => window.clearTimeout(timeoutId)

    };

};


const parseFunctionResponse = async (response) => {

    const rawText = await response.text();

    if (!rawText) {

        return {};

    }

    try {

        return JSON.parse(rawText);

    } catch {

        return {

            error:
                rawText.slice(0, 500)

        };

    }

};


const describeFunctionFailure = (

    status,

    body

) => {

    const providerMessage =

        body?.error

        || body?.message

        || body?.warning

        || "";

    if (status === 404) {

        return "The send-message Edge Function was not found. Deploy it in Supabase, then try again.";

    }

    if (status === 401 || status === 403) {

        return "The send-message Edge Function rejected the request. Deploy it with JWT verification disabled for this public contact form and confirm the allowed website origin.";

    }

    if (status === 429) {

        return providerMessage

            || "Too many recent requests. Wait a few minutes and try again.";

    }

    if (status >= 500) {

        return providerMessage

            || "The message service reached Supabase, but its server configuration is incomplete. Check the Function logs and secrets.";

    }

    return providerMessage

        || `The message service returned HTTP ${status}.`;

};


const storeWebsiteMessageFallback = async (

    payload,

    originalError

) => {

    if (!headsUpSupabase) {

        throw originalError;

    }

    const {

        data,

        error

    } = await headsUpSupabase.rpc(

        HEADS_UP_CONFIG.contactFallbackRpcName,

        {

            p_kind:
                payload.kind,

            p_name:
                payload.name,

            p_email:
                payload.email,

            p_audience:
                payload.audience || "",

            p_subject:
                payload.subject,

            p_message:
                payload.message,

            p_page_url:
                payload.page || ""

        }

    );

    if (error) {

        const combinedError = new Error(

            `${originalError?.message || "The email service was unavailable."} The secure database fallback also failed: ${error.message}`

        );

        combinedError.cause = error;

        throw combinedError;

    }

    return {

        ok:
            true,

        emailSent:
            false,

        storedFallback:
            true,

        messageId:
            data,

        warning:
            "Your message was securely saved, but the email notification service is not working yet. Heads Up can review it in Supabase Table Editor → contact_messages."

    };

};


const invokeWebsiteMessageFunction = async (

    payload

) => {

    if (!headsUpSupabase) {

        throw new Error(

            "Supabase is not connected. Add the project URL and publishable key near the top of script.js."

        );

    }

    const functionUrl =

        `${HEADS_UP_CONFIG.supabaseUrl.replace(/\/$/, "")}/functions/v1/${encodeURIComponent(HEADS_UP_CONFIG.contactFunctionName)}`;

    const timeout = createAbortControllerWithTimeout(

        HEADS_UP_CONFIG.contactFunctionTimeoutMs

    );

    try {

        const response = await fetch(

            functionUrl,

            {

                method:
                    "POST",

                headers: {

                    "Content-Type":
                        "application/json",

                    "apikey":
                        HEADS_UP_CONFIG.supabasePublishableKey,

                    "Authorization":
                        `Bearer ${HEADS_UP_CONFIG.supabasePublishableKey}`,

                    "X-Client-Info":
                        "headsup-website/3"

                },

                body:
                    JSON.stringify(payload),

                signal:
                    timeout.controller.signal

            }

        );

        const body = await parseFunctionResponse(response);

        if (!response.ok) {

            const error = new Error(

                describeFunctionFailure(

                    response.status,

                    body

                )

            );

            error.status = response.status;

            error.details = body;

            throw error;

        }

        if (body?.error) {

            throw new Error(body.error);

        }

        return body;

    } catch (error) {

        const normalizedError =

            error?.name === "AbortError"

                ? new Error(

                    "The email service did not respond within 15 seconds."

                )

                : error;

        console.warn(

            "Edge Function unavailable; attempting secure database fallback.",

            normalizedError

        );

        return storeWebsiteMessageFallback(

            payload,

            normalizedError

        );

    } finally {

        timeout.clear();

    }

};

const contactFormStatus = select(

    "#contactFormStatus"

);


contactForm?.addEventListener(

    "submit",

    async (

        event

    ) => {

        event.preventDefault();


        if (

            !validateContactForm()

        ) {

            showToast({

                title:
                    "Please review the form",

                message:
                    "A few required fields need attention.",

                type:
                    "danger"

            });


            return;

        }


        setSubmittingState(

            contactForm,

            true

        );


        setFormSubmitStatus(

            contactFormStatus,

            "Sending your message securely…",

            "info"

        );


        try {

            const result = await invokeWebsiteMessageFunction({

                kind:
                    "contact",

                name:
                    contactName.value.trim(),

                email:
                    contactEmail.value.trim(),

                audience:
                    contactAudience.value,

                subject:
                    contactSubject.value.trim(),

                message:
                    contactMessage.value.trim(),

                website:
                    select("#contactWebsite")?.value.trim()

                    || "",

                page:
                    window.location.href

            });


            contactForm.reset();


            setFormSubmitStatus(

                contactFormStatus,

                result?.emailSent === false

                    ? result?.storedFallback

                        ? "Your message was securely saved in Supabase. The email notification service still needs repair."

                        : "Your message was securely recorded, but the email notification service still needs configuration."

                    : "Message sent successfully to headsupweb@gmail.com.",

                result?.emailSent === false

                    ? "warning"

                    : "success"

            );


            showToast({

                title:
                    "Message received",

                message:
                    result?.emailSent === false

                        ? result?.warning

                            || "The request was saved. Complete the email-service setup to enable notifications."

                        : "Heads Up received your message.",

                type:
                    result?.emailSent === false

                        ? "warning"

                        : "success"

            });

        } catch (

            error

        ) {

            console.error(

                "Contact form error:",

                error

            );


            setFormSubmitStatus(

                contactFormStatus,

                error?.message

                || "The message could not be sent. Please try again.",

                "danger"

            );


            showToast({

                title:
                    "Message not sent",

                message:
                    "Check the Supabase connection and Edge Function setup.",

                type:
                    "danger"

            });

        } finally {

            setSubmittingState(

                contactForm,

                false

            );

        }

    }

);


/* =============================================================
   33. NEWSLETTER REQUEST DELIVERY
============================================================= */

const newsletterForm = select(

    "#newsletterForm"

);


const newsletterEmail = select(

    "#newsletterEmail"

);


newsletterForm?.addEventListener(

    "submit",

    async (

        event

    ) => {

        event.preventDefault();


        const emailValue =

            newsletterEmail?.value.trim()

            || "";


        if (

            !/^[^\s@]+@[^\s@]+\.[^\s@]+$/

                .test(emailValue)

        ) {

            showToast({

                title:
                    "Enter a valid email",

                message:
                    "Please check the email address.",

                type:
                    "warning"

            });


            newsletterEmail?.focus();


            return;

        }


        setSubmittingState(

            newsletterForm,

            true

        );


        try {

            await invokeWebsiteMessageFunction({

                kind:
                    "newsletter",

                name:
                    "Newsletter request",

                email:
                    emailValue,

                audience:
                    "Website visitor",

                subject:
                    "Heads Up updates subscription request",

                message:
                    "Please add this email address to the approved Heads Up updates list.",

                website:
                    "",

                page:
                    window.location.href

            });


            newsletterForm.reset();


            showToast({

                title:
                    "Request received",

                message:
                    "The subscription request was sent to Heads Up.",

                type:
                    "success"

            });

        } catch (

            error

        ) {

            console.error(

                "Newsletter request error:",

                error

            );


            showToast({

                title:
                    "Request not sent",

                message:
                    error?.message

                    || "Please try again later.",

                type:
                    "danger"

            });

        } finally {

            setSubmittingState(

                newsletterForm,

                false

            );

        }

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
   40. LIGHTWEIGHT PAGE ROUTER

   The website remains one index.html file, but each hash route
   behaves like a separate page. Browser Back and Forward work,
   links remain simple, and only the selected content is shown.
============================================================= */

const routeMap = {

    "#home": [
        "home",
        "about",
        "contact"
    ],

    "#about": [
        "about"
    ],

    "#programs": [
        "programs"
    ],

    "#parents": [
        "parents"
    ],

    "#volunteer": [
        "volunteer"
    ],

    "#updates": [
        "updates"
    ],

    "#events": [
        "updates"
    ],

    "#portal": [
        "portal"
    ],

    "#gallery": [
        "gallery"
    ],

    "#stories": [
        "stories"
    ],

    "#resources": [
        "resources"
    ],

    "#team": [
        "team"
    ],

    "#faq": [
        "faq"
    ],

    "#contact": [
        "contact"
    ]

};


const routeTitles = {

    "#home":
        "Heads Up | Tutoring & Life Skills Program",

    "#about":
        "About | Heads Up",

    "#programs":
        "Programs | Heads Up",

    "#parents":
        "Parents | Heads Up",

    "#volunteer":
        "Volunteer With Us | Heads Up",

    "#updates":
        "Updates | Heads Up",

    "#events":
        "Events | Heads Up",

    "#portal":
        "Family Portal | Heads Up",

    "#gallery":
        "Gallery | Heads Up",

    "#stories":
        "Stories | Heads Up",

    "#resources":
        "Resources | Heads Up",

    "#team":
        "Our Team | Heads Up",

    "#faq":
        "FAQ | Heads Up",

    "#contact":
        "Contact | Heads Up"

};


const routeSections = selectAll(

    "main > section[id]"

);


const normalizeRouteHash = (

    hash

) => {

    return routeMap[hash]

        ? hash

        : "#home";

};


const setRouteNavigationState = (

    routeHash

) => {

    selectAll(

        'a[href^="#"]'

    ).forEach(

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


const renderRoute = (

    hashValue = window.location.hash

) => {

    const routeHash =

        normalizeRouteHash(

            hashValue

        );


    const visibleIds =

        routeMap[routeHash];


    document.body.dataset.route =

        routeHash.slice(1);


    document.title =

        routeTitles[routeHash];


    routeSections.forEach(

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

        }

    );


    selectAll(

        "[data-home-only]"

    ).forEach(

        (element) => {

            element.hidden =

                routeHash !== "#home";

        }

    );


    if (

        routeHash === "#events"

    ) {

        activateHubTab(

            "events"

        );

    } else if (

        routeHash === "#updates"

    ) {

        activateHubTab(

            "updates"

        );

    }


    setRouteNavigationState(

        routeHash

    );


    setExploreMenuState(

        false

    );


    setMobileNavState(

        false

    );


    window.setTimeout(

        () => {

            window.scrollTo({

                top:
                    0,

                behavior:
                    prefersReducedMotion

                        ? "auto"

                        : "smooth"

            });

        },

        20

    );

};


document.addEventListener(

    "click",

    (

        event

    ) => {

        const routeLink =

            event.target.closest(

                'a[href^="#"]'

            );


        if (

            !routeLink

        ) {

            return;

        }


        const href =

            routeLink.getAttribute(

                "href"

            );


        if (

            !routeMap[href]

        ) {

            return;

        }


        event.preventDefault();


        if (

            window.location.hash === href

        ) {

            renderRoute(

                href

            );

        } else {

            window.location.hash =

                href;

        }

    },

    true

);


window.addEventListener(

    "hashchange",

    () => renderRoute(

        window.location.hash

    )

);


/* =============================================================
   41. ROUTE-AWARE CONTACT PREFILL
============================================================= */

document.addEventListener(

    "click",

    (

        event

    ) => {

        const prefillLink =

            event.target.closest(

                "[data-prefill-subject]"

            );


        if (

            !prefillLink

        ) {

            return;

        }


        const subject =

            prefillLink.dataset.prefillSubject;


        window.setTimeout(

            () => {

                if (

                    contactSubject

                ) {

                    contactSubject.value =

                        subject;

                }

            },

            40

        );

    }

);


/* =============================================================
   42. COPY CONTACT EMAIL WITHOUT OPENING OUTLOOK
============================================================= */

selectAll(

    "[data-copy-email]"

).forEach(

    (button) => {

        button.addEventListener(

            "click",

            async () => {

                const email =

                    button.dataset.copyEmail

                    || HEADS_UP_CONFIG.contactEmail;


                try {

                    await navigator.clipboard.writeText(

                        email

                    );


                    showToast({

                        title:
                            "Email copied",

                        message:
                            `${email} was copied to your clipboard.`,

                        type:
                            "success"

                    });

                } catch (

                    error

                ) {

                    showToast({

                        title:
                            "Email address",

                        message:
                            email,

                        type:
                            "info"

                    });

                }

            }

        );

    }

);


/* =============================================================
   43. PASSWORD VISIBILITY
============================================================= */

selectAll(

    "[data-password-toggle]"

).forEach(

    (button) => {

        button.addEventListener(

            "click",

            () => {

                const input = select(

                    `#${button.dataset.passwordToggle}`

                );


                if (

                    !input

                ) {

                    return;

                }


                const showing =

                    input.type === "text";


                input.type =

                    showing

                        ? "password"

                        : "text";


                button.textContent =

                    showing

                        ? "Show"

                        : "Hide";


                button.setAttribute(

                    "aria-label",

                    showing

                        ? "Show password"

                        : "Hide password"

                );

            }

        );

    }

);


/* =============================================================
   44. PORTAL TAB CONTROLS
============================================================= */

const portalStatus = select(

    "#portalStatus"

);


const portalDashboard = select(

    "#portalDashboard"

);


const portalProfileSummary = select(

    "#portalProfileSummary"

);


const portalApprovalBanner = select(

    "#portalApprovalBanner"

);


const privateContentList = select(

    "#privateContentList"

);


const setPortalStatus = (

    message,

    type = "info"

) => {

    if (

        portalStatus

    ) {

        portalStatus.textContent =

            message;


        portalStatus.dataset.status =

            type;

    }

};


const activatePortalTab = (

    tabName

) => {

    selectAll(

        "[data-portal-tab]"

    ).forEach(

        (button) => {

            const active =

                button.dataset.portalTab === tabName;


            button.classList.toggle(

                "is-active",

                active

            );


            button.setAttribute(

                "aria-selected",

                String(active)

            );

        }

    );


    selectAll(

        "[data-portal-panel]"

    ).forEach(

        (panel) => {

            panel.hidden =

                panel.dataset.portalPanel !== tabName;

        }

    );

};


selectAll(

    "[data-portal-tab]"

).forEach(

    (button) => {

        button.addEventListener(

            "click",

            () => activatePortalTab(

                button.dataset.portalTab

            )

        );

    }

);


/* =============================================================
   45. SUPABASE AUTHENTICATION
============================================================= */

const portalSignInForm = select("#portalSignInForm");
const portalRequestAccessForm = select("#portalRequestAccessForm");
const portalResetPasswordForm = select("#portalResetPasswordForm");
const portalNewPasswordForm = select("#portalNewPasswordForm");
const portalMagicLinkButton = select("#portalMagicLinkButton");
const portalResendConfirmationButton = select("#portalResendConfirmationButton");
const portalSignOutButton = select("#portalSignOutButton");

const portalRedirectUrl = () => {
    const configured = String(
        HEADS_UP_CONFIG.authRedirectUrl || ""
    ).trim();

    if (configured) {
        const configuredUrl = new URL(configured, window.location.href);
        configuredUrl.hash = "#portal";
        return configuredUrl.toString();
    }

    if (window.location.protocol === "file:") {
        throw new Error(
            "Open the website through START_HEADS_UP_WEBSITE.bat or a live HTTPS address before requesting access."
        );
    }

    /*
       Fall back to the page that is currently open. This is correct for
       local testing only while the local server remains running. For a live
       website, set authRedirectUrl above and also allow that exact URL in
       Supabase Authentication -> URL Configuration.
    */
    const currentUrl = new URL(window.location.href);
    currentUrl.hash = "#portal";
    return currentUrl.toString();
};

const describeSupabaseError = (error) => {
    console.error("Complete Supabase error:", error);

    const possibleMessages = [
        typeof error?.message === "string" ? error.message : "",
        typeof error?.error_description === "string"
            ? error.error_description
            : "",
        typeof error?.details === "string" ? error.details : "",
        typeof error?.hint === "string" ? error.hint : "",
        typeof error?.cause?.message === "string"
            ? error.cause.message
            : ""
    ];

    const message =
        possibleMessages.find(
            (value) =>
                value
                && value.trim()
                && value.trim() !== "{}"
                && value.trim() !== "[object Object]"
        )
        || "Supabase rejected the request. Check the newest Auth or Edge Function log entry.";

    if (/invalid login credentials/i.test(message)) {
        return "The email or password is incorrect. Confirm the email address and use Reset password if needed.";
    }

    if (/email not confirmed/i.test(message)) {
        return "Confirm the verification email from Supabase before signing in.";
    }

    if (/user already registered/i.test(message)) {
        return "An account already exists for this email. Sign in or reset the password.";
    }

    if (/rate limit|email rate limit|over_email_send_rate_limit/i.test(message)) {
        return "Supabase has temporarily limited authentication emails. Wait several minutes and use Resend verification once.";
    }

    if (/failed to fetch|network request failed/i.test(message)) {
        return "The browser could not reach Supabase. Check the project URL, publishable key, internet connection, and allowed Site URL.";
    }

    if (/email address.*invalid|invalid email/i.test(message)) {
        return "Enter a valid email address.";
    }

    if (/database error saving new user/i.test(message)) {
        return "Supabase Auth reached the database, but the profile trigger failed. Run the latest supabase-setup.sql.";
    }

    return message;
};

const getCurrentProfile = async (user) => {
    let response = await headsUpSupabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .maybeSingle();

    if (!response.data && !response.error) {
        const metadata = user.user_metadata || {};

        const { error: repairError } = await headsUpSupabase.rpc(
            "headsup_ensure_profile",
            {
                p_display_name:
                    metadata.display_name
                    || metadata.full_name
                    || "",
                p_relationship:
                    metadata.relationship
                    || metadata.requested_role
                    || "family",
                p_request_reason:
                    metadata.request_reason
                    || ""
            }
        );

        if (repairError) {
            throw repairError;
        }

        response = await headsUpSupabase
            .from("profiles")
            .select("*")
            .eq("id", user.id)
            .maybeSingle();
    }

    if (response.error) {
        throw response.error;
    }

    return response.data;
};

const formatPrivateDate = (value) => {
    if (!value) {
        return "";
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return "";
    }

    return new Intl.DateTimeFormat(undefined, {
        dateStyle: "medium",
        timeStyle: "short"
    }).format(date);
};

const renderPrivateContent = (items) => {
    if (!privateContentList) {
        return;
    }

    privateContentList.innerHTML = "";

    if (!items?.length) {
        const empty = document.createElement("div");
        empty.className = "private-content-empty";
        empty.textContent = "No private updates are available for this account yet.";
        privateContentList.append(empty);
        return;
    }

    items.forEach((item) => {
        const article = document.createElement("article");
        article.className = "private-content-card";

        const type = document.createElement("span");
        type.className = "private-content-card__type";
        type.textContent = item.content_type || "Private update";

        const title = document.createElement("h4");
        title.textContent = item.title;

        article.append(type, title);

        if (item.summary) {
            const summary = document.createElement("p");
            summary.textContent = item.summary;
            article.append(summary);
        }

        const details = [];

        if (item.start_at) {
            details.push(formatPrivateDate(item.start_at));
        }

        if (item.location) {
            details.push(item.location);
        }

        if (details.length) {
            const meta = document.createElement("p");
            meta.className = "private-content-card__meta";
            meta.textContent = details.join(" • ");
            article.append(meta);
        }

        if (item.link_url && /^https:\/\//i.test(item.link_url)) {
            const link = document.createElement("a");
            link.className = "button button--secondary";
            link.href = item.link_url;
            link.target = "_blank";
            link.rel = "noopener noreferrer";
            link.textContent = "Open private link";
            article.append(link);
        }

        privateContentList.append(article);
    });
};

const refreshPortalSession = async (suppliedSession = null) => {
    if (!headsUpSupabase) {
        setPortalStatus(
            "Supabase is not connected. Paste the project URL and publishable key near the top of script.js.",
            "danger"
        );
        return;
    }

    try {
        const session = suppliedSession || (await headsUpSupabase.auth.getSession()).data.session;

        if (!session?.user) {
            if (portalDashboard) {
                portalDashboard.hidden = true;
            }

            setPortalStatus("Sign in or request approved access.", "info");
            return;
        }

        const profile = await getCurrentProfile(session.user);

        portalDashboard.hidden = false;
        portalProfileSummary.textContent =
            `${profile?.display_name || session.user.email} • ${profile?.member_role || "member"}`;

        const status = profile?.approval_status || "pending";
        portalApprovalBanner.dataset.status = status;

        if (status !== "approved" || profile?.account_status !== "active") {
            portalApprovalBanner.innerHTML = "";

            const bannerMessage = document.createElement("span");

            bannerMessage.textContent =
                status === "rejected"
                    ? "This access request was not approved. Contact Heads Up if you believe this is an error."
                    : status === "suspended" || profile?.account_status === "disabled"
                        ? "This account is currently suspended."
                        : "Your email is verified, but an administrator still needs to approve access.";

            portalApprovalBanner.append(bannerMessage);

            if (status === "pending" && profile?.account_status === "active") {
                const resendButton = document.createElement("button");

                resendButton.type = "button";
                resendButton.className = "button button--secondary button--small";
                resendButton.textContent = "Resend approval request to Heads Up";
                resendButton.style.marginTop = "0.85rem";

                resendButton.addEventListener("click", async () => {
                    resendButton.disabled = true;
                    resendButton.textContent = "Sending review email…";

                    try {
                        const result = await invokeWebsiteMessageFunction({
                            kind: "access-request",
                            workflow: "portal-access-review",

                            name:
                                profile?.display_name
                                || session.user.email
                                || "Portal applicant",
                            email:
                                profile?.email
                                || session.user.email
                                || "",
                            audience:
                                profile?.member_role
                                || "family",
                            subject:
                                "Heads Up portal access request awaiting review",
                            message:
                                profile?.request_reason
                                || "No additional reason was provided.",
                            website: "",
                            page: window.location.href,
                            authUserId: session.user.id,
                            relationship:
                                profile?.relationship
                                || profile?.member_role
                                || "family",
                            requestedRole:
                                profile?.member_role
                                || "family",
                            requestReason:
                                profile?.request_reason
                                || "No additional reason was provided."
                        });

                        setPortalStatus(
                            result?.emailSent === false
                                ? "The request was saved again, but the Heads Up review email service still needs configuration."
                                : "A fresh review email was sent to headsupweb@gmail.com with Approve and Reject options.",
                            result?.emailSent === false
                                ? "warning"
                                : "success"
                        );
                    } catch (notificationError) {
                        console.error(
                            "Could not resend approval request:",
                            notificationError
                        );

                        setPortalStatus(
                            describeSupabaseError(notificationError),
                            "danger"
                        );
                    } finally {
                        window.setTimeout(() => {
                            resendButton.disabled = false;
                            resendButton.textContent =
                                "Resend approval request to Heads Up";
                        }, 2500);
                    }
                });

                portalApprovalBanner.append(resendButton);
            }

            privateContentList.innerHTML = "";
            setPortalStatus(
                "Signed in successfully. Private content remains locked until approval.",
                "warning"
            );
            return;
        }

        portalApprovalBanner.textContent =
            "Approved account — private content is available according to your role.";

        const { data, error } = await headsUpSupabase
            .from("private_portal_content")
            .select(
                "id, content_type, title, summary, details, start_at, end_at, location, link_url, sort_order"
            )
            .eq("is_active", true)
            .order("sort_order", { ascending: true })
            .order("start_at", { ascending: true, nullsFirst: false });

        if (error) {
            throw error;
        }

        renderPrivateContent(data);
        setPortalStatus("Secure portal access is active.", "success");
    } catch (error) {
        console.error("Portal session error:", error);
        setPortalStatus(describeSupabaseError(error), "danger");
    }
};

portalSignInForm?.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (!headsUpSupabase) {
        setPortalStatus("Connect Supabase near the top of script.js first.", "danger");
        return;
    }

    const formData = new FormData(portalSignInForm);
    setSubmittingState(portalSignInForm, true);
    setPortalStatus("Signing in securely…", "info");

    try {
        const { data, error } = await headsUpSupabase.auth.signInWithPassword({
            email: String(formData.get("email")).trim(),
            password: String(formData.get("password"))
        });

        if (error) {
            throw error;
        }

        await refreshPortalSession(data.session);
    } catch (error) {
        setPortalStatus(describeSupabaseError(error), "danger");
    } finally {
        setSubmittingState(portalSignInForm, false);
    }
});

portalMagicLinkButton?.addEventListener("click", async () => {
    if (!headsUpSupabase) {
        setPortalStatus("Connect Supabase before requesting a sign-in link.", "danger");
        return;
    }

    const email = select("#portalSignInEmail")?.value.trim();

    if (!email) {
        setPortalStatus("Enter your account email first.", "warning");
        return;
    }

    portalMagicLinkButton.disabled = true;

    try {
        const { error } = await headsUpSupabase.auth.signInWithOtp({
            email,
            options: {
                shouldCreateUser: false,
                emailRedirectTo: portalRedirectUrl()
            }
        });

        if (error) {
            throw error;
        }

        setPortalStatus(
            "A secure sign-in link was sent if an account exists for that email.",
            "success"
        );
    } catch (error) {
        setPortalStatus(describeSupabaseError(error), "danger");
    } finally {
        portalMagicLinkButton.disabled = false;
    }
});


portalResendConfirmationButton?.addEventListener("click", async () => {
    if (!headsUpSupabase) {
        setPortalStatus("Connect Supabase before resending verification.", "danger");
        return;
    }

    const email = String(select("#portalSignInEmail")?.value || "").trim();

    if (!email) {
        setPortalStatus("Enter the account email address first.", "warning");
        return;
    }

    portalResendConfirmationButton.disabled = true;
    setPortalStatus("Sending a new verification email…", "info");

    try {
        const { error } = await headsUpSupabase.auth.resend({
            type: "signup",
            email,
            options: {
                emailRedirectTo: portalRedirectUrl()
            }
        });

        if (error) {
            throw error;
        }

        setPortalStatus(
            "A new verification email was sent. Use the newest message and keep the local server running, or use the configured live website URL.",
            "success"
        );
    } catch (error) {
        setPortalStatus(describeSupabaseError(error), "danger");
    } finally {
        portalResendConfirmationButton.disabled = false;
    }
});

portalRequestAccessForm?.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (!headsUpSupabase) {
        setPortalStatus("Connect Supabase before submitting an access request.", "danger");
        return;
    }

    const formData = new FormData(portalRequestAccessForm);
    const fullName = String(formData.get("fullName")).trim();
    const email = String(formData.get("email")).trim().toLowerCase();
    const password = String(formData.get("password"));
    const role = String(formData.get("role"));
    const reason = String(formData.get("reason")).trim();

    setSubmittingState(portalRequestAccessForm, true);
    setPortalStatus("Creating the access request…", "info");

    try {
        const redirectTo = portalRedirectUrl();

        const { data, error } = await headsUpSupabase.auth.signUp({
            email,
            password,
            options: {
                emailRedirectTo: redirectTo,
                data: {
                    display_name: fullName,
                    relationship:
                        role === "volunteer"
                            ? "volunteer_mentor"
                            : role,
                    request_reason: reason
                }
            }
        });

        if (error) {
            throw error;
        }

        /*
           Supabase may intentionally hide whether an account already exists.
           An empty identities array is the practical signal that this email
           should use Sign In, Reset Password, or Resend Verification instead.
        */
        if (
            data.user
            && Array.isArray(data.user.identities)
            && data.user.identities.length === 0
        ) {
            activatePortalTab("signin");
            setPortalStatus(
                "An account may already exist for this email. Use Sign In, Reset password, or Resend my verification email.",
                "warning"
            );
            return;
        }

        let notificationResult = null;

        try {
            notificationResult = await invokeWebsiteMessageFunction({
                kind: "access-request",
                workflow: "portal-access-review",

                name: fullName,
                email,
                audience: role,
                subject: "New Heads Up portal access request",
                message: reason,
                website: "",
                page: window.location.href,
                authUserId: data.user?.id || null,
                relationship:
                    role === "volunteer"
                        ? "volunteer_mentor"
                        : role,
                requestedRole: role,
                requestReason: reason
            });
        } catch (notificationError) {
            console.warn(
                "Access account was created, but the administrator notification failed:",
                notificationError
            );
        }

        portalRequestAccessForm.reset();
        activatePortalTab("signin");

        if (data.session) {
            setPortalStatus(
                "Your account was created and signed in. Email confirmation is currently disabled in Supabase, so no verification email is expected. An administrator must still approve private access.",
                "success"
            );
        } else {
            setPortalStatus(
                notificationResult?.emailSent === false
                    ? "Your account request was created. The verification email is handled separately by Supabase Auth. The Heads Up review email was saved but was not delivered; after signing in, use Resend approval request to notify Heads Up again."
                    : "Your account request was created. Supabase Auth is sending your verification email, and Heads Up has received a separate review email with Approve and Reject options.",
                notificationResult?.emailSent === false
                    ? "warning"
                    : "success"
            );
        }
    } catch (error) {
        setPortalStatus(describeSupabaseError(error), "danger");
    } finally {
        setSubmittingState(portalRequestAccessForm, false);
    }
});

portalResetPasswordForm?.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (!headsUpSupabase) {
        setPortalStatus("Connect Supabase before resetting a password.", "danger");
        return;
    }

    const email = String(
        new FormData(portalResetPasswordForm).get("email")
    ).trim();

    setSubmittingState(portalResetPasswordForm, true);

    try {
        const { error } = await headsUpSupabase.auth.resetPasswordForEmail(
            email,
            { redirectTo: portalRedirectUrl() }
        );

        if (error) {
            throw error;
        }

        setPortalStatus("A password-reset link was sent if the account exists.", "success");
    } catch (error) {
        setPortalStatus(describeSupabaseError(error), "danger");
    } finally {
        setSubmittingState(portalResetPasswordForm, false);
    }
});

portalNewPasswordForm?.addEventListener("submit", async (event) => {
    event.preventDefault();

    const password = String(
        new FormData(portalNewPasswordForm).get("password")
    );

    setSubmittingState(portalNewPasswordForm, true);

    try {
        const { error } = await headsUpSupabase.auth.updateUser({ password });

        if (error) {
            throw error;
        }

        setPortalStatus("Your password was updated successfully.", "success");
        activatePortalTab("signin");
    } catch (error) {
        setPortalStatus(describeSupabaseError(error), "danger");
    } finally {
        setSubmittingState(portalNewPasswordForm, false);
    }
});

portalSignOutButton?.addEventListener("click", async () => {
    if (headsUpSupabase) {
        await headsUpSupabase.auth.signOut();
    }

    portalDashboard.hidden = true;
    setPortalStatus("You have been signed out.", "success");
});

if (headsUpSupabase) {
    headsUpSupabase.auth.onAuthStateChange((event, session) => {
        window.setTimeout(() => {
            if (event === "PASSWORD_RECOVERY") {
                activatePortalTab("new-password");
                setPortalStatus("Enter a new password for your account.", "info");
                window.location.hash = "#portal";
            }

            refreshPortalSession(session);
        }, 0);
    });
} else {
    setPortalStatus(
        "Supabase is not connected yet. Paste the project URL and publishable key near the top of script.js.",
        "warning"
    );
}


/* =============================================================
   46. PRIVATE DETAIL ACTIONS
============================================================= */

document.addEventListener("click", (event) => {
    const trigger = event.target.closest("[data-private-trigger]");

    if (!trigger) {
        return;
    }

    event.preventDefault();
    window.location.hash = "#portal";

    setPortalStatus(
        "Sign in with an approved account to view exact schedules, locations, and private links.",
        "warning"
    );
});


/* =============================================================
   47. PUBLIC-SAFE GOOGLE CALENDAR
============================================================= */

const publicCalendarFrame = select("#publicCalendarFrame");

if (
    publicCalendarFrame
    && HEADS_UP_CONFIG.publicGoogleCalendarEmbedUrl
) {
    const calendarUrl = HEADS_UP_CONFIG.publicGoogleCalendarEmbedUrl;

    if (/^https:\/\/calendar\.google\.com\//i.test(calendarUrl)) {
        const iframe = document.createElement("iframe");
        iframe.src = calendarUrl;
        iframe.title = "Heads Up public events calendar";
        iframe.loading = "lazy";
        iframe.referrerPolicy = "no-referrer-when-downgrade";
        publicCalendarFrame.replaceChildren(iframe);
    }
}


/* =============================================================
   48. INITIAL ROUTE AND PORTAL SESSION
============================================================= */

renderRoute(window.location.hash || "#home");
refreshPortalSession();

console.info(
    "Heads Up privacy reminder: public pages stay general; exact schedules, protected locations, child-related updates, and private links load only after approved authentication."
);


/* =============================================================
   47. EMAIL-BASED ACCESS REVIEW

   The Heads Up inbox receives a message containing all submitted
   request information plus Review & Approve / Review & Reject links.

   Clicking a Gmail button opens this same website. The website first
   shows the request details and requires a second confirmation click.
   This prevents email security scanners from approving an account by
   merely previewing the link.

   The one-time token is validated by the review-access Edge Function.
   No service-role key or protected database credential is exposed here.
============================================================= */

const getAccessReviewFunctionUrl = () => {
    return `${HEADS_UP_CONFIG.supabaseUrl.replace(/\/$/, "")}/functions/v1/${encodeURIComponent(
        HEADS_UP_CONFIG.accessReviewFunctionName
    )}`;
};


const callAccessReviewFunction = async ({
    method = "GET",
    token,
    action = ""
}) => {
    if (!isSupabaseConfigurationReady()) {
        throw new Error(
            "Supabase is not connected. Add the project URL and publishable key near the top of script.js."
        );
    }

    const functionUrl = new URL(getAccessReviewFunctionUrl());

    if (method === "GET") {
        functionUrl.searchParams.set("token", token);
    }

    const response = await fetch(functionUrl.toString(), {
        method,
        headers: {
            "Content-Type": "application/json",
            "apikey": HEADS_UP_CONFIG.supabasePublishableKey,
            "Authorization":
                `Bearer ${HEADS_UP_CONFIG.supabasePublishableKey}`,
            "X-Client-Info": "headsup-website/4"
        },
        body:
            method === "POST"
                ? JSON.stringify({ token, action })
                : undefined
    });

    const body = await response.json().catch(() => ({}));

    if (!response.ok || body?.ok === false) {
        const error = new Error(
            body?.error
            || body?.message
            || `The review request failed with status ${response.status}.`
        );

        error.status = response.status;
        error.details = body;

        throw error;
    }

    return body;
};


const removeAccessReviewParameters = () => {
    const url = new URL(window.location.href);

    url.searchParams.delete("headsup_review_token");
    url.searchParams.delete("headsup_review_action");

    history.replaceState(
        null,
        "",
        `${url.pathname}${url.search}${url.hash || "#portal"}`
    );
};


const appendReviewDetail = (container, label, value) => {
    const row = document.createElement("p");
    const strong = document.createElement("strong");

    strong.textContent = `${label}: `;
    row.append(strong, document.createTextNode(value || "Not provided"));
    container.append(row);
};


const showAccessReviewResult = ({
    action,
    decisionEmailSent,
    warning
}) => {
    modalEyebrow.textContent = "Heads Up access review";
    modalTitle.textContent =
        action === "approve"
            ? "Access approved"
            : "Request rejected";

    modalBody.innerHTML = "";

    const message = document.createElement("p");

    message.textContent =
        action === "approve"
            ? "The account is now approved. The person can sign in again to access private content allowed for their role."
            : "The account request is now rejected. Private portal content remains locked.";

    modalBody.append(message);

    if (decisionEmailSent === false) {
        const notice = document.createElement("p");

        notice.textContent =
            warning
            || "The Supabase status changed successfully, but a decision email could not be delivered. The requester will still see the updated status when signing in.";

        modalBody.append(notice);
    }

    modalActions.innerHTML = "";

    const closeButton = document.createElement("button");

    closeButton.type = "button";
    closeButton.textContent = "Close";
    closeButton.className = "modal-primary-action";
    closeButton.addEventListener("click", closeModal);

    modalActions.append(closeButton);

    removeAccessReviewParameters();
};


const submitAccessReviewDecision = async (
    token,
    action,
    clickedButton,
    actionButtons
) => {
    actionButtons.forEach((button) => {
        button.disabled = true;
    });

    const originalText = clickedButton.textContent;

    clickedButton.textContent =
        action === "approve"
            ? "Approving…"
            : "Rejecting…";

    try {
        const result = await callAccessReviewFunction({
            method: "POST",
            token,
            action
        });

        showAccessReviewResult({
            action,
            decisionEmailSent: result?.decisionEmailSent,
            warning: result?.warning
        });
    } catch (error) {
        console.error("Access review decision failed:", error);

        const errorMessage = document.createElement("p");

        errorMessage.className = "form-submit-status is-danger";
        errorMessage.textContent = describeSupabaseError(error);

        modalBody.append(errorMessage);

        actionButtons.forEach((button) => {
            button.disabled = false;
        });

        clickedButton.textContent = originalText;
    }
};


const openAccessReviewModal = (
    review,
    token,
    suggestedAction
) => {
    if (!siteModal || !modalBody || !modalActions) {
        return;
    }

    lastFocusedElement = document.activeElement;

    modalEyebrow.textContent = "Heads Up access review";
    modalTitle.textContent = "Review portal access request";
    modalBody.innerHTML = "";
    modalActions.innerHTML = "";

    const intro = document.createElement("p");

    intro.textContent =
        "Confirm the request below. Nothing changes until you press Approve request or Reject request.";

    modalBody.append(intro);

    appendReviewDetail(modalBody, "Name", review.requesterName);
    appendReviewDetail(modalBody, "Email", review.requesterEmail);
    appendReviewDetail(modalBody, "Relationship", review.relationship);
    appendReviewDetail(modalBody, "Requested role", review.requestedRole);
    appendReviewDetail(modalBody, "Reason", review.requestReason);
    appendReviewDetail(
        modalBody,
        "Submitted",
        review.createdAt
            ? new Date(review.createdAt).toLocaleString()
            : ""
    );
    appendReviewDetail(
        modalBody,
        "Review link expires",
        review.expiresAt
            ? new Date(review.expiresAt).toLocaleString()
            : ""
    );

    const securityNotice = document.createElement("p");

    securityNotice.textContent =
        "Only approve people whose relationship with Heads Up has been independently verified. This review link is single-use and expires automatically.";

    modalBody.append(securityNotice);

    const approveButton = document.createElement("button");
    const rejectButton = document.createElement("button");
    const closeButton = document.createElement("button");

    approveButton.type = "button";
    rejectButton.type = "button";
    closeButton.type = "button";

    approveButton.textContent = "Approve request";
    rejectButton.textContent = "Reject request";
    closeButton.textContent = "Close without deciding";

    approveButton.className = "modal-primary-action";
    rejectButton.style.borderColor = "#ef2021";
    rejectButton.style.color = "#a31313";

    if (suggestedAction === "reject") {
        rejectButton.style.fontWeight = "900";
    } else {
        approveButton.style.fontWeight = "900";
    }

    const actionButtons = [approveButton, rejectButton];

    approveButton.addEventListener(
        "click",
        () => submitAccessReviewDecision(
            token,
            "approve",
            approveButton,
            actionButtons
        )
    );

    rejectButton.addEventListener(
        "click",
        () => submitAccessReviewDecision(
            token,
            "reject",
            rejectButton,
            actionButtons
        )
    );

    closeButton.addEventListener("click", closeModal);

    modalActions.append(approveButton, rejectButton, closeButton);

    siteModal.hidden = false;
    document.body.classList.add("modal-is-open");

    window.setTimeout(() => approveButton.focus(), 40);
};


const initializeAccessReviewFromEmail = async () => {
    const parameters = new URLSearchParams(window.location.search);
    const token = parameters.get("headsup_review_token") || "";
    const suggestedAction =
        parameters.get("headsup_review_action") || "approve";

    if (!token) {
        return;
    }

    if (window.location.hash !== "#portal") {
        history.replaceState(
            null,
            "",
            `${window.location.pathname}${window.location.search}#portal`
        );

        renderRoute("#portal");
    }

    modalEyebrow.textContent = "Heads Up access review";
    modalTitle.textContent = "Loading request…";
    modalBody.textContent = "Checking the secure one-time review link.";
    modalActions.innerHTML = "";
    siteModal.hidden = false;
    document.body.classList.add("modal-is-open");

    try {
        const result = await callAccessReviewFunction({
            method: "GET",
            token
        });

        openAccessReviewModal(
            result.request,
            token,
            suggestedAction
        );
    } catch (error) {
        console.error("Could not load access review:", error);

        modalTitle.textContent = "Review link unavailable";
        modalBody.textContent = describeSupabaseError(error);
        modalActions.innerHTML = "";

        const closeButton = document.createElement("button");

        closeButton.type = "button";
        closeButton.className = "modal-primary-action";
        closeButton.textContent = "Close";
        closeButton.addEventListener("click", () => {
            removeAccessReviewParameters();
            closeModal();
        });

        modalActions.append(closeButton);
    }
};


initializeAccessReviewFromEmail();



/* =====================================================================
   MERGED PUBLIC-READY.JS — ORIGINAL ADD-ON PRESERVED VERBATIM
   =====================================================================
   This IIFE was previously loaded after script.js. It remains last so
   every original function, DOM reference, route, and portal behavior
   is available before the enhancement layer initializes.
   ===================================================================== */

/* =============================================================
   HEADS UP PUBLIC-READY ADD-ON
   -------------------------------------------------------------
   Load this AFTER script.js.

   This add-on does not replace the existing website logic. It layers
   the requested public-readiness, cleaner navigation, protected-view,
   approved-account, and calendar features on top of the working site.
============================================================= */

"use strict";

(() => {
    const PUBLIC_READY = {
        approved: false,
        email: "",
        profile: null,
        privateItems: []
    };

    const $ = (selector, root = document) => root.querySelector(selector);
    const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

    const setText = (selector, value, root = document) => {
        const element = $(selector, root);
        if (element) {
            element.textContent = value;
        }
        return element;
    };

    const safeUrl = (value) => {
        try {
            const url = new URL(String(value || ""));
            return ["https:", "http:"].includes(url.protocol) ? url.toString() : "";
        } catch {
            return "";
        }
    };

    const escapeIcsText = (value) => String(value || "")
        .replace(/\\/g, "\\\\")
        .replace(/\r?\n/g, "\\n")
        .replace(/,/g, "\\,")
        .replace(/;/g, "\\;");

    const formatIcsDate = (value) => {
        const date = new Date(value);
        if (Number.isNaN(date.getTime())) {
            return "";
        }
        return date.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}Z$/, "Z");
    };

    const formatPrivateDate = (value) => {
        const date = new Date(value);
        if (Number.isNaN(date.getTime())) {
            return "";
        }
        return new Intl.DateTimeFormat(undefined, {
            dateStyle: "medium",
            timeStyle: "short"
        }).format(date);
    };

    const showFriendlyStatus = (message, type = "info") => {
        if (typeof setPortalStatus === "function") {
            setPortalStatus(message, type);
            return;
        }

        const status = $("#portalStatus");
        if (status) {
            status.textContent = message;
            status.dataset.status = type;
        }
    };

    const makeButton = ({ label, href = "", onClick = null, primary = false }) => {
        const element = href ? document.createElement("a") : document.createElement("button");
        element.className = `button ${primary ? "button--primary" : "button--secondary"} button--small`;
        element.textContent = label;

        if (href) {
            element.href = href;
            if (/^https?:/i.test(href)) {
                element.target = "_blank";
                element.rel = "noopener noreferrer";
            }
        } else {
            element.type = "button";
        }

        if (onClick) {
            element.addEventListener("click", onClick);
        }

        return element;
    };

    /* ---------------------------------------------------------
       PUBLIC COPY AND NAVIGATION CLEANUP
    --------------------------------------------------------- */

    const cleanPublicCopy = () => {
        const primaryHeroButton = $(".hero-buttons .button--primary");
        if (primaryHeroButton) {
            primaryHeroButton.href = "#programs";
            primaryHeroButton.childNodes.forEach((node) => {
                if (node.nodeType === Node.TEXT_NODE) {
                    node.textContent = " Explore Our Activities ";
                }
            });
        }

        setText(
            ".hero-description",
            "Heads Up is a welcoming tutoring and life skills community where students build academic confidence, explore new interests, connect with caring mentors, and grow through creativity, teamwork, and encouragement."
        );

        const heroPrivacy = $(".hero-privacy-note span:last-child");
        if (heroPrivacy) {
            heroPrivacy.innerHTML = `
                <strong>Family privacy comes first.</strong>
                General program information is public. Approved members sign in for schedules,
                locations, family announcements, and other protected updates.
            `;
        }

        const aboutIntro = $("#about .section-heading--split > p");
        if (aboutIntro) {
            aboutIntro.textContent =
                "Heads Up is a place to be you. No matter who you are, you belong here. We want you to show up as your authentic self, ready to laugh, learn, and share what makes you unique. Our mentors are more like guides and teammates. We are here to support your goals, help you work through tricky problems, and cheer you on as you grow and succeed.";
        }

        const aboutGrid = $("#about .about-grid");
        if (aboutGrid) {
            aboutGrid.classList.add("is-public-ready");
        }

        const aboutCards = $$("#about .about-card");
        const feelCard = aboutCards.find((card) => /what families should feel/i.test($("h3", card)?.textContent || ""));
        const duplicatePriorities = aboutCards.find((card) => /community priorities/i.test($("h3", card)?.textContent || ""));

        if (feelCard) {
            setText("h3", "Community priorities", feelCard);
            const list = $(".check-list", feelCard);
            if (list) {
                list.innerHTML = `
                    <li><svg aria-hidden="true"><use href="#icon-check"></use></svg>Safety, belonging, and respect</li>
                    <li><svg aria-hidden="true"><use href="#icon-check"></use></svg>Academic confidence and life skills</li>
                    <li><svg aria-hidden="true"><use href="#icon-check"></use></svg>Family and community connection</li>
                    <li><svg aria-hidden="true"><use href="#icon-check"></use></svg>Creativity, curiosity, and shared growth</li>
                `;
            }
        }

        if (duplicatePriorities && duplicatePriorities !== feelCard) {
            duplicatePriorities.classList.add("is-public-ready-hidden");
        }

        const whoWeAreButton = $("#about .about-card--feature .text-link");
        if (whoWeAreButton) {
            whoWeAreButton.firstChild.textContent = "Learn more about Heads Up ";
        }

        setText(
            "#programs .section-heading--center > p:last-child",
            "Students learn best when they can participate, create, ask questions, work with others, and connect new ideas to real experiences."
        );

        setText(
            ".day-at-heads-up__intro > p:last-child",
            "A typical program day balances connection, academic support, hands-on activities, community time, and reflection."
        );

        setText(
            "#updatesTitle",
            "Program updates and approved family information—in one place."
        );

        const privacyNotice = $(".communication-privacy-notice");
        if (privacyNotice) {
            setText(".communication-privacy-notice__eyebrow", "Family privacy", privacyNotice);
            setText("h3", "General updates are public. Detailed schedules stay protected.", privacyNotice);
            setText(
                "p:last-child",
                "Public updates share program news without exposing exact locations, attendance information, or child-specific details. Approved members can sign in for complete schedules and family announcements.",
                privacyNotice
            );
        }

        const announcementLink = $(".announcement-strip a");
        if (announcementLink) {
            announcementLink.href = "#updates";
            announcementLink.textContent = "See updates";
        }

        const growPiece = $(".puzzle-piece--grow");
        if (growPiece) {
            growPiece.href = "#updates";
        }

        setText(
            "#stories .section-heading--center > p:last-child",
            "Approved reflections and community voices help families understand the encouragement, curiosity, teamwork, and belonging that shape the Heads Up experience."
        );

        const galleryHeading = $("#galleryTitle");
        if (galleryHeading) {
            galleryHeading.textContent = "Approved moments from the Heads Up community.";
        }

        const portalIntro = $("#portal .section-heading--split > p");
        if (portalIntro) {
            portalIntro.textContent =
                "Exact schedules, locations, family announcements, protected links, and approved private updates are available only to verified accounts that have been reviewed by Heads Up.";
        }

        const portalSecurity = $("#portal .portal-security-note");
        if (portalSecurity) {
            setText("strong", "Private information stays protected.", portalSecurity);
            setText(
                "p",
                "Each person uses an individual account. Access is limited by role and may be reviewed, suspended, or removed when it is no longer needed.",
                portalSecurity
            );
        }

        const portalSteps = $("#portal .portal-steps");
        if (portalSteps) {
            portalSteps.innerHTML = `
                <li>Request access using your own email address.</li>
                <li>Confirm the verification email.</li>
                <li>Wait for Heads Up to review the request.</li>
                <li>Sign in to view the information approved for your role.</li>
            `;
        }

        const portalSmallNote = $("#portal .portal-small-note");
        if (portalSmallNote) {
            portalSmallNote.textContent =
                "Individual accounts protect families better than a shared PIN because access can be approved or removed one person at a time.";
        }

        const contactDeliveryNote = $$("#contact p, #contact small").find((element) => /Supabase|Edge Function/i.test(element.textContent || ""));
        if (contactDeliveryNote) {
            contactDeliveryNote.textContent =
                "Your message is sent securely to headsupweb@gmail.com. No separate email application will open.";
        }

        const resourcesHeading = $("#resources .section-heading--split > p");
        if (resourcesHeading) {
            resourcesHeading.textContent =
                "Choose the pathway that best matches your connection to Heads Up. Public guidance is available here, while private documents and schedules remain in the approved portal.";
        }

        const incomingResource = $(".resource-card--incoming");
        if (incomingResource) {
            incomingResource.classList.remove("is-private-resource-hidden");
            setText(".resource-card__eyebrow", "Safety & privacy", incomingResource);
            setText("h3", "Safe participation", incomingResource);
            setText(
                "p",
                "Clear privacy expectations, approved communication pathways, responsible photo use, and consistent community standards.",
                incomingResource
            );
            const button = $("button", incomingResource);
            if (button) {
                button.removeAttribute("data-resource");
                button.dataset.modalContent = "privacy";
                button.textContent = "Review privacy commitments";
            }
        }

        const transparencyPanel = $(".transparency-panel");
        if (transparencyPanel) {
            transparencyPanel.classList.add("public-ready-commitments");
            const content = $(".transparency-panel__content", transparencyPanel);
            if (content) {
                content.innerHTML = `
                    <p class="section-tag">Our public commitments</p>
                    <h3>Clear information, respectful communication, and responsible sharing.</h3>
                    <ul class="public-ready-commitment-list">
                        <li>Private child, family, schedule, and location details stay behind approved access.</li>
                        <li>Only permission-approved images and stories are displayed.</li>
                        <li>Volunteers follow clear safety, privacy, and conduct expectations.</li>
                        <li>Families can contact Heads Up directly with questions or accessibility needs.</li>
                    </ul>
                `;
            }

            const notesButton = $$("button", transparencyPanel).find((button) => /transparency notes/i.test(button.textContent || ""));
            if (notesButton) {
                notesButton.remove();
            }
        }

        const teamIntro = $("#team .section-heading--split > p");
        if (teamIntro) {
            teamIntro.textContent =
                "Program leadership, mentors, volunteers, and community partners work together to create a dependable and encouraging student experience.";
        }

        const teamCards = $$("#team .team-card");
        teamCards.forEach((card) => {
            const heading = $("h3", card)?.textContent || "";
            const paragraph = $(".team-card__body p", card);
            const image = $(".team-photo", card);

            if (/leadership/i.test(heading) && paragraph) {
                paragraph.textContent =
                    "Program leaders guide daily operations, family communication, student safety, partnerships, and the long-term direction of Heads Up.";
                image?.setAttribute("aria-label", "Heads Up program leadership illustration");
            } else if (/research|community-centered/i.test(heading) && paragraph) {
                paragraph.textContent =
                    "Community feedback and responsible research help Heads Up improve activities, communication, accessibility, and family engagement.";
                image?.setAttribute("aria-label", "Heads Up community learning illustration");
            } else if (paragraph) {
                paragraph.textContent =
                    "Mentors and volunteers offer homework support, encouragement, activity guidance, and a reliable presence for students.";
                image?.setAttribute("aria-label", "Heads Up mentor and volunteer illustration");
            }
        });

        const newsletter = $(".footer-newsletter");
        newsletter?.setAttribute("aria-hidden", "true");

        const socialStrip = $(".footer-social-strip");
        socialStrip?.setAttribute("aria-hidden", "true");
    };

    const updatePublicDataLibraries = () => {
        if (typeof weeklyUpdates !== "undefined" && Array.isArray(weeklyUpdates)) {
            weeklyUpdates.splice(0, weeklyUpdates.length,
                {
                    id: "weekly-program-focus",
                    featured: true,
                    category: "This week",
                    title: "Learning, creativity, and community connection",
                    dateLabel: "Updated weekly",
                    audience: "Students and families",
                    summary: "Students continue building academic confidence through tutoring, hands-on exploration, teamwork, reflection, and supportive mentor relationships.",
                    details: `
                        <p>Each week balances focused learning with opportunities to create, collaborate, ask questions, and celebrate progress.</p>
                        <h3>Current program focus</h3>
                        <ul>
                            <li>Homework and academic support</li>
                            <li>Hands-on STEM and creative activities</li>
                            <li>Teamwork, communication, and life skills</li>
                            <li>Community connection and reflection</li>
                        </ul>
                        <p>Approved families can sign in for exact schedules, locations, and family-specific notices.</p>
                    `
                },
                {
                    id: "family-communication",
                    featured: false,
                    category: "Families",
                    title: "Family communication and support",
                    dateLabel: "Ongoing",
                    audience: "Parents and guardians",
                    summary: "Families can contact Heads Up with participation, accessibility, transportation, learning-support, or portal questions.",
                    details: `
                        <p>Clear family communication helps Heads Up respond to student needs and keep participation expectations easy to understand.</p>
                        <p>Use the Contact page for general questions and the approved portal for protected information.</p>
                    `
                },
                {
                    id: "volunteer-opportunities",
                    featured: false,
                    category: "Get involved",
                    title: "Volunteer and mentor opportunities",
                    dateLabel: "Applications welcomed",
                    audience: "Prospective volunteers",
                    summary: "Support tutoring, activities, setup, community events, and positive student relationships through a clearly guided volunteer role.",
                    details: `
                        <p>Volunteers complete the program's review, orientation, privacy expectations, and any required screening before beginning.</p>
                        <p>Visit Volunteer With Us to review responsibilities and submit an inquiry.</p>
                    `
                },
                {
                    id: "activity-spotlight",
                    featured: false,
                    category: "Activity spotlight",
                    title: "Explore, create, and learn together",
                    dateLabel: "Program highlight",
                    audience: "Everyone",
                    summary: "Activity spotlights show how tutoring, STEM, creative work, outdoor exploration, and community time support whole-person growth.",
                    details: `
                        <p>Heads Up activities are designed to be welcoming, active, collaborative, and connected to student interests.</p>
                        <p>Only permission-approved stories and images are shared.</p>
                    `
                }
            );

            if (typeof renderWeeklyUpdates === "function") {
                renderWeeklyUpdates();
            }
        }

        if (typeof announcementMessages !== "undefined" && Array.isArray(announcementMessages)) {
            announcementMessages.splice(0, announcementMessages.length,
                "General updates are available publicly; approved members can sign in for exact schedules and family details.",
                "Questions about participation, accessibility, or volunteering are always welcome through the Contact page.",
                "Only permission-approved images, quotations, and stories are shared.",
                "Heads Up is committed to safety, encouragement, belonging, and engaging learning experiences."
            );
        }

        if (typeof resourceLibrary !== "undefined") {
            resourceLibrary.parents = {
                eyebrow: "Parents & guardians",
                title: "Family information without the guesswork",
                body: `
                    <p>Families can quickly find public program information, participation steps, privacy expectations, and the correct way to ask for support.</p>
                    <h3>Family resources</h3>
                    <ul>
                        <li>What students can expect during a program day</li>
                        <li>Program activities and learning goals</li>
                        <li>Safety, privacy, and communication expectations</li>
                        <li>Accessibility and participation questions</li>
                        <li>Approved portal access for detailed schedules and announcements</li>
                    </ul>
                `,
                actions: [
                    { label: "Visit the Parents page", href: "#parents", primary: true },
                    { label: "Contact Heads Up", href: "#contact" }
                ]
            };

            resourceLibrary.volunteers = {
                eyebrow: "Volunteers & mentors",
                title: "Support students with clarity and care",
                body: `
                    <p>Volunteers help with tutoring, activities, setup, family events, and encouraging student relationships under program guidance.</p>
                    <h3>Before beginning</h3>
                    <ul>
                        <li>Submit an interest inquiry</li>
                        <li>Complete the program review and required screening</li>
                        <li>Attend orientation</li>
                        <li>Follow privacy, conduct, supervision, and communication expectations</li>
                        <li>Use approved channels for schedules and protected information</li>
                    </ul>
                `,
                actions: [
                    { label: "Volunteer With Us", href: "#volunteer", primary: true },
                    { label: "Ask a volunteer question", href: "#contact" }
                ]
            };

            resourceLibrary.researchers = {
                eyebrow: "Research & community learning",
                title: "Responsible, community-centered improvement",
                body: `
                    <p>Research and community feedback support thoughtful improvements to communication, accessibility, activities, and the overall family experience.</p>
                    <h3>Public commitments</h3>
                    <ul>
                        <li>Protect private participant and family information</li>
                        <li>Use approved consent and media practices</li>
                        <li>Share public findings responsibly</li>
                        <li>Keep participation and research roles clear</li>
                        <li>Provide a direct contact pathway for questions</li>
                    </ul>
                `,
                actions: [
                    { label: "Ask about research", href: "#contact", primary: true },
                    { label: "Review privacy", modal: "privacy" }
                ]
            };

            resourceLibrary.incoming = {
                eyebrow: "Safety & privacy",
                title: "Consistent rules protect the whole community",
                body: `
                    <p>Heads Up separates public information from protected family information and avoids publishing sensitive child, schedule, location, attendance, or contact details.</p>
                    <h3>Core safeguards</h3>
                    <ul>
                        <li>Individual approved accounts for private access</li>
                        <li>Permission review for identifiable images and stories</li>
                        <li>Clear volunteer supervision and conduct expectations</li>
                        <li>Role-based access to private information</li>
                        <li>Prompt removal of outdated or withdrawn content</li>
                    </ul>
                `,
                actions: [
                    { label: "Privacy information", modal: "privacy", primary: true },
                    { label: "Contact Heads Up", href: "#contact" }
                ]
            };

            resourceLibrary.community = {
                eyebrow: "Community partners",
                title: "Build a meaningful partnership",
                body: `
                    <p>Community partners can support learning experiences, family engagement, mentoring, resources, and opportunities that align with the Heads Up mission.</p>
                    <h3>Ways to connect</h3>
                    <ul>
                        <li>Activity or workshop partnerships</li>
                        <li>Volunteer and mentor support</li>
                        <li>Family and community events</li>
                        <li>Educational resources and program collaboration</li>
                        <li>Responsible research and evaluation partnerships</li>
                    </ul>
                `,
                actions: [
                    { label: "Start a partnership conversation", href: "#contact", primary: true },
                    { label: "Explore programs", href: "#programs" }
                ]
            };
        }

        if (typeof teamLibrary !== "undefined") {
            teamLibrary.leadership = {
                eyebrow: "Program leadership",
                title: "Guidance, responsibility, and community care",
                body: `
                    <p>Program leadership supports daily operations, family communication, student safety, volunteer coordination, partnerships, and long-term program direction.</p>
                    <h3>Leadership responsibilities</h3>
                    <ul>
                        <li>Maintain a safe and welcoming environment</li>
                        <li>Support families and respond to questions</li>
                        <li>Coordinate mentors, volunteers, and activities</li>
                        <li>Protect private program and participant information</li>
                        <li>Use community feedback to strengthen the program</li>
                    </ul>
                `,
                actions: [
                    { label: "Contact program leadership", href: "#contact", primary: true },
                    { label: "Close", close: true }
                ]
            };

            teamLibrary.research = {
                eyebrow: "Community learning",
                title: "Listening carefully and improving responsibly",
                body: `
                    <p>Community feedback and responsible research help Heads Up understand what students and families value and where communication or programming can improve.</p>
                    <h3>Our approach</h3>
                    <ul>
                        <li>Center community voices and lived experiences</li>
                        <li>Protect privacy and follow approved procedures</li>
                        <li>Translate findings into practical improvements</li>
                        <li>Communicate goals and participation expectations clearly</li>
                    </ul>
                `,
                actions: [
                    { label: "Ask a research question", href: "#contact", primary: true },
                    { label: "Close", close: true }
                ]
            };

            teamLibrary.volunteers = {
                eyebrow: "Mentors & volunteers",
                title: "A dependable and encouraging presence",
                body: `
                    <p>Mentors and volunteers help students work through challenges, explore interests, communicate ideas, and feel connected to a caring community.</p>
                    <h3>What strong mentorship looks like</h3>
                    <ul>
                        <li>Listen before directing</li>
                        <li>Encourage effort, curiosity, and reflection</li>
                        <li>Use inclusive and age-appropriate communication</li>
                        <li>Follow supervision, privacy, and safety expectations</li>
                        <li>Communicate reliably with program leadership</li>
                    </ul>
                `,
                actions: [
                    { label: "Volunteer With Us", href: "#volunteer", primary: true },
                    { label: "Close", close: true }
                ]
            };
        }

        if (typeof contentLibrary !== "undefined") {
            contentLibrary.transparency = {
                eyebrow: "Trust & transparency",
                title: "Clear information and responsible communication",
                body: `
                    <p>Heads Up shares public program information clearly while protecting details that belong only with approved families, volunteers, staff, and partners.</p>
                    <h3>What the public can expect</h3>
                    <ul>
                        <li>Accurate mission, program, participation, and contact information</li>
                        <li>Clear privacy and media-use expectations</li>
                        <li>General updates that do not expose child or location details</li>
                        <li>Direct pathways for family, volunteer, accessibility, and partnership questions</li>
                    </ul>
                `,
                actions: [
                    { label: "Contact Heads Up", href: "#contact", primary: true },
                    { label: "Close", close: true }
                ]
            };

            contentLibrary.photoPolicy = {
                eyebrow: "Photos, stories & privacy",
                title: "Community stories shared with care",
                body: `
                    <p>Identifiable photos, quotations, artwork, and personal stories are displayed only after the appropriate permission and ownership review.</p>
                    <h3>Public-sharing commitments</h3>
                    <ul>
                        <li>Use only approved images and stories</li>
                        <li>Provide meaningful alternative text and captions</li>
                        <li>Avoid unnecessary identifying or private details</li>
                        <li>Credit original or properly licensed media</li>
                        <li>Remove content promptly when approval is withdrawn</li>
                    </ul>
                `,
                actions: [
                    { label: "Ask a media question", href: "#contact", primary: true },
                    { label: "Close", close: true }
                ]
            };

            contentLibrary.privacy = {
                eyebrow: "Privacy",
                title: "Private information belongs in protected spaces",
                body: `
                    <p>Heads Up limits public information to what visitors need to understand the program and connect safely.</p>
                    <h3>Information kept out of public pages</h3>
                    <ul>
                        <li>Exact child schedules, attendance, and locations</li>
                        <li>Private family or emergency information</li>
                        <li>Unapproved names, images, quotations, and stories</li>
                        <li>Protected research, staff, or volunteer documents</li>
                        <li>Passwords, security credentials, and private calendar links</li>
                    </ul>
                `,
                actions: [
                    { label: "Ask a privacy question", href: "#contact", primary: true },
                    { label: "Close", close: true }
                ]
            };
        }
    };

    /* ---------------------------------------------------------
       PORTAL NAVIGATION STATE
    --------------------------------------------------------- */

    const preparePortalNav = () => {
        const portalLinks = $$("a[href='#portal']").filter((link) =>
            link.matches(".nav-link, .mobile-nav__links a")
        );

        portalLinks.forEach((link) => {
            link.classList.add("portal-nav-link");
            link.innerHTML = `
                <svg class="portal-nav-icon" aria-hidden="true">
                    <use href="#icon-lock"></use>
                </svg>
                <span class="portal-nav-label">Family Portal</span>
            `;
        });
    };

    const updatePortalNav = () => {
        $$(".portal-nav-link").forEach((link) => {
            const label = $(".portal-nav-label", link);
            const use = $(".portal-nav-icon use", link);

            if (PUBLIC_READY.approved && PUBLIC_READY.email) {
                link.classList.add("is-unlocked");
                link.title = `Signed in as ${PUBLIC_READY.email}`;
                label.textContent = PUBLIC_READY.email;
                use?.setAttribute("href", "#icon-unlock");
            } else {
                link.classList.remove("is-unlocked");
                link.title = "Family Portal";
                label.textContent = "Family Portal";
                use?.setAttribute("href", "#icon-lock");
            }
        });
    };

    /* ---------------------------------------------------------
       GALLERY AND UPDATE LOCK STATES
    --------------------------------------------------------- */

    const createLockCard = ({ title, text, buttonText = "Open Family Portal" }) => {
        const card = document.createElement("div");
        card.className = "protected-lock-card";
        card.innerHTML = `
            <span class="protected-lock-card__icon" aria-hidden="true">
                <svg><use href="#icon-lock"></use></svg>
            </span>
            <div>
                <h3>${title}</h3>
                <p>${text}</p>
            </div>
            <a class="button button--primary button--small" href="#portal">${buttonText}</a>
        `;
        return card;
    };

    const prepareProtectedGallery = () => {
        const gallery = $("#gallery");
        const shell = $(".section-shell", gallery || document);
        if (!gallery || !shell || $("#galleryProtectedContent")) {
            return;
        }

        const heading = $(".section-heading", shell);
        const protectedContent = document.createElement("div");
        protectedContent.id = "galleryProtectedContent";
        protectedContent.className = "protected-content";
        protectedContent.hidden = true;

        [...shell.children].forEach((child) => {
            if (child !== heading) {
                protectedContent.append(child);
            }
        });

        const note = $(".gallery-note", protectedContent);
        if (note) {
            note.classList.add("public-ready-gallery-note");
            note.textContent =
                "This gallery is available only to approved members. Please respect participant privacy and do not download or redistribute images without permission.";
        }

        const lockCard = createLockCard({
            title: "Gallery access is protected",
            text: "Approved members can view permission-reviewed program images after signing in. This protects students, families, volunteers, and community participants."
        });
        lockCard.id = "galleryLockedState";

        shell.append(lockCard, protectedContent);
    };

    const prepareProtectedUpdates = () => {
        const schedulePanel = $("#schedulePanel");
        const eventsPanel = $("#eventsPanel");

        $("#weeklyScheduleList")?.classList.add("public-ready-original-private-data");
        $("#upcomingEventsGrid")?.classList.add("public-ready-original-private-data");

        const scheduleSummary = $("#schedulePanel .schedule-summary");
        if (scheduleSummary) {
            setText(".section-tag", "Approved weekly schedule", scheduleSummary);
            setText("h3", "Current times, locations, and family reminders", scheduleSummary);
        }

        [
            [schedulePanel, "schedule", "Weekly schedule"],
            [eventsPanel, "events", "Upcoming events"]
        ].forEach(([panel, type, label]) => {
            if (!panel || $(`.private-schedule-view[data-private-view='${type}']`, panel)) {
                return;
            }

            const existingChildren = [...panel.children];
            const protectedContent = document.createElement("div");
            protectedContent.className = "protected-content private-schedule-view";
            protectedContent.dataset.privateView = type;
            protectedContent.hidden = true;

            existingChildren.forEach((child) => protectedContent.append(child));

            const lockCard = createLockCard({
                title: `${label} is available to approved members`,
                text: "Sign in with an approved account to view exact dates, times, locations, family reminders, and calendar options."
            });
            lockCard.classList.add("private-schedule-view");
            lockCard.dataset.privateLock = type;

            panel.append(lockCard, protectedContent);
        });

        ["schedule", "events"].forEach((type) => {
            const tab = $(`[data-hub-tab='${type}']`);
            tab?.classList.add("is-private-locked");
        });
    };

    const setProtectedVisibility = () => {
        document.body.classList.toggle("portal-access-approved", PUBLIC_READY.approved);
        document.body.classList.toggle("portal-access-locked", !PUBLIC_READY.approved);

        const galleryLock = $("#galleryLockedState");
        const galleryContent = $("#galleryProtectedContent");
        if (galleryLock) galleryLock.hidden = PUBLIC_READY.approved;
        if (galleryContent) galleryContent.hidden = !PUBLIC_READY.approved;

        ["schedule", "events"].forEach((type) => {
            const lock = $(`[data-private-lock='${type}']`);
            const content = $(`[data-private-view='${type}']`);
            const tab = $(`[data-hub-tab='${type}']`);

            if (lock) lock.hidden = PUBLIC_READY.approved;
            if (content) content.hidden = !PUBLIC_READY.approved;
            tab?.classList.toggle("is-private-locked", !PUBLIC_READY.approved);
            tab?.classList.toggle("is-private-unlocked", PUBLIC_READY.approved);
        });
    };

    document.addEventListener("click", (event) => {
        const privateTab = event.target.closest("[data-hub-tab='schedule'], [data-hub-tab='events']");
        if (!privateTab || PUBLIC_READY.approved) {
            return;
        }

        event.preventDefault();
        event.stopImmediatePropagation();
        window.location.hash = "#portal";
        showFriendlyStatus(
            "Sign in with an approved account to unlock complete schedules, event details, and calendar options.",
            "warning"
        );
    }, true);

    /* ---------------------------------------------------------
       PRIVATE CALENDAR AND EVENT DOWNLOADS
    --------------------------------------------------------- */

    const eventItems = () => PUBLIC_READY.privateItems.filter((item) =>
        item?.start_at && /schedule|event|calendar|activity|meeting|announcement/i.test(item?.content_type || "")
    );

    const calendarSubscriptionItem = () => PUBLIC_READY.privateItems.find((item) =>
        /calendar/i.test(item?.content_type || "") && safeUrl(item?.link_url)
    );

    const buildIcs = (items) => {
        const events = items
            .filter((item) => item?.title && item?.start_at)
            .map((item) => {
                const start = formatIcsDate(item.start_at);
                const end = formatIcsDate(item.end_at || new Date(new Date(item.start_at).getTime() + 60 * 60 * 1000));
                if (!start || !end) return "";

                return [
                    "BEGIN:VEVENT",
                    `UID:${escapeIcsText(item.id || crypto.randomUUID())}@headsup`,
                    `DTSTAMP:${formatIcsDate(new Date())}`,
                    `DTSTART:${start}`,
                    `DTEND:${end}`,
                    `SUMMARY:${escapeIcsText(item.title)}`,
                    `DESCRIPTION:${escapeIcsText([item.summary, item.details].filter(Boolean).join("\n\n"))}`,
                    `LOCATION:${escapeIcsText(item.location || "")}`,
                    "END:VEVENT"
                ].join("\r\n");
            })
            .filter(Boolean);

        return [
            "BEGIN:VCALENDAR",
            "VERSION:2.0",
            "PRODID:-//Heads Up//Private Family Portal//EN",
            "CALSCALE:GREGORIAN",
            "METHOD:PUBLISH",
            ...events,
            "END:VCALENDAR"
        ].join("\r\n");
    };

    const downloadIcs = (items, filename) => {
        const usableItems = items.filter((item) => item?.start_at);
        if (!usableItems.length) {
            showFriendlyStatus("No dated private events are available to download yet.", "warning");
            return;
        }

        const blob = new Blob([buildIcs(usableItems)], { type: "text/calendar;charset=utf-8" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = filename;
        document.body.append(link);
        link.click();
        link.remove();
        URL.revokeObjectURL(url);
    };

    const renderEventCard = (item) => {
        const card = document.createElement("article");
        card.className = "private-schedule-card";

        const type = document.createElement("span");
        type.className = "private-schedule-card__type";
        type.textContent = item.content_type || "Private schedule";

        const title = document.createElement("h4");
        title.textContent = item.title || "Program event";

        card.append(type, title);

        if (item.summary) {
            const summary = document.createElement("p");
            summary.textContent = item.summary;
            card.append(summary);
        }

        const metaParts = [
            item.start_at ? formatPrivateDate(item.start_at) : "",
            item.location || ""
        ].filter(Boolean);

        if (metaParts.length) {
            const meta = document.createElement("p");
            meta.className = "private-schedule-card__meta";
            meta.textContent = metaParts.join(" • ");
            card.append(meta);
        }

        const actions = document.createElement("div");
        actions.className = "private-schedule-card__actions";

        if (item.start_at) {
            actions.append(makeButton({
                label: "Download event (.ics)",
                onClick: () => downloadIcs([item], `${String(item.title || "headsup-event").replace(/[^a-z0-9]+/gi, "-").toLowerCase()}.ics`)
            }));
        }

        const itemLink = safeUrl(item.link_url);
        if (itemLink && !/calendar/i.test(item.content_type || "")) {
            actions.append(makeButton({ label: "Open private link", href: itemLink }));
        }

        if (actions.children.length) {
            card.append(actions);
        }

        return card;
    };

    const dedupePrivateItems = (items) => {
        const seen = new Set();

        return (Array.isArray(items) ? items : []).filter((item) => {
            const key = [
                String(item?.content_type || "").trim().toLowerCase(),
                String(item?.title || "").trim().toLowerCase(),
                String(item?.start_at || ""),
                String(item?.link_url || "").trim().toLowerCase()
            ].join("|");

            if (seen.has(key)) {
                return false;
            }

            seen.add(key);
            return true;
        });
    };

    const cleanRenderedPrivateContent = () => {
        const list = $("#privateContentList");
        if (!list) {
            return;
        }

        const seen = new Set();

        $$(".private-content-card", list).forEach((card) => {
            const type = $(".private-content-card__type", card)?.textContent || "";
            const title = $("h3, h4", card)?.textContent || "";
            const link = $("a[href]", card)?.getAttribute("href") || "";
            const key = `${type}|${title}|${link}`.trim().toLowerCase();

            /* The dedicated calendar panel already provides these actions. */
            if (/calendar/i.test(type) || /heads up family calendar/i.test(title)) {
                card.classList.add("public-ready-calendar-card-hidden");
                card.setAttribute("aria-hidden", "true");
                return;
            }

            if (seen.has(key)) {
                card.remove();
                return;
            }

            seen.add(key);
        });
    };

    const observePrivateContentList = () => {
        const list = $("#privateContentList");
        if (!list || list.dataset.publicReadyObserved === "true") {
            return;
        }

        list.dataset.publicReadyObserved = "true";
        const observer = new MutationObserver(() => cleanRenderedPrivateContent());
        observer.observe(list, { childList: true, subtree: true });
        cleanRenderedPrivateContent();
    };

    const createCalendarPanel = ({
        panelId,
        actionsId,
        eventsId,
        eyebrow,
        title,
        description,
        extraClass = ""
    }) => {
        const panel = document.createElement("section");
        panel.id = panelId;
        panel.className = `private-calendar-panel ${extraClass}`.trim();
        panel.hidden = true;
        panel.innerHTML = `
            <div class="private-calendar-panel__header">
                <div>
                    <p class="card-kicker">${eyebrow}</p>
                    <h3>${title}</h3>
                    <p>${description}</p>
                </div>
                <div class="private-calendar-actions" id="${actionsId}"></div>
            </div>
            <div class="private-calendar-events" id="${eventsId}"></div>
        `;
        return panel;
    };

    const ensurePrivateCalendarPanel = () => {
        const dashboard = $("#portalDashboard");
        const privateContentList = $("#privateContentList");
        if (!dashboard || $("#privateCalendarPanel")) {
            return;
        }

        const panel = createCalendarPanel({
            panelId: "privateCalendarPanel",
            actionsId: "privateCalendarActions",
            eventsId: "privateCalendarEvents",
            eyebrow: "Approved family calendar",
            title: "Schedules, reminders, and calendar tools",
            description: "Download individual events, download all available events, or open the approved shared calendar when one has been connected."
        });

        dashboard.insertBefore(panel, privateContentList || null);
    };

    const ensureUpdatesCalendarPanel = () => {
        const updatesPanel = $("#updatesPanel");
        if (!updatesPanel || $("#updatesPrivateCalendarPanel")) {
            return;
        }

        const panel = createCalendarPanel({
            panelId: "updatesPrivateCalendarPanel",
            actionsId: "updatesPrivateCalendarActions",
            eventsId: "updatesPrivateCalendarEvents",
            eyebrow: "Approved member calendar",
            title: "Save schedules and open the shared calendar",
            description: "Approved members can open the protected Google Calendar, download all dated events, or save individual events from Updates.",
            extraClass: "private-calendar-panel--updates"
        });

        updatesPanel.append(panel);
    };

    const renderPrivateScheduleViews = () => {
        const items = PUBLIC_READY.privateItems.filter((item) =>
            /schedule|event|activity|meeting|announcement/i.test(item?.content_type || "")
        );

        ["schedule", "events"].forEach((type) => {
            const view = $(`[data-private-view='${type}']`);
            if (!view) return;

            const oldGrid = $(".public-ready-private-grid", view);
            oldGrid?.remove();

            const grid = document.createElement("div");
            grid.className = "private-schedule-grid public-ready-private-grid";

            const filtered = type === "events"
                ? items.filter((item) => item.start_at)
                : items;

            if (!filtered.length) {
                const empty = document.createElement("div");
                empty.className = "private-calendar-empty";
                empty.textContent = "No private schedule details have been posted for this account yet.";
                grid.append(empty);
            } else {
                filtered.forEach((item) => grid.append(renderEventCard(item)));
            }

            view.prepend(grid);
        });
    };

    const renderCalendarPanel = ({ panelSelector, actionsSelector, eventsSelector }) => {
        const panel = $(panelSelector);
        const actions = $(actionsSelector);
        const events = $(eventsSelector);
        if (!panel || !actions || !events) {
            return;
        }

        panel.hidden = !PUBLIC_READY.approved;
        actions.replaceChildren();
        events.replaceChildren();

        if (!PUBLIC_READY.approved) {
            return;
        }

        const datedItems = eventItems();
        const subscription = calendarSubscriptionItem();

        if (subscription) {
            actions.append(makeButton({
                label: "Open shared Google Calendar",
                href: safeUrl(subscription.link_url),
                primary: true
            }));
        }

        actions.append(makeButton({
            label: "Download all events (.ics)",
            onClick: () => downloadIcs(datedItems, "heads-up-family-events.ics")
        }));

        if (!datedItems.length) {
            const empty = document.createElement("div");
            empty.className = "private-calendar-empty";
            empty.textContent = subscription
                ? "The shared calendar is connected. Individual downloadable events will appear here when they are posted."
                : "No dated events or shared calendar have been posted for this account yet.";
            events.append(empty);
            return;
        }

        datedItems.forEach((item) => events.append(renderEventCard(item)));
    };

    const renderPrivateCalendar = () => {
        ensurePrivateCalendarPanel();
        ensureUpdatesCalendarPanel();

        renderCalendarPanel({
            panelSelector: "#privateCalendarPanel",
            actionsSelector: "#privateCalendarActions",
            eventsSelector: "#privateCalendarEvents"
        });

        renderCalendarPanel({
            panelSelector: "#updatesPrivateCalendarPanel",
            actionsSelector: "#updatesPrivateCalendarActions",
            eventsSelector: "#updatesPrivateCalendarEvents"
        });

        cleanRenderedPrivateContent();
    };

    /* ---------------------------------------------------------
       AUTHENTICATION AND APPROVAL STATE
    --------------------------------------------------------- */

    const clearApprovedState = () => {
        PUBLIC_READY.approved = false;
        PUBLIC_READY.email = "";
        PUBLIC_READY.profile = null;
        PUBLIC_READY.privateItems = [];
        updatePortalNav();
        setProtectedVisibility();
        renderPrivateCalendar();
    };

    const loadPublicReadyAccessState = async (sessionOverride = null) => {
        if (typeof headsUpSupabase === "undefined" || !headsUpSupabase) {
            clearApprovedState();
            return;
        }

        try {
            const session = sessionOverride || (await headsUpSupabase.auth.getSession()).data.session;
            if (!session?.user) {
                clearApprovedState();
                return;
            }

            const { data: profile, error: profileError } = await headsUpSupabase
                .from("profiles")
                .select("*")
                .eq("id", session.user.id)
                .maybeSingle();

            if (profileError) {
                throw profileError;
            }

            const approved = profile?.approval_status === "approved"
                && profile?.account_status === "active";

            PUBLIC_READY.approved = approved;
            PUBLIC_READY.email = session.user.email || profile?.email || "";
            PUBLIC_READY.profile = profile || null;
            PUBLIC_READY.privateItems = [];

            if (approved) {
                const { data, error } = await headsUpSupabase
                    .from("private_portal_content")
                    .select("id, content_type, title, summary, details, start_at, end_at, location, link_url, sort_order")
                    .eq("is_active", true)
                    .order("sort_order", { ascending: true })
                    .order("start_at", { ascending: true, nullsFirst: false });

                if (error) {
                    throw error;
                }

                PUBLIC_READY.privateItems = dedupePrivateItems(data || []);
            }

            updatePortalNav();
            setProtectedVisibility();
            renderPrivateScheduleViews();
            renderPrivateCalendar();
            window.setTimeout(cleanRenderedPrivateContent, 80);
        } catch (error) {
            console.error("Public-ready portal state could not be refreshed:", error);
            clearApprovedState();
        }
    };

    const connectPortalState = () => {
        loadPublicReadyAccessState();

        if (typeof headsUpSupabase !== "undefined" && headsUpSupabase) {
            headsUpSupabase.auth.onAuthStateChange((_event, session) => {
                window.setTimeout(() => loadPublicReadyAccessState(session), 50);
            });
        }

        $("#portalSignOutButton")?.addEventListener("click", () => {
            window.setTimeout(clearApprovedState, 50);
        });
    };

    const initialize = () => {
        cleanPublicCopy();
        updatePublicDataLibraries();
        preparePortalNav();
        prepareProtectedGallery();
        prepareProtectedUpdates();
        ensurePrivateCalendarPanel();
        ensureUpdatesCalendarPanel();
        observePrivateContentList();
        updatePortalNav();
        setProtectedVisibility();
        connectPortalState();
    };

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", initialize, { once: true });
    } else {
        initialize();
    }
})();
