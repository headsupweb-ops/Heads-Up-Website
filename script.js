/* =====================================================================
   HEADS UP PUBLIC DEMONSTRATION RELEASE
   =====================================================================
   Existing public copy, authentication, Gmail approval, protected portal,
   calendar, contact, routing, and public-ready behavior are preserved.

   The approved account email now appears in a dedicated mobile account card
   at the top of the navigation drawer. The mobile portal row stays concise,
   while desktop navigation continues to display the approved email.

   Visible template instructions have been rewritten as finished public copy.
   A line-by-line maintenance index follows the live JavaScript without
   inserting comments inside template strings or expressions.
   ===================================================================== */

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

/* =====================================================================
   2026-08-17 CORE LAB CONTENT + CUSTOM DOMAIN UPDATE
   =====================================================================
   Existing behavior is preserved. Focused additions below support the
   headsupgl.org redirect, three requested program panels, revised volunteer
   and team content, and reliable Stories-to-Contact form routing.
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

   PUBLIC CONTENT MAINTENANCE:
   -------------------------------------------------------------
   - Keep weekly updates and event details current.
   - Add only permission-approved images and biographies.
   - Keep exact schedules, locations, and family details protected.
   - Review public links and contact information before each release.

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
       Live domain: "https://headsupgl.org/#portal"
       Leave blank only while actively testing with a running local server.
    */
    authRedirectUrl:
        "https://headsupgl.org/",

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
                    Approved weekly details, family reminders, and
                    schedule information are available through the
                    Updates area and Family Portal.
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
                    Families can review the week's most important
                    schedule reminders, including approved arrival,
                    dismissal, transportation, or cancellation updates.
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
                    Discussion topics
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


    /* 2026-08-18: Keep this public update general until additional
       volunteer preparation information is approved for publication. */
    {

        id:
            "volunteer-orientation",

        featured:
            false,

        category:
            "Volunteer",

        title:
            "Volunteer information",

        dateLabel:
            "June 10, 2026",

        audience:
            "Volunteers and mentors",

        summary:
            "Prospective volunteers can review student-centered support practices and available participation opportunities.",

        details:
            `
                <p>
                    Volunteers support tutoring, activities, community events,
                    and positive student relationships with program guidance.
                </p>

                <p>
                    Use the volunteer inquiry or contact form to ask about
                    current opportunities and next steps.
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
            "Approved student reflections and project highlights celebrate learning, collaboration, and student excitement.",

        details:
            `
                <p>
                    Approved student projects, group accomplishments, and short reflections
                    highlight learning and community connection.
                    Avoid publishing private or identifying information
                    without the required permission.
                </p>

                <p>
                    Consent-approved images may accompany a story
                    when they add useful context and preserve privacy.
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
                    The Resources area brings together current forms,
                    support information, common questions, and contact
                    pathways for families and community members.
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
                    Exact time, location, student names, and attendance
                    information remain available only through approved
                    family communication.
                </p>
            `

    },


    /* 2026-08-18: The stable event ID remains unchanged so existing links
       keep working; only the public-facing wording is kept general. */
    {

        id:
            "volunteer-orientation-event",

        title:
            "Volunteer Information Check-In",

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
            "Volunteer information is available through the contact form or approved portal pathway.",

        details:
            `
                <p>
                    Volunteer onboarding can be introduced publicly,
                    but internal meeting locations, private documents,
                    and participant details should be shared only after
                    approval.
                </p>

                <h3>
                    Preparation topics
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

    "Heads Up shares only approved photos, stories, and student information in public community highlights."

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
                    What visitors can expect
                </h3>

                <p>
                    This website offers a welcoming, trustworthy,
                    and easy-to-navigate view of the program, grounded
                    in community voices and real learning experiences.
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
                    Homework Club is a school-year afterschool program
                    in the neighborhood clubhouse where children connect,
                    enjoy informal learning activities, complete assignments,
                    and receive guidance from volunteers and peers.
                </p>

                <h3>
                    What a Homework Club day can include
                </h3>

                <ul>
                    <li>Connection time and a short brain break after arrival</li>
                    <li>Group games, gardening, or another shared activity</li>
                    <li>Free voluntary reading and conversation about books</li>
                    <li>Homework, independent reading, or a guided group project</li>
                    <li>Snacks, encouragement, and points toward special field experiences</li>
                </ul>

                <p>
                    Current days, times, and family-specific details remain
                    available through approved program communication.
                </p>
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


    /*
       2026-08-17 PROGRAM MODALS:
       These keys support the new Team Mentor Program and Tutoring panels.
       Earlier modal definitions remain below so unrelated code is preserved.
    */
    mentor: {

        eyebrow:
            "Program activity",

        title:
            "Team Mentor Program",

        body:
            `
                <p>
                    The Team Mentor Program creates year-round connections
                    between local young people and dependable volunteers.
                    Meetings and activities are coordinated around mentor and
                    student availability.
                </p>

                <h3>
                    What students may experience
                </h3>

                <ul>
                    <li>Consistent relationships with caring adults</li>
                    <li>Conversation, goal-setting, and shared presentations</li>
                    <li>Encouragement that normalizes ambition and supports autonomy</li>
                    <li>Opportunities to explore new interests and skills</li>
                    <li>Positive teamwork with volunteers and peers</li>
                </ul>
            `,

        actions: [
            {
                label:
                    "Volunteer with Heads Up",

                href:
                    "#volunteer",

                primary:
                    true
            },
            {
                label:
                    "Ask about mentoring",

                prefill:
                    "Team Mentor Program question"
            }
        ]

    },


    tutoring: {

        eyebrow:
            "Program activity",

        title:
            "Tutoring",

        body:
            `
                <p>
                    Tutoring pairs a volunteer with one or two students for
                    recurring after-school support, either virtually or at an
                    approved program location. No subject-specific expertise is
                    required to encourage strong learning habits.
                </p>

                <h3>
                    Tutoring support includes
                </h3>

                <ul>
                    <li>Focused help with math, reading, language arts, and current assignments</li>
                    <li>Ask what the student already knows before jumping in</li>
                    <li>Break a challenge into smaller, understandable steps</li>
                    <li>Model a different example, then let the student try</li>
                    <li>Encourage effort, questions, and steady progress</li>
                </ul>
            `,

        actions: [
            {
                label:
                    "Ask a tutoring question",

                prefill:
                    "Tutoring question",

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
                    Activity highlights
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
                    Heads Up provides clear explanations of how the
                    program communicates, gathers community feedback,
                    protects privacy, and keeps public information current.
                </p>

                <h3>
                    Program information
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
                    Families and community members may contact Heads Up
                    for approved policies, accessibility support, or
                    additional program information.
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
                    Families can find essential information here
                    quickly and follow the Family Portal pathway for
                    protected schedules and announcements.
                </p>

                <h3>
                    Family resources
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
                    Volunteers contribute to academic support, hands-on
                    activities, relationship-building, and community engagement.
                    Subject-specific expertise is not required.
                </p>

                <h3>
                    Ways volunteers support students
                </h3>

                <ul>
                    <li>
                        Available roles and responsibilities
                    </li>

                    <li>
                        Student-centered and culturally responsive support practices
                    </li>

                    <li>
                        Privacy, media, and safety expectations
                    </li>

                </ul>

                <p>
                    Questions may be sent to
                    <a href="mailto:headsupglafayette@gmail.com">headsupglafayette@gmail.com</a>.
                </p>
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
                    Partnership opportunities
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
                    Program leadership guides daily operations,
                    family communication, student safety, partnerships,
                    and the long-term direction of Heads Up.
                </p>

                <h3>
                    Leadership responsibilities
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


    /*
       2026-08-17 TEAM MODALS:
       The visible team cards now use Program Leadership, Mentors, and
       Homework Helpers & Tutors. Older modal keys remain for compatibility.
    */
    mentors: {

        eyebrow:
            "Mentors",

        title:
            "Relationships, guidance, and encouragement",

        body:
            `
                <p>
                    Mentors listen, encourage curiosity, share experience,
                    and help students feel supported as they learn and grow.
                </p>

                <h3>How mentors support students</h3>

                <ul>
                    <li>Build dependable, respectful relationships</li>
                    <li>Encourage questions, effort, and participation</li>
                    <li>Guide group activities and presentations</li>
                    <li>Share practical experience and new perspectives</li>
                    <li>Follow program privacy, safety, and communication expectations</li>
                </ul>
            `,

        actions: [
            {
                label:
                    "Volunteer With Us",

                href:
                    "#volunteer",

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


    tutors: {

        eyebrow:
            "Homework Helpers & Tutors",

        title:
            "Skill-building and academic confidence",

        body:
            `
                <p>
                    Homework helpers and tutors work alongside students on
                    assignments and academic skills while encouraging confidence,
                    persistence, and increasing independence.
                </p>

                <h3>How tutors support students</h3>

                <ul>
                    <li>Help students understand current assignments</li>
                    <li>Explain ideas with patience and age-appropriate language</li>
                    <li>Practice study, organization, and problem-solving skills</li>
                    <li>Celebrate progress without taking over the student's work</li>
                    <li>Communicate reliably with program leadership</li>
                </ul>
            `,

        actions: [
            {
                label:
                    "Ask about tutoring",

                prefill:
                    "Homework helper or tutoring question",

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
                    The research team gathers and organizes community
                    feedback to support thoughtful program communication,
                    storytelling, accessibility, and website improvement.
                </p>

                <p>
                    Surveys, observations, interviews, thematic
                    analysis, and user-centered design help keep the
                    website grounded in community experiences.
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
                    Mentors and volunteers bring academic interests,
                    practical experience, encouragement, and dependable
                    support to student activities and relationships.
                </p>

                <p>
                    Clear descriptions of mentor and program roles
                    help families understand who supports students and
                    how the community works together.
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


    /*
       2026-08-17 SUBMIT STORY FIX:
       The site uses page-style hash routing, so Contact may be hidden while
       the Stories page is active. Reveal the Contact route before scrolling
       or focusing; this also fixes every other data-prefill-subject action.
    */
    const contactRoute =

        "#contact";


    if (

        window.location.hash === contactRoute

    ) {

        if (

            typeof renderRoute === "function"

        ) {

            renderRoute(

                contactRoute

            );

        }

    } else {

        window.location.hash =

            contactRoute;

    }


    contactSubject.value =

        subject;


    if (

        message

        && contactMessage

    ) {

        contactMessage.value =

            message;

    }


    window.setTimeout(

        () => {

            scrollToElement(

                select("#contact")

            );


            contactName?.focus();

        },

        120

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

            "Heads Up content check: review contact information, dates, images, links, and approved public content."

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
            "Children connect, receive skill support, learn with volunteers and peers, and take part in shared activities at Homework Club."
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
                "Meet the program leadership, mentors, and homework helpers and tutors who support students each week.";
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
            } else if (/mentor|relationship/i.test(heading) && paragraph) {
                paragraph.textContent =
                    "Mentors listen, encourage curiosity, share experience, and help students feel supported as they learn and grow.";
                image?.setAttribute("aria-label", "Heads Up mentor illustration");
            } else if (paragraph) {
                paragraph.textContent =
                    "Homework helpers and tutors work alongside students on assignments and skills while encouraging confidence and independence.";
                image?.setAttribute("aria-label", "Heads Up homework helper and tutor illustration");
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
                    summary: "Support tutoring, activities, community events, and positive student relationships through a clearly guided role that does not require subject-specific expertise.",
                    details: `
                        <p>Volunteers complete the program review, screening, and privacy expectations before beginning.</p>
                        <p>Visit Volunteer With Us to review responsibilities, student-support practices, and the five-step onboarding path.</p>
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

            /* 2026-08-18: Preserve the existing volunteer resource modal and
               student-support guidance while keeping private preparation
               details off the public website for now. */
            resourceLibrary.volunteers = {
                eyebrow: "Volunteers & mentors",
                title: "Support students with clarity and care",
                body: `
                    <p>Volunteers help with tutoring, activities, community events, and encouraging student relationships under program guidance. No subject-specific expertise is required.</p>
                    <h3>Student-centered support</h3>
                    <ul>
                        <li>Get to know the student and ask how they would like help</li>
                        <li>Find out what they already know and how the skill was introduced</li>
                        <li>Break challenges into smaller steps and guide with questions</li>
                        <li>Encourage effort and persistence rather than labeling ability</li>
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
            const isMobilePortalLink =
                link.matches(".mobile-nav__links a");

            link.classList.add("portal-nav-link");

            /*
               The mobile menu keeps a stable numbered navigation row.
               The signed-in email is displayed separately in the approved
               account summary at the top of the drawer.
            */
            link.innerHTML = isMobilePortalLink
                ? `
                    <span class="portal-nav-number">05</span>
                    <svg class="portal-nav-icon" aria-hidden="true">
                        <use href="#icon-lock"></use>
                    </svg>
                    <span class="portal-nav-label">Family Portal</span>
                `
                : `
                    <svg class="portal-nav-icon" aria-hidden="true">
                        <use href="#icon-lock"></use>
                    </svg>
                    <span class="portal-nav-label">Family Portal</span>
                `;
        });
    };

    const updatePortalNav = () => {
        const mobileAccount =
            $("#mobileNavAccount");

        const mobileAccountEmail =
            $("#mobileNavAccountEmail");

        $$(".portal-nav-link").forEach((link) => {
            const label = $(".portal-nav-label", link);
            const use = $(".portal-nav-icon use", link);
            const isMobilePortalLink =
                link.matches(".mobile-nav__links a");

            if (PUBLIC_READY.approved && PUBLIC_READY.email) {
                link.classList.add("is-unlocked");
                link.title = `Signed in as ${PUBLIC_READY.email}`;

                /*
                   Desktop navigation may show the approved email directly.
                   Mobile navigation keeps the concise "My Portal" label
                   because the full email appears in the account card above.
                */
                if (label) {
                    label.textContent = isMobilePortalLink
                        ? "My Portal"
                        : PUBLIC_READY.email;
                }

                use?.setAttribute("href", "#icon-unlock");
            } else {
                link.classList.remove("is-unlocked");
                link.title = "Family Portal";

                if (label) {
                    label.textContent = "Family Portal";
                }

                use?.setAttribute("href", "#icon-lock");
            }
        });

        if (mobileAccount && mobileAccountEmail) {
            if (PUBLIC_READY.approved && PUBLIC_READY.email) {
                mobileAccountEmail.textContent =
                    PUBLIC_READY.email;

                mobileAccount.hidden =
                    false;
            } else {
                mobileAccountEmail.textContent =
                    "Signed in";

                mobileAccount.hidden =
                    true;
            }
        }
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

/*
=====================================================================
LINE BY LINE MAINTENANCE INDEX
=====================================================================
This index documents every nonblank code line above without inserting
comments into strings, selectors, or multi-line expressions that would
change behavior. Line numbers refer to this file before this index begins.

L00001: continues JavaScript documentation for maintainers.
L00002: continues a statement, function call, data value, or rendered content.
L00003: continues a statement, function call, data value, or rendered content.
L00004: continues a statement, function call, data value, or rendered content.
L00005: continues a statement, function call, data value, or rendered content.
L00007: continues a statement, function call, data value, or rendered content.
L00008: continues a statement, function call, data value, or rendered content.
L00009: continues a statement, function call, data value, or rendered content.
L00011: continues a statement, function call, data value, or rendered content.
L00012: continues a statement, function call, data value, or rendered content.
L00013: continues a statement, function call, data value, or rendered content.
L00014: continues JavaScript documentation for maintainers.
L00016: continues JavaScript documentation for maintainers.
L00017: continues a statement, function call, data value, or rendered content.
L00018: continues a statement, function call, data value, or rendered content.
L00020: continues a statement, function call, data value, or rendered content.
L00021: continues a statement, function call, data value, or rendered content.
L00022: continues a statement, function call, data value, or rendered content.
L00023: continues a statement, function call, data value, or rendered content.
L00024: continues a statement, function call, data value, or rendered content.
L00025: continues a statement, function call, data value, or rendered content.
L00027: continues a statement, function call, data value, or rendered content.
L00028: continues a statement, function call, data value, or rendered content.
L00029: continues a statement, function call, data value, or rendered content.
L00030: continues a statement, function call, data value, or rendered content.
L00031: continues a statement, function call, data value, or rendered content.
L00032: continues a statement, function call, data value, or rendered content.
L00033: continues a statement, function call, data value, or rendered content.
L00034: continues a statement, function call, data value, or rendered content.
L00035: continues a statement, function call, data value, or rendered content.
L00036: continues a statement, function call, data value, or rendered content.
L00037: continues a statement, function call, data value, or rendered content.
L00039: continues a statement, function call, data value, or rendered content.
L00040: continues a statement, function call, data value, or rendered content.
L00041: continues a statement, function call, data value, or rendered content.
L00042: continues a statement, function call, data value, or rendered content.
L00043: continues a statement, function call, data value, or rendered content.
L00045: continues a statement, function call, data value, or rendered content.
L00046: continues a statement, function call, data value, or rendered content.
L00047: continues a statement, function call, data value, or rendered content.
L00048: continues a statement, function call, data value, or rendered content.
L00049: continues a statement, function call, data value, or rendered content.
L00050: continues a statement, function call, data value, or rendered content.
L00051: continues a statement, function call, data value, or rendered content.
L00053: continues a statement, function call, data value, or rendered content.
L00054: continues a statement, function call, data value, or rendered content.
L00055: continues a statement, function call, data value, or rendered content.
L00056: continues a statement, function call, data value, or rendered content.
L00057: continues a statement, function call, data value, or rendered content.
L00058: continues a statement, function call, data value, or rendered content.
L00059: continues a statement, function call, data value, or rendered content.
L00060: continues a statement, function call, data value, or rendered content.
L00061: continues a statement, function call, data value, or rendered content.
L00063: continues a statement, function call, data value, or rendered content.
L00064: continues a statement, function call, data value, or rendered content.
L00065: continues a statement, function call, data value, or rendered content.
L00066: continues a statement, function call, data value, or rendered content.
L00067: continues a statement, function call, data value, or rendered content.
L00068: continues a statement, function call, data value, or rendered content.
L00069: continues a statement, function call, data value, or rendered content.
L00070: continues a statement, function call, data value, or rendered content.
L00071: continues a statement, function call, data value, or rendered content.
L00072: continues JavaScript documentation for maintainers.
L00073: continues JavaScript documentation for maintainers.
L00074: continues a statement, function call, data value, or rendered content.
L00075: continues a statement, function call, data value, or rendered content.
L00077: continues a statement, function call, data value, or rendered content.
L00078: continues a statement, function call, data value, or rendered content.
L00079: continues a statement, function call, data value, or rendered content.
L00081: continues a statement, function call, data value, or rendered content.
L00082: continues a statement, function call, data value, or rendered content.
L00083: continues a statement, function call, data value, or rendered content.
L00084: continues a statement, function call, data value, or rendered content.
L00085: continues a statement, function call, data value, or rendered content.
L00086: continues a statement, function call, data value, or rendered content.
L00087: continues a statement, function call, data value, or rendered content.
L00088: continues a statement, function call, data value, or rendered content.
L00089: continues a statement, function call, data value, or rendered content.
L00090: continues a statement, function call, data value, or rendered content.
L00091: continues a statement, function call, data value, or rendered content.
L00092: continues a statement, function call, data value, or rendered content.
L00093: continues a statement, function call, data value, or rendered content.
L00094: continues a statement, function call, data value, or rendered content.
L00095: continues a statement, function call, data value, or rendered content.
L00096: continues a statement, function call, data value, or rendered content.
L00097: continues a statement, function call, data value, or rendered content.
L00098: continues a statement, function call, data value, or rendered content.
L00100: continues a statement, function call, data value, or rendered content.
L00101: continues a statement, function call, data value, or rendered content.
L00102: continues a statement, function call, data value, or rendered content.
L00103: continues a statement, function call, data value, or rendered content.
L00105: continues a statement, function call, data value, or rendered content.
L00106: continues a statement, function call, data value, or rendered content.
L00108: continues a statement, function call, data value, or rendered content.
L00109: continues a statement, function call, data value, or rendered content.
L00110: continues a statement, function call, data value, or rendered content.
L00111: continues a statement, function call, data value, or rendered content.
L00112: continues a statement, function call, data value, or rendered content.
L00113: continues a statement, function call, data value, or rendered content.
L00115: continues a statement, function call, data value, or rendered content.
L00116: continues a statement, function call, data value, or rendered content.
L00117: continues a statement, function call, data value, or rendered content.
L00119: continues a statement, function call, data value, or rendered content.
L00120: continues a statement, function call, data value, or rendered content.
L00121: continues a statement, function call, data value, or rendered content.
L00122: continues a statement, function call, data value, or rendered content.
L00123: continues JavaScript documentation for maintainers.
L00125: enables strict JavaScript execution rules.
L00128: continues JavaScript documentation for maintainers.
L00129: continues a statement, function call, data value, or rendered content.
L00131: continues a statement, function call, data value, or rendered content.
L00132: continues a statement, function call, data value, or rendered content.
L00134: continues a statement, function call, data value, or rendered content.
L00135: continues a statement, function call, data value, or rendered content.
L00136: continues JavaScript documentation for maintainers.
L00138: declares the HEADS_UP_CONFIG JavaScript value.
L00140: defines the contactEmail property in the current object.
L00141: continues a statement, function call, data value, or rendered content.
L00143: defines the supabaseUrl property in the current object.
L00144: continues a statement, function call, data value, or rendered content.
L00146: defines the supabasePublishableKey property in the current object.
L00147: continues a statement, function call, data value, or rendered content.
L00149: defines the contactFunctionName property in the current object.
L00150: continues a statement, function call, data value, or rendered content.
L00152: continues JavaScript documentation for maintainers.
L00153: continues a statement, function call, data value, or rendered content.
L00154: continues a statement, function call, data value, or rendered content.
L00155: continues a statement, function call, data value, or rendered content.
L00156: continues JavaScript documentation for maintainers.
L00157: defines the accessReviewFunctionName property in the current object.
L00158: continues a statement, function call, data value, or rendered content.
L00160: continues JavaScript documentation for maintainers.
L00161: continues a statement, function call, data value, or rendered content.
L00162: continues a statement, function call, data value, or rendered content.
L00163: continues a statement, function call, data value, or rendered content.
L00164: continues JavaScript documentation for maintainers.
L00165: defines the contactFallbackRpcName property in the current object.
L00166: continues a statement, function call, data value, or rendered content.
L00168: continues JavaScript documentation for maintainers.
L00169: defines the contactFunctionTimeoutMs property in the current object.
L00170: continues a statement, function call, data value, or rendered content.
L00172: continues JavaScript documentation for maintainers.
L00173: continues a statement, function call, data value, or rendered content.
L00174: defines the Example property in the current object.
L00175: continues a statement, function call, data value, or rendered content.
L00176: continues JavaScript documentation for maintainers.
L00177: defines the authRedirectUrl property in the current object.
L00178: continues a statement, function call, data value, or rendered content.
L00180: continues JavaScript documentation for maintainers.
L00181: defines the publicGoogleCalendarEmbedUrl property in the current object.
L00182: continues a statement, function call, data value, or rendered content.
L00184: continues a statement, function call, data value, or rendered content.
L00187: declares the isSupabaseConfigurationReady JavaScript value.
L00189: returns a value or exits the current function.
L00191: continues a statement, function call, data value, or rendered content.
L00193: continues a statement, function call, data value, or rendered content.
L00195: continues a statement, function call, data value, or rendered content.
L00197: continues a statement, function call, data value, or rendered content.
L00199: opens or closes the current JavaScript structure.
L00201: continues a statement, function call, data value, or rendered content.
L00203: continues a statement, function call, data value, or rendered content.
L00205: opens or closes the current JavaScript structure.
L00207: opens or closes the current JavaScript structure.
L00209: opens or closes the current JavaScript structure.
L00212: declares the headsUpSupabase JavaScript value.
L00214: continues a statement, function call, data value, or rendered content.
L00217: starts a conditional branch.
L00219: continues a statement, function call, data value, or rendered content.
L00221: continues a statement, function call, data value, or rendered content.
L00223: continues a statement, function call, data value, or rendered content.
L00225: continues a statement, function call, data value, or rendered content.
L00227: interacts with the browser document or window.
L00229: continues a statement, function call, data value, or rendered content.
L00231: continues a statement, function call, data value, or rendered content.
L00233: opens or closes the current JavaScript structure.
L00235: defines the auth property in the current object.
L00237: defines the persistSession property in the current object.
L00238: continues a statement, function call, data value, or rendered content.
L00240: defines the autoRefreshToken property in the current object.
L00241: continues a statement, function call, data value, or rendered content.
L00243: defines the detectSessionInUrl property in the current object.
L00244: continues a statement, function call, data value, or rendered content.
L00246: defines the flowType property in the current object.
L00247: continues a statement, function call, data value, or rendered content.
L00249: opens or closes the current JavaScript structure.
L00251: opens or closes the current JavaScript structure.
L00253: opens or closes the current JavaScript structure.
L00255: opens or closes the current JavaScript structure.
L00259: continues JavaScript documentation for maintainers.
L00260: continues a statement, function call, data value, or rendered content.
L00262: continues a statement, function call, data value, or rendered content.
L00263: continues JavaScript documentation for maintainers.
L00265: declares the weeklyUpdates JavaScript value.
L00267: opens or closes the current JavaScript structure.
L00269: defines the id property in the current object.
L00270: continues a statement, function call, data value, or rendered content.
L00272: defines the featured property in the current object.
L00273: continues a statement, function call, data value, or rendered content.
L00275: defines the category property in the current object.
L00276: continues a statement, function call, data value, or rendered content.
L00278: defines the title property in the current object.
L00279: continues a statement, function call, data value, or rendered content.
L00281: defines the dateLabel property in the current object.
L00282: continues a statement, function call, data value, or rendered content.
L00284: defines the audience property in the current object.
L00285: continues a statement, function call, data value, or rendered content.
L00287: defines the summary property in the current object.
L00288: continues a statement, function call, data value, or rendered content.
L00290: defines the details property in the current object.
L00291: continues a template string used to render interface content.
L00292: continues a template string used to render interface content.
L00293: continues a statement, function call, data value, or rendered content.
L00294: continues a statement, function call, data value, or rendered content.
L00295: continues a statement, function call, data value, or rendered content.
L00296: continues a statement, function call, data value, or rendered content.
L00297: continues a statement, function call, data value, or rendered content.
L00298: continues a template string used to render interface content.
L00300: continues a template string used to render interface content.
L00301: continues a statement, function call, data value, or rendered content.
L00302: continues a template string used to render interface content.
L00304: continues a template string used to render interface content.
L00305: continues a template string used to render interface content.
L00306: continues a statement, function call, data value, or rendered content.
L00307: continues a template string used to render interface content.
L00309: continues a template string used to render interface content.
L00310: continues a statement, function call, data value, or rendered content.
L00311: continues a template string used to render interface content.
L00313: continues a template string used to render interface content.
L00314: continues a statement, function call, data value, or rendered content.
L00315: continues a template string used to render interface content.
L00317: continues a template string used to render interface content.
L00318: continues a statement, function call, data value, or rendered content.
L00319: continues a template string used to render interface content.
L00321: continues a template string used to render interface content.
L00322: continues a statement, function call, data value, or rendered content.
L00323: continues a template string used to render interface content.
L00324: continues a template string used to render interface content.
L00326: continues a template string used to render interface content.
L00327: continues a statement, function call, data value, or rendered content.
L00328: continues a statement, function call, data value, or rendered content.
L00329: continues a statement, function call, data value, or rendered content.
L00330: continues a template string used to render interface content.
L00331: continues a template string used to render interface content.
L00333: continues a statement, function call, data value, or rendered content.
L00336: opens or closes the current JavaScript structure.
L00338: defines the id property in the current object.
L00339: continues a statement, function call, data value, or rendered content.
L00341: defines the featured property in the current object.
L00342: continues a statement, function call, data value, or rendered content.
L00344: defines the category property in the current object.
L00345: continues a statement, function call, data value, or rendered content.
L00347: defines the title property in the current object.
L00348: continues a statement, function call, data value, or rendered content.
L00350: defines the dateLabel property in the current object.
L00351: continues a statement, function call, data value, or rendered content.
L00353: defines the audience property in the current object.
L00354: continues a statement, function call, data value, or rendered content.
L00356: defines the summary property in the current object.
L00357: continues a statement, function call, data value, or rendered content.
L00359: defines the details property in the current object.
L00360: continues a template string used to render interface content.
L00361: continues a template string used to render interface content.
L00362: continues a statement, function call, data value, or rendered content.
L00363: continues a statement, function call, data value, or rendered content.
L00364: continues a statement, function call, data value, or rendered content.
L00365: continues a template string used to render interface content.
L00367: continues a template string used to render interface content.
L00368: continues a statement, function call, data value, or rendered content.
L00369: continues a statement, function call, data value, or rendered content.
L00370: continues a template string used to render interface content.
L00371: continues a template string used to render interface content.
L00373: continues a statement, function call, data value, or rendered content.
L00376: opens or closes the current JavaScript structure.
L00378: defines the id property in the current object.
L00379: continues a statement, function call, data value, or rendered content.
L00381: defines the featured property in the current object.
L00382: continues a statement, function call, data value, or rendered content.
L00384: defines the category property in the current object.
L00385: continues a statement, function call, data value, or rendered content.
L00387: defines the title property in the current object.
L00388: continues a statement, function call, data value, or rendered content.
L00390: defines the dateLabel property in the current object.
L00391: continues a statement, function call, data value, or rendered content.
L00393: defines the audience property in the current object.
L00394: continues a statement, function call, data value, or rendered content.
L00396: defines the summary property in the current object.
L00397: continues a statement, function call, data value, or rendered content.
L00399: defines the details property in the current object.
L00400: continues a template string used to render interface content.
L00401: continues a template string used to render interface content.
L00402: continues a statement, function call, data value, or rendered content.
L00403: continues a statement, function call, data value, or rendered content.
L00404: continues a statement, function call, data value, or rendered content.
L00405: continues a template string used to render interface content.
L00407: continues a template string used to render interface content.
L00408: continues a statement, function call, data value, or rendered content.
L00409: continues a template string used to render interface content.
L00411: continues a template string used to render interface content.
L00412: continues a template string used to render interface content.
L00413: continues a statement, function call, data value, or rendered content.
L00414: continues a template string used to render interface content.
L00416: continues a template string used to render interface content.
L00417: continues a statement, function call, data value, or rendered content.
L00418: continues a template string used to render interface content.
L00420: continues a template string used to render interface content.
L00421: continues a statement, function call, data value, or rendered content.
L00422: continues a template string used to render interface content.
L00424: continues a template string used to render interface content.
L00425: continues a statement, function call, data value, or rendered content.
L00426: continues a template string used to render interface content.
L00427: continues a template string used to render interface content.
L00428: continues a template string used to render interface content.
L00430: continues a statement, function call, data value, or rendered content.
L00433: opens or closes the current JavaScript structure.
L00435: defines the id property in the current object.
L00436: continues a statement, function call, data value, or rendered content.
L00438: defines the featured property in the current object.
L00439: continues a statement, function call, data value, or rendered content.
L00441: defines the category property in the current object.
L00442: continues a statement, function call, data value, or rendered content.
L00444: defines the title property in the current object.
L00445: continues a statement, function call, data value, or rendered content.
L00447: defines the dateLabel property in the current object.
L00448: continues a statement, function call, data value, or rendered content.
L00450: defines the audience property in the current object.
L00451: continues a statement, function call, data value, or rendered content.
L00453: defines the summary property in the current object.
L00454: continues a statement, function call, data value, or rendered content.
L00456: defines the details property in the current object.
L00457: continues a template string used to render interface content.
L00458: continues a template string used to render interface content.
L00459: continues a statement, function call, data value, or rendered content.
L00460: continues a statement, function call, data value, or rendered content.
L00461: continues a statement, function call, data value, or rendered content.
L00462: continues a template string used to render interface content.
L00464: continues a template string used to render interface content.
L00465: continues a statement, function call, data value, or rendered content.
L00466: continues a statement, function call, data value, or rendered content.
L00467: continues a template string used to render interface content.
L00468: continues a template string used to render interface content.
L00470: continues a statement, function call, data value, or rendered content.
L00473: opens or closes the current JavaScript structure.
L00475: defines the id property in the current object.
L00476: continues a statement, function call, data value, or rendered content.
L00478: defines the featured property in the current object.
L00479: continues a statement, function call, data value, or rendered content.
L00481: defines the category property in the current object.
L00482: continues a statement, function call, data value, or rendered content.
L00484: defines the title property in the current object.
L00485: continues a statement, function call, data value, or rendered content.
L00487: defines the dateLabel property in the current object.
L00488: continues a statement, function call, data value, or rendered content.
L00490: defines the audience property in the current object.
L00491: continues a statement, function call, data value, or rendered content.
L00493: defines the summary property in the current object.
L00494: continues a statement, function call, data value, or rendered content.
L00496: defines the details property in the current object.
L00497: continues a template string used to render interface content.
L00498: continues a template string used to render interface content.
L00499: continues a statement, function call, data value, or rendered content.
L00500: continues a statement, function call, data value, or rendered content.
L00501: continues a statement, function call, data value, or rendered content.
L00502: continues a statement, function call, data value, or rendered content.
L00503: continues a template string used to render interface content.
L00505: continues a template string used to render interface content.
L00506: continues a statement, function call, data value, or rendered content.
L00507: continues a statement, function call, data value, or rendered content.
L00508: continues a template string used to render interface content.
L00509: continues a template string used to render interface content.
L00511: continues a statement, function call, data value, or rendered content.
L00514: opens or closes the current JavaScript structure.
L00516: defines the id property in the current object.
L00517: continues a statement, function call, data value, or rendered content.
L00519: defines the featured property in the current object.
L00520: continues a statement, function call, data value, or rendered content.
L00522: defines the category property in the current object.
L00523: continues a statement, function call, data value, or rendered content.
L00525: defines the title property in the current object.
L00526: continues a statement, function call, data value, or rendered content.
L00528: defines the dateLabel property in the current object.
L00529: continues a statement, function call, data value, or rendered content.
L00531: defines the audience property in the current object.
L00532: continues a statement, function call, data value, or rendered content.
L00534: defines the summary property in the current object.
L00535: continues a statement, function call, data value, or rendered content.
L00537: defines the details property in the current object.
L00538: continues a template string used to render interface content.
L00539: continues a template string used to render interface content.
L00540: continues a statement, function call, data value, or rendered content.
L00541: continues a statement, function call, data value, or rendered content.
L00542: continues a statement, function call, data value, or rendered content.
L00543: continues a template string used to render interface content.
L00545: continues a template string used to render interface content.
L00546: continues a statement, function call, data value, or rendered content.
L00547: continues a statement, function call, data value, or rendered content.
L00548: continues a template string used to render interface content.
L00549: continues a template string used to render interface content.
L00551: opens or closes the current JavaScript structure.
L00553: opens or closes the current JavaScript structure.
L00556: continues JavaScript documentation for maintainers.
L00557: continues a statement, function call, data value, or rendered content.
L00558: continues JavaScript documentation for maintainers.
L00560: declares the weeklySchedule JavaScript value.
L00562: opens or closes the current JavaScript structure.
L00564: defines the day property in the current object.
L00565: continues a statement, function call, data value, or rendered content.
L00567: defines the time property in the current object.
L00568: continues a statement, function call, data value, or rendered content.
L00570: defines the activity property in the current object.
L00571: continues a statement, function call, data value, or rendered content.
L00573: defines the description property in the current object.
L00574: continues a statement, function call, data value, or rendered content.
L00576: defines the audience property in the current object.
L00577: continues a statement, function call, data value, or rendered content.
L00579: defines the privateDetails property in the current object.
L00580: continues a statement, function call, data value, or rendered content.
L00582: continues a statement, function call, data value, or rendered content.
L00585: opens or closes the current JavaScript structure.
L00587: defines the day property in the current object.
L00588: continues a statement, function call, data value, or rendered content.
L00590: defines the time property in the current object.
L00591: continues a statement, function call, data value, or rendered content.
L00593: defines the activity property in the current object.
L00594: continues a statement, function call, data value, or rendered content.
L00596: defines the description property in the current object.
L00597: continues a statement, function call, data value, or rendered content.
L00599: defines the audience property in the current object.
L00600: continues a statement, function call, data value, or rendered content.
L00602: defines the privateDetails property in the current object.
L00603: continues a statement, function call, data value, or rendered content.
L00605: continues a statement, function call, data value, or rendered content.
L00608: opens or closes the current JavaScript structure.
L00610: defines the day property in the current object.
L00611: continues a statement, function call, data value, or rendered content.
L00613: defines the time property in the current object.
L00614: continues a statement, function call, data value, or rendered content.
L00616: defines the activity property in the current object.
L00617: continues a statement, function call, data value, or rendered content.
L00619: defines the description property in the current object.
L00620: continues a statement, function call, data value, or rendered content.
L00622: defines the audience property in the current object.
L00623: continues a statement, function call, data value, or rendered content.
L00625: defines the privateDetails property in the current object.
L00626: continues a statement, function call, data value, or rendered content.
L00628: continues a statement, function call, data value, or rendered content.
L00631: opens or closes the current JavaScript structure.
L00633: defines the day property in the current object.
L00634: continues a statement, function call, data value, or rendered content.
L00636: defines the time property in the current object.
L00637: continues a statement, function call, data value, or rendered content.
L00639: defines the activity property in the current object.
L00640: continues a statement, function call, data value, or rendered content.
L00642: defines the description property in the current object.
L00643: continues a statement, function call, data value, or rendered content.
L00645: defines the audience property in the current object.
L00646: continues a statement, function call, data value, or rendered content.
L00648: defines the privateDetails property in the current object.
L00649: continues a statement, function call, data value, or rendered content.
L00651: continues a statement, function call, data value, or rendered content.
L00654: opens or closes the current JavaScript structure.
L00656: defines the day property in the current object.
L00657: continues a statement, function call, data value, or rendered content.
L00659: defines the time property in the current object.
L00660: continues a statement, function call, data value, or rendered content.
L00662: defines the activity property in the current object.
L00663: continues a statement, function call, data value, or rendered content.
L00665: defines the description property in the current object.
L00666: continues a statement, function call, data value, or rendered content.
L00668: defines the audience property in the current object.
L00669: continues a statement, function call, data value, or rendered content.
L00671: defines the privateDetails property in the current object.
L00672: continues a statement, function call, data value, or rendered content.
L00674: opens or closes the current JavaScript structure.
L00676: opens or closes the current JavaScript structure.
L00679: continues JavaScript documentation for maintainers.
L00680: continues a statement, function call, data value, or rendered content.
L00682: continues a statement, function call, data value, or rendered content.
L00683: continues a statement, function call, data value, or rendered content.
L00685: continues a statement, function call, data value, or rendered content.
L00686: defines the HH property in the current object.
L00688: continues a statement, function call, data value, or rendered content.
L00689: continues a statement, function call, data value, or rendered content.
L00690: continues a statement, function call, data value, or rendered content.
L00691: continues a statement, function call, data value, or rendered content.
L00692: continues a statement, function call, data value, or rendered content.
L00693: continues JavaScript documentation for maintainers.
L00695: declares the upcomingEvents JavaScript value.
L00697: opens or closes the current JavaScript structure.
L00699: defines the id property in the current object.
L00700: continues a statement, function call, data value, or rendered content.
L00702: defines the title property in the current object.
L00703: continues a statement, function call, data value, or rendered content.
L00705: defines the date property in the current object.
L00706: continues a statement, function call, data value, or rendered content.
L00708: defines the startTime property in the current object.
L00709: continues a statement, function call, data value, or rendered content.
L00711: defines the endTime property in the current object.
L00712: continues a statement, function call, data value, or rendered content.
L00714: defines the location property in the current object.
L00715: continues a statement, function call, data value, or rendered content.
L00717: defines the audience property in the current object.
L00718: continues a statement, function call, data value, or rendered content.
L00720: defines the audienceLabel property in the current object.
L00721: continues a statement, function call, data value, or rendered content.
L00723: defines the privateDetails property in the current object.
L00724: continues a statement, function call, data value, or rendered content.
L00726: defines the publicDateLabel property in the current object.
L00727: continues a statement, function call, data value, or rendered content.
L00729: defines the publicTimeLabel property in the current object.
L00730: continues a statement, function call, data value, or rendered content.
L00732: defines the publicLocationLabel property in the current object.
L00733: continues a statement, function call, data value, or rendered content.
L00735: defines the summary property in the current object.
L00736: continues a statement, function call, data value, or rendered content.
L00738: defines the details property in the current object.
L00739: continues a template string used to render interface content.
L00740: continues a template string used to render interface content.
L00741: continues a statement, function call, data value, or rendered content.
L00742: continues a statement, function call, data value, or rendered content.
L00743: continues a statement, function call, data value, or rendered content.
L00744: continues a template string used to render interface content.
L00746: continues a template string used to render interface content.
L00747: continues a statement, function call, data value, or rendered content.
L00748: continues a template string used to render interface content.
L00750: continues a template string used to render interface content.
L00751: continues a template string used to render interface content.
L00752: continues a statement, function call, data value, or rendered content.
L00753: continues a template string used to render interface content.
L00755: continues a template string used to render interface content.
L00756: continues a statement, function call, data value, or rendered content.
L00757: continues a template string used to render interface content.
L00759: continues a template string used to render interface content.
L00760: continues a statement, function call, data value, or rendered content.
L00761: continues a template string used to render interface content.
L00762: continues a template string used to render interface content.
L00764: continues a template string used to render interface content.
L00765: continues a statement, function call, data value, or rendered content.
L00766: continues a statement, function call, data value, or rendered content.
L00767: continues a template string used to render interface content.
L00768: continues a template string used to render interface content.
L00770: continues a statement, function call, data value, or rendered content.
L00773: opens or closes the current JavaScript structure.
L00775: defines the id property in the current object.
L00776: continues a statement, function call, data value, or rendered content.
L00778: defines the title property in the current object.
L00779: continues a statement, function call, data value, or rendered content.
L00781: defines the date property in the current object.
L00782: continues a statement, function call, data value, or rendered content.
L00784: defines the startTime property in the current object.
L00785: continues a statement, function call, data value, or rendered content.
L00787: defines the endTime property in the current object.
L00788: continues a statement, function call, data value, or rendered content.
L00790: defines the location property in the current object.
L00791: continues a statement, function call, data value, or rendered content.
L00793: defines the audience property in the current object.
L00794: continues a statement, function call, data value, or rendered content.
L00796: defines the audienceLabel property in the current object.
L00797: continues a statement, function call, data value, or rendered content.
L00799: defines the privateDetails property in the current object.
L00800: continues a statement, function call, data value, or rendered content.
L00802: defines the publicDateLabel property in the current object.
L00803: continues a statement, function call, data value, or rendered content.
L00805: defines the publicTimeLabel property in the current object.
L00806: continues a statement, function call, data value, or rendered content.
L00808: defines the publicLocationLabel property in the current object.
L00809: continues a statement, function call, data value, or rendered content.
L00811: defines the summary property in the current object.
L00812: continues a statement, function call, data value, or rendered content.
L00814: defines the details property in the current object.
L00815: continues a template string used to render interface content.
L00816: continues a template string used to render interface content.
L00817: continues a statement, function call, data value, or rendered content.
L00818: continues a statement, function call, data value, or rendered content.
L00819: continues a statement, function call, data value, or rendered content.
L00820: continues a template string used to render interface content.
L00822: continues a template string used to render interface content.
L00823: continues a statement, function call, data value, or rendered content.
L00824: continues a statement, function call, data value, or rendered content.
L00825: continues a statement, function call, data value, or rendered content.
L00826: continues a template string used to render interface content.
L00827: continues a template string used to render interface content.
L00829: continues a statement, function call, data value, or rendered content.
L00832: opens or closes the current JavaScript structure.
L00834: defines the id property in the current object.
L00835: continues a statement, function call, data value, or rendered content.
L00837: defines the title property in the current object.
L00838: continues a statement, function call, data value, or rendered content.
L00840: defines the date property in the current object.
L00841: continues a statement, function call, data value, or rendered content.
L00843: defines the startTime property in the current object.
L00844: continues a statement, function call, data value, or rendered content.
L00846: defines the endTime property in the current object.
L00847: continues a statement, function call, data value, or rendered content.
L00849: defines the location property in the current object.
L00850: continues a statement, function call, data value, or rendered content.
L00852: defines the audience property in the current object.
L00853: continues a statement, function call, data value, or rendered content.
L00855: defines the audienceLabel property in the current object.
L00856: continues a statement, function call, data value, or rendered content.
L00858: defines the privateDetails property in the current object.
L00859: continues a statement, function call, data value, or rendered content.
L00861: defines the publicDateLabel property in the current object.
L00862: continues a statement, function call, data value, or rendered content.
L00864: defines the publicTimeLabel property in the current object.
L00865: continues a statement, function call, data value, or rendered content.
L00867: defines the publicLocationLabel property in the current object.
L00868: continues a statement, function call, data value, or rendered content.
L00870: defines the summary property in the current object.
L00871: continues a statement, function call, data value, or rendered content.
L00873: defines the details property in the current object.
L00874: continues a template string used to render interface content.
L00875: continues a template string used to render interface content.
L00876: continues a statement, function call, data value, or rendered content.
L00877: continues a statement, function call, data value, or rendered content.
L00878: continues a statement, function call, data value, or rendered content.
L00879: continues a statement, function call, data value, or rendered content.
L00880: continues a template string used to render interface content.
L00882: continues a template string used to render interface content.
L00883: continues a statement, function call, data value, or rendered content.
L00884: continues a template string used to render interface content.
L00886: continues a template string used to render interface content.
L00887: continues a template string used to render interface content.
L00888: continues a statement, function call, data value, or rendered content.
L00889: continues a template string used to render interface content.
L00891: continues a template string used to render interface content.
L00892: continues a statement, function call, data value, or rendered content.
L00893: continues a template string used to render interface content.
L00895: continues a template string used to render interface content.
L00896: continues a statement, function call, data value, or rendered content.
L00897: continues a template string used to render interface content.
L00899: continues a template string used to render interface content.
L00900: continues a statement, function call, data value, or rendered content.
L00901: continues a template string used to render interface content.
L00902: continues a template string used to render interface content.
L00903: continues a template string used to render interface content.
L00905: continues a statement, function call, data value, or rendered content.
L00908: opens or closes the current JavaScript structure.
L00910: defines the id property in the current object.
L00911: continues a statement, function call, data value, or rendered content.
L00913: defines the title property in the current object.
L00914: continues a statement, function call, data value, or rendered content.
L00916: defines the date property in the current object.
L00917: continues a statement, function call, data value, or rendered content.
L00919: defines the startTime property in the current object.
L00920: continues a statement, function call, data value, or rendered content.
L00922: defines the endTime property in the current object.
L00923: continues a statement, function call, data value, or rendered content.
L00925: defines the location property in the current object.
L00926: continues a statement, function call, data value, or rendered content.
L00928: defines the audience property in the current object.
L00929: continues a statement, function call, data value, or rendered content.
L00931: defines the audienceLabel property in the current object.
L00932: continues a statement, function call, data value, or rendered content.
L00934: defines the privateDetails property in the current object.
L00935: continues a statement, function call, data value, or rendered content.
L00937: defines the publicDateLabel property in the current object.
L00938: continues a statement, function call, data value, or rendered content.
L00940: defines the publicTimeLabel property in the current object.
L00941: continues a statement, function call, data value, or rendered content.
L00943: defines the publicLocationLabel property in the current object.
L00944: continues a statement, function call, data value, or rendered content.
L00946: defines the summary property in the current object.
L00947: continues a statement, function call, data value, or rendered content.
L00949: defines the details property in the current object.
L00950: continues a template string used to render interface content.
L00951: continues a template string used to render interface content.
L00952: continues a statement, function call, data value, or rendered content.
L00953: continues a statement, function call, data value, or rendered content.
L00954: continues a template string used to render interface content.
L00956: continues a template string used to render interface content.
L00957: continues a statement, function call, data value, or rendered content.
L00958: continues a statement, function call, data value, or rendered content.
L00959: continues a statement, function call, data value, or rendered content.
L00960: continues a template string used to render interface content.
L00961: continues a template string used to render interface content.
L00963: opens or closes the current JavaScript structure.
L00965: opens or closes the current JavaScript structure.
L00968: continues JavaScript documentation for maintainers.
L00969: continues a statement, function call, data value, or rendered content.
L00970: continues JavaScript documentation for maintainers.
L00972: declares the announcementMessages JavaScript value.
L00974: continues a statement, function call, data value, or rendered content.
L00976: continues a statement, function call, data value, or rendered content.
L00978: continues a statement, function call, data value, or rendered content.
L00980: continues a statement, function call, data value, or rendered content.
L00982: opens or closes the current JavaScript structure.
L00985: continues JavaScript documentation for maintainers.
L00986: continues a statement, function call, data value, or rendered content.
L00987: continues JavaScript documentation for maintainers.
L00989: declares the heroWords JavaScript value.
L00991: continues a statement, function call, data value, or rendered content.
L00993: continues a statement, function call, data value, or rendered content.
L00995: continues a statement, function call, data value, or rendered content.
L00997: continues a statement, function call, data value, or rendered content.
L00999: continues a statement, function call, data value, or rendered content.
L01001: opens or closes the current JavaScript structure.
L01004: continues JavaScript documentation for maintainers.
L01005: continues a statement, function call, data value, or rendered content.
L01006: continues JavaScript documentation for maintainers.
L01008: declares the contentLibrary JavaScript value.
L01010: defines the about property in the current object.
L01012: defines the eyebrow property in the current object.
L01013: continues a statement, function call, data value, or rendered content.
L01015: defines the title property in the current object.
L01016: continues a statement, function call, data value, or rendered content.
L01018: defines the body property in the current object.
L01019: continues a template string used to render interface content.
L01020: continues a template string used to render interface content.
L01021: continues a statement, function call, data value, or rendered content.
L01022: continues a statement, function call, data value, or rendered content.
L01023: continues a statement, function call, data value, or rendered content.
L01024: continues a statement, function call, data value, or rendered content.
L01025: continues a statement, function call, data value, or rendered content.
L01026: continues a template string used to render interface content.
L01028: continues a template string used to render interface content.
L01029: continues a statement, function call, data value, or rendered content.
L01030: continues a template string used to render interface content.
L01032: continues a template string used to render interface content.
L01033: continues a template string used to render interface content.
L01034: continues a statement, function call, data value, or rendered content.
L01035: continues a template string used to render interface content.
L01037: continues a template string used to render interface content.
L01038: continues a statement, function call, data value, or rendered content.
L01039: continues a template string used to render interface content.
L01041: continues a template string used to render interface content.
L01042: continues a statement, function call, data value, or rendered content.
L01043: continues a template string used to render interface content.
L01045: continues a template string used to render interface content.
L01046: continues a statement, function call, data value, or rendered content.
L01047: continues a template string used to render interface content.
L01049: continues a template string used to render interface content.
L01050: continues a statement, function call, data value, or rendered content.
L01051: continues a template string used to render interface content.
L01052: continues a template string used to render interface content.
L01054: continues a template string used to render interface content.
L01055: continues a statement, function call, data value, or rendered content.
L01056: continues a template string used to render interface content.
L01058: continues a template string used to render interface content.
L01059: continues a statement, function call, data value, or rendered content.
L01060: continues a statement, function call, data value, or rendered content.
L01061: continues a statement, function call, data value, or rendered content.
L01062: continues a template string used to render interface content.
L01063: continues a template string used to render interface content.
L01065: defines the actions property in the current object.
L01067: opens or closes the current JavaScript structure.
L01069: defines the label property in the current object.
L01070: continues a statement, function call, data value, or rendered content.
L01072: defines the href property in the current object.
L01073: continues a statement, function call, data value, or rendered content.
L01075: defines the primary property in the current object.
L01076: continues a statement, function call, data value, or rendered content.
L01078: continues a statement, function call, data value, or rendered content.
L01080: opens or closes the current JavaScript structure.
L01082: defines the label property in the current object.
L01083: continues a statement, function call, data value, or rendered content.
L01085: defines the href property in the current object.
L01086: continues a statement, function call, data value, or rendered content.
L01088: opens or closes the current JavaScript structure.
L01090: opens or closes the current JavaScript structure.
L01092: continues a statement, function call, data value, or rendered content.
L01095: defines the homework property in the current object.
L01097: defines the eyebrow property in the current object.
L01098: continues a statement, function call, data value, or rendered content.
L01100: defines the title property in the current object.
L01101: continues a statement, function call, data value, or rendered content.
L01103: defines the body property in the current object.
L01104: continues a template string used to render interface content.
L01105: continues a template string used to render interface content.
L01106: continues a statement, function call, data value, or rendered content.
L01107: continues a statement, function call, data value, or rendered content.
L01108: continues a statement, function call, data value, or rendered content.
L01109: continues a statement, function call, data value, or rendered content.
L01110: continues a template string used to render interface content.
L01112: continues a template string used to render interface content.
L01113: continues a statement, function call, data value, or rendered content.
L01114: continues a template string used to render interface content.
L01116: continues a template string used to render interface content.
L01117: continues a template string used to render interface content.
L01118: continues a statement, function call, data value, or rendered content.
L01119: continues a template string used to render interface content.
L01121: continues a template string used to render interface content.
L01122: continues a statement, function call, data value, or rendered content.
L01123: continues a template string used to render interface content.
L01125: continues a template string used to render interface content.
L01126: continues a statement, function call, data value, or rendered content.
L01127: continues a template string used to render interface content.
L01129: continues a template string used to render interface content.
L01130: continues a statement, function call, data value, or rendered content.
L01131: continues a template string used to render interface content.
L01133: continues a template string used to render interface content.
L01134: continues a statement, function call, data value, or rendered content.
L01135: continues a template string used to render interface content.
L01136: continues a template string used to render interface content.
L01137: continues a template string used to render interface content.
L01139: defines the actions property in the current object.
L01141: opens or closes the current JavaScript structure.
L01143: defines the label property in the current object.
L01144: continues a statement, function call, data value, or rendered content.
L01146: defines the href property in the current object.
L01147: continues a statement, function call, data value, or rendered content.
L01149: defines the primary property in the current object.
L01150: continues a statement, function call, data value, or rendered content.
L01152: continues a statement, function call, data value, or rendered content.
L01154: opens or closes the current JavaScript structure.
L01156: defines the label property in the current object.
L01157: continues a statement, function call, data value, or rendered content.
L01159: defines the prefill property in the current object.
L01160: continues a statement, function call, data value, or rendered content.
L01162: opens or closes the current JavaScript structure.
L01164: opens or closes the current JavaScript structure.
L01166: continues a statement, function call, data value, or rendered content.
L01169: defines the stem property in the current object.
L01171: defines the eyebrow property in the current object.
L01172: continues a statement, function call, data value, or rendered content.
L01174: defines the title property in the current object.
L01175: continues a statement, function call, data value, or rendered content.
L01177: defines the body property in the current object.
L01178: continues a template string used to render interface content.
L01179: continues a template string used to render interface content.
L01180: continues a statement, function call, data value, or rendered content.
L01181: continues a statement, function call, data value, or rendered content.
L01182: continues a statement, function call, data value, or rendered content.
L01183: continues a statement, function call, data value, or rendered content.
L01184: continues a statement, function call, data value, or rendered content.
L01185: continues a template string used to render interface content.
L01187: continues a template string used to render interface content.
L01188: continues a statement, function call, data value, or rendered content.
L01189: continues a template string used to render interface content.
L01191: continues a template string used to render interface content.
L01192: continues a template string used to render interface content.
L01193: continues a statement, function call, data value, or rendered content.
L01194: continues a template string used to render interface content.
L01196: continues a template string used to render interface content.
L01197: continues a statement, function call, data value, or rendered content.
L01198: continues a template string used to render interface content.
L01200: continues a template string used to render interface content.
L01201: continues a statement, function call, data value, or rendered content.
L01202: continues a template string used to render interface content.
L01204: continues a template string used to render interface content.
L01205: continues a statement, function call, data value, or rendered content.
L01206: continues a template string used to render interface content.
L01208: continues a template string used to render interface content.
L01209: continues a statement, function call, data value, or rendered content.
L01210: continues a template string used to render interface content.
L01211: continues a template string used to render interface content.
L01212: continues a template string used to render interface content.
L01214: defines the actions property in the current object.
L01216: opens or closes the current JavaScript structure.
L01218: defines the label property in the current object.
L01219: continues a statement, function call, data value, or rendered content.
L01221: defines the href property in the current object.
L01222: continues a statement, function call, data value, or rendered content.
L01224: defines the primary property in the current object.
L01225: continues a statement, function call, data value, or rendered content.
L01227: continues a statement, function call, data value, or rendered content.
L01229: opens or closes the current JavaScript structure.
L01231: defines the label property in the current object.
L01232: continues a statement, function call, data value, or rendered content.
L01234: defines the href property in the current object.
L01235: continues a statement, function call, data value, or rendered content.
L01237: opens or closes the current JavaScript structure.
L01239: opens or closes the current JavaScript structure.
L01241: continues a statement, function call, data value, or rendered content.
L01244: defines the community property in the current object.
L01246: defines the eyebrow property in the current object.
L01247: continues a statement, function call, data value, or rendered content.
L01249: defines the title property in the current object.
L01250: continues a statement, function call, data value, or rendered content.
L01252: defines the body property in the current object.
L01253: continues a template string used to render interface content.
L01254: continues a template string used to render interface content.
L01255: continues a statement, function call, data value, or rendered content.
L01256: continues a statement, function call, data value, or rendered content.
L01257: continues a statement, function call, data value, or rendered content.
L01258: continues a statement, function call, data value, or rendered content.
L01259: continues a statement, function call, data value, or rendered content.
L01260: continues a template string used to render interface content.
L01262: continues a template string used to render interface content.
L01263: continues a statement, function call, data value, or rendered content.
L01264: continues a template string used to render interface content.
L01266: continues a template string used to render interface content.
L01267: continues a template string used to render interface content.
L01268: continues a statement, function call, data value, or rendered content.
L01269: continues a template string used to render interface content.
L01271: continues a template string used to render interface content.
L01272: continues a statement, function call, data value, or rendered content.
L01273: continues a template string used to render interface content.
L01275: continues a template string used to render interface content.
L01276: continues a statement, function call, data value, or rendered content.
L01277: continues a template string used to render interface content.
L01279: continues a template string used to render interface content.
L01280: continues a statement, function call, data value, or rendered content.
L01281: continues a template string used to render interface content.
L01283: continues a template string used to render interface content.
L01284: continues a statement, function call, data value, or rendered content.
L01285: continues a template string used to render interface content.
L01286: continues a template string used to render interface content.
L01287: continues a template string used to render interface content.
L01289: defines the actions property in the current object.
L01291: opens or closes the current JavaScript structure.
L01293: defines the label property in the current object.
L01294: continues a statement, function call, data value, or rendered content.
L01296: defines the href property in the current object.
L01297: continues a statement, function call, data value, or rendered content.
L01299: defines the primary property in the current object.
L01300: continues a statement, function call, data value, or rendered content.
L01302: continues a statement, function call, data value, or rendered content.
L01304: opens or closes the current JavaScript structure.
L01306: defines the label property in the current object.
L01307: continues a statement, function call, data value, or rendered content.
L01309: defines the href property in the current object.
L01310: continues a statement, function call, data value, or rendered content.
L01312: opens or closes the current JavaScript structure.
L01314: opens or closes the current JavaScript structure.
L01316: continues a statement, function call, data value, or rendered content.
L01319: defines the creative property in the current object.
L01321: defines the eyebrow property in the current object.
L01322: continues a statement, function call, data value, or rendered content.
L01324: defines the title property in the current object.
L01325: continues a statement, function call, data value, or rendered content.
L01327: defines the body property in the current object.
L01328: continues a template string used to render interface content.
L01329: continues a template string used to render interface content.
L01330: continues a statement, function call, data value, or rendered content.
L01331: continues a statement, function call, data value, or rendered content.
L01332: continues a statement, function call, data value, or rendered content.
L01333: continues a statement, function call, data value, or rendered content.
L01334: continues a statement, function call, data value, or rendered content.
L01335: continues a template string used to render interface content.
L01337: continues a template string used to render interface content.
L01338: continues a statement, function call, data value, or rendered content.
L01339: continues a template string used to render interface content.
L01341: continues a template string used to render interface content.
L01342: continues a template string used to render interface content.
L01343: continues a statement, function call, data value, or rendered content.
L01344: continues a template string used to render interface content.
L01346: continues a template string used to render interface content.
L01347: continues a statement, function call, data value, or rendered content.
L01348: continues a template string used to render interface content.
L01350: continues a template string used to render interface content.
L01351: continues a statement, function call, data value, or rendered content.
L01352: continues a template string used to render interface content.
L01354: continues a template string used to render interface content.
L01355: continues a statement, function call, data value, or rendered content.
L01356: continues a template string used to render interface content.
L01358: continues a template string used to render interface content.
L01359: continues a statement, function call, data value, or rendered content.
L01360: continues a template string used to render interface content.
L01361: continues a template string used to render interface content.
L01362: continues a template string used to render interface content.
L01364: defines the actions property in the current object.
L01366: opens or closes the current JavaScript structure.
L01368: defines the label property in the current object.
L01369: continues a statement, function call, data value, or rendered content.
L01371: defines the href property in the current object.
L01372: continues a statement, function call, data value, or rendered content.
L01374: defines the primary property in the current object.
L01375: continues a statement, function call, data value, or rendered content.
L01377: continues a statement, function call, data value, or rendered content.
L01379: opens or closes the current JavaScript structure.
L01381: defines the label property in the current object.
L01382: continues a statement, function call, data value, or rendered content.
L01384: defines the prefill property in the current object.
L01385: continues a statement, function call, data value, or rendered content.
L01387: opens or closes the current JavaScript structure.
L01389: opens or closes the current JavaScript structure.
L01391: continues a statement, function call, data value, or rendered content.
L01394: defines the transparency property in the current object.
L01396: defines the eyebrow property in the current object.
L01397: continues a statement, function call, data value, or rendered content.
L01399: defines the title property in the current object.
L01400: continues a statement, function call, data value, or rendered content.
L01402: defines the body property in the current object.
L01403: continues a template string used to render interface content.
L01404: continues a template string used to render interface content.
L01405: continues a statement, function call, data value, or rendered content.
L01406: continues a statement, function call, data value, or rendered content.
L01407: continues a statement, function call, data value, or rendered content.
L01408: continues a template string used to render interface content.
L01410: continues a template string used to render interface content.
L01411: continues a statement, function call, data value, or rendered content.
L01412: continues a template string used to render interface content.
L01414: continues a template string used to render interface content.
L01415: continues a template string used to render interface content.
L01416: continues a statement, function call, data value, or rendered content.
L01417: continues a template string used to render interface content.
L01419: continues a template string used to render interface content.
L01420: continues a statement, function call, data value, or rendered content.
L01421: continues a template string used to render interface content.
L01423: continues a template string used to render interface content.
L01424: continues a statement, function call, data value, or rendered content.
L01425: continues a template string used to render interface content.
L01427: continues a template string used to render interface content.
L01428: continues a statement, function call, data value, or rendered content.
L01429: continues a template string used to render interface content.
L01431: continues a template string used to render interface content.
L01432: continues a statement, function call, data value, or rendered content.
L01433: continues a template string used to render interface content.
L01435: continues a template string used to render interface content.
L01436: continues a statement, function call, data value, or rendered content.
L01437: continues a template string used to render interface content.
L01438: continues a template string used to render interface content.
L01440: continues a template string used to render interface content.
L01441: continues a statement, function call, data value, or rendered content.
L01442: starts or continues an iteration.
L01443: continues a statement, function call, data value, or rendered content.
L01444: continues a template string used to render interface content.
L01445: continues a template string used to render interface content.
L01447: defines the actions property in the current object.
L01449: opens or closes the current JavaScript structure.
L01451: defines the label property in the current object.
L01452: continues a statement, function call, data value, or rendered content.
L01454: defines the resource property in the current object.
L01455: continues a statement, function call, data value, or rendered content.
L01457: defines the primary property in the current object.
L01458: continues a statement, function call, data value, or rendered content.
L01460: continues a statement, function call, data value, or rendered content.
L01462: opens or closes the current JavaScript structure.
L01464: defines the label property in the current object.
L01465: continues a statement, function call, data value, or rendered content.
L01467: defines the href property in the current object.
L01468: continues a statement, function call, data value, or rendered content.
L01470: opens or closes the current JavaScript structure.
L01472: opens or closes the current JavaScript structure.
L01474: continues a statement, function call, data value, or rendered content.
L01477: defines the photoPolicy property in the current object.
L01479: defines the eyebrow property in the current object.
L01480: continues a statement, function call, data value, or rendered content.
L01482: defines the title property in the current object.
L01483: continues a statement, function call, data value, or rendered content.
L01485: defines the body property in the current object.
L01486: continues a template string used to render interface content.
L01487: continues a template string used to render interface content.
L01488: continues a statement, function call, data value, or rendered content.
L01489: continues a statement, function call, data value, or rendered content.
L01490: continues a statement, function call, data value, or rendered content.
L01491: continues a template string used to render interface content.
L01493: continues a template string used to render interface content.
L01494: continues a statement, function call, data value, or rendered content.
L01495: continues a template string used to render interface content.
L01497: continues a template string used to render interface content.
L01498: continues a template string used to render interface content.
L01499: continues a statement, function call, data value, or rendered content.
L01500: starts or continues an iteration.
L01501: continues a template string used to render interface content.
L01503: continues a template string used to render interface content.
L01504: continues a statement, function call, data value, or rendered content.
L01505: continues a statement, function call, data value, or rendered content.
L01506: continues a template string used to render interface content.
L01508: continues a template string used to render interface content.
L01509: continues a statement, function call, data value, or rendered content.
L01510: continues a statement, function call, data value, or rendered content.
L01511: continues a template string used to render interface content.
L01513: continues a template string used to render interface content.
L01514: continues a statement, function call, data value, or rendered content.
L01515: continues a statement, function call, data value, or rendered content.
L01516: continues a template string used to render interface content.
L01518: continues a template string used to render interface content.
L01519: continues a statement, function call, data value, or rendered content.
L01520: continues a statement, function call, data value, or rendered content.
L01521: continues a template string used to render interface content.
L01523: continues a template string used to render interface content.
L01524: continues a statement, function call, data value, or rendered content.
L01525: continues a template string used to render interface content.
L01526: continues a template string used to render interface content.
L01528: continues a template string used to render interface content.
L01529: continues a statement, function call, data value, or rendered content.
L01530: continues a statement, function call, data value, or rendered content.
L01531: continues a statement, function call, data value, or rendered content.
L01532: continues a template string used to render interface content.
L01533: continues a template string used to render interface content.
L01535: defines the actions property in the current object.
L01537: opens or closes the current JavaScript structure.
L01539: defines the label property in the current object.
L01540: continues a statement, function call, data value, or rendered content.
L01542: defines the prefill property in the current object.
L01543: continues a statement, function call, data value, or rendered content.
L01545: defines the primary property in the current object.
L01546: continues a statement, function call, data value, or rendered content.
L01548: continues a statement, function call, data value, or rendered content.
L01550: opens or closes the current JavaScript structure.
L01552: defines the label property in the current object.
L01553: continues a statement, function call, data value, or rendered content.
L01555: defines the close property in the current object.
L01556: continues a statement, function call, data value, or rendered content.
L01558: opens or closes the current JavaScript structure.
L01560: opens or closes the current JavaScript structure.
L01562: continues a statement, function call, data value, or rendered content.
L01565: defines the accessibility property in the current object.
L01567: defines the eyebrow property in the current object.
L01568: continues a statement, function call, data value, or rendered content.
L01570: defines the title property in the current object.
L01571: continues a statement, function call, data value, or rendered content.
L01573: defines the body property in the current object.
L01574: continues a template string used to render interface content.
L01575: continues a template string used to render interface content.
L01576: continues a statement, function call, data value, or rendered content.
L01577: continues a statement, function call, data value, or rendered content.
L01578: continues a statement, function call, data value, or rendered content.
L01579: continues a statement, function call, data value, or rendered content.
L01580: continues a template string used to render interface content.
L01582: continues a template string used to render interface content.
L01583: continues a statement, function call, data value, or rendered content.
L01584: continues a template string used to render interface content.
L01586: continues a template string used to render interface content.
L01587: continues a template string used to render interface content.
L01588: continues a statement, function call, data value, or rendered content.
L01589: continues a template string used to render interface content.
L01591: continues a template string used to render interface content.
L01592: continues a statement, function call, data value, or rendered content.
L01593: continues a template string used to render interface content.
L01595: continues a template string used to render interface content.
L01596: continues a statement, function call, data value, or rendered content.
L01597: continues a template string used to render interface content.
L01599: continues a template string used to render interface content.
L01600: continues a statement, function call, data value, or rendered content.
L01601: continues a template string used to render interface content.
L01603: continues a template string used to render interface content.
L01604: continues a statement, function call, data value, or rendered content.
L01605: continues a template string used to render interface content.
L01607: continues a template string used to render interface content.
L01608: continues a statement, function call, data value, or rendered content.
L01609: continues a template string used to render interface content.
L01610: continues a template string used to render interface content.
L01611: continues a template string used to render interface content.
L01613: defines the actions property in the current object.
L01615: opens or closes the current JavaScript structure.
L01617: defines the label property in the current object.
L01618: continues a statement, function call, data value, or rendered content.
L01620: defines the prefill property in the current object.
L01621: continues a statement, function call, data value, or rendered content.
L01623: defines the primary property in the current object.
L01624: continues a statement, function call, data value, or rendered content.
L01626: continues a statement, function call, data value, or rendered content.
L01628: opens or closes the current JavaScript structure.
L01630: defines the label property in the current object.
L01631: continues a statement, function call, data value, or rendered content.
L01633: defines the close property in the current object.
L01634: continues a statement, function call, data value, or rendered content.
L01636: opens or closes the current JavaScript structure.
L01638: opens or closes the current JavaScript structure.
L01640: continues a statement, function call, data value, or rendered content.
L01643: defines the privacy property in the current object.
L01645: defines the eyebrow property in the current object.
L01646: continues a statement, function call, data value, or rendered content.
L01648: defines the title property in the current object.
L01649: continues a statement, function call, data value, or rendered content.
L01651: defines the body property in the current object.
L01652: continues a template string used to render interface content.
L01653: continues a template string used to render interface content.
L01654: continues a statement, function call, data value, or rendered content.
L01655: continues a statement, function call, data value, or rendered content.
L01656: continues a statement, function call, data value, or rendered content.
L01657: continues a statement, function call, data value, or rendered content.
L01658: continues a template string used to render interface content.
L01660: continues a template string used to render interface content.
L01661: continues a statement, function call, data value, or rendered content.
L01662: continues a template string used to render interface content.
L01664: continues a template string used to render interface content.
L01665: continues a template string used to render interface content.
L01666: continues a statement, function call, data value, or rendered content.
L01667: continues a template string used to render interface content.
L01669: continues a template string used to render interface content.
L01670: continues a statement, function call, data value, or rendered content.
L01671: continues a template string used to render interface content.
L01673: continues a template string used to render interface content.
L01674: continues a statement, function call, data value, or rendered content.
L01675: continues a template string used to render interface content.
L01677: continues a template string used to render interface content.
L01678: continues a statement, function call, data value, or rendered content.
L01679: continues a template string used to render interface content.
L01681: continues a template string used to render interface content.
L01682: continues a statement, function call, data value, or rendered content.
L01683: continues a template string used to render interface content.
L01684: continues a template string used to render interface content.
L01685: continues a template string used to render interface content.
L01687: defines the actions property in the current object.
L01689: opens or closes the current JavaScript structure.
L01691: defines the label property in the current object.
L01692: continues a statement, function call, data value, or rendered content.
L01694: defines the prefill property in the current object.
L01695: continues a statement, function call, data value, or rendered content.
L01697: defines the primary property in the current object.
L01698: continues a statement, function call, data value, or rendered content.
L01700: continues a statement, function call, data value, or rendered content.
L01702: opens or closes the current JavaScript structure.
L01704: defines the label property in the current object.
L01705: continues a statement, function call, data value, or rendered content.
L01707: defines the close property in the current object.
L01708: continues a statement, function call, data value, or rendered content.
L01710: opens or closes the current JavaScript structure.
L01712: opens or closes the current JavaScript structure.
L01714: opens or closes the current JavaScript structure.
L01716: opens or closes the current JavaScript structure.
L01719: continues JavaScript documentation for maintainers.
L01720: continues a statement, function call, data value, or rendered content.
L01721: continues JavaScript documentation for maintainers.
L01723: declares the resourceLibrary JavaScript value.
L01725: defines the parents property in the current object.
L01727: defines the eyebrow property in the current object.
L01728: continues a statement, function call, data value, or rendered content.
L01730: defines the title property in the current object.
L01731: continues a statement, function call, data value, or rendered content.
L01733: defines the body property in the current object.
L01734: continues a template string used to render interface content.
L01735: continues a template string used to render interface content.
L01736: continues a statement, function call, data value, or rendered content.
L01737: continues a statement, function call, data value, or rendered content.
L01738: continues a statement, function call, data value, or rendered content.
L01739: continues a template string used to render interface content.
L01741: continues a template string used to render interface content.
L01742: continues a statement, function call, data value, or rendered content.
L01743: continues a template string used to render interface content.
L01745: continues a template string used to render interface content.
L01746: continues a template string used to render interface content.
L01747: continues a statement, function call, data value, or rendered content.
L01748: continues a template string used to render interface content.
L01750: continues a template string used to render interface content.
L01751: continues a statement, function call, data value, or rendered content.
L01752: continues a template string used to render interface content.
L01754: continues a template string used to render interface content.
L01755: continues a statement, function call, data value, or rendered content.
L01756: continues a template string used to render interface content.
L01758: continues a template string used to render interface content.
L01759: continues a statement, function call, data value, or rendered content.
L01760: continues a template string used to render interface content.
L01762: continues a template string used to render interface content.
L01763: continues a statement, function call, data value, or rendered content.
L01764: continues a template string used to render interface content.
L01766: continues a template string used to render interface content.
L01767: continues a statement, function call, data value, or rendered content.
L01768: continues a template string used to render interface content.
L01770: continues a template string used to render interface content.
L01771: continues a statement, function call, data value, or rendered content.
L01772: continues a template string used to render interface content.
L01773: continues a template string used to render interface content.
L01774: continues a template string used to render interface content.
L01776: defines the actions property in the current object.
L01778: opens or closes the current JavaScript structure.
L01780: defines the label property in the current object.
L01781: continues a statement, function call, data value, or rendered content.
L01783: defines the href property in the current object.
L01784: continues a statement, function call, data value, or rendered content.
L01786: defines the primary property in the current object.
L01787: continues a statement, function call, data value, or rendered content.
L01789: continues a statement, function call, data value, or rendered content.
L01791: opens or closes the current JavaScript structure.
L01793: defines the label property in the current object.
L01794: continues a statement, function call, data value, or rendered content.
L01796: defines the prefill property in the current object.
L01797: continues a statement, function call, data value, or rendered content.
L01799: opens or closes the current JavaScript structure.
L01801: opens or closes the current JavaScript structure.
L01803: continues a statement, function call, data value, or rendered content.
L01806: defines the volunteers property in the current object.
L01808: defines the eyebrow property in the current object.
L01809: continues a statement, function call, data value, or rendered content.
L01811: defines the title property in the current object.
L01812: continues a statement, function call, data value, or rendered content.
L01814: defines the body property in the current object.
L01815: continues a template string used to render interface content.
L01816: continues a template string used to render interface content.
L01817: continues a statement, function call, data value, or rendered content.
L01818: continues a statement, function call, data value, or rendered content.
L01819: continues a statement, function call, data value, or rendered content.
L01820: continues a template string used to render interface content.
L01822: continues a template string used to render interface content.
L01823: continues a statement, function call, data value, or rendered content.
L01824: continues a template string used to render interface content.
L01826: continues a template string used to render interface content.
L01827: continues a template string used to render interface content.
L01828: continues a statement, function call, data value, or rendered content.
L01829: continues a template string used to render interface content.
L01831: continues a template string used to render interface content.
L01832: continues a statement, function call, data value, or rendered content.
L01833: continues a template string used to render interface content.
L01835: continues a template string used to render interface content.
L01836: continues a statement, function call, data value, or rendered content.
L01837: continues a template string used to render interface content.
L01839: continues a template string used to render interface content.
L01840: continues a statement, function call, data value, or rendered content.
L01841: continues a template string used to render interface content.
L01843: continues a template string used to render interface content.
L01844: continues a statement, function call, data value, or rendered content.
L01845: continues a template string used to render interface content.
L01847: continues a template string used to render interface content.
L01848: continues a statement, function call, data value, or rendered content.
L01849: continues a template string used to render interface content.
L01850: continues a template string used to render interface content.
L01851: continues a template string used to render interface content.
L01853: defines the actions property in the current object.
L01855: opens or closes the current JavaScript structure.
L01857: defines the label property in the current object.
L01858: continues a statement, function call, data value, or rendered content.
L01860: defines the prefill property in the current object.
L01861: continues a statement, function call, data value, or rendered content.
L01863: defines the primary property in the current object.
L01864: continues a statement, function call, data value, or rendered content.
L01866: continues a statement, function call, data value, or rendered content.
L01868: opens or closes the current JavaScript structure.
L01870: defines the label property in the current object.
L01871: continues a statement, function call, data value, or rendered content.
L01873: defines the href property in the current object.
L01874: continues a statement, function call, data value, or rendered content.
L01876: opens or closes the current JavaScript structure.
L01878: opens or closes the current JavaScript structure.
L01880: continues a statement, function call, data value, or rendered content.
L01883: defines the researchers property in the current object.
L01885: defines the eyebrow property in the current object.
L01886: continues a statement, function call, data value, or rendered content.
L01888: defines the title property in the current object.
L01889: continues a statement, function call, data value, or rendered content.
L01891: defines the body property in the current object.
L01892: continues a template string used to render interface content.
L01893: continues a template string used to render interface content.
L01894: continues a statement, function call, data value, or rendered content.
L01895: continues a statement, function call, data value, or rendered content.
L01896: continues a statement, function call, data value, or rendered content.
L01897: continues a template string used to render interface content.
L01899: continues a template string used to render interface content.
L01900: continues a statement, function call, data value, or rendered content.
L01901: continues a template string used to render interface content.
L01903: continues a template string used to render interface content.
L01904: continues a template string used to render interface content.
L01905: continues a statement, function call, data value, or rendered content.
L01906: continues a statement, function call, data value, or rendered content.
L01907: continues a template string used to render interface content.
L01909: continues a template string used to render interface content.
L01910: continues a statement, function call, data value, or rendered content.
L01911: continues a statement, function call, data value, or rendered content.
L01912: continues a statement, function call, data value, or rendered content.
L01913: continues a template string used to render interface content.
L01914: continues a template string used to render interface content.
L01916: continues a template string used to render interface content.
L01917: continues a statement, function call, data value, or rendered content.
L01918: continues a template string used to render interface content.
L01920: continues a template string used to render interface content.
L01921: continues a template string used to render interface content.
L01922: continues a statement, function call, data value, or rendered content.
L01923: continues a template string used to render interface content.
L01925: continues a template string used to render interface content.
L01926: continues a statement, function call, data value, or rendered content.
L01927: continues a template string used to render interface content.
L01929: continues a template string used to render interface content.
L01930: continues a statement, function call, data value, or rendered content.
L01931: continues a template string used to render interface content.
L01933: continues a template string used to render interface content.
L01934: continues a statement, function call, data value, or rendered content.
L01935: continues a template string used to render interface content.
L01937: continues a template string used to render interface content.
L01938: continues a statement, function call, data value, or rendered content.
L01939: continues a template string used to render interface content.
L01940: continues a template string used to render interface content.
L01942: continues a template string used to render interface content.
L01943: continues a statement, function call, data value, or rendered content.
L01944: continues a statement, function call, data value, or rendered content.
L01945: continues a statement, function call, data value, or rendered content.
L01946: continues a template string used to render interface content.
L01947: continues a template string used to render interface content.
L01949: defines the actions property in the current object.
L01951: opens or closes the current JavaScript structure.
L01953: defines the label property in the current object.
L01954: continues a statement, function call, data value, or rendered content.
L01956: defines the prefill property in the current object.
L01957: continues a statement, function call, data value, or rendered content.
L01959: defines the primary property in the current object.
L01960: continues a statement, function call, data value, or rendered content.
L01962: continues a statement, function call, data value, or rendered content.
L01964: opens or closes the current JavaScript structure.
L01966: defines the label property in the current object.
L01967: continues a statement, function call, data value, or rendered content.
L01969: defines the modal property in the current object.
L01970: continues a statement, function call, data value, or rendered content.
L01972: opens or closes the current JavaScript structure.
L01974: opens or closes the current JavaScript structure.
L01976: continues a statement, function call, data value, or rendered content.
L01979: defines the incoming property in the current object.
L01981: defines the eyebrow property in the current object.
L01982: continues a statement, function call, data value, or rendered content.
L01984: defines the title property in the current object.
L01985: continues a statement, function call, data value, or rendered content.
L01987: defines the body property in the current object.
L01988: continues a template string used to render interface content.
L01989: continues a template string used to render interface content.
L01990: continues a statement, function call, data value, or rendered content.
L01991: continues a statement, function call, data value, or rendered content.
L01992: continues a statement, function call, data value, or rendered content.
L01993: continues a template string used to render interface content.
L01995: continues a template string used to render interface content.
L01996: continues a statement, function call, data value, or rendered content.
L01997: continues a template string used to render interface content.
L01999: continues a template string used to render interface content.
L02000: continues a template string used to render interface content.
L02001: continues a statement, function call, data value, or rendered content.
L02002: continues a template string used to render interface content.
L02004: continues a template string used to render interface content.
L02005: continues a statement, function call, data value, or rendered content.
L02006: continues a template string used to render interface content.
L02008: continues a template string used to render interface content.
L02009: continues a statement, function call, data value, or rendered content.
L02010: continues a statement, function call, data value, or rendered content.
L02011: continues a template string used to render interface content.
L02013: continues a template string used to render interface content.
L02014: continues a statement, function call, data value, or rendered content.
L02015: continues a statement, function call, data value, or rendered content.
L02016: continues a template string used to render interface content.
L02018: continues a template string used to render interface content.
L02019: continues a statement, function call, data value, or rendered content.
L02020: continues a template string used to render interface content.
L02022: continues a template string used to render interface content.
L02023: continues a statement, function call, data value, or rendered content.
L02024: continues a template string used to render interface content.
L02025: continues a template string used to render interface content.
L02026: continues a template string used to render interface content.
L02028: defines the actions property in the current object.
L02030: opens or closes the current JavaScript structure.
L02032: defines the label property in the current object.
L02033: continues a statement, function call, data value, or rendered content.
L02035: defines the prefill property in the current object.
L02036: continues a statement, function call, data value, or rendered content.
L02038: defines the primary property in the current object.
L02039: continues a statement, function call, data value, or rendered content.
L02041: continues a statement, function call, data value, or rendered content.
L02043: opens or closes the current JavaScript structure.
L02045: defines the label property in the current object.
L02046: continues a statement, function call, data value, or rendered content.
L02048: defines the modal property in the current object.
L02049: continues a statement, function call, data value, or rendered content.
L02051: opens or closes the current JavaScript structure.
L02053: opens or closes the current JavaScript structure.
L02055: continues a statement, function call, data value, or rendered content.
L02058: defines the community property in the current object.
L02060: defines the eyebrow property in the current object.
L02061: continues a statement, function call, data value, or rendered content.
L02063: defines the title property in the current object.
L02064: continues a statement, function call, data value, or rendered content.
L02066: defines the body property in the current object.
L02067: continues a template string used to render interface content.
L02068: continues a template string used to render interface content.
L02069: continues a statement, function call, data value, or rendered content.
L02070: continues a statement, function call, data value, or rendered content.
L02071: continues a statement, function call, data value, or rendered content.
L02072: continues a statement, function call, data value, or rendered content.
L02073: continues a template string used to render interface content.
L02075: continues a template string used to render interface content.
L02076: continues a statement, function call, data value, or rendered content.
L02077: continues a template string used to render interface content.
L02079: continues a template string used to render interface content.
L02080: continues a template string used to render interface content.
L02081: continues a statement, function call, data value, or rendered content.
L02082: continues a template string used to render interface content.
L02084: continues a template string used to render interface content.
L02085: continues a statement, function call, data value, or rendered content.
L02086: continues a template string used to render interface content.
L02088: continues a template string used to render interface content.
L02089: continues a statement, function call, data value, or rendered content.
L02090: continues a template string used to render interface content.
L02092: continues a template string used to render interface content.
L02093: continues a statement, function call, data value, or rendered content.
L02094: continues a template string used to render interface content.
L02096: continues a template string used to render interface content.
L02097: continues a statement, function call, data value, or rendered content.
L02098: continues a template string used to render interface content.
L02100: continues a template string used to render interface content.
L02101: continues a statement, function call, data value, or rendered content.
L02102: continues a template string used to render interface content.
L02103: continues a template string used to render interface content.
L02104: continues a template string used to render interface content.
L02106: defines the actions property in the current object.
L02108: opens or closes the current JavaScript structure.
L02110: defines the label property in the current object.
L02111: continues a statement, function call, data value, or rendered content.
L02113: defines the prefill property in the current object.
L02114: continues a statement, function call, data value, or rendered content.
L02116: defines the primary property in the current object.
L02117: continues a statement, function call, data value, or rendered content.
L02119: continues a statement, function call, data value, or rendered content.
L02121: opens or closes the current JavaScript structure.
L02123: defines the label property in the current object.
L02124: continues a statement, function call, data value, or rendered content.
L02126: defines the href property in the current object.
L02127: continues a statement, function call, data value, or rendered content.
L02129: opens or closes the current JavaScript structure.
L02131: opens or closes the current JavaScript structure.
L02133: opens or closes the current JavaScript structure.
L02135: opens or closes the current JavaScript structure.
L02138: continues JavaScript documentation for maintainers.
L02139: continues a statement, function call, data value, or rendered content.
L02140: continues JavaScript documentation for maintainers.
L02142: declares the teamLibrary JavaScript value.
L02144: defines the leadership property in the current object.
L02146: defines the eyebrow property in the current object.
L02147: continues a statement, function call, data value, or rendered content.
L02149: defines the title property in the current object.
L02150: continues a statement, function call, data value, or rendered content.
L02152: defines the body property in the current object.
L02153: continues a template string used to render interface content.
L02154: continues a template string used to render interface content.
L02155: continues a statement, function call, data value, or rendered content.
L02156: continues a statement, function call, data value, or rendered content.
L02157: continues a statement, function call, data value, or rendered content.
L02158: continues a template string used to render interface content.
L02160: continues a template string used to render interface content.
L02161: continues a statement, function call, data value, or rendered content.
L02162: continues a template string used to render interface content.
L02164: continues a template string used to render interface content.
L02165: continues a template string used to render interface content.
L02166: continues a statement, function call, data value, or rendered content.
L02167: continues a template string used to render interface content.
L02169: continues a template string used to render interface content.
L02170: continues a statement, function call, data value, or rendered content.
L02171: continues a template string used to render interface content.
L02173: continues a template string used to render interface content.
L02174: continues a statement, function call, data value, or rendered content.
L02175: continues a template string used to render interface content.
L02177: continues a template string used to render interface content.
L02178: continues a statement, function call, data value, or rendered content.
L02179: continues a template string used to render interface content.
L02181: continues a template string used to render interface content.
L02182: continues a statement, function call, data value, or rendered content.
L02183: continues a template string used to render interface content.
L02184: continues a template string used to render interface content.
L02185: continues a template string used to render interface content.
L02187: defines the actions property in the current object.
L02189: opens or closes the current JavaScript structure.
L02191: defines the label property in the current object.
L02192: continues a statement, function call, data value, or rendered content.
L02194: defines the prefill property in the current object.
L02195: continues a statement, function call, data value, or rendered content.
L02197: defines the primary property in the current object.
L02198: continues a statement, function call, data value, or rendered content.
L02200: continues a statement, function call, data value, or rendered content.
L02202: opens or closes the current JavaScript structure.
L02204: defines the label property in the current object.
L02205: continues a statement, function call, data value, or rendered content.
L02207: defines the close property in the current object.
L02208: continues a statement, function call, data value, or rendered content.
L02210: opens or closes the current JavaScript structure.
L02212: opens or closes the current JavaScript structure.
L02214: continues a statement, function call, data value, or rendered content.
L02217: defines the research property in the current object.
L02219: defines the eyebrow property in the current object.
L02220: continues a statement, function call, data value, or rendered content.
L02222: defines the title property in the current object.
L02223: continues a statement, function call, data value, or rendered content.
L02225: defines the body property in the current object.
L02226: continues a template string used to render interface content.
L02227: continues a template string used to render interface content.
L02228: continues a statement, function call, data value, or rendered content.
L02229: continues a statement, function call, data value, or rendered content.
L02230: continues a statement, function call, data value, or rendered content.
L02231: continues a template string used to render interface content.
L02233: continues a template string used to render interface content.
L02234: continues a statement, function call, data value, or rendered content.
L02235: continues a statement, function call, data value, or rendered content.
L02236: continues a statement, function call, data value, or rendered content.
L02237: continues a template string used to render interface content.
L02238: continues a template string used to render interface content.
L02240: defines the actions property in the current object.
L02242: opens or closes the current JavaScript structure.
L02244: defines the label property in the current object.
L02245: continues a statement, function call, data value, or rendered content.
L02247: defines the resource property in the current object.
L02248: continues a statement, function call, data value, or rendered content.
L02250: defines the primary property in the current object.
L02251: continues a statement, function call, data value, or rendered content.
L02253: continues a statement, function call, data value, or rendered content.
L02255: opens or closes the current JavaScript structure.
L02257: defines the label property in the current object.
L02258: continues a statement, function call, data value, or rendered content.
L02260: defines the prefill property in the current object.
L02261: continues a statement, function call, data value, or rendered content.
L02263: opens or closes the current JavaScript structure.
L02265: opens or closes the current JavaScript structure.
L02267: continues a statement, function call, data value, or rendered content.
L02270: defines the volunteers property in the current object.
L02272: defines the eyebrow property in the current object.
L02273: continues a statement, function call, data value, or rendered content.
L02275: defines the title property in the current object.
L02276: continues a statement, function call, data value, or rendered content.
L02278: defines the body property in the current object.
L02279: continues a template string used to render interface content.
L02280: continues a template string used to render interface content.
L02281: continues a statement, function call, data value, or rendered content.
L02282: continues a statement, function call, data value, or rendered content.
L02283: continues a statement, function call, data value, or rendered content.
L02284: continues a template string used to render interface content.
L02286: continues a template string used to render interface content.
L02287: continues a statement, function call, data value, or rendered content.
L02288: continues a statement, function call, data value, or rendered content.
L02289: continues a statement, function call, data value, or rendered content.
L02290: continues a template string used to render interface content.
L02291: continues a template string used to render interface content.
L02293: defines the actions property in the current object.
L02295: opens or closes the current JavaScript structure.
L02297: defines the label property in the current object.
L02298: continues a statement, function call, data value, or rendered content.
L02300: defines the resource property in the current object.
L02301: continues a statement, function call, data value, or rendered content.
L02303: defines the primary property in the current object.
L02304: continues a statement, function call, data value, or rendered content.
L02306: continues a statement, function call, data value, or rendered content.
L02308: opens or closes the current JavaScript structure.
L02310: defines the label property in the current object.
L02311: continues a statement, function call, data value, or rendered content.
L02313: defines the prefill property in the current object.
L02314: continues a statement, function call, data value, or rendered content.
L02316: opens or closes the current JavaScript structure.
L02318: opens or closes the current JavaScript structure.
L02320: opens or closes the current JavaScript structure.
L02322: opens or closes the current JavaScript structure.
L02325: continues JavaScript documentation for maintainers.
L02326: continues a statement, function call, data value, or rendered content.
L02327: continues JavaScript documentation for maintainers.
L02329: declares the select JavaScript value.
L02331: continues a statement, function call, data value, or rendered content.
L02333: continues a statement, function call, data value, or rendered content.
L02335: defines or continues an arrow function.
L02338: declares the selectAll JavaScript value.
L02340: continues a statement, function call, data value, or rendered content.
L02342: continues a statement, function call, data value, or rendered content.
L02344: defines or continues an arrow function.
L02346: continues a chained method call.
L02348: opens or closes the current JavaScript structure.
L02351: declares the escapeHtml JavaScript value.
L02353: continues a statement, function call, data value, or rendered content.
L02355: defines or continues an arrow function.
L02357: continues a chained method call.
L02358: continues a statement, function call, data value, or rendered content.
L02359: continues a statement, function call, data value, or rendered content.
L02360: opens or closes the current JavaScript structure.
L02362: continues a chained method call.
L02363: continues a statement, function call, data value, or rendered content.
L02364: continues a statement, function call, data value, or rendered content.
L02365: opens or closes the current JavaScript structure.
L02367: continues a chained method call.
L02368: continues a statement, function call, data value, or rendered content.
L02369: continues a statement, function call, data value, or rendered content.
L02370: opens or closes the current JavaScript structure.
L02372: continues a chained method call.
L02373: continues a statement, function call, data value, or rendered content.
L02374: continues a statement, function call, data value, or rendered content.
L02375: opens or closes the current JavaScript structure.
L02377: continues a chained method call.
L02378: continues a statement, function call, data value, or rendered content.
L02379: continues a statement, function call, data value, or rendered content.
L02380: opens or closes the current JavaScript structure.
L02383: declares the prefersReducedMotion JavaScript value.
L02385: continues a statement, function call, data value, or rendered content.
L02387: continues a statement, function call, data value, or rendered content.
L02390: continues JavaScript documentation for maintainers.
L02391: continues a statement, function call, data value, or rendered content.
L02392: continues JavaScript documentation for maintainers.
L02394: declares the formatEventDate JavaScript value.
L02396: continues a statement, function call, data value, or rendered content.
L02398: defines or continues an arrow function.
L02400: declares the date JavaScript value.
L02402: continues a template string used to render interface content.
L02404: opens or closes the current JavaScript structure.
L02407: starts a conditional branch.
L02409: continues a statement, function call, data value, or rendered content.
L02411: continues a statement, function call, data value, or rendered content.
L02413: returns a value or exits the current function.
L02415: defines the day property in the current object.
L02416: continues a statement, function call, data value, or rendered content.
L02418: defines the month property in the current object.
L02419: continues a statement, function call, data value, or rendered content.
L02421: defines the long property in the current object.
L02422: continues a statement, function call, data value, or rendered content.
L02424: opens or closes the current JavaScript structure.
L02426: opens or closes the current JavaScript structure.
L02429: returns a value or exits the current function.
L02431: defines the day property in the current object.
L02432: continues a statement, function call, data value, or rendered content.
L02434: continues a statement, function call, data value, or rendered content.
L02436: opens or closes the current JavaScript structure.
L02438: defines the day property in the current object.
L02439: continues a statement, function call, data value, or rendered content.
L02441: opens or closes the current JavaScript structure.
L02443: continues a statement, function call, data value, or rendered content.
L02446: defines the month property in the current object.
L02447: continues a statement, function call, data value, or rendered content.
L02449: continues a statement, function call, data value, or rendered content.
L02451: opens or closes the current JavaScript structure.
L02453: defines the month property in the current object.
L02454: continues a statement, function call, data value, or rendered content.
L02456: opens or closes the current JavaScript structure.
L02458: opens or closes the current JavaScript structure.
L02460: continues a chained method call.
L02462: continues a chained method call.
L02465: defines the long property in the current object.
L02466: continues a statement, function call, data value, or rendered content.
L02468: continues a statement, function call, data value, or rendered content.
L02470: opens or closes the current JavaScript structure.
L02472: defines the weekday property in the current object.
L02473: continues a statement, function call, data value, or rendered content.
L02475: defines the month property in the current object.
L02476: continues a statement, function call, data value, or rendered content.
L02478: defines the day property in the current object.
L02479: continues a statement, function call, data value, or rendered content.
L02481: defines the year property in the current object.
L02482: continues a statement, function call, data value, or rendered content.
L02484: opens or closes the current JavaScript structure.
L02486: continues a statement, function call, data value, or rendered content.
L02488: opens or closes the current JavaScript structure.
L02490: opens or closes the current JavaScript structure.
L02493: declares the formatTime JavaScript value.
L02495: continues a statement, function call, data value, or rendered content.
L02497: defines or continues an arrow function.
L02499: continues a statement, function call, data value, or rendered content.
L02501: continues a statement, function call, data value, or rendered content.
L02503: continues a statement, function call, data value, or rendered content.
L02505: continues a statement, function call, data value, or rendered content.
L02507: continues a chained method call.
L02509: continues a chained method call.
L02512: declares the date JavaScript value.
L02515: continues a statement, function call, data value, or rendered content.
L02517: continues a statement, function call, data value, or rendered content.
L02519: continues a statement, function call, data value, or rendered content.
L02521: continues a statement, function call, data value, or rendered content.
L02523: continues a statement, function call, data value, or rendered content.
L02525: opens or closes the current JavaScript structure.
L02528: returns a value or exits the current function.
L02530: continues a statement, function call, data value, or rendered content.
L02532: opens or closes the current JavaScript structure.
L02534: defines the hour property in the current object.
L02535: continues a statement, function call, data value, or rendered content.
L02537: defines the minute property in the current object.
L02538: continues a statement, function call, data value, or rendered content.
L02540: opens or closes the current JavaScript structure.
L02542: continues a statement, function call, data value, or rendered content.
L02544: opens or closes the current JavaScript structure.
L02547: declares the createLocalDate JavaScript value.
L02549: continues a statement, function call, data value, or rendered content.
L02551: continues a statement, function call, data value, or rendered content.
L02553: defines or continues an arrow function.
L02555: returns a value or exits the current function.
L02557: continues a template string used to render interface content.
L02559: opens or closes the current JavaScript structure.
L02561: opens or closes the current JavaScript structure.
L02564: declares the formatICSDate JavaScript value.
L02566: continues a statement, function call, data value, or rendered content.
L02568: defines or continues an arrow function.
L02570: returns a value or exits the current function.
L02572: continues a chained method call.
L02574: continues a chained method call.
L02575: continues a statement, function call, data value, or rendered content.
L02576: continues a statement, function call, data value, or rendered content.
L02577: opens or closes the current JavaScript structure.
L02579: continues a chained method call.
L02580: continues a statement, function call, data value, or rendered content.
L02581: continues a statement, function call, data value, or rendered content.
L02582: opens or closes the current JavaScript structure.
L02584: opens or closes the current JavaScript structure.
L02587: continues JavaScript documentation for maintainers.
L02588: continues a statement, function call, data value, or rendered content.
L02589: continues JavaScript documentation for maintainers.
L02591: declares the toastRegion JavaScript value.
L02593: continues a statement, function call, data value, or rendered content.
L02595: opens or closes the current JavaScript structure.
L02598: declares the showToast JavaScript value.
L02600: continues a statement, function call, data value, or rendered content.
L02601: continues a statement, function call, data value, or rendered content.
L02603: continues a statement, function call, data value, or rendered content.
L02604: continues a statement, function call, data value, or rendered content.
L02606: continues a statement, function call, data value, or rendered content.
L02607: continues a statement, function call, data value, or rendered content.
L02609: continues a statement, function call, data value, or rendered content.
L02610: continues a statement, function call, data value, or rendered content.
L02612: defines or continues an arrow function.
L02614: starts a conditional branch.
L02616: continues a statement, function call, data value, or rendered content.
L02618: continues a statement, function call, data value, or rendered content.
L02620: returns a value or exits the current function.
L02622: opens or closes the current JavaScript structure.
L02625: declares the toast JavaScript value.
L02627: continues a statement, function call, data value, or rendered content.
L02629: opens or closes the current JavaScript structure.
L02632: continues a statement, function call, data value, or rendered content.
L02634: continues a template string used to render interface content.
L02637: continues a statement, function call, data value, or rendered content.
L02639: continues a statement, function call, data value, or rendered content.
L02641: continues a statement, function call, data value, or rendered content.
L02643: opens or closes the current JavaScript structure.
L02646: continues a template string used to render interface content.
L02648: continues a template string used to render interface content.
L02650: continues a template string used to render interface content.
L02652: continues a statement, function call, data value, or rendered content.
L02654: continues a template string used to render interface content.
L02656: continues a template string used to render interface content.
L02658: continues a statement, function call, data value, or rendered content.
L02660: continues a template string used to render interface content.
L02662: continues a template string used to render interface content.
L02664: continues a template string used to render interface content.
L02666: continues a statement, function call, data value, or rendered content.
L02668: continues a statement, function call, data value, or rendered content.
L02670: continues a statement, function call, data value, or rendered content.
L02672: continues a statement, function call, data value, or rendered content.
L02674: continues a template string used to render interface content.
L02676: continues a template string used to render interface content.
L02679: declares the removeToast JavaScript value.
L02681: continues a statement, function call, data value, or rendered content.
L02683: continues a statement, function call, data value, or rendered content.
L02686: continues a statement, function call, data value, or rendered content.
L02688: continues a statement, function call, data value, or rendered content.
L02691: interacts with the browser document or window.
L02693: defines or continues an arrow function.
L02695: continues a statement, function call, data value, or rendered content.
L02697: continues a statement, function call, data value, or rendered content.
L02699: continues a statement, function call, data value, or rendered content.
L02701: opens or closes the current JavaScript structure.
L02703: opens or closes the current JavaScript structure.
L02706: continues a statement, function call, data value, or rendered content.
L02708: continues a statement, function call, data value, or rendered content.
L02710: continues a statement, function call, data value, or rendered content.
L02712: continues a statement, function call, data value, or rendered content.
L02714: continues a statement, function call, data value, or rendered content.
L02716: continues a statement, function call, data value, or rendered content.
L02718: opens or closes the current JavaScript structure.
L02721: continues a statement, function call, data value, or rendered content.
L02723: continues a statement, function call, data value, or rendered content.
L02725: opens or closes the current JavaScript structure.
L02728: interacts with the browser document or window.
L02730: continues a statement, function call, data value, or rendered content.
L02732: continues a statement, function call, data value, or rendered content.
L02734: opens or closes the current JavaScript structure.
L02736: opens or closes the current JavaScript structure.
L02739: continues JavaScript documentation for maintainers.
L02740: continues a statement, function call, data value, or rendered content.
L02742: continues a statement, function call, data value, or rendered content.
L02743: continues a statement, function call, data value, or rendered content.
L02744: continues a statement, function call, data value, or rendered content.
L02745: continues JavaScript documentation for maintainers.
L02747: declares the mobileMenuButton JavaScript value.
L02749: continues a statement, function call, data value, or rendered content.
L02751: opens or closes the current JavaScript structure.
L02754: declares the mobileNav JavaScript value.
L02756: continues a statement, function call, data value, or rendered content.
L02758: opens or closes the current JavaScript structure.
L02761: declares the mobileNavClose JavaScript value.
L02763: continues a statement, function call, data value, or rendered content.
L02765: opens or closes the current JavaScript structure.
L02768: declares the mobileNavBackdrop JavaScript value.
L02770: continues a statement, function call, data value, or rendered content.
L02772: opens or closes the current JavaScript structure.
L02775: declares the mobileNavLastFocusedElement JavaScript value.
L02777: continues a statement, function call, data value, or rendered content.
L02780: declares the getMobileNavFocusableElements JavaScript value.
L02782: starts a conditional branch.
L02784: continues a statement, function call, data value, or rendered content.
L02786: continues a statement, function call, data value, or rendered content.
L02788: continues a statement, function call, data value, or rendered content.
L02790: returns a value or exits the current function.
L02792: opens or closes the current JavaScript structure.
L02795: returns a value or exits the current function.
L02797: continues a template string used to render interface content.
L02798: defines the button property in the current object.
L02799: defines the input property in the current object.
L02800: defines the select property in the current object.
L02801: defines the textarea property in the current object.
L02802: continues a statement, function call, data value, or rendered content.
L02804: continues a statement, function call, data value, or rendered content.
L02806: continues a statement, function call, data value, or rendered content.
L02808: defines or continues an arrow function.
L02810: continues a statement, function call, data value, or rendered content.
L02812: opens or closes the current JavaScript structure.
L02814: opens or closes the current JavaScript structure.
L02817: declares the finalizeClosedMobileNav JavaScript value.
L02819: continues a statement, function call, data value, or rendered content.
L02821: defines or continues an arrow function.
L02823: starts a conditional branch.
L02825: continues a statement, function call, data value, or rendered content.
L02827: continues a statement, function call, data value, or rendered content.
L02829: continues a statement, function call, data value, or rendered content.
L02831: returns a value or exits the current function.
L02833: opens or closes the current JavaScript structure.
L02836: continues a statement, function call, data value, or rendered content.
L02838: continues a statement, function call, data value, or rendered content.
L02840: opens or closes the current JavaScript structure.
L02843: continues a statement, function call, data value, or rendered content.
L02845: continues a statement, function call, data value, or rendered content.
L02847: opens or closes the current JavaScript structure.
L02850: continues a statement, function call, data value, or rendered content.
L02852: continues a statement, function call, data value, or rendered content.
L02855: continues a statement, function call, data value, or rendered content.
L02857: continues a statement, function call, data value, or rendered content.
L02859: continues a statement, function call, data value, or rendered content.
L02861: opens or closes the current JavaScript structure.
L02864: continues a statement, function call, data value, or rendered content.
L02866: continues a statement, function call, data value, or rendered content.
L02868: continues a statement, function call, data value, or rendered content.
L02870: opens or closes the current JavaScript structure.
L02873: continues a statement, function call, data value, or rendered content.
L02875: continues a statement, function call, data value, or rendered content.
L02878: interacts with the browser document or window.
L02880: continues a statement, function call, data value, or rendered content.
L02882: opens or closes the current JavaScript structure.
L02885: starts a conditional branch.
L02887: continues a statement, function call, data value, or rendered content.
L02889: continues a statement, function call, data value, or rendered content.
L02891: continues a statement, function call, data value, or rendered content.
L02893: continues a statement, function call, data value, or rendered content.
L02895: continues a statement, function call, data value, or rendered content.
L02897: opens or closes the current JavaScript structure.
L02899: opens or closes the current JavaScript structure.
L02902: declares the openMobileNav JavaScript value.
L02904: starts a conditional branch.
L02906: continues a statement, function call, data value, or rendered content.
L02908: continues a statement, function call, data value, or rendered content.
L02910: continues a statement, function call, data value, or rendered content.
L02912: continues a statement, function call, data value, or rendered content.
L02914: returns a value or exits the current function.
L02916: opens or closes the current JavaScript structure.
L02919: continues a statement, function call, data value, or rendered content.
L02921: interacts with the browser document or window.
L02924: continues a statement, function call, data value, or rendered content.
L02926: continues a statement, function call, data value, or rendered content.
L02928: continues a statement, function call, data value, or rendered content.
L02930: opens or closes the current JavaScript structure.
L02933: continues a statement, function call, data value, or rendered content.
L02935: continues a statement, function call, data value, or rendered content.
L02937: continues a statement, function call, data value, or rendered content.
L02939: opens or closes the current JavaScript structure.
L02942: continues a statement, function call, data value, or rendered content.
L02944: continues a statement, function call, data value, or rendered content.
L02946: continues a statement, function call, data value, or rendered content.
L02948: opens or closes the current JavaScript structure.
L02951: continues a statement, function call, data value, or rendered content.
L02953: continues a statement, function call, data value, or rendered content.
L02955: opens or closes the current JavaScript structure.
L02958: continues a statement, function call, data value, or rendered content.
L02960: continues a statement, function call, data value, or rendered content.
L02962: opens or closes the current JavaScript structure.
L02965: continues a statement, function call, data value, or rendered content.
L02967: continues a statement, function call, data value, or rendered content.
L02969: opens or closes the current JavaScript structure.
L02972: continues a statement, function call, data value, or rendered content.
L02974: continues a statement, function call, data value, or rendered content.
L02977: continues a statement, function call, data value, or rendered content.
L02979: continues a statement, function call, data value, or rendered content.
L02982: interacts with the browser document or window.
L02984: continues a statement, function call, data value, or rendered content.
L02986: opens or closes the current JavaScript structure.
L02989: interacts with the browser document or window.
L02991: defines or continues an arrow function.
L02993: continues a statement, function call, data value, or rendered content.
L02995: continues a statement, function call, data value, or rendered content.
L02997: continues a statement, function call, data value, or rendered content.
L02999: opens or closes the current JavaScript structure.
L03001: opens or closes the current JavaScript structure.
L03004: declares the closeMobileNav JavaScript value.
L03006: continues a statement, function call, data value, or rendered content.
L03008: defines or continues an arrow function.
L03010: starts a conditional branch.
L03012: continues a statement, function call, data value, or rendered content.
L03014: continues a statement, function call, data value, or rendered content.
L03016: returns a value or exits the current function.
L03018: opens or closes the current JavaScript structure.
L03021: continues a statement, function call, data value, or rendered content.
L03023: continues a statement, function call, data value, or rendered content.
L03025: continues a statement, function call, data value, or rendered content.
L03027: opens or closes the current JavaScript structure.
L03030: continues a statement, function call, data value, or rendered content.
L03032: continues a statement, function call, data value, or rendered content.
L03034: continues a statement, function call, data value, or rendered content.
L03036: opens or closes the current JavaScript structure.
L03039: continues a statement, function call, data value, or rendered content.
L03041: continues a statement, function call, data value, or rendered content.
L03043: opens or closes the current JavaScript structure.
L03045: opens or closes the current JavaScript structure.
L03048: declares the setMobileNavState JavaScript value.
L03050: continues a statement, function call, data value, or rendered content.
L03052: continues a statement, function call, data value, or rendered content.
L03054: defines or continues an arrow function.
L03056: starts a conditional branch.
L03058: continues a statement, function call, data value, or rendered content.
L03060: continues a statement, function call, data value, or rendered content.
L03062: continues a statement, function call, data value, or rendered content.
L03064: continues a statement, function call, data value, or rendered content.
L03066: continues a statement, function call, data value, or rendered content.
L03068: opens or closes the current JavaScript structure.
L03070: opens or closes the current JavaScript structure.
L03073: declares the synchronizeMobileNavForViewport JavaScript value.
L03075: starts a conditional branch.
L03077: interacts with the browser document or window.
L03079: continues a statement, function call, data value, or rendered content.
L03081: continues a statement, function call, data value, or rendered content.
L03083: returns a value or exits the current function.
L03085: opens or closes the current JavaScript structure.
L03088: declares the isOpen JavaScript value.
L03090: continues a statement, function call, data value, or rendered content.
L03092: continues a statement, function call, data value, or rendered content.
L03094: continues a statement, function call, data value, or rendered content.
L03097: starts a conditional branch.
L03099: continues a statement, function call, data value, or rendered content.
L03101: continues a statement, function call, data value, or rendered content.
L03103: continues a statement, function call, data value, or rendered content.
L03105: opens or closes the current JavaScript structure.
L03107: opens or closes the current JavaScript structure.
L03110: continues a statement, function call, data value, or rendered content.
L03112: continues a statement, function call, data value, or rendered content.
L03114: defines or continues an arrow function.
L03116: declares the isOpen JavaScript value.
L03118: continues a statement, function call, data value, or rendered content.
L03120: continues a statement, function call, data value, or rendered content.
L03122: continues a statement, function call, data value, or rendered content.
L03125: continues a statement, function call, data value, or rendered content.
L03127: continues a statement, function call, data value, or rendered content.
L03129: opens or closes the current JavaScript structure.
L03131: defines the restoreFocus property in the current object.
L03132: continues a statement, function call, data value, or rendered content.
L03134: opens or closes the current JavaScript structure.
L03136: opens or closes the current JavaScript structure.
L03138: opens or closes the current JavaScript structure.
L03140: opens or closes the current JavaScript structure.
L03143: continues a statement, function call, data value, or rendered content.
L03145: continues a statement, function call, data value, or rendered content.
L03147: defines or continues an arrow function.
L03149: defines the restoreFocus property in the current object.
L03150: continues a statement, function call, data value, or rendered content.
L03152: continues a statement, function call, data value, or rendered content.
L03154: opens or closes the current JavaScript structure.
L03157: continues a statement, function call, data value, or rendered content.
L03159: continues a statement, function call, data value, or rendered content.
L03161: defines or continues an arrow function.
L03163: defines the restoreFocus property in the current object.
L03164: continues a statement, function call, data value, or rendered content.
L03166: continues a statement, function call, data value, or rendered content.
L03168: opens or closes the current JavaScript structure.
L03171: continues a statement, function call, data value, or rendered content.
L03173: continues a statement, function call, data value, or rendered content.
L03175: continues a statement, function call, data value, or rendered content.
L03177: defines or continues an arrow function.
L03179: continues a statement, function call, data value, or rendered content.
L03181: continues a statement, function call, data value, or rendered content.
L03183: defines or continues an arrow function.
L03185: opens or closes the current JavaScript structure.
L03187: opens or closes the current JavaScript structure.
L03189: opens or closes the current JavaScript structure.
L03192: continues a statement, function call, data value, or rendered content.
L03194: continues a statement, function call, data value, or rendered content.
L03196: defines or continues an arrow function.
L03198: starts a conditional branch.
L03200: continues a statement, function call, data value, or rendered content.
L03202: continues a statement, function call, data value, or rendered content.
L03204: returns a value or exits the current function.
L03206: opens or closes the current JavaScript structure.
L03209: declares the focusableElements JavaScript value.
L03211: continues a statement, function call, data value, or rendered content.
L03214: starts a conditional branch.
L03216: continues a statement, function call, data value, or rendered content.
L03218: continues a statement, function call, data value, or rendered content.
L03220: returns a value or exits the current function.
L03222: opens or closes the current JavaScript structure.
L03225: declares the firstElement JavaScript value.
L03227: continues a statement, function call, data value, or rendered content.
L03230: declares the lastElement JavaScript value.
L03232: continues a statement, function call, data value, or rendered content.
L03234: continues a statement, function call, data value, or rendered content.
L03236: opens or closes the current JavaScript structure.
L03239: starts a conditional branch.
L03241: continues a statement, function call, data value, or rendered content.
L03243: continues a statement, function call, data value, or rendered content.
L03245: continues a statement, function call, data value, or rendered content.
L03247: continues a statement, function call, data value, or rendered content.
L03249: continues a statement, function call, data value, or rendered content.
L03251: continues a statement, function call, data value, or rendered content.
L03253: continues a statement, function call, data value, or rendered content.
L03255: continues a statement, function call, data value, or rendered content.
L03257: continues a statement, function call, data value, or rendered content.
L03259: continues a statement, function call, data value, or rendered content.
L03261: continues a statement, function call, data value, or rendered content.
L03263: opens or closes the current JavaScript structure.
L03265: opens or closes the current JavaScript structure.
L03267: opens or closes the current JavaScript structure.
L03270: interacts with the browser document or window.
L03272: continues a statement, function call, data value, or rendered content.
L03274: continues a statement, function call, data value, or rendered content.
L03276: opens or closes the current JavaScript structure.
L03279: interacts with the browser document or window.
L03281: continues a statement, function call, data value, or rendered content.
L03283: defines or continues an arrow function.
L03285: interacts with the browser document or window.
L03287: continues a statement, function call, data value, or rendered content.
L03289: continues a statement, function call, data value, or rendered content.
L03291: opens or closes the current JavaScript structure.
L03293: opens or closes the current JavaScript structure.
L03295: opens or closes the current JavaScript structure.
L03298: continues a statement, function call, data value, or rendered content.
L03301: continues JavaScript documentation for maintainers.
L03302: continues a statement, function call, data value, or rendered content.
L03303: continues JavaScript documentation for maintainers.
L03305: declares the exploreButton JavaScript value.
L03307: continues a statement, function call, data value, or rendered content.
L03309: opens or closes the current JavaScript structure.
L03312: declares the exploreMenu JavaScript value.
L03314: continues a statement, function call, data value, or rendered content.
L03316: opens or closes the current JavaScript structure.
L03319: declares the exploreDropdown JavaScript value.
L03321: continues a statement, function call, data value, or rendered content.
L03323: opens or closes the current JavaScript structure.
L03326: declares the setExploreMenuState JavaScript value.
L03328: continues a statement, function call, data value, or rendered content.
L03330: defines or continues an arrow function.
L03332: starts a conditional branch.
L03334: continues a statement, function call, data value, or rendered content.
L03336: continues a statement, function call, data value, or rendered content.
L03338: continues a statement, function call, data value, or rendered content.
L03340: returns a value or exits the current function.
L03342: opens or closes the current JavaScript structure.
L03345: continues a statement, function call, data value, or rendered content.
L03347: continues a statement, function call, data value, or rendered content.
L03349: continues a statement, function call, data value, or rendered content.
L03351: opens or closes the current JavaScript structure.
L03354: continues a statement, function call, data value, or rendered content.
L03356: continues a statement, function call, data value, or rendered content.
L03358: continues a statement, function call, data value, or rendered content.
L03360: opens or closes the current JavaScript structure.
L03362: opens or closes the current JavaScript structure.
L03365: continues a statement, function call, data value, or rendered content.
L03367: continues a statement, function call, data value, or rendered content.
L03369: defines or continues an arrow function.
L03371: continues a statement, function call, data value, or rendered content.
L03374: declares the isOpen JavaScript value.
L03376: continues a statement, function call, data value, or rendered content.
L03378: continues a statement, function call, data value, or rendered content.
L03380: continues a statement, function call, data value, or rendered content.
L03383: continues a statement, function call, data value, or rendered content.
L03385: continues a statement, function call, data value, or rendered content.
L03387: opens or closes the current JavaScript structure.
L03389: opens or closes the current JavaScript structure.
L03391: opens or closes the current JavaScript structure.
L03394: continues a statement, function call, data value, or rendered content.
L03396: continues a statement, function call, data value, or rendered content.
L03398: defines or continues an arrow function.
L03400: opens or closes the current JavaScript structure.
L03403: interacts with the browser document or window.
L03405: continues a statement, function call, data value, or rendered content.
L03407: defines or continues an arrow function.
L03409: starts a conditional branch.
L03411: continues a statement, function call, data value, or rendered content.
L03413: continues a statement, function call, data value, or rendered content.
L03415: continues a statement, function call, data value, or rendered content.
L03417: opens or closes the current JavaScript structure.
L03419: continues a statement, function call, data value, or rendered content.
L03421: continues a statement, function call, data value, or rendered content.
L03423: opens or closes the current JavaScript structure.
L03425: opens or closes the current JavaScript structure.
L03427: opens or closes the current JavaScript structure.
L03430: continues JavaScript documentation for maintainers.
L03431: continues a statement, function call, data value, or rendered content.
L03432: continues JavaScript documentation for maintainers.
L03434: declares the mainHeader JavaScript value.
L03436: continues a statement, function call, data value, or rendered content.
L03438: opens or closes the current JavaScript structure.
L03441: declares the backToTop JavaScript value.
L03443: continues a statement, function call, data value, or rendered content.
L03445: opens or closes the current JavaScript structure.
L03448: declares the desktopNavigationLinks JavaScript value.
L03450: continues a statement, function call, data value, or rendered content.
L03452: opens or closes the current JavaScript structure.
L03455: declares the updateHeaderScrollState JavaScript value.
L03457: declares the scrolled JavaScript value.
L03459: interacts with the browser document or window.
L03462: continues a statement, function call, data value, or rendered content.
L03464: continues a statement, function call, data value, or rendered content.
L03466: continues a statement, function call, data value, or rendered content.
L03468: opens or closes the current JavaScript structure.
L03471: continues a statement, function call, data value, or rendered content.
L03473: continues a statement, function call, data value, or rendered content.
L03475: interacts with the browser document or window.
L03477: opens or closes the current JavaScript structure.
L03479: opens or closes the current JavaScript structure.
L03482: interacts with the browser document or window.
L03484: continues a statement, function call, data value, or rendered content.
L03486: continues a statement, function call, data value, or rendered content.
L03488: opens or closes the current JavaScript structure.
L03490: defines the passive property in the current object.
L03491: continues a statement, function call, data value, or rendered content.
L03493: opens or closes the current JavaScript structure.
L03495: opens or closes the current JavaScript structure.
L03498: continues a statement, function call, data value, or rendered content.
L03502: continues JavaScript documentation for maintainers.
L03503: continues a statement, function call, data value, or rendered content.
L03505: continues a statement, function call, data value, or rendered content.
L03506: continues a statement, function call, data value, or rendered content.
L03507: continues JavaScript documentation for maintainers.
L03509: continues a statement, function call, data value, or rendered content.
L03511: continues a statement, function call, data value, or rendered content.
L03513: defines or continues an arrow function.
L03515: interacts with the browser document or window.
L03517: defines the top property in the current object.
L03518: continues a statement, function call, data value, or rendered content.
L03520: defines the behavior property in the current object.
L03521: continues a statement, function call, data value, or rendered content.
L03523: continues a statement, function call, data value, or rendered content.
L03525: continues a statement, function call, data value, or rendered content.
L03527: continues a statement, function call, data value, or rendered content.
L03529: opens or closes the current JavaScript structure.
L03531: opens or closes the current JavaScript structure.
L03534: continues JavaScript documentation for maintainers.
L03535: continues a statement, function call, data value, or rendered content.
L03537: continues a statement, function call, data value, or rendered content.
L03538: continues JavaScript documentation for maintainers.
L03540: declares the scrollToElement JavaScript value.
L03542: continues a statement, function call, data value, or rendered content.
L03544: defines or continues an arrow function.
L03546: starts a conditional branch.
L03548: continues a statement, function call, data value, or rendered content.
L03550: continues a statement, function call, data value, or rendered content.
L03552: returns a value or exits the current function.
L03554: opens or closes the current JavaScript structure.
L03557: continues a statement, function call, data value, or rendered content.
L03559: defines the behavior property in the current object.
L03561: continues a statement, function call, data value, or rendered content.
L03563: continues a statement, function call, data value, or rendered content.
L03565: continues a statement, function call, data value, or rendered content.
L03567: defines the block property in the current object.
L03568: continues a statement, function call, data value, or rendered content.
L03570: continues a statement, function call, data value, or rendered content.
L03572: opens or closes the current JavaScript structure.
L03574: continues JavaScript documentation for maintainers.
L03575: continues a statement, function call, data value, or rendered content.
L03576: continues JavaScript documentation for maintainers.
L03578: declares the rotatingWord JavaScript value.
L03580: continues a statement, function call, data value, or rendered content.
L03582: opens or closes the current JavaScript structure.
L03585: declares the rotatingWordIndex JavaScript value.
L03587: continues a statement, function call, data value, or rendered content.
L03590: declares the rotatingWordTimer JavaScript value.
L03592: continues a statement, function call, data value, or rendered content.
L03595: declares the rotateHeroWord JavaScript value.
L03597: starts a conditional branch.
L03599: continues a statement, function call, data value, or rendered content.
L03601: continues a statement, function call, data value, or rendered content.
L03603: continues a statement, function call, data value, or rendered content.
L03605: returns a value or exits the current function.
L03607: opens or closes the current JavaScript structure.
L03610: continues a statement, function call, data value, or rendered content.
L03612: continues a statement, function call, data value, or rendered content.
L03614: opens or closes the current JavaScript structure.
L03617: interacts with the browser document or window.
L03619: defines or continues an arrow function.
L03621: continues a statement, function call, data value, or rendered content.
L03623: continues a statement, function call, data value, or rendered content.
L03625: continues a statement, function call, data value, or rendered content.
L03627: continues a statement, function call, data value, or rendered content.
L03630: continues a statement, function call, data value, or rendered content.
L03632: continues a statement, function call, data value, or rendered content.
L03635: continues a statement, function call, data value, or rendered content.
L03637: continues a statement, function call, data value, or rendered content.
L03639: opens or closes the current JavaScript structure.
L03641: continues a statement, function call, data value, or rendered content.
L03643: continues a statement, function call, data value, or rendered content.
L03645: opens or closes the current JavaScript structure.
L03647: opens or closes the current JavaScript structure.
L03650: starts a conditional branch.
L03652: continues a statement, function call, data value, or rendered content.
L03654: continues a statement, function call, data value, or rendered content.
L03656: continues a statement, function call, data value, or rendered content.
L03658: continues a statement, function call, data value, or rendered content.
L03660: continues a statement, function call, data value, or rendered content.
L03662: continues a statement, function call, data value, or rendered content.
L03664: opens or closes the current JavaScript structure.
L03666: opens or closes the current JavaScript structure.
L03669: continues JavaScript documentation for maintainers.
L03670: continues a statement, function call, data value, or rendered content.
L03671: continues JavaScript documentation for maintainers.
L03673: declares the communityPuzzle JavaScript value.
L03675: continues a statement, function call, data value, or rendered content.
L03677: opens or closes the current JavaScript structure.
L03680: declares the supportsHover JavaScript value.
L03682: continues a statement, function call, data value, or rendered content.
L03684: continues a statement, function call, data value, or rendered content.
L03687: starts a conditional branch.
L03689: continues a statement, function call, data value, or rendered content.
L03691: continues a statement, function call, data value, or rendered content.
L03693: continues a statement, function call, data value, or rendered content.
L03695: continues a statement, function call, data value, or rendered content.
L03697: continues a statement, function call, data value, or rendered content.
L03699: continues a statement, function call, data value, or rendered content.
L03701: defines or continues an arrow function.
L03703: declares the bounds JavaScript value.
L03705: continues a statement, function call, data value, or rendered content.
L03708: declares the x JavaScript value.
L03710: continues a statement, function call, data value, or rendered content.
L03712: continues a statement, function call, data value, or rendered content.
L03714: continues a statement, function call, data value, or rendered content.
L03716: opens or closes the current JavaScript structure.
L03718: continues a statement, function call, data value, or rendered content.
L03720: continues a statement, function call, data value, or rendered content.
L03723: declares the y JavaScript value.
L03725: continues a statement, function call, data value, or rendered content.
L03727: continues a statement, function call, data value, or rendered content.
L03729: continues a statement, function call, data value, or rendered content.
L03731: opens or closes the current JavaScript structure.
L03733: continues a statement, function call, data value, or rendered content.
L03735: continues a statement, function call, data value, or rendered content.
L03738: continues a template string used to render interface content.
L03740: continues a statement, function call, data value, or rendered content.
L03742: continues a statement, function call, data value, or rendered content.
L03744: continues a template string used to render interface content.
L03746: opens or closes the current JavaScript structure.
L03748: opens or closes the current JavaScript structure.
L03751: continues a statement, function call, data value, or rendered content.
L03753: continues a statement, function call, data value, or rendered content.
L03755: defines or continues an arrow function.
L03757: continues a statement, function call, data value, or rendered content.
L03759: continues a statement, function call, data value, or rendered content.
L03761: opens or closes the current JavaScript structure.
L03763: opens or closes the current JavaScript structure.
L03765: opens or closes the current JavaScript structure.
L03768: continues JavaScript documentation for maintainers.
L03769: continues a statement, function call, data value, or rendered content.
L03770: continues JavaScript documentation for maintainers.
L03772: declares the revealElements JavaScript value.
L03774: continues a statement, function call, data value, or rendered content.
L03776: opens or closes the current JavaScript structure.
L03779: starts a conditional branch.
L03781: continues a statement, function call, data value, or rendered content.
L03783: continues a statement, function call, data value, or rendered content.
L03785: continues a statement, function call, data value, or rendered content.
L03787: defines or continues an arrow function.
L03789: continues a statement, function call, data value, or rendered content.
L03791: continues a statement, function call, data value, or rendered content.
L03793: opens or closes the current JavaScript structure.
L03795: opens or closes the current JavaScript structure.
L03797: continues a statement, function call, data value, or rendered content.
L03799: declares the revealObserver JavaScript value.
L03801: continues a statement, function call, data value, or rendered content.
L03803: continues a statement, function call, data value, or rendered content.
L03805: continues a statement, function call, data value, or rendered content.
L03807: defines or continues an arrow function.
L03809: continues a statement, function call, data value, or rendered content.
L03811: defines or continues an arrow function.
L03813: starts a conditional branch.
L03815: continues a statement, function call, data value, or rendered content.
L03817: continues a statement, function call, data value, or rendered content.
L03819: continues a statement, function call, data value, or rendered content.
L03821: continues a statement, function call, data value, or rendered content.
L03823: opens or closes the current JavaScript structure.
L03826: continues a statement, function call, data value, or rendered content.
L03828: continues a statement, function call, data value, or rendered content.
L03830: opens or closes the current JavaScript structure.
L03832: opens or closes the current JavaScript structure.
L03834: opens or closes the current JavaScript structure.
L03836: opens or closes the current JavaScript structure.
L03838: continues a statement, function call, data value, or rendered content.
L03840: opens or closes the current JavaScript structure.
L03842: defines the rootMargin property in the current object.
L03843: continues a statement, function call, data value, or rendered content.
L03845: defines the threshold property in the current object.
L03846: continues a statement, function call, data value, or rendered content.
L03848: opens or closes the current JavaScript structure.
L03850: opens or closes the current JavaScript structure.
L03853: continues a statement, function call, data value, or rendered content.
L03855: defines or continues an arrow function.
L03857: continues a statement, function call, data value, or rendered content.
L03859: continues a statement, function call, data value, or rendered content.
L03861: opens or closes the current JavaScript structure.
L03863: opens or closes the current JavaScript structure.
L03865: opens or closes the current JavaScript structure.
L03868: continues JavaScript documentation for maintainers.
L03869: continues a statement, function call, data value, or rendered content.
L03870: continues JavaScript documentation for maintainers.
L03872: declares the hubTabs JavaScript value.
L03874: continues a statement, function call, data value, or rendered content.
L03876: opens or closes the current JavaScript structure.
L03879: declares the hubPanels JavaScript value.
L03881: continues a statement, function call, data value, or rendered content.
L03883: opens or closes the current JavaScript structure.
L03886: declares the activeHubTabName JavaScript value.
L03888: continues a statement, function call, data value, or rendered content.
L03891: declares the activateHubTab function.
L03893: continues a statement, function call, data value, or rendered content.
L03895: continues a statement, function call, data value, or rendered content.
L03897: continues a statement, function call, data value, or rendered content.
L03899: continues a statement, function call, data value, or rendered content.
L03901: continues a statement, function call, data value, or rendered content.
L03904: continues a statement, function call, data value, or rendered content.
L03906: defines or continues an arrow function.
L03908: declares the active JavaScript value.
L03910: continues a statement, function call, data value, or rendered content.
L03912: continues a statement, function call, data value, or rendered content.
L03915: continues a statement, function call, data value, or rendered content.
L03917: continues a statement, function call, data value, or rendered content.
L03919: continues a statement, function call, data value, or rendered content.
L03921: opens or closes the current JavaScript structure.
L03924: continues a statement, function call, data value, or rendered content.
L03926: continues a statement, function call, data value, or rendered content.
L03928: continues a statement, function call, data value, or rendered content.
L03930: opens or closes the current JavaScript structure.
L03933: starts a conditional branch.
L03935: continues a statement, function call, data value, or rendered content.
L03937: continues a statement, function call, data value, or rendered content.
L03939: continues a statement, function call, data value, or rendered content.
L03941: continues a statement, function call, data value, or rendered content.
L03943: opens or closes the current JavaScript structure.
L03945: opens or closes the current JavaScript structure.
L03947: opens or closes the current JavaScript structure.
L03950: continues a statement, function call, data value, or rendered content.
L03952: defines or continues an arrow function.
L03954: declares the active JavaScript value.
L03956: continues a statement, function call, data value, or rendered content.
L03958: continues a statement, function call, data value, or rendered content.
L03961: continues a statement, function call, data value, or rendered content.
L03963: continues a statement, function call, data value, or rendered content.
L03965: continues a statement, function call, data value, or rendered content.
L03967: opens or closes the current JavaScript structure.
L03970: continues a statement, function call, data value, or rendered content.
L03972: continues a statement, function call, data value, or rendered content.
L03974: opens or closes the current JavaScript structure.
L03976: opens or closes the current JavaScript structure.
L03979: continues a statement, function call, data value, or rendered content.
L03981: defines or continues an arrow function.
L03983: declares the linkHash JavaScript value.
L03985: continues a statement, function call, data value, or rendered content.
L03987: continues a statement, function call, data value, or rendered content.
L03989: continues a statement, function call, data value, or rendered content.
L03992: starts a conditional branch.
L03994: continues a statement, function call, data value, or rendered content.
L03996: continues a statement, function call, data value, or rendered content.
L03998: continues a statement, function call, data value, or rendered content.
L04000: continues a statement, function call, data value, or rendered content.
L04002: continues a statement, function call, data value, or rendered content.
L04004: opens or closes the current JavaScript structure.
L04006: continues a statement, function call, data value, or rendered content.
L04008: interacts with the browser document or window.
L04010: continues a statement, function call, data value, or rendered content.
L04011: continues a statement, function call, data value, or rendered content.
L04012: continues a chained method call.
L04014: continues a statement, function call, data value, or rendered content.
L04016: starts a conditional branch.
L04018: continues a statement, function call, data value, or rendered content.
L04020: continues a statement, function call, data value, or rendered content.
L04022: continues a statement, function call, data value, or rendered content.
L04024: continues a statement, function call, data value, or rendered content.
L04026: continues a statement, function call, data value, or rendered content.
L04028: continues a statement, function call, data value, or rendered content.
L04030: opens or closes the current JavaScript structure.
L04032: opens or closes the current JavaScript structure.
L04034: opens or closes the current JavaScript structure.
L04036: opens or closes the current JavaScript structure.
L04038: opens or closes the current JavaScript structure.
L04040: opens or closes the current JavaScript structure.
L04043: continues a statement, function call, data value, or rendered content.
L04045: continues a statement, function call, data value, or rendered content.
L04047: continues a statement, function call, data value, or rendered content.
L04049: continues a statement, function call, data value, or rendered content.
L04051: defines or continues an arrow function.
L04053: continues a statement, function call, data value, or rendered content.
L04055: continues a statement, function call, data value, or rendered content.
L04057: defines or continues an arrow function.
L04059: continues a statement, function call, data value, or rendered content.
L04061: opens or closes the current JavaScript structure.
L04063: opens or closes the current JavaScript structure.
L04066: continues a statement, function call, data value, or rendered content.
L04068: continues a statement, function call, data value, or rendered content.
L04070: defines or continues an arrow function.
L04072: starts a conditional branch.
L04074: continues a statement, function call, data value, or rendered content.
L04076: continues a statement, function call, data value, or rendered content.
L04078: continues a statement, function call, data value, or rendered content.
L04080: continues a statement, function call, data value, or rendered content.
L04082: continues a statement, function call, data value, or rendered content.
L04084: continues a statement, function call, data value, or rendered content.
L04086: continues a statement, function call, data value, or rendered content.
L04088: returns a value or exits the current function.
L04090: opens or closes the current JavaScript structure.
L04093: continues a statement, function call, data value, or rendered content.
L04096: declares the targetIndex JavaScript value.
L04098: continues a statement, function call, data value, or rendered content.
L04101: starts a conditional branch.
L04103: continues a statement, function call, data value, or rendered content.
L04105: continues a statement, function call, data value, or rendered content.
L04107: continues a statement, function call, data value, or rendered content.
L04109: continues a statement, function call, data value, or rendered content.
L04111: continues a statement, function call, data value, or rendered content.
L04113: continues a statement, function call, data value, or rendered content.
L04115: opens or closes the current JavaScript structure.
L04117: continues a statement, function call, data value, or rendered content.
L04119: opens or closes the current JavaScript structure.
L04122: starts a conditional branch.
L04124: continues a statement, function call, data value, or rendered content.
L04126: continues a statement, function call, data value, or rendered content.
L04128: continues a statement, function call, data value, or rendered content.
L04130: continues a statement, function call, data value, or rendered content.
L04132: continues a statement, function call, data value, or rendered content.
L04134: opens or closes the current JavaScript structure.
L04136: continues a statement, function call, data value, or rendered content.
L04138: opens or closes the current JavaScript structure.
L04141: starts a conditional branch.
L04143: continues a statement, function call, data value, or rendered content.
L04145: continues a statement, function call, data value, or rendered content.
L04147: continues a statement, function call, data value, or rendered content.
L04149: continues a statement, function call, data value, or rendered content.
L04151: opens or closes the current JavaScript structure.
L04154: starts a conditional branch.
L04156: continues a statement, function call, data value, or rendered content.
L04158: continues a statement, function call, data value, or rendered content.
L04160: continues a statement, function call, data value, or rendered content.
L04162: continues a statement, function call, data value, or rendered content.
L04164: opens or closes the current JavaScript structure.
L04167: continues a statement, function call, data value, or rendered content.
L04169: continues a statement, function call, data value, or rendered content.
L04170: continues a chained method call.
L04171: continues a chained method call.
L04173: continues a statement, function call, data value, or rendered content.
L04175: opens or closes the current JavaScript structure.
L04177: opens or closes the current JavaScript structure.
L04179: opens or closes the current JavaScript structure.
L04181: opens or closes the current JavaScript structure.
L04183: opens or closes the current JavaScript structure.
L04186: continues JavaScript documentation for maintainers.
L04187: continues a statement, function call, data value, or rendered content.
L04188: continues JavaScript documentation for maintainers.
L04190: declares the featuredUpdateContainer JavaScript value.
L04192: continues a statement, function call, data value, or rendered content.
L04194: opens or closes the current JavaScript structure.
L04197: declares the weeklyUpdatesGrid JavaScript value.
L04199: continues a statement, function call, data value, or rendered content.
L04201: opens or closes the current JavaScript structure.
L04204: declares the lastUpdatedText JavaScript value.
L04206: continues a statement, function call, data value, or rendered content.
L04208: opens or closes the current JavaScript structure.
L04211: declares the renderWeeklyUpdates JavaScript value.
L04213: starts a conditional branch.
L04215: continues a statement, function call, data value, or rendered content.
L04217: continues a statement, function call, data value, or rendered content.
L04219: continues a statement, function call, data value, or rendered content.
L04221: returns a value or exits the current function.
L04223: opens or closes the current JavaScript structure.
L04226: declares the featuredUpdate JavaScript value.
L04228: continues a statement, function call, data value, or rendered content.
L04230: defines or continues an arrow function.
L04232: opens or closes the current JavaScript structure.
L04234: continues a statement, function call, data value, or rendered content.
L04237: declares the secondaryUpdates JavaScript value.
L04239: continues a statement, function call, data value, or rendered content.
L04241: defines or continues an arrow function.
L04243: continues a statement, function call, data value, or rendered content.
L04245: continues a statement, function call, data value, or rendered content.
L04247: opens or closes the current JavaScript structure.
L04250: continues a template string used to render interface content.
L04252: continues a template string used to render interface content.
L04254: continues a template string used to render interface content.
L04256: continues a template string used to render interface content.
L04258: continues a template string used to render interface content.
L04260: continues a statement, function call, data value, or rendered content.
L04262: continues a statement, function call, data value, or rendered content.
L04264: continues a statement, function call, data value, or rendered content.
L04266: continues a statement, function call, data value, or rendered content.
L04268: continues a template string used to render interface content.
L04270: continues a template string used to render interface content.
L04272: continues a statement, function call, data value, or rendered content.
L04274: continues a template string used to render interface content.
L04276: continues a template string used to render interface content.
L04278: continues a statement, function call, data value, or rendered content.
L04280: continues a template string used to render interface content.
L04282: continues a template string used to render interface content.
L04284: continues a template string used to render interface content.
L04286: continues a template string used to render interface content.
L04288: continues a template string used to render interface content.
L04290: continues a template string used to render interface content.
L04292: continues a template string used to render interface content.
L04294: continues a statement, function call, data value, or rendered content.
L04296: continues a template string used to render interface content.
L04298: continues a template string used to render interface content.
L04300: continues a template string used to render interface content.
L04302: continues a template string used to render interface content.
L04304: continues a template string used to render interface content.
L04306: continues a statement, function call, data value, or rendered content.
L04308: continues a template string used to render interface content.
L04310: continues a template string used to render interface content.
L04312: continues a statement, function call, data value, or rendered content.
L04314: continues a statement, function call, data value, or rendered content.
L04316: continues a statement, function call, data value, or rendered content.
L04318: continues a statement, function call, data value, or rendered content.
L04320: continues a statement, function call, data value, or rendered content.
L04322: continues a template string used to render interface content.
L04324: continues a template string used to render interface content.
L04326: continues a template string used to render interface content.
L04328: continues a template string used to render interface content.
L04331: continues a statement, function call, data value, or rendered content.
L04333: continues a chained method call.
L04335: defines or continues an arrow function.
L04337: continues a template string used to render interface content.
L04339: continues a template string used to render interface content.
L04341: continues a template string used to render interface content.
L04343: continues a statement, function call, data value, or rendered content.
L04345: continues a template string used to render interface content.
L04347: continues a template string used to render interface content.
L04349: continues a statement, function call, data value, or rendered content.
L04351: continues a template string used to render interface content.
L04353: continues a template string used to render interface content.
L04355: continues a template string used to render interface content.
L04357: continues a statement, function call, data value, or rendered content.
L04359: continues a template string used to render interface content.
L04361: continues a template string used to render interface content.
L04363: continues a statement, function call, data value, or rendered content.
L04365: continues a template string used to render interface content.
L04367: continues a template string used to render interface content.
L04369: continues a statement, function call, data value, or rendered content.
L04371: continues a statement, function call, data value, or rendered content.
L04373: continues a statement, function call, data value, or rendered content.
L04375: continues a statement, function call, data value, or rendered content.
L04377: continues a statement, function call, data value, or rendered content.
L04379: continues a template string used to render interface content.
L04381: continues a template string used to render interface content.
L04383: continues a template string used to render interface content.
L04385: opens or closes the current JavaScript structure.
L04387: continues a chained method call.
L04390: declares the latestLabel JavaScript value.
L04392: continues a statement, function call, data value, or rendered content.
L04394: continues a statement, function call, data value, or rendered content.
L04397: starts a conditional branch.
L04399: continues a statement, function call, data value, or rendered content.
L04401: continues a statement, function call, data value, or rendered content.
L04403: continues a statement, function call, data value, or rendered content.
L04405: continues a statement, function call, data value, or rendered content.
L04407: opens or closes the current JavaScript structure.
L04409: opens or closes the current JavaScript structure.
L04412: continues JavaScript documentation for maintainers.
L04413: continues a statement, function call, data value, or rendered content.
L04414: continues JavaScript documentation for maintainers.
L04416: declares the weeklyScheduleList JavaScript value.
L04418: continues a statement, function call, data value, or rendered content.
L04420: opens or closes the current JavaScript structure.
L04423: declares the printScheduleButton JavaScript value.
L04425: continues a statement, function call, data value, or rendered content.
L04427: opens or closes the current JavaScript structure.
L04430: declares the renderWeeklySchedule JavaScript value.
L04432: starts a conditional branch.
L04434: continues a statement, function call, data value, or rendered content.
L04436: continues a statement, function call, data value, or rendered content.
L04438: returns a value or exits the current function.
L04440: opens or closes the current JavaScript structure.
L04443: continues a statement, function call, data value, or rendered content.
L04445: continues a chained method call.
L04447: defines or continues an arrow function.
L04449: continues a template string used to render interface content.
L04451: continues a template string used to render interface content.
L04453: continues a template string used to render interface content.
L04455: continues a template string used to render interface content.
L04457: continues a template string used to render interface content.
L04459: continues a statement, function call, data value, or rendered content.
L04461: continues a template string used to render interface content.
L04463: continues a template string used to render interface content.
L04465: continues a statement, function call, data value, or rendered content.
L04467: continues a template string used to render interface content.
L04469: continues a template string used to render interface content.
L04471: continues a template string used to render interface content.
L04473: continues a statement, function call, data value, or rendered content.
L04475: continues a template string used to render interface content.
L04477: continues a template string used to render interface content.
L04479: continues a statement, function call, data value, or rendered content.
L04481: continues a template string used to render interface content.
L04483: continues a template string used to render interface content.
L04485: continues a template string used to render interface content.
L04487: continues a statement, function call, data value, or rendered content.
L04489: continues a template string used to render interface content.
L04491: continues a template string used to render interface content.
L04493: continues a template string used to render interface content.
L04495: opens or closes the current JavaScript structure.
L04497: continues a chained method call.
L04499: opens or closes the current JavaScript structure.
L04502: continues a statement, function call, data value, or rendered content.
L04504: continues a statement, function call, data value, or rendered content.
L04506: defines or continues an arrow function.
L04508: continues a statement, function call, data value, or rendered content.
L04510: continues a statement, function call, data value, or rendered content.
L04512: opens or closes the current JavaScript structure.
L04515: interacts with the browser document or window.
L04517: defines or continues an arrow function.
L04519: continues a statement, function call, data value, or rendered content.
L04521: opens or closes the current JavaScript structure.
L04523: opens or closes the current JavaScript structure.
L04525: opens or closes the current JavaScript structure.
L04528: continues JavaScript documentation for maintainers.
L04529: continues a statement, function call, data value, or rendered content.
L04530: continues JavaScript documentation for maintainers.
L04532: declares the upcomingEventsGrid JavaScript value.
L04534: continues a statement, function call, data value, or rendered content.
L04536: opens or closes the current JavaScript structure.
L04539: declares the eventFilterButtons JavaScript value.
L04541: continues a statement, function call, data value, or rendered content.
L04543: opens or closes the current JavaScript structure.
L04546: declares the activeEventFilter JavaScript value.
L04548: continues a statement, function call, data value, or rendered content.
L04551: declares the renderUpcomingEvents JavaScript value.
L04553: continues a statement, function call, data value, or rendered content.
L04555: defines or continues an arrow function.
L04557: starts a conditional branch.
L04559: continues a statement, function call, data value, or rendered content.
L04561: continues a statement, function call, data value, or rendered content.
L04563: returns a value or exits the current function.
L04565: opens or closes the current JavaScript structure.
L04568: declares the filteredEvents JavaScript value.
L04570: defines or continues an arrow function.
L04572: starts a conditional branch.
L04574: continues a statement, function call, data value, or rendered content.
L04576: continues a statement, function call, data value, or rendered content.
L04578: returns a value or exits the current function.
L04580: opens or closes the current JavaScript structure.
L04583: starts a conditional branch.
L04585: continues a statement, function call, data value, or rendered content.
L04587: continues a statement, function call, data value, or rendered content.
L04589: returns a value or exits the current function.
L04591: opens or closes the current JavaScript structure.
L04594: returns a value or exits the current function.
L04596: opens or closes the current JavaScript structure.
L04598: opens or closes the current JavaScript structure.
L04601: starts a conditional branch.
L04603: continues a statement, function call, data value, or rendered content.
L04605: continues a statement, function call, data value, or rendered content.
L04607: continues a template string used to render interface content.
L04609: continues a template string used to render interface content.
L04611: continues a template string used to render interface content.
L04613: continues a statement, function call, data value, or rendered content.
L04615: continues a template string used to render interface content.
L04617: continues a template string used to render interface content.
L04619: continues a statement, function call, data value, or rendered content.
L04620: continues a statement, function call, data value, or rendered content.
L04622: continues a template string used to render interface content.
L04624: continues a template string used to render interface content.
L04626: continues a template string used to render interface content.
L04629: returns a value or exits the current function.
L04631: opens or closes the current JavaScript structure.
L04634: continues a statement, function call, data value, or rendered content.
L04636: continues a chained method call.
L04638: defines or continues an arrow function.
L04640: declares the isPrivate JavaScript value.
L04642: continues a statement, function call, data value, or rendered content.
L04645: declares the date JavaScript value.
L04647: continues a statement, function call, data value, or rendered content.
L04649: continues a statement, function call, data value, or rendered content.
L04651: defines the day property in the current object.
L04652: continues a statement, function call, data value, or rendered content.
L04654: defines the month property in the current object.
L04655: continues a statement, function call, data value, or rendered content.
L04657: defines the long property in the current object.
L04658: continues a statement, function call, data value, or rendered content.
L04660: opens or closes the current JavaScript structure.
L04662: continues a statement, function call, data value, or rendered content.
L04664: continues a statement, function call, data value, or rendered content.
L04666: opens or closes the current JavaScript structure.
L04669: declares the timeLabel JavaScript value.
L04671: continues a statement, function call, data value, or rendered content.
L04673: continues a statement, function call, data value, or rendered content.
L04675: continues a statement, function call, data value, or rendered content.
L04678: declares the locationLabel JavaScript value.
L04680: continues a statement, function call, data value, or rendered content.
L04682: continues a statement, function call, data value, or rendered content.
L04684: continues a statement, function call, data value, or rendered content.
L04687: returns a value or exits the current function.
L04689: continues a template string used to render interface content.
L04691: continues a statement, function call, data value, or rendered content.
L04693: continues a statement, function call, data value, or rendered content.
L04695: continues a statement, function call, data value, or rendered content.
L04697: continues a template string used to render interface content.
L04699: continues a template string used to render interface content.
L04701: continues a statement, function call, data value, or rendered content.
L04703: continues a template string used to render interface content.
L04705: continues a template string used to render interface content.
L04707: continues a statement, function call, data value, or rendered content.
L04709: continues a template string used to render interface content.
L04711: continues a template string used to render interface content.
L04713: continues a template string used to render interface content.
L04715: continues a statement, function call, data value, or rendered content.
L04717: continues a template string used to render interface content.
L04719: continues a template string used to render interface content.
L04721: continues a statement, function call, data value, or rendered content.
L04723: continues a template string used to render interface content.
L04725: continues a template string used to render interface content.
L04727: continues a statement, function call, data value, or rendered content.
L04729: continues a template string used to render interface content.
L04731: continues a template string used to render interface content.
L04733: continues a template string used to render interface content.
L04735: continues a template string used to render interface content.
L04737: continues a template string used to render interface content.
L04739: continues a template string used to render interface content.
L04741: continues a statement, function call, data value, or rendered content.
L04743: continues a template string used to render interface content.
L04745: continues a template string used to render interface content.
L04747: continues a template string used to render interface content.
L04749: continues a template string used to render interface content.
L04751: continues a template string used to render interface content.
L04753: continues a statement, function call, data value, or rendered content.
L04755: continues a template string used to render interface content.
L04757: continues a template string used to render interface content.
L04759: continues a template string used to render interface content.
L04761: continues a template string used to render interface content.
L04763: continues a template string used to render interface content.
L04765: continues a statement, function call, data value, or rendered content.
L04767: continues a template string used to render interface content.
L04769: continues a template string used to render interface content.
L04771: continues a template string used to render interface content.
L04773: continues a template string used to render interface content.
L04775: continues a statement, function call, data value, or rendered content.
L04777: continues a statement, function call, data value, or rendered content.
L04779: continues a statement, function call, data value, or rendered content.
L04781: continues a statement, function call, data value, or rendered content.
L04783: continues a template string used to render interface content.
L04785: continues a template string used to render interface content.
L04787: continues a statement, function call, data value, or rendered content.
L04789: continues a statement, function call, data value, or rendered content.
L04791: continues a statement, function call, data value, or rendered content.
L04793: continues a statement, function call, data value, or rendered content.
L04795: continues a statement, function call, data value, or rendered content.
L04797: continues a template string used to render interface content.
L04799: continues a template string used to render interface content.
L04801: continues a template string used to render interface content.
L04803: continues a template string used to render interface content.
L04805: opens or closes the current JavaScript structure.
L04807: opens or closes the current JavaScript structure.
L04809: continues a chained method call.
L04811: opens or closes the current JavaScript structure.
L04814: continues a statement, function call, data value, or rendered content.
L04816: defines or continues an arrow function.
L04818: continues a statement, function call, data value, or rendered content.
L04820: continues a statement, function call, data value, or rendered content.
L04822: defines or continues an arrow function.
L04824: continues a statement, function call, data value, or rendered content.
L04826: continues a statement, function call, data value, or rendered content.
L04829: continues a statement, function call, data value, or rendered content.
L04831: defines or continues an arrow function.
L04833: continues a statement, function call, data value, or rendered content.
L04835: continues a statement, function call, data value, or rendered content.
L04837: continues a statement, function call, data value, or rendered content.
L04839: opens or closes the current JavaScript structure.
L04841: opens or closes the current JavaScript structure.
L04843: opens or closes the current JavaScript structure.
L04846: continues a statement, function call, data value, or rendered content.
L04848: continues a statement, function call, data value, or rendered content.
L04850: opens or closes the current JavaScript structure.
L04852: opens or closes the current JavaScript structure.
L04854: opens or closes the current JavaScript structure.
L04856: opens or closes the current JavaScript structure.
L04858: opens or closes the current JavaScript structure.
L04861: continues JavaScript documentation for maintainers.
L04862: continues a statement, function call, data value, or rendered content.
L04863: continues JavaScript documentation for maintainers.
L04865: declares the downloadCalendarEvent JavaScript value.
L04867: continues a statement, function call, data value, or rendered content.
L04869: defines or continues an arrow function.
L04871: starts a conditional branch.
L04873: continues a statement, function call, data value, or rendered content.
L04875: continues a statement, function call, data value, or rendered content.
L04877: continues a statement, function call, data value, or rendered content.
L04879: continues a statement, function call, data value, or rendered content.
L04881: opens or closes the current JavaScript structure.
L04884: returns a value or exits the current function.
L04886: opens or closes the current JavaScript structure.
L04889: declares the startDate JavaScript value.
L04891: continues a statement, function call, data value, or rendered content.
L04893: continues a statement, function call, data value, or rendered content.
L04895: opens or closes the current JavaScript structure.
L04898: declares the endDate JavaScript value.
L04900: continues a statement, function call, data value, or rendered content.
L04902: continues a statement, function call, data value, or rendered content.
L04904: opens or closes the current JavaScript structure.
L04907: declares the now JavaScript value.
L04910: declares the icsContent JavaScript value.
L04912: continues a statement, function call, data value, or rendered content.
L04914: continues a statement, function call, data value, or rendered content.
L04916: continues a statement, function call, data value, or rendered content.
L04918: continues a statement, function call, data value, or rendered content.
L04920: continues a statement, function call, data value, or rendered content.
L04922: continues a statement, function call, data value, or rendered content.
L04924: continues a template string used to render interface content.
L04926: continues a template string used to render interface content.
L04928: continues a template string used to render interface content.
L04930: continues a template string used to render interface content.
L04932: continues a template string used to render interface content.
L04934: continues a template string used to render interface content.
L04935: continues a chained method call.
L04936: continues a chained method call.
L04938: continues a template string used to render interface content.
L04940: continues a statement, function call, data value, or rendered content.
L04942: continues a statement, function call, data value, or rendered content.
L04944: continues a statement, function call, data value, or rendered content.
L04947: declares the blob JavaScript value.
L04949: continues a statement, function call, data value, or rendered content.
L04951: opens or closes the current JavaScript structure.
L04953: defines the type property in the current object.
L04954: continues a statement, function call, data value, or rendered content.
L04956: opens or closes the current JavaScript structure.
L04958: opens or closes the current JavaScript structure.
L04961: declares the downloadUrl JavaScript value.
L04963: continues a statement, function call, data value, or rendered content.
L04965: opens or closes the current JavaScript structure.
L04968: declares the downloadLink JavaScript value.
L04970: continues a statement, function call, data value, or rendered content.
L04972: opens or closes the current JavaScript structure.
L04975: continues a statement, function call, data value, or rendered content.
L04977: continues a statement, function call, data value, or rendered content.
L04980: continues a statement, function call, data value, or rendered content.
L04982: continues a template string used to render interface content.
L04985: interacts with the browser document or window.
L04987: continues a statement, function call, data value, or rendered content.
L04989: opens or closes the current JavaScript structure.
L04992: continues a statement, function call, data value, or rendered content.
L04995: continues a statement, function call, data value, or rendered content.
L04998: continues a statement, function call, data value, or rendered content.
L05000: continues a statement, function call, data value, or rendered content.
L05002: opens or closes the current JavaScript structure.
L05005: continues a statement, function call, data value, or rendered content.
L05007: defines the title property in the current object.
L05008: continues a statement, function call, data value, or rendered content.
L05010: defines the message property in the current object.
L05011: continues a statement, function call, data value, or rendered content.
L05013: defines the type property in the current object.
L05014: continues a statement, function call, data value, or rendered content.
L05016: continues a statement, function call, data value, or rendered content.
L05018: opens or closes the current JavaScript structure.
L05021: continues JavaScript documentation for maintainers.
L05022: continues a statement, function call, data value, or rendered content.
L05023: continues JavaScript documentation for maintainers.
L05025: declares the announcementTickerText JavaScript value.
L05027: continues a statement, function call, data value, or rendered content.
L05029: opens or closes the current JavaScript structure.
L05032: declares the announcementIndex JavaScript value.
L05034: continues a statement, function call, data value, or rendered content.
L05037: declares the rotateAnnouncement JavaScript value.
L05039: starts a conditional branch.
L05041: continues a statement, function call, data value, or rendered content.
L05043: continues a statement, function call, data value, or rendered content.
L05045: continues a statement, function call, data value, or rendered content.
L05047: returns a value or exits the current function.
L05049: opens or closes the current JavaScript structure.
L05052: continues a statement, function call, data value, or rendered content.
L05054: continues a statement, function call, data value, or rendered content.
L05057: continues a statement, function call, data value, or rendered content.
L05059: continues a statement, function call, data value, or rendered content.
L05062: interacts with the browser document or window.
L05064: defines or continues an arrow function.
L05066: continues a statement, function call, data value, or rendered content.
L05068: continues a statement, function call, data value, or rendered content.
L05070: continues a statement, function call, data value, or rendered content.
L05072: opens or closes the current JavaScript structure.
L05074: continues a statement, function call, data value, or rendered content.
L05077: continues a statement, function call, data value, or rendered content.
L05079: continues a statement, function call, data value, or rendered content.
L05080: continues a statement, function call, data value, or rendered content.
L05081: opens or closes the current JavaScript structure.
L05084: continues a statement, function call, data value, or rendered content.
L05086: continues a statement, function call, data value, or rendered content.
L05089: continues a statement, function call, data value, or rendered content.
L05091: continues a statement, function call, data value, or rendered content.
L05093: continues a statement, function call, data value, or rendered content.
L05095: continues a statement, function call, data value, or rendered content.
L05097: opens or closes the current JavaScript structure.
L05099: opens or closes the current JavaScript structure.
L05102: starts a conditional branch.
L05104: continues a statement, function call, data value, or rendered content.
L05106: continues a statement, function call, data value, or rendered content.
L05108: continues a statement, function call, data value, or rendered content.
L05110: continues a statement, function call, data value, or rendered content.
L05113: starts a conditional branch.
L05115: continues a statement, function call, data value, or rendered content.
L05117: continues a statement, function call, data value, or rendered content.
L05119: interacts with the browser document or window.
L05121: continues a statement, function call, data value, or rendered content.
L05123: continues a statement, function call, data value, or rendered content.
L05125: opens or closes the current JavaScript structure.
L05127: opens or closes the current JavaScript structure.
L05129: opens or closes the current JavaScript structure.
L05132: continues JavaScript documentation for maintainers.
L05133: continues a statement, function call, data value, or rendered content.
L05134: continues JavaScript documentation for maintainers.
L05136: declares the siteModal JavaScript value.
L05138: continues a statement, function call, data value, or rendered content.
L05140: opens or closes the current JavaScript structure.
L05143: declares the modalTitle JavaScript value.
L05145: continues a statement, function call, data value, or rendered content.
L05147: opens or closes the current JavaScript structure.
L05150: declares the modalEyebrow JavaScript value.
L05152: continues a statement, function call, data value, or rendered content.
L05154: opens or closes the current JavaScript structure.
L05157: declares the modalBody JavaScript value.
L05159: continues a statement, function call, data value, or rendered content.
L05161: opens or closes the current JavaScript structure.
L05164: declares the modalActions JavaScript value.
L05166: continues a statement, function call, data value, or rendered content.
L05168: opens or closes the current JavaScript structure.
L05171: declares the lastFocusedElement JavaScript value.
L05173: continues a statement, function call, data value, or rendered content.
L05176: declares the getModalFocusableElements JavaScript value.
L05178: starts a conditional branch.
L05180: continues a statement, function call, data value, or rendered content.
L05182: continues a statement, function call, data value, or rendered content.
L05184: returns a value or exits the current function.
L05186: opens or closes the current JavaScript structure.
L05189: returns a value or exits the current function.
L05191: continues a template string used to render interface content.
L05192: continues a statement, function call, data value, or rendered content.
L05193: defines the input property in the current object.
L05194: defines the select property in the current object.
L05195: defines the textarea property in the current object.
L05196: continues a statement, function call, data value, or rendered content.
L05198: continues a statement, function call, data value, or rendered content.
L05200: continues a statement, function call, data value, or rendered content.
L05202: defines or continues an arrow function.
L05204: continues a statement, function call, data value, or rendered content.
L05206: continues a statement, function call, data value, or rendered content.
L05208: opens or closes the current JavaScript structure.
L05210: opens or closes the current JavaScript structure.
L05213: declares the closeModal JavaScript value.
L05215: starts a conditional branch.
L05217: continues a statement, function call, data value, or rendered content.
L05219: continues a statement, function call, data value, or rendered content.
L05221: returns a value or exits the current function.
L05223: opens or closes the current JavaScript structure.
L05226: continues a statement, function call, data value, or rendered content.
L05228: continues a statement, function call, data value, or rendered content.
L05231: interacts with the browser document or window.
L05233: continues a statement, function call, data value, or rendered content.
L05235: opens or closes the current JavaScript structure.
L05238: starts a conditional branch.
L05240: continues a statement, function call, data value, or rendered content.
L05242: continues a statement, function call, data value, or rendered content.
L05244: continues a statement, function call, data value, or rendered content.
L05246: continues a statement, function call, data value, or rendered content.
L05248: opens or closes the current JavaScript structure.
L05250: opens or closes the current JavaScript structure.
L05253: declares the createModalAction JavaScript value.
L05255: continues a statement, function call, data value, or rendered content.
L05257: defines or continues an arrow function.
L05259: starts a conditional branch.
L05261: continues a statement, function call, data value, or rendered content.
L05263: continues a statement, function call, data value, or rendered content.
L05265: declares the link JavaScript value.
L05267: continues a statement, function call, data value, or rendered content.
L05269: opens or closes the current JavaScript structure.
L05272: continues a statement, function call, data value, or rendered content.
L05274: continues a statement, function call, data value, or rendered content.
L05277: continues a statement, function call, data value, or rendered content.
L05279: continues a statement, function call, data value, or rendered content.
L05282: starts a conditional branch.
L05284: continues a statement, function call, data value, or rendered content.
L05286: continues a statement, function call, data value, or rendered content.
L05288: continues a statement, function call, data value, or rendered content.
L05290: continues a statement, function call, data value, or rendered content.
L05292: opens or closes the current JavaScript structure.
L05294: opens or closes the current JavaScript structure.
L05297: continues a statement, function call, data value, or rendered content.
L05299: continues a statement, function call, data value, or rendered content.
L05301: defines or continues an arrow function.
L05303: continues a statement, function call, data value, or rendered content.
L05306: starts a conditional branch.
L05308: continues a statement, function call, data value, or rendered content.
L05310: continues a statement, function call, data value, or rendered content.
L05312: continues a statement, function call, data value, or rendered content.
L05315: continues a statement, function call, data value, or rendered content.
L05317: continues a statement, function call, data value, or rendered content.
L05319: opens or closes the current JavaScript structure.
L05322: continues a statement, function call, data value, or rendered content.
L05324: continues a statement, function call, data value, or rendered content.
L05326: opens or closes the current JavaScript structure.
L05329: continues a statement, function call, data value, or rendered content.
L05331: continues a statement, function call, data value, or rendered content.
L05333: continues a statement, function call, data value, or rendered content.
L05335: continues a statement, function call, data value, or rendered content.
L05337: opens or closes the current JavaScript structure.
L05339: opens or closes the current JavaScript structure.
L05341: opens or closes the current JavaScript structure.
L05343: opens or closes the current JavaScript structure.
L05346: returns a value or exits the current function.
L05348: opens or closes the current JavaScript structure.
L05351: declares the button JavaScript value.
L05353: continues a statement, function call, data value, or rendered content.
L05355: opens or closes the current JavaScript structure.
L05358: continues a statement, function call, data value, or rendered content.
L05360: continues a statement, function call, data value, or rendered content.
L05363: continues a statement, function call, data value, or rendered content.
L05365: continues a statement, function call, data value, or rendered content.
L05368: starts a conditional branch.
L05370: continues a statement, function call, data value, or rendered content.
L05372: continues a statement, function call, data value, or rendered content.
L05374: continues a statement, function call, data value, or rendered content.
L05376: continues a statement, function call, data value, or rendered content.
L05378: opens or closes the current JavaScript structure.
L05380: opens or closes the current JavaScript structure.
L05383: starts a conditional branch.
L05385: continues a statement, function call, data value, or rendered content.
L05387: continues a statement, function call, data value, or rendered content.
L05389: continues a statement, function call, data value, or rendered content.
L05391: continues a statement, function call, data value, or rendered content.
L05393: continues a statement, function call, data value, or rendered content.
L05395: opens or closes the current JavaScript structure.
L05397: opens or closes the current JavaScript structure.
L05400: starts a conditional branch.
L05402: continues a statement, function call, data value, or rendered content.
L05404: continues a statement, function call, data value, or rendered content.
L05406: continues a statement, function call, data value, or rendered content.
L05408: continues a statement, function call, data value, or rendered content.
L05410: defines or continues an arrow function.
L05412: continues a statement, function call, data value, or rendered content.
L05415: continues a statement, function call, data value, or rendered content.
L05417: continues a statement, function call, data value, or rendered content.
L05419: opens or closes the current JavaScript structure.
L05421: opens or closes the current JavaScript structure.
L05423: opens or closes the current JavaScript structure.
L05425: opens or closes the current JavaScript structure.
L05428: starts a conditional branch.
L05430: continues a statement, function call, data value, or rendered content.
L05432: continues a statement, function call, data value, or rendered content.
L05434: continues a statement, function call, data value, or rendered content.
L05436: continues a statement, function call, data value, or rendered content.
L05438: defines or continues an arrow function.
L05440: declares the nextContent JavaScript value.
L05442: continues a statement, function call, data value, or rendered content.
L05443: continues a statement, function call, data value, or rendered content.
L05444: opens or closes the current JavaScript structure.
L05447: starts a conditional branch.
L05449: continues a statement, function call, data value, or rendered content.
L05451: continues a statement, function call, data value, or rendered content.
L05453: continues a statement, function call, data value, or rendered content.
L05455: continues a statement, function call, data value, or rendered content.
L05457: opens or closes the current JavaScript structure.
L05459: opens or closes the current JavaScript structure.
L05461: opens or closes the current JavaScript structure.
L05463: opens or closes the current JavaScript structure.
L05465: opens or closes the current JavaScript structure.
L05468: starts a conditional branch.
L05470: continues a statement, function call, data value, or rendered content.
L05472: continues a statement, function call, data value, or rendered content.
L05474: continues a statement, function call, data value, or rendered content.
L05476: continues a statement, function call, data value, or rendered content.
L05478: defines or continues an arrow function.
L05480: declares the nextContent JavaScript value.
L05482: continues a statement, function call, data value, or rendered content.
L05483: continues a statement, function call, data value, or rendered content.
L05484: opens or closes the current JavaScript structure.
L05487: starts a conditional branch.
L05489: continues a statement, function call, data value, or rendered content.
L05491: continues a statement, function call, data value, or rendered content.
L05493: continues a statement, function call, data value, or rendered content.
L05495: continues a statement, function call, data value, or rendered content.
L05497: opens or closes the current JavaScript structure.
L05499: opens or closes the current JavaScript structure.
L05501: opens or closes the current JavaScript structure.
L05503: opens or closes the current JavaScript structure.
L05505: opens or closes the current JavaScript structure.
L05508: returns a value or exits the current function.
L05510: opens or closes the current JavaScript structure.
L05513: declares the openModal function.
L05515: continues a statement, function call, data value, or rendered content.
L05517: continues a statement, function call, data value, or rendered content.
L05519: starts a conditional branch.
L05521: continues a statement, function call, data value, or rendered content.
L05523: continues a statement, function call, data value, or rendered content.
L05525: continues a statement, function call, data value, or rendered content.
L05527: returns a value or exits the current function.
L05529: opens or closes the current JavaScript structure.
L05532: continues a statement, function call, data value, or rendered content.
L05534: interacts with the browser document or window.
L05537: continues a statement, function call, data value, or rendered content.
L05539: continues a statement, function call, data value, or rendered content.
L05541: continues a statement, function call, data value, or rendered content.
L05544: continues a statement, function call, data value, or rendered content.
L05546: continues a statement, function call, data value, or rendered content.
L05548: continues a statement, function call, data value, or rendered content.
L05551: continues a statement, function call, data value, or rendered content.
L05553: continues a statement, function call, data value, or rendered content.
L05555: continues a statement, function call, data value, or rendered content.
L05558: continues a statement, function call, data value, or rendered content.
L05560: continues a statement, function call, data value, or rendered content.
L05563: continues a statement, function call, data value, or rendered content.
L05565: continues a statement, function call, data value, or rendered content.
L05567: continues a statement, function call, data value, or rendered content.
L05569: opens or closes the current JavaScript structure.
L05571: defines the label property in the current object.
L05572: continues a statement, function call, data value, or rendered content.
L05574: defines the close property in the current object.
L05575: continues a statement, function call, data value, or rendered content.
L05577: opens or closes the current JavaScript structure.
L05579: opens or closes the current JavaScript structure.
L05581: continues a statement, function call, data value, or rendered content.
L05583: defines or continues an arrow function.
L05585: continues a statement, function call, data value, or rendered content.
L05587: continues a statement, function call, data value, or rendered content.
L05589: opens or closes the current JavaScript structure.
L05591: opens or closes the current JavaScript structure.
L05593: opens or closes the current JavaScript structure.
L05596: continues a statement, function call, data value, or rendered content.
L05598: continues a statement, function call, data value, or rendered content.
L05601: interacts with the browser document or window.
L05603: continues a statement, function call, data value, or rendered content.
L05605: opens or closes the current JavaScript structure.
L05608: interacts with the browser document or window.
L05610: defines or continues an arrow function.
L05612: continues a statement, function call, data value, or rendered content.
L05614: continues a statement, function call, data value, or rendered content.
L05616: continues a statement, function call, data value, or rendered content.
L05618: continues a statement, function call, data value, or rendered content.
L05620: continues a statement, function call, data value, or rendered content.
L05622: continues a statement, function call, data value, or rendered content.
L05624: opens or closes the current JavaScript structure.
L05626: opens or closes the current JavaScript structure.
L05629: continues a statement, function call, data value, or rendered content.
L05631: continues a statement, function call, data value, or rendered content.
L05633: continues a statement, function call, data value, or rendered content.
L05635: defines or continues an arrow function.
L05637: continues a statement, function call, data value, or rendered content.
L05639: continues a statement, function call, data value, or rendered content.
L05641: continues a statement, function call, data value, or rendered content.
L05643: opens or closes the current JavaScript structure.
L05645: opens or closes the current JavaScript structure.
L05647: opens or closes the current JavaScript structure.
L05650: continues a statement, function call, data value, or rendered content.
L05652: continues a statement, function call, data value, or rendered content.
L05654: defines or continues an arrow function.
L05656: starts a conditional branch.
L05658: continues a statement, function call, data value, or rendered content.
L05660: continues a statement, function call, data value, or rendered content.
L05662: continues a statement, function call, data value, or rendered content.
L05664: returns a value or exits the current function.
L05666: opens or closes the current JavaScript structure.
L05669: starts a conditional branch.
L05671: continues a statement, function call, data value, or rendered content.
L05673: continues a statement, function call, data value, or rendered content.
L05675: returns a value or exits the current function.
L05677: opens or closes the current JavaScript structure.
L05680: declares the focusableElements JavaScript value.
L05682: continues a statement, function call, data value, or rendered content.
L05685: starts a conditional branch.
L05687: continues a statement, function call, data value, or rendered content.
L05689: continues a statement, function call, data value, or rendered content.
L05691: returns a value or exits the current function.
L05693: opens or closes the current JavaScript structure.
L05696: declares the firstElement JavaScript value.
L05698: continues a statement, function call, data value, or rendered content.
L05701: declares the lastElement JavaScript value.
L05703: continues a statement, function call, data value, or rendered content.
L05704: continues a statement, function call, data value, or rendered content.
L05705: opens or closes the current JavaScript structure.
L05708: starts a conditional branch.
L05710: continues a statement, function call, data value, or rendered content.
L05712: continues a statement, function call, data value, or rendered content.
L05714: continues a statement, function call, data value, or rendered content.
L05716: continues a statement, function call, data value, or rendered content.
L05719: continues a statement, function call, data value, or rendered content.
L05721: continues a statement, function call, data value, or rendered content.
L05723: continues a statement, function call, data value, or rendered content.
L05725: continues a statement, function call, data value, or rendered content.
L05727: continues a statement, function call, data value, or rendered content.
L05729: continues a statement, function call, data value, or rendered content.
L05732: continues a statement, function call, data value, or rendered content.
L05734: opens or closes the current JavaScript structure.
L05736: opens or closes the current JavaScript structure.
L05738: opens or closes the current JavaScript structure.
L05741: continues JavaScript documentation for maintainers.
L05742: continues a statement, function call, data value, or rendered content.
L05743: continues JavaScript documentation for maintainers.
L05745: interacts with the browser document or window.
L05747: continues a statement, function call, data value, or rendered content.
L05749: defines or continues an arrow function.
L05751: declares the updateButton JavaScript value.
L05753: continues a statement, function call, data value, or rendered content.
L05755: continues a statement, function call, data value, or rendered content.
L05757: opens or closes the current JavaScript structure.
L05760: declares the eventDetailsButton JavaScript value.
L05762: continues a statement, function call, data value, or rendered content.
L05764: continues a statement, function call, data value, or rendered content.
L05766: opens or closes the current JavaScript structure.
L05769: declares the eventCalendarButton JavaScript value.
L05771: continues a statement, function call, data value, or rendered content.
L05773: continues a statement, function call, data value, or rendered content.
L05775: opens or closes the current JavaScript structure.
L05778: declares the resourceButton JavaScript value.
L05780: continues a statement, function call, data value, or rendered content.
L05782: continues a statement, function call, data value, or rendered content.
L05784: opens or closes the current JavaScript structure.
L05787: declares the teamButton JavaScript value.
L05789: continues a statement, function call, data value, or rendered content.
L05791: continues a statement, function call, data value, or rendered content.
L05793: opens or closes the current JavaScript structure.
L05796: declares the modalContentButton JavaScript value.
L05798: continues a statement, function call, data value, or rendered content.
L05800: continues a statement, function call, data value, or rendered content.
L05802: opens or closes the current JavaScript structure.
L05805: declares the prefillButton JavaScript value.
L05807: continues a statement, function call, data value, or rendered content.
L05809: continues a statement, function call, data value, or rendered content.
L05811: opens or closes the current JavaScript structure.
L05814: starts a conditional branch.
L05816: continues a statement, function call, data value, or rendered content.
L05818: continues a statement, function call, data value, or rendered content.
L05820: declares the update JavaScript value.
L05822: defines or continues an arrow function.
L05824: continues a statement, function call, data value, or rendered content.
L05826: continues a statement, function call, data value, or rendered content.
L05828: opens or closes the current JavaScript structure.
L05831: starts a conditional branch.
L05833: continues a statement, function call, data value, or rendered content.
L05835: continues a statement, function call, data value, or rendered content.
L05837: continues a statement, function call, data value, or rendered content.
L05839: defines the eyebrow property in the current object.
L05840: continues a statement, function call, data value, or rendered content.
L05842: defines the title property in the current object.
L05843: continues a statement, function call, data value, or rendered content.
L05845: defines the body property in the current object.
L05846: continues a template string used to render interface content.
L05847: continues a template string used to render interface content.
L05848: continues a template string used to render interface content.
L05849: continues a statement, function call, data value, or rendered content.
L05850: continues a template string used to render interface content.
L05851: continues a template string used to render interface content.
L05853: continues a template string used to render interface content.
L05854: continues a statement, function call, data value, or rendered content.
L05855: continues a template string used to render interface content.
L05857: continues a statement, function call, data value, or rendered content.
L05858: continues a template string used to render interface content.
L05860: defines the actions property in the current object.
L05862: opens or closes the current JavaScript structure.
L05864: defines the label property in the current object.
L05865: continues a statement, function call, data value, or rendered content.
L05867: defines the href property in the current object.
L05868: continues a statement, function call, data value, or rendered content.
L05870: defines the primary property in the current object.
L05871: continues a statement, function call, data value, or rendered content.
L05873: continues a statement, function call, data value, or rendered content.
L05875: opens or closes the current JavaScript structure.
L05877: defines the label property in the current object.
L05878: continues a statement, function call, data value, or rendered content.
L05880: defines the href property in the current object.
L05881: continues a statement, function call, data value, or rendered content.
L05883: opens or closes the current JavaScript structure.
L05885: opens or closes the current JavaScript structure.
L05887: continues a statement, function call, data value, or rendered content.
L05889: opens or closes the current JavaScript structure.
L05891: opens or closes the current JavaScript structure.
L05894: starts a conditional branch.
L05896: continues a statement, function call, data value, or rendered content.
L05898: continues a statement, function call, data value, or rendered content.
L05900: declares the eventData JavaScript value.
L05902: defines or continues an arrow function.
L05904: continues a statement, function call, data value, or rendered content.
L05906: continues a statement, function call, data value, or rendered content.
L05907: continues a chained method call.
L05908: continues a chained method call.
L05910: opens or closes the current JavaScript structure.
L05913: starts a conditional branch.
L05915: continues a statement, function call, data value, or rendered content.
L05917: continues a statement, function call, data value, or rendered content.
L05919: declares the date JavaScript value.
L05921: continues a statement, function call, data value, or rendered content.
L05923: continues a statement, function call, data value, or rendered content.
L05925: opens or closes the current JavaScript structure.
L05928: continues a statement, function call, data value, or rendered content.
L05930: defines the eyebrow property in the current object.
L05931: continues a template string used to render interface content.
L05933: defines the title property in the current object.
L05934: continues a statement, function call, data value, or rendered content.
L05936: defines the body property in the current object.
L05937: continues a template string used to render interface content.
L05938: continues a template string used to render interface content.
L05939: continues a template string used to render interface content.
L05940: continues a statement, function call, data value, or rendered content.
L05941: continues a template string used to render interface content.
L05943: continues a template string used to render interface content.
L05945: continues a statement, function call, data value, or rendered content.
L05946: continues a statement, function call, data value, or rendered content.
L05947: continues a statement, function call, data value, or rendered content.
L05949: continues a template string used to render interface content.
L05951: continues a statement, function call, data value, or rendered content.
L05952: continues a template string used to render interface content.
L05954: continues a template string used to render interface content.
L05955: continues a statement, function call, data value, or rendered content.
L05956: continues a template string used to render interface content.
L05958: continues a statement, function call, data value, or rendered content.
L05959: continues a template string used to render interface content.
L05961: defines the actions property in the current object.
L05963: opens or closes the current JavaScript structure.
L05965: defines the label property in the current object.
L05966: continues a statement, function call, data value, or rendered content.
L05968: defines the primary property in the current object.
L05969: continues a statement, function call, data value, or rendered content.
L05971: defines the close property in the current object.
L05972: continues a statement, function call, data value, or rendered content.
L05974: continues a statement, function call, data value, or rendered content.
L05976: opens or closes the current JavaScript structure.
L05978: defines the label property in the current object.
L05979: continues a statement, function call, data value, or rendered content.
L05981: defines the prefill property in the current object.
L05982: continues a template string used to render interface content.
L05984: opens or closes the current JavaScript structure.
L05986: opens or closes the current JavaScript structure.
L05988: continues a statement, function call, data value, or rendered content.
L05991: declares the firstModalAction JavaScript value.
L05993: continues a statement, function call, data value, or rendered content.
L05995: continues a statement, function call, data value, or rendered content.
L05997: opens or closes the current JavaScript structure.
L06000: continues a statement, function call, data value, or rendered content.
L06002: continues a statement, function call, data value, or rendered content.
L06004: defines or continues an arrow function.
L06006: continues a statement, function call, data value, or rendered content.
L06008: continues a statement, function call, data value, or rendered content.
L06010: opens or closes the current JavaScript structure.
L06012: defines the once property in the current object.
L06013: continues a statement, function call, data value, or rendered content.
L06015: opens or closes the current JavaScript structure.
L06017: opens or closes the current JavaScript structure.
L06019: opens or closes the current JavaScript structure.
L06021: opens or closes the current JavaScript structure.
L06024: starts a conditional branch.
L06026: continues a statement, function call, data value, or rendered content.
L06028: continues a statement, function call, data value, or rendered content.
L06030: declares the eventData JavaScript value.
L06032: defines or continues an arrow function.
L06034: continues a statement, function call, data value, or rendered content.
L06036: continues a statement, function call, data value, or rendered content.
L06037: continues a chained method call.
L06038: continues a chained method call.
L06040: opens or closes the current JavaScript structure.
L06043: starts a conditional branch.
L06045: continues a statement, function call, data value, or rendered content.
L06047: continues a statement, function call, data value, or rendered content.
L06049: continues a statement, function call, data value, or rendered content.
L06051: continues a statement, function call, data value, or rendered content.
L06053: opens or closes the current JavaScript structure.
L06055: opens or closes the current JavaScript structure.
L06057: opens or closes the current JavaScript structure.
L06060: starts a conditional branch.
L06062: continues a statement, function call, data value, or rendered content.
L06064: continues a statement, function call, data value, or rendered content.
L06066: declares the resource JavaScript value.
L06068: continues a statement, function call, data value, or rendered content.
L06070: opens or closes the current JavaScript structure.
L06073: starts a conditional branch.
L06075: continues a statement, function call, data value, or rendered content.
L06077: continues a statement, function call, data value, or rendered content.
L06079: continues a statement, function call, data value, or rendered content.
L06081: continues a statement, function call, data value, or rendered content.
L06083: opens or closes the current JavaScript structure.
L06085: opens or closes the current JavaScript structure.
L06087: opens or closes the current JavaScript structure.
L06090: starts a conditional branch.
L06092: continues a statement, function call, data value, or rendered content.
L06094: continues a statement, function call, data value, or rendered content.
L06096: declares the teamContent JavaScript value.
L06098: continues a statement, function call, data value, or rendered content.
L06100: opens or closes the current JavaScript structure.
L06103: starts a conditional branch.
L06105: continues a statement, function call, data value, or rendered content.
L06107: continues a statement, function call, data value, or rendered content.
L06109: continues a statement, function call, data value, or rendered content.
L06111: continues a statement, function call, data value, or rendered content.
L06113: opens or closes the current JavaScript structure.
L06115: opens or closes the current JavaScript structure.
L06117: opens or closes the current JavaScript structure.
L06120: starts a conditional branch.
L06122: continues a statement, function call, data value, or rendered content.
L06124: continues a statement, function call, data value, or rendered content.
L06126: declares the modalContent JavaScript value.
L06128: continues a statement, function call, data value, or rendered content.
L06129: continues a chained method call.
L06130: continues a chained method call.
L06132: opens or closes the current JavaScript structure.
L06135: starts a conditional branch.
L06137: continues a statement, function call, data value, or rendered content.
L06139: continues a statement, function call, data value, or rendered content.
L06141: continues a statement, function call, data value, or rendered content.
L06143: continues a statement, function call, data value, or rendered content.
L06145: opens or closes the current JavaScript structure.
L06147: opens or closes the current JavaScript structure.
L06149: opens or closes the current JavaScript structure.
L06152: starts a conditional branch.
L06154: continues a statement, function call, data value, or rendered content.
L06156: continues a statement, function call, data value, or rendered content.
L06158: continues a statement, function call, data value, or rendered content.
L06160: continues a statement, function call, data value, or rendered content.
L06162: continues a statement, function call, data value, or rendered content.
L06164: opens or closes the current JavaScript structure.
L06166: opens or closes the current JavaScript structure.
L06168: opens or closes the current JavaScript structure.
L06170: opens or closes the current JavaScript structure.
L06173: continues JavaScript documentation for maintainers.
L06174: continues a statement, function call, data value, or rendered content.
L06175: continues JavaScript documentation for maintainers.
L06177: declares the galleryTrack JavaScript value.
L06179: continues a statement, function call, data value, or rendered content.
L06181: opens or closes the current JavaScript structure.
L06184: declares the galleryMarquee JavaScript value.
L06186: continues a statement, function call, data value, or rendered content.
L06188: opens or closes the current JavaScript structure.
L06191: declares the galleryToggle JavaScript value.
L06193: continues a statement, function call, data value, or rendered content.
L06195: opens or closes the current JavaScript structure.
L06198: declares the galleryPrevious JavaScript value.
L06200: continues a statement, function call, data value, or rendered content.
L06202: opens or closes the current JavaScript structure.
L06205: declares the galleryNext JavaScript value.
L06207: continues a statement, function call, data value, or rendered content.
L06209: opens or closes the current JavaScript structure.
L06212: declares the duplicateGalleryCards JavaScript value.
L06214: starts a conditional branch.
L06216: continues a statement, function call, data value, or rendered content.
L06218: continues a statement, function call, data value, or rendered content.
L06220: continues a statement, function call, data value, or rendered content.
L06222: returns a value or exits the current function.
L06224: opens or closes the current JavaScript structure.
L06227: declares the originalCards JavaScript value.
L06229: continues a statement, function call, data value, or rendered content.
L06231: continues a statement, function call, data value, or rendered content.
L06233: opens or closes the current JavaScript structure.
L06236: continues a statement, function call, data value, or rendered content.
L06238: defines or continues an arrow function.
L06240: declares the clone JavaScript value.
L06242: continues a statement, function call, data value, or rendered content.
L06244: opens or closes the current JavaScript structure.
L06247: continues a statement, function call, data value, or rendered content.
L06249: continues a statement, function call, data value, or rendered content.
L06251: continues a statement, function call, data value, or rendered content.
L06253: opens or closes the current JavaScript structure.
L06256: continues a statement, function call, data value, or rendered content.
L06258: continues a statement, function call, data value, or rendered content.
L06260: continues a statement, function call, data value, or rendered content.
L06262: defines or continues an arrow function.
L06264: continues a statement, function call, data value, or rendered content.
L06266: opens or closes the current JavaScript structure.
L06269: continues a statement, function call, data value, or rendered content.
L06271: continues a statement, function call, data value, or rendered content.
L06273: opens or closes the current JavaScript structure.
L06275: opens or closes the current JavaScript structure.
L06277: opens or closes the current JavaScript structure.
L06280: continues a statement, function call, data value, or rendered content.
L06282: continues a statement, function call, data value, or rendered content.
L06284: opens or closes the current JavaScript structure.
L06287: declares the setGalleryPaused JavaScript value.
L06289: continues a statement, function call, data value, or rendered content.
L06291: defines or continues an arrow function.
L06293: starts a conditional branch.
L06295: continues a statement, function call, data value, or rendered content.
L06297: continues a statement, function call, data value, or rendered content.
L06299: continues a statement, function call, data value, or rendered content.
L06301: returns a value or exits the current function.
L06303: opens or closes the current JavaScript structure.
L06306: continues a statement, function call, data value, or rendered content.
L06308: continues a statement, function call, data value, or rendered content.
L06310: continues a statement, function call, data value, or rendered content.
L06312: opens or closes the current JavaScript structure.
L06315: continues a statement, function call, data value, or rendered content.
L06317: continues a statement, function call, data value, or rendered content.
L06319: continues a statement, function call, data value, or rendered content.
L06321: opens or closes the current JavaScript structure.
L06324: continues a statement, function call, data value, or rendered content.
L06326: continues a statement, function call, data value, or rendered content.
L06328: continues a statement, function call, data value, or rendered content.
L06330: continues a statement, function call, data value, or rendered content.
L06332: continues a statement, function call, data value, or rendered content.
L06334: opens or closes the current JavaScript structure.
L06336: opens or closes the current JavaScript structure.
L06339: declares the scrollGalleryByCard JavaScript value.
L06341: continues a statement, function call, data value, or rendered content.
L06343: defines or continues an arrow function.
L06345: starts a conditional branch.
L06347: continues a statement, function call, data value, or rendered content.
L06349: continues a statement, function call, data value, or rendered content.
L06351: returns a value or exits the current function.
L06353: opens or closes the current JavaScript structure.
L06356: continues a statement, function call, data value, or rendered content.
L06358: continues a statement, function call, data value, or rendered content.
L06360: opens or closes the current JavaScript structure.
L06363: declares the firstCard JavaScript value.
L06365: continues a statement, function call, data value, or rendered content.
L06367: continues a statement, function call, data value, or rendered content.
L06369: opens or closes the current JavaScript structure.
L06372: declares the cardWidth JavaScript value.
L06374: continues a statement, function call, data value, or rendered content.
L06375: continues a statement, function call, data value, or rendered content.
L06376: continues a chained method call.
L06378: continues a statement, function call, data value, or rendered content.
L06381: continues a statement, function call, data value, or rendered content.
L06383: defines the left property in the current object.
L06384: continues a statement, function call, data value, or rendered content.
L06385: continues JavaScript documentation for maintainers.
L06386: continues a statement, function call, data value, or rendered content.
L06387: continues a statement, function call, data value, or rendered content.
L06388: continues a statement, function call, data value, or rendered content.
L06390: defines the behavior property in the current object.
L06391: continues a statement, function call, data value, or rendered content.
L06393: continues a statement, function call, data value, or rendered content.
L06395: continues a statement, function call, data value, or rendered content.
L06397: continues a statement, function call, data value, or rendered content.
L06399: opens or closes the current JavaScript structure.
L06402: continues a statement, function call, data value, or rendered content.
L06405: continues a statement, function call, data value, or rendered content.
L06407: continues a statement, function call, data value, or rendered content.
L06409: defines or continues an arrow function.
L06411: declares the paused JavaScript value.
L06413: continues a statement, function call, data value, or rendered content.
L06415: continues a statement, function call, data value, or rendered content.
L06417: continues a statement, function call, data value, or rendered content.
L06420: continues a statement, function call, data value, or rendered content.
L06422: continues a statement, function call, data value, or rendered content.
L06424: opens or closes the current JavaScript structure.
L06426: opens or closes the current JavaScript structure.
L06428: opens or closes the current JavaScript structure.
L06431: continues a statement, function call, data value, or rendered content.
L06433: continues a statement, function call, data value, or rendered content.
L06435: defines or continues an arrow function.
L06437: opens or closes the current JavaScript structure.
L06440: continues a statement, function call, data value, or rendered content.
L06442: continues a statement, function call, data value, or rendered content.
L06444: defines or continues an arrow function.
L06446: opens or closes the current JavaScript structure.
L06449: continues JavaScript documentation for maintainers.
L06450: continues a statement, function call, data value, or rendered content.
L06451: continues JavaScript documentation for maintainers.
L06453: continues a statement, function call, data value, or rendered content.
L06455: continues a statement, function call, data value, or rendered content.
L06457: continues a statement, function call, data value, or rendered content.
L06459: defines or continues an arrow function.
L06461: continues a statement, function call, data value, or rendered content.
L06463: continues a statement, function call, data value, or rendered content.
L06465: defines or continues an arrow function.
L06467: declares the item JavaScript value.
L06469: continues a statement, function call, data value, or rendered content.
L06471: continues a statement, function call, data value, or rendered content.
L06473: opens or closes the current JavaScript structure.
L06476: declares the answer JavaScript value.
L06478: continues a statement, function call, data value, or rendered content.
L06480: continues a statement, function call, data value, or rendered content.
L06482: opens or closes the current JavaScript structure.
L06485: declares the expanded JavaScript value.
L06487: continues a statement, function call, data value, or rendered content.
L06489: continues a statement, function call, data value, or rendered content.
L06491: continues a statement, function call, data value, or rendered content.
L06494: continues a statement, function call, data value, or rendered content.
L06496: continues a statement, function call, data value, or rendered content.
L06498: continues a statement, function call, data value, or rendered content.
L06500: opens or closes the current JavaScript structure.
L06503: continues a statement, function call, data value, or rendered content.
L06505: continues a statement, function call, data value, or rendered content.
L06507: opens or closes the current JavaScript structure.
L06509: opens or closes the current JavaScript structure.
L06511: opens or closes the current JavaScript structure.
L06513: opens or closes the current JavaScript structure.
L06516: continues JavaScript documentation for maintainers.
L06517: continues a statement, function call, data value, or rendered content.
L06518: continues JavaScript documentation for maintainers.
L06520: declares the contactForm JavaScript value.
L06522: continues a statement, function call, data value, or rendered content.
L06524: opens or closes the current JavaScript structure.
L06527: declares the contactName JavaScript value.
L06529: continues a statement, function call, data value, or rendered content.
L06531: opens or closes the current JavaScript structure.
L06534: declares the contactEmail JavaScript value.
L06536: continues a statement, function call, data value, or rendered content.
L06538: opens or closes the current JavaScript structure.
L06541: declares the contactAudience JavaScript value.
L06543: continues a statement, function call, data value, or rendered content.
L06545: opens or closes the current JavaScript structure.
L06548: declares the contactSubject JavaScript value.
L06550: continues a statement, function call, data value, or rendered content.
L06552: opens or closes the current JavaScript structure.
L06555: declares the contactMessage JavaScript value.
L06557: continues a statement, function call, data value, or rendered content.
L06559: opens or closes the current JavaScript structure.
L06562: declares the prefillContactForm function.
L06564: continues a statement, function call, data value, or rendered content.
L06566: continues a statement, function call, data value, or rendered content.
L06568: continues a statement, function call, data value, or rendered content.
L06570: starts a conditional branch.
L06572: continues a statement, function call, data value, or rendered content.
L06574: continues a statement, function call, data value, or rendered content.
L06576: continues a statement, function call, data value, or rendered content.
L06578: returns a value or exits the current function.
L06580: opens or closes the current JavaScript structure.
L06583: continues a statement, function call, data value, or rendered content.
L06586: continues a statement, function call, data value, or rendered content.
L06588: continues a statement, function call, data value, or rendered content.
L06591: starts a conditional branch.
L06593: continues a statement, function call, data value, or rendered content.
L06595: continues a statement, function call, data value, or rendered content.
L06597: continues a statement, function call, data value, or rendered content.
L06599: continues a statement, function call, data value, or rendered content.
L06601: continues a statement, function call, data value, or rendered content.
L06603: opens or closes the current JavaScript structure.
L06606: continues a statement, function call, data value, or rendered content.
L06608: continues a statement, function call, data value, or rendered content.
L06610: opens or closes the current JavaScript structure.
L06613: interacts with the browser document or window.
L06615: defines or continues an arrow function.
L06617: continues a statement, function call, data value, or rendered content.
L06619: continues a statement, function call, data value, or rendered content.
L06621: continues a statement, function call, data value, or rendered content.
L06623: opens or closes the current JavaScript structure.
L06625: opens or closes the current JavaScript structure.
L06628: continues JavaScript documentation for maintainers.
L06629: continues a statement, function call, data value, or rendered content.
L06630: continues JavaScript documentation for maintainers.
L06632: declares the setFieldError JavaScript value.
L06634: continues a statement, function call, data value, or rendered content.
L06636: continues a statement, function call, data value, or rendered content.
L06638: continues a statement, function call, data value, or rendered content.
L06640: defines or continues an arrow function.
L06642: starts a conditional branch.
L06644: continues a statement, function call, data value, or rendered content.
L06646: continues a statement, function call, data value, or rendered content.
L06648: returns a value or exits the current function.
L06650: opens or closes the current JavaScript structure.
L06653: declares the formField JavaScript value.
L06655: continues a statement, function call, data value, or rendered content.
L06657: opens or closes the current JavaScript structure.
L06660: declares the errorElement JavaScript value.
L06662: continues a template string used to render interface content.
L06664: opens or closes the current JavaScript structure.
L06667: continues a statement, function call, data value, or rendered content.
L06669: continues a statement, function call, data value, or rendered content.
L06671: continues a statement, function call, data value, or rendered content.
L06673: opens or closes the current JavaScript structure.
L06676: continues a statement, function call, data value, or rendered content.
L06678: continues a statement, function call, data value, or rendered content.
L06680: continues a statement, function call, data value, or rendered content.
L06682: opens or closes the current JavaScript structure.
L06685: starts a conditional branch.
L06687: continues a statement, function call, data value, or rendered content.
L06689: continues a statement, function call, data value, or rendered content.
L06691: continues a statement, function call, data value, or rendered content.
L06693: continues a statement, function call, data value, or rendered content.
L06695: continues a statement, function call, data value, or rendered content.
L06697: opens or closes the current JavaScript structure.
L06699: continues a statement, function call, data value, or rendered content.
L06701: continues a statement, function call, data value, or rendered content.
L06703: continues a statement, function call, data value, or rendered content.
L06705: opens or closes the current JavaScript structure.
L06707: opens or closes the current JavaScript structure.
L06710: starts a conditional branch.
L06712: continues a statement, function call, data value, or rendered content.
L06714: continues a statement, function call, data value, or rendered content.
L06716: continues a statement, function call, data value, or rendered content.
L06718: continues a statement, function call, data value, or rendered content.
L06720: opens or closes the current JavaScript structure.
L06722: opens or closes the current JavaScript structure.
L06725: declares the validateContactForm JavaScript value.
L06727: declares the valid JavaScript value.
L06729: continues a statement, function call, data value, or rendered content.
L06732: starts a conditional branch.
L06734: continues a statement, function call, data value, or rendered content.
L06736: continues a statement, function call, data value, or rendered content.
L06738: continues a statement, function call, data value, or rendered content.
L06740: continues a statement, function call, data value, or rendered content.
L06742: continues a statement, function call, data value, or rendered content.
L06744: continues a statement, function call, data value, or rendered content.
L06746: opens or closes the current JavaScript structure.
L06749: continues a statement, function call, data value, or rendered content.
L06751: continues a statement, function call, data value, or rendered content.
L06753: continues a statement, function call, data value, or rendered content.
L06755: continues a statement, function call, data value, or rendered content.
L06757: continues a statement, function call, data value, or rendered content.
L06759: continues a statement, function call, data value, or rendered content.
L06761: continues a statement, function call, data value, or rendered content.
L06763: opens or closes the current JavaScript structure.
L06765: opens or closes the current JavaScript structure.
L06768: declares the emailValue JavaScript value.
L06770: continues a statement, function call, data value, or rendered content.
L06772: continues a statement, function call, data value, or rendered content.
L06775: declares the emailValid JavaScript value.
L06777: continues a statement, function call, data value, or rendered content.
L06779: continues a chained method call.
L06782: starts a conditional branch.
L06784: continues a statement, function call, data value, or rendered content.
L06786: continues a statement, function call, data value, or rendered content.
L06788: continues a statement, function call, data value, or rendered content.
L06790: continues a statement, function call, data value, or rendered content.
L06792: continues a statement, function call, data value, or rendered content.
L06794: continues a statement, function call, data value, or rendered content.
L06796: opens or closes the current JavaScript structure.
L06799: continues a statement, function call, data value, or rendered content.
L06801: continues a statement, function call, data value, or rendered content.
L06803: continues a statement, function call, data value, or rendered content.
L06805: continues a statement, function call, data value, or rendered content.
L06807: continues a statement, function call, data value, or rendered content.
L06809: continues a statement, function call, data value, or rendered content.
L06811: continues a statement, function call, data value, or rendered content.
L06813: opens or closes the current JavaScript structure.
L06815: opens or closes the current JavaScript structure.
L06818: starts a conditional branch.
L06820: continues a statement, function call, data value, or rendered content.
L06822: continues a statement, function call, data value, or rendered content.
L06824: continues a statement, function call, data value, or rendered content.
L06826: continues a statement, function call, data value, or rendered content.
L06828: continues a statement, function call, data value, or rendered content.
L06830: continues a statement, function call, data value, or rendered content.
L06832: opens or closes the current JavaScript structure.
L06835: continues a statement, function call, data value, or rendered content.
L06837: continues a statement, function call, data value, or rendered content.
L06839: continues a statement, function call, data value, or rendered content.
L06841: continues a statement, function call, data value, or rendered content.
L06843: continues a statement, function call, data value, or rendered content.
L06845: continues a statement, function call, data value, or rendered content.
L06847: continues a statement, function call, data value, or rendered content.
L06849: opens or closes the current JavaScript structure.
L06851: opens or closes the current JavaScript structure.
L06854: starts a conditional branch.
L06856: continues a statement, function call, data value, or rendered content.
L06858: continues a statement, function call, data value, or rendered content.
L06860: continues a statement, function call, data value, or rendered content.
L06862: continues a statement, function call, data value, or rendered content.
L06864: continues a statement, function call, data value, or rendered content.
L06866: continues a statement, function call, data value, or rendered content.
L06868: opens or closes the current JavaScript structure.
L06871: continues a statement, function call, data value, or rendered content.
L06873: continues a statement, function call, data value, or rendered content.
L06875: continues a statement, function call, data value, or rendered content.
L06877: continues a statement, function call, data value, or rendered content.
L06879: continues a statement, function call, data value, or rendered content.
L06881: continues a statement, function call, data value, or rendered content.
L06883: continues a statement, function call, data value, or rendered content.
L06885: opens or closes the current JavaScript structure.
L06887: opens or closes the current JavaScript structure.
L06890: returns a value or exits the current function.
L06892: opens or closes the current JavaScript structure.
L06896: continues JavaScript documentation for maintainers.
L06897: continues a statement, function call, data value, or rendered content.
L06899: continues a statement, function call, data value, or rendered content.
L06900: continues a statement, function call, data value, or rendered content.
L06901: continues JavaScript documentation for maintainers.
L06903: declares the setFormSubmitStatus JavaScript value.
L06905: continues a statement, function call, data value, or rendered content.
L06907: continues a statement, function call, data value, or rendered content.
L06909: continues a statement, function call, data value, or rendered content.
L06911: defines or continues an arrow function.
L06913: starts a conditional branch.
L06915: continues a statement, function call, data value, or rendered content.
L06917: continues a statement, function call, data value, or rendered content.
L06919: returns a value or exits the current function.
L06921: opens or closes the current JavaScript structure.
L06924: continues a statement, function call, data value, or rendered content.
L06926: continues a statement, function call, data value, or rendered content.
L06929: continues a statement, function call, data value, or rendered content.
L06931: continues a statement, function call, data value, or rendered content.
L06933: opens or closes the current JavaScript structure.
L06936: declares the setSubmittingState JavaScript value.
L06938: continues a statement, function call, data value, or rendered content.
L06940: continues a statement, function call, data value, or rendered content.
L06942: defines or continues an arrow function.
L06944: starts a conditional branch.
L06946: continues a statement, function call, data value, or rendered content.
L06948: continues a statement, function call, data value, or rendered content.
L06950: returns a value or exits the current function.
L06952: opens or closes the current JavaScript structure.
L06955: declares the submitButton JavaScript value.
L06957: continues a statement, function call, data value, or rendered content.
L06959: continues a statement, function call, data value, or rendered content.
L06961: opens or closes the current JavaScript structure.
L06964: starts a conditional branch.
L06966: continues a statement, function call, data value, or rendered content.
L06968: continues a statement, function call, data value, or rendered content.
L06970: continues a statement, function call, data value, or rendered content.
L06972: continues a statement, function call, data value, or rendered content.
L06975: continues a statement, function call, data value, or rendered content.
L06977: continues a statement, function call, data value, or rendered content.
L06979: continues a statement, function call, data value, or rendered content.
L06981: opens or closes the current JavaScript structure.
L06984: starts a conditional branch.
L06986: continues a statement, function call, data value, or rendered content.
L06988: continues a statement, function call, data value, or rendered content.
L06990: starts a conditional branch.
L06992: continues a statement, function call, data value, or rendered content.
L06994: continues a statement, function call, data value, or rendered content.
L06996: continues a statement, function call, data value, or rendered content.
L06998: continues a statement, function call, data value, or rendered content.
L07000: opens or closes the current JavaScript structure.
L07003: continues a statement, function call, data value, or rendered content.
L07005: continues a statement, function call, data value, or rendered content.
L07007: continues a statement, function call, data value, or rendered content.
L07009: continues a statement, function call, data value, or rendered content.
L07011: continues a statement, function call, data value, or rendered content.
L07013: continues a statement, function call, data value, or rendered content.
L07015: continues a statement, function call, data value, or rendered content.
L07017: opens or closes the current JavaScript structure.
L07019: opens or closes the current JavaScript structure.
L07021: opens or closes the current JavaScript structure.
L07024: declares the createAbortControllerWithTimeout JavaScript value.
L07026: declares the controller JavaScript value.
L07028: declares the timeoutId JavaScript value.
L07030: defines or continues an arrow function.
L07032: continues a statement, function call, data value, or rendered content.
L07034: opens or closes the current JavaScript structure.
L07036: returns a value or exits the current function.
L07038: continues a statement, function call, data value, or rendered content.
L07040: defines the clear property in the current object.
L07041: defines or continues an arrow function.
L07043: opens or closes the current JavaScript structure.
L07045: opens or closes the current JavaScript structure.
L07048: declares the parseFunctionResponse JavaScript value.
L07050: declares the rawText JavaScript value.
L07052: starts a conditional branch.
L07054: returns a value or exits the current function.
L07056: opens or closes the current JavaScript structure.
L07058: starts protected error-handling logic.
L07060: returns a value or exits the current function.
L07062: continues a statement, function call, data value, or rendered content.
L07064: returns a value or exits the current function.
L07066: defines the error property in the current object.
L07067: continues a statement, function call, data value, or rendered content.
L07069: opens or closes the current JavaScript structure.
L07071: opens or closes the current JavaScript structure.
L07073: opens or closes the current JavaScript structure.
L07076: declares the describeFunctionFailure JavaScript value.
L07078: continues a statement, function call, data value, or rendered content.
L07080: continues a statement, function call, data value, or rendered content.
L07082: defines or continues an arrow function.
L07084: declares the providerMessage JavaScript value.
L07086: continues a statement, function call, data value, or rendered content.
L07088: continues a statement, function call, data value, or rendered content.
L07090: continues a statement, function call, data value, or rendered content.
L07092: continues a statement, function call, data value, or rendered content.
L07094: starts a conditional branch.
L07096: returns a value or exits the current function.
L07098: opens or closes the current JavaScript structure.
L07100: starts a conditional branch.
L07102: returns a value or exits the current function.
L07104: opens or closes the current JavaScript structure.
L07106: starts a conditional branch.
L07108: returns a value or exits the current function.
L07110: continues a statement, function call, data value, or rendered content.
L07112: opens or closes the current JavaScript structure.
L07114: starts a conditional branch.
L07116: returns a value or exits the current function.
L07118: continues a statement, function call, data value, or rendered content.
L07120: opens or closes the current JavaScript structure.
L07122: returns a value or exits the current function.
L07124: continues a statement, function call, data value, or rendered content.
L07126: opens or closes the current JavaScript structure.
L07129: declares the storeWebsiteMessageFallback JavaScript value.
L07131: continues a statement, function call, data value, or rendered content.
L07133: continues a statement, function call, data value, or rendered content.
L07135: defines or continues an arrow function.
L07137: starts a conditional branch.
L07139: raises an error for the caller.
L07141: opens or closes the current JavaScript structure.
L07143: continues a statement, function call, data value, or rendered content.
L07145: continues a statement, function call, data value, or rendered content.
L07147: continues a statement, function call, data value, or rendered content.
L07149: continues a statement, function call, data value, or rendered content.
L07151: continues a statement, function call, data value, or rendered content.
L07153: opens or closes the current JavaScript structure.
L07155: defines the p_kind property in the current object.
L07156: continues a statement, function call, data value, or rendered content.
L07158: defines the p_name property in the current object.
L07159: continues a statement, function call, data value, or rendered content.
L07161: defines the p_email property in the current object.
L07162: continues a statement, function call, data value, or rendered content.
L07164: defines the p_audience property in the current object.
L07165: continues a statement, function call, data value, or rendered content.
L07167: defines the p_subject property in the current object.
L07168: continues a statement, function call, data value, or rendered content.
L07170: defines the p_message property in the current object.
L07171: continues a statement, function call, data value, or rendered content.
L07173: defines the p_page_url property in the current object.
L07174: continues a statement, function call, data value, or rendered content.
L07176: opens or closes the current JavaScript structure.
L07178: opens or closes the current JavaScript structure.
L07180: starts a conditional branch.
L07182: declares the combinedError JavaScript value.
L07184: continues a template string used to render interface content.
L07186: opens or closes the current JavaScript structure.
L07188: continues a statement, function call, data value, or rendered content.
L07190: raises an error for the caller.
L07192: opens or closes the current JavaScript structure.
L07194: returns a value or exits the current function.
L07196: defines the ok property in the current object.
L07197: continues a statement, function call, data value, or rendered content.
L07199: defines the emailSent property in the current object.
L07200: continues a statement, function call, data value, or rendered content.
L07202: defines the storedFallback property in the current object.
L07203: continues a statement, function call, data value, or rendered content.
L07205: defines the messageId property in the current object.
L07206: continues a statement, function call, data value, or rendered content.
L07208: defines the warning property in the current object.
L07209: continues a statement, function call, data value, or rendered content.
L07211: opens or closes the current JavaScript structure.
L07213: opens or closes the current JavaScript structure.
L07216: declares the invokeWebsiteMessageFunction JavaScript value.
L07218: continues a statement, function call, data value, or rendered content.
L07220: defines or continues an arrow function.
L07222: starts a conditional branch.
L07224: raises an error for the caller.
L07226: continues a statement, function call, data value, or rendered content.
L07228: opens or closes the current JavaScript structure.
L07230: opens or closes the current JavaScript structure.
L07232: declares the functionUrl JavaScript value.
L07234: continues a template string used to render interface content.
L07236: declares the timeout JavaScript value.
L07238: continues a statement, function call, data value, or rendered content.
L07240: opens or closes the current JavaScript structure.
L07242: starts protected error-handling logic.
L07244: declares the response JavaScript value.
L07246: continues a statement, function call, data value, or rendered content.
L07248: opens or closes the current JavaScript structure.
L07250: defines the method property in the current object.
L07251: continues a statement, function call, data value, or rendered content.
L07253: defines the headers property in the current object.
L07255: continues a statement, function call, data value, or rendered content.
L07256: continues a statement, function call, data value, or rendered content.
L07258: continues a statement, function call, data value, or rendered content.
L07259: continues a statement, function call, data value, or rendered content.
L07261: continues a statement, function call, data value, or rendered content.
L07262: continues a template string used to render interface content.
L07264: continues a statement, function call, data value, or rendered content.
L07265: continues a statement, function call, data value, or rendered content.
L07267: continues a statement, function call, data value, or rendered content.
L07269: defines the body property in the current object.
L07270: continues a statement, function call, data value, or rendered content.
L07272: defines the signal property in the current object.
L07273: continues a statement, function call, data value, or rendered content.
L07275: opens or closes the current JavaScript structure.
L07277: opens or closes the current JavaScript structure.
L07279: declares the body JavaScript value.
L07281: starts a conditional branch.
L07283: declares the error JavaScript value.
L07285: continues a statement, function call, data value, or rendered content.
L07287: continues a statement, function call, data value, or rendered content.
L07289: continues a statement, function call, data value, or rendered content.
L07291: opens or closes the current JavaScript structure.
L07293: opens or closes the current JavaScript structure.
L07295: continues a statement, function call, data value, or rendered content.
L07297: continues a statement, function call, data value, or rendered content.
L07299: raises an error for the caller.
L07301: opens or closes the current JavaScript structure.
L07303: starts a conditional branch.
L07305: raises an error for the caller.
L07307: opens or closes the current JavaScript structure.
L07309: returns a value or exits the current function.
L07311: continues a statement, function call, data value, or rendered content.
L07313: declares the normalizedError JavaScript value.
L07315: continues a statement, function call, data value, or rendered content.
L07317: continues a statement, function call, data value, or rendered content.
L07319: continues a statement, function call, data value, or rendered content.
L07321: opens or closes the current JavaScript structure.
L07323: continues a statement, function call, data value, or rendered content.
L07325: continues a statement, function call, data value, or rendered content.
L07327: continues a statement, function call, data value, or rendered content.
L07329: continues a statement, function call, data value, or rendered content.
L07331: opens or closes the current JavaScript structure.
L07333: returns a value or exits the current function.
L07335: continues a statement, function call, data value, or rendered content.
L07337: continues a statement, function call, data value, or rendered content.
L07339: opens or closes the current JavaScript structure.
L07341: continues a statement, function call, data value, or rendered content.
L07343: continues a statement, function call, data value, or rendered content.
L07345: opens or closes the current JavaScript structure.
L07347: opens or closes the current JavaScript structure.
L07349: declares the contactFormStatus JavaScript value.
L07351: continues a statement, function call, data value, or rendered content.
L07353: opens or closes the current JavaScript structure.
L07356: continues a statement, function call, data value, or rendered content.
L07358: continues a statement, function call, data value, or rendered content.
L07360: continues a statement, function call, data value, or rendered content.
L07362: continues a statement, function call, data value, or rendered content.
L07364: defines or continues an arrow function.
L07366: continues a statement, function call, data value, or rendered content.
L07369: starts a conditional branch.
L07371: continues a statement, function call, data value, or rendered content.
L07373: continues a statement, function call, data value, or rendered content.
L07375: continues a statement, function call, data value, or rendered content.
L07377: defines the title property in the current object.
L07378: continues a statement, function call, data value, or rendered content.
L07380: defines the message property in the current object.
L07381: continues a statement, function call, data value, or rendered content.
L07383: defines the type property in the current object.
L07384: continues a statement, function call, data value, or rendered content.
L07386: continues a statement, function call, data value, or rendered content.
L07389: returns a value or exits the current function.
L07391: opens or closes the current JavaScript structure.
L07394: continues a statement, function call, data value, or rendered content.
L07396: continues a statement, function call, data value, or rendered content.
L07398: continues a statement, function call, data value, or rendered content.
L07400: opens or closes the current JavaScript structure.
L07403: continues a statement, function call, data value, or rendered content.
L07405: continues a statement, function call, data value, or rendered content.
L07407: continues a statement, function call, data value, or rendered content.
L07409: continues a statement, function call, data value, or rendered content.
L07411: opens or closes the current JavaScript structure.
L07414: starts protected error-handling logic.
L07416: declares the result JavaScript value.
L07418: defines the kind property in the current object.
L07419: continues a statement, function call, data value, or rendered content.
L07421: defines the name property in the current object.
L07422: continues a statement, function call, data value, or rendered content.
L07424: defines the email property in the current object.
L07425: continues a statement, function call, data value, or rendered content.
L07427: defines the audience property in the current object.
L07428: continues a statement, function call, data value, or rendered content.
L07430: defines the subject property in the current object.
L07431: continues a statement, function call, data value, or rendered content.
L07433: defines the message property in the current object.
L07434: continues a statement, function call, data value, or rendered content.
L07436: defines the website property in the current object.
L07437: continues a statement, function call, data value, or rendered content.
L07439: continues a statement, function call, data value, or rendered content.
L07441: defines the page property in the current object.
L07442: interacts with the browser document or window.
L07444: continues a statement, function call, data value, or rendered content.
L07447: continues a statement, function call, data value, or rendered content.
L07450: continues a statement, function call, data value, or rendered content.
L07452: continues a statement, function call, data value, or rendered content.
L07454: continues a statement, function call, data value, or rendered content.
L07456: continues a statement, function call, data value, or rendered content.
L07458: continues a statement, function call, data value, or rendered content.
L07460: continues a statement, function call, data value, or rendered content.
L07462: continues a statement, function call, data value, or rendered content.
L07464: continues a statement, function call, data value, or rendered content.
L07466: continues a statement, function call, data value, or rendered content.
L07468: continues a statement, function call, data value, or rendered content.
L07470: opens or closes the current JavaScript structure.
L07473: continues a statement, function call, data value, or rendered content.
L07475: defines the title property in the current object.
L07476: continues a statement, function call, data value, or rendered content.
L07478: defines the message property in the current object.
L07479: continues a statement, function call, data value, or rendered content.
L07481: continues a statement, function call, data value, or rendered content.
L07483: continues a statement, function call, data value, or rendered content.
L07485: continues a statement, function call, data value, or rendered content.
L07487: defines the type property in the current object.
L07488: continues a statement, function call, data value, or rendered content.
L07490: continues a statement, function call, data value, or rendered content.
L07492: continues a statement, function call, data value, or rendered content.
L07494: continues a statement, function call, data value, or rendered content.
L07496: continues a statement, function call, data value, or rendered content.
L07498: continues a statement, function call, data value, or rendered content.
L07500: continues a statement, function call, data value, or rendered content.
L07502: continues a statement, function call, data value, or rendered content.
L07504: continues a statement, function call, data value, or rendered content.
L07506: continues a statement, function call, data value, or rendered content.
L07508: opens or closes the current JavaScript structure.
L07511: continues a statement, function call, data value, or rendered content.
L07513: continues a statement, function call, data value, or rendered content.
L07515: continues a statement, function call, data value, or rendered content.
L07517: continues a statement, function call, data value, or rendered content.
L07519: continues a statement, function call, data value, or rendered content.
L07521: opens or closes the current JavaScript structure.
L07524: continues a statement, function call, data value, or rendered content.
L07526: defines the title property in the current object.
L07527: continues a statement, function call, data value, or rendered content.
L07529: defines the message property in the current object.
L07530: continues a statement, function call, data value, or rendered content.
L07532: defines the type property in the current object.
L07533: continues a statement, function call, data value, or rendered content.
L07535: continues a statement, function call, data value, or rendered content.
L07537: continues a statement, function call, data value, or rendered content.
L07539: continues a statement, function call, data value, or rendered content.
L07541: continues a statement, function call, data value, or rendered content.
L07543: continues a statement, function call, data value, or rendered content.
L07545: opens or closes the current JavaScript structure.
L07547: opens or closes the current JavaScript structure.
L07549: opens or closes the current JavaScript structure.
L07551: opens or closes the current JavaScript structure.
L07554: continues JavaScript documentation for maintainers.
L07555: continues a statement, function call, data value, or rendered content.
L07556: continues JavaScript documentation for maintainers.
L07558: declares the newsletterForm JavaScript value.
L07560: continues a statement, function call, data value, or rendered content.
L07562: opens or closes the current JavaScript structure.
L07565: declares the newsletterEmail JavaScript value.
L07567: continues a statement, function call, data value, or rendered content.
L07569: opens or closes the current JavaScript structure.
L07572: continues a statement, function call, data value, or rendered content.
L07574: continues a statement, function call, data value, or rendered content.
L07576: continues a statement, function call, data value, or rendered content.
L07578: continues a statement, function call, data value, or rendered content.
L07580: defines or continues an arrow function.
L07582: continues a statement, function call, data value, or rendered content.
L07585: declares the emailValue JavaScript value.
L07587: continues a statement, function call, data value, or rendered content.
L07589: continues a statement, function call, data value, or rendered content.
L07592: starts a conditional branch.
L07594: continues a statement, function call, data value, or rendered content.
L07596: continues a chained method call.
L07598: continues a statement, function call, data value, or rendered content.
L07600: continues a statement, function call, data value, or rendered content.
L07602: defines the title property in the current object.
L07603: continues a statement, function call, data value, or rendered content.
L07605: defines the message property in the current object.
L07606: continues a statement, function call, data value, or rendered content.
L07608: defines the type property in the current object.
L07609: continues a statement, function call, data value, or rendered content.
L07611: continues a statement, function call, data value, or rendered content.
L07614: continues a statement, function call, data value, or rendered content.
L07617: returns a value or exits the current function.
L07619: opens or closes the current JavaScript structure.
L07622: continues a statement, function call, data value, or rendered content.
L07624: continues a statement, function call, data value, or rendered content.
L07626: continues a statement, function call, data value, or rendered content.
L07628: opens or closes the current JavaScript structure.
L07631: starts protected error-handling logic.
L07633: waits for an asynchronous operation.
L07635: defines the kind property in the current object.
L07636: continues a statement, function call, data value, or rendered content.
L07638: defines the name property in the current object.
L07639: continues a statement, function call, data value, or rendered content.
L07641: defines the email property in the current object.
L07642: continues a statement, function call, data value, or rendered content.
L07644: defines the audience property in the current object.
L07645: continues a statement, function call, data value, or rendered content.
L07647: defines the subject property in the current object.
L07648: continues a statement, function call, data value, or rendered content.
L07650: defines the message property in the current object.
L07651: continues a statement, function call, data value, or rendered content.
L07653: defines the website property in the current object.
L07654: continues a statement, function call, data value, or rendered content.
L07656: defines the page property in the current object.
L07657: interacts with the browser document or window.
L07659: continues a statement, function call, data value, or rendered content.
L07662: continues a statement, function call, data value, or rendered content.
L07665: continues a statement, function call, data value, or rendered content.
L07667: defines the title property in the current object.
L07668: continues a statement, function call, data value, or rendered content.
L07670: defines the message property in the current object.
L07671: continues a statement, function call, data value, or rendered content.
L07673: defines the type property in the current object.
L07674: continues a statement, function call, data value, or rendered content.
L07676: continues a statement, function call, data value, or rendered content.
L07678: continues a statement, function call, data value, or rendered content.
L07680: continues a statement, function call, data value, or rendered content.
L07682: continues a statement, function call, data value, or rendered content.
L07684: continues a statement, function call, data value, or rendered content.
L07686: continues a statement, function call, data value, or rendered content.
L07688: continues a statement, function call, data value, or rendered content.
L07690: opens or closes the current JavaScript structure.
L07693: continues a statement, function call, data value, or rendered content.
L07695: defines the title property in the current object.
L07696: continues a statement, function call, data value, or rendered content.
L07698: defines the message property in the current object.
L07699: continues a statement, function call, data value, or rendered content.
L07701: continues a statement, function call, data value, or rendered content.
L07703: defines the type property in the current object.
L07704: continues a statement, function call, data value, or rendered content.
L07706: continues a statement, function call, data value, or rendered content.
L07708: continues a statement, function call, data value, or rendered content.
L07710: continues a statement, function call, data value, or rendered content.
L07712: continues a statement, function call, data value, or rendered content.
L07714: continues a statement, function call, data value, or rendered content.
L07716: opens or closes the current JavaScript structure.
L07718: opens or closes the current JavaScript structure.
L07720: opens or closes the current JavaScript structure.
L07722: opens or closes the current JavaScript structure.
L07724: continues JavaScript documentation for maintainers.
L07725: continues a statement, function call, data value, or rendered content.
L07726: continues JavaScript documentation for maintainers.
L07728: declares the floatingActions JavaScript value.
L07730: continues a statement, function call, data value, or rendered content.
L07732: opens or closes the current JavaScript structure.
L07735: declares the floatingActionsToggle JavaScript value.
L07737: continues a statement, function call, data value, or rendered content.
L07739: opens or closes the current JavaScript structure.
L07742: declares the floatingActionsMenu JavaScript value.
L07744: continues a statement, function call, data value, or rendered content.
L07746: opens or closes the current JavaScript structure.
L07749: declares the setFloatingActionsState JavaScript value.
L07751: continues a statement, function call, data value, or rendered content.
L07753: defines or continues an arrow function.
L07755: starts a conditional branch.
L07757: continues a statement, function call, data value, or rendered content.
L07759: continues a statement, function call, data value, or rendered content.
L07761: continues a statement, function call, data value, or rendered content.
L07763: returns a value or exits the current function.
L07765: opens or closes the current JavaScript structure.
L07768: continues a statement, function call, data value, or rendered content.
L07770: continues a statement, function call, data value, or rendered content.
L07772: continues a statement, function call, data value, or rendered content.
L07774: opens or closes the current JavaScript structure.
L07777: continues a statement, function call, data value, or rendered content.
L07779: continues a statement, function call, data value, or rendered content.
L07781: opens or closes the current JavaScript structure.
L07784: continues a statement, function call, data value, or rendered content.
L07786: continues a statement, function call, data value, or rendered content.
L07788: defines or continues an arrow function.
L07790: continues a statement, function call, data value, or rendered content.
L07793: declares the isOpen JavaScript value.
L07795: continues a statement, function call, data value, or rendered content.
L07797: continues a statement, function call, data value, or rendered content.
L07799: continues a statement, function call, data value, or rendered content.
L07802: continues a statement, function call, data value, or rendered content.
L07804: continues a statement, function call, data value, or rendered content.
L07806: opens or closes the current JavaScript structure.
L07808: opens or closes the current JavaScript structure.
L07810: opens or closes the current JavaScript structure.
L07813: continues a statement, function call, data value, or rendered content.
L07815: continues a statement, function call, data value, or rendered content.
L07817: defines or continues an arrow function.
L07819: continues a statement, function call, data value, or rendered content.
L07821: continues a statement, function call, data value, or rendered content.
L07823: opens or closes the current JavaScript structure.
L07825: opens or closes the current JavaScript structure.
L07827: opens or closes the current JavaScript structure.
L07830: interacts with the browser document or window.
L07832: continues a statement, function call, data value, or rendered content.
L07834: defines or continues an arrow function.
L07836: starts a conditional branch.
L07838: continues a statement, function call, data value, or rendered content.
L07840: continues a statement, function call, data value, or rendered content.
L07842: continues a statement, function call, data value, or rendered content.
L07844: opens or closes the current JavaScript structure.
L07846: continues a statement, function call, data value, or rendered content.
L07848: continues a statement, function call, data value, or rendered content.
L07850: continues a statement, function call, data value, or rendered content.
L07852: opens or closes the current JavaScript structure.
L07854: opens or closes the current JavaScript structure.
L07856: opens or closes the current JavaScript structure.
L07858: opens or closes the current JavaScript structure.
L07861: continues JavaScript documentation for maintainers.
L07862: continues a statement, function call, data value, or rendered content.
L07863: continues JavaScript documentation for maintainers.
L07865: interacts with the browser document or window.
L07867: continues a statement, function call, data value, or rendered content.
L07869: defines or continues an arrow function.
L07871: starts a conditional branch.
L07873: continues a statement, function call, data value, or rendered content.
L07875: continues a statement, function call, data value, or rendered content.
L07877: returns a value or exits the current function.
L07879: opens or closes the current JavaScript structure.
L07882: continues a statement, function call, data value, or rendered content.
L07884: continues a statement, function call, data value, or rendered content.
L07886: opens or closes the current JavaScript structure.
L07889: continues a statement, function call, data value, or rendered content.
L07891: continues a statement, function call, data value, or rendered content.
L07893: opens or closes the current JavaScript structure.
L07896: starts a conditional branch.
L07898: continues a statement, function call, data value, or rendered content.
L07899: continues a statement, function call, data value, or rendered content.
L07901: continues a statement, function call, data value, or rendered content.
L07903: continues a statement, function call, data value, or rendered content.
L07905: continues a statement, function call, data value, or rendered content.
L07907: continues a statement, function call, data value, or rendered content.
L07909: opens or closes the current JavaScript structure.
L07912: continues a statement, function call, data value, or rendered content.
L07914: opens or closes the current JavaScript structure.
L07917: starts a conditional branch.
L07919: continues a statement, function call, data value, or rendered content.
L07921: continues a statement, function call, data value, or rendered content.
L07923: continues a statement, function call, data value, or rendered content.
L07925: continues a statement, function call, data value, or rendered content.
L07927: opens or closes the current JavaScript structure.
L07929: opens or closes the current JavaScript structure.
L07931: opens or closes the current JavaScript structure.
L07934: continues JavaScript documentation for maintainers.
L07935: continues a statement, function call, data value, or rendered content.
L07936: continues JavaScript documentation for maintainers.
L07938: declares the handleInitialHash JavaScript value.
L07940: starts a conditional branch.
L07942: interacts with the browser document or window.
L07944: continues a statement, function call, data value, or rendered content.
L07946: continues a statement, function call, data value, or rendered content.
L07948: continues a statement, function call, data value, or rendered content.
L07950: opens or closes the current JavaScript structure.
L07953: interacts with the browser document or window.
L07955: defines or continues an arrow function.
L07957: continues a statement, function call, data value, or rendered content.
L07959: continues a statement, function call, data value, or rendered content.
L07961: continues a statement, function call, data value, or rendered content.
L07963: opens or closes the current JavaScript structure.
L07965: opens or closes the current JavaScript structure.
L07967: opens or closes the current JavaScript structure.
L07970: continues JavaScript documentation for maintainers.
L07971: continues a statement, function call, data value, or rendered content.
L07972: continues JavaScript documentation for maintainers.
L07974: declares the currentYear JavaScript value.
L07976: continues a statement, function call, data value, or rendered content.
L07978: opens or closes the current JavaScript structure.
L07981: starts a conditional branch.
L07983: continues a statement, function call, data value, or rendered content.
L07985: continues a statement, function call, data value, or rendered content.
L07987: continues a statement, function call, data value, or rendered content.
L07989: continues a statement, function call, data value, or rendered content.
L07991: continues a statement, function call, data value, or rendered content.
L07993: opens or closes the current JavaScript structure.
L07995: opens or closes the current JavaScript structure.
L07998: continues JavaScript documentation for maintainers.
L07999: continues a statement, function call, data value, or rendered content.
L08000: continues JavaScript documentation for maintainers.
L08002: declares the initializeWebsite JavaScript value.
L08004: continues a statement, function call, data value, or rendered content.
L08007: continues a statement, function call, data value, or rendered content.
L08010: continues a statement, function call, data value, or rendered content.
L08012: continues a statement, function call, data value, or rendered content.
L08014: opens or closes the current JavaScript structure.
L08017: continues a statement, function call, data value, or rendered content.
L08019: continues a statement, function call, data value, or rendered content.
L08021: opens or closes the current JavaScript structure.
L08024: continues a statement, function call, data value, or rendered content.
L08026: opens or closes the current JavaScript structure.
L08029: continues a statement, function call, data value, or rendered content.
L08032: continues JavaScript documentation for maintainers.
L08033: continues a statement, function call, data value, or rendered content.
L08034: continues JavaScript documentation for maintainers.
L08036: declares the developmentChecks JavaScript value.
L08038: declares the placeholderElements JavaScript value.
L08040: continues a statement, function call, data value, or rendered content.
L08042: continues a statement, function call, data value, or rendered content.
L08044: defines or continues an arrow function.
L08046: starts a conditional branch.
L08048: continues a statement, function call, data value, or rendered content.
L08050: continues a statement, function call, data value, or rendered content.
L08052: returns a value or exits the current function.
L08054: opens or closes the current JavaScript structure.
L08057: declares the placeholderPattern JavaScript value.
L08058: continues a statement, function call, data value, or rendered content.
L08060: returns a value or exits the current function.
L08061: continues a statement, function call, data value, or rendered content.
L08062: opens or closes the current JavaScript structure.
L08064: opens or closes the current JavaScript structure.
L08066: opens or closes the current JavaScript structure.
L08069: starts a conditional branch.
L08071: continues a statement, function call, data value, or rendered content.
L08073: continues a statement, function call, data value, or rendered content.
L08075: continues a statement, function call, data value, or rendered content.
L08077: continues a statement, function call, data value, or rendered content.
L08079: opens or closes the current JavaScript structure.
L08081: opens or closes the current JavaScript structure.
L08084: declares the duplicateIds JavaScript value.
L08086: continues a statement, function call, data value, or rendered content.
L08088: opens or closes the current JavaScript structure.
L08090: continues a chained method call.
L08092: defines or continues an arrow function.
L08094: opens or closes the current JavaScript structure.
L08096: continues a chained method call.
L08098: continues a statement, function call, data value, or rendered content.
L08100: continues a statement, function call, data value, or rendered content.
L08102: continues a statement, function call, data value, or rendered content.
L08104: continues a statement, function call, data value, or rendered content.
L08106: defines or continues an arrow function.
L08108: continues a statement, function call, data value, or rendered content.
L08110: continues a statement, function call, data value, or rendered content.
L08112: opens or closes the current JavaScript structure.
L08115: starts a conditional branch.
L08117: continues a statement, function call, data value, or rendered content.
L08119: continues a statement, function call, data value, or rendered content.
L08121: continues a statement, function call, data value, or rendered content.
L08123: continues a statement, function call, data value, or rendered content.
L08125: continues a statement, function call, data value, or rendered content.
L08127: opens or closes the current JavaScript structure.
L08129: opens or closes the current JavaScript structure.
L08131: opens or closes the current JavaScript structure.
L08134: continues a statement, function call, data value, or rendered content.
L08139: continues JavaScript documentation for maintainers.
L08140: continues a statement, function call, data value, or rendered content.
L08142: continues a statement, function call, data value, or rendered content.
L08143: continues a statement, function call, data value, or rendered content.
L08144: continues a statement, function call, data value, or rendered content.
L08145: continues JavaScript documentation for maintainers.
L08147: declares the routeMap JavaScript value.
L08149: continues a statement, function call, data value, or rendered content.
L08150: continues a statement, function call, data value, or rendered content.
L08151: continues a statement, function call, data value, or rendered content.
L08152: continues a statement, function call, data value, or rendered content.
L08153: continues a statement, function call, data value, or rendered content.
L08155: continues a statement, function call, data value, or rendered content.
L08156: continues a statement, function call, data value, or rendered content.
L08157: continues a statement, function call, data value, or rendered content.
L08159: continues a statement, function call, data value, or rendered content.
L08160: continues a statement, function call, data value, or rendered content.
L08161: continues a statement, function call, data value, or rendered content.
L08163: continues a statement, function call, data value, or rendered content.
L08164: continues a statement, function call, data value, or rendered content.
L08165: continues a statement, function call, data value, or rendered content.
L08167: continues a statement, function call, data value, or rendered content.
L08168: continues a statement, function call, data value, or rendered content.
L08169: continues a statement, function call, data value, or rendered content.
L08171: continues a statement, function call, data value, or rendered content.
L08172: continues a statement, function call, data value, or rendered content.
L08173: continues a statement, function call, data value, or rendered content.
L08175: continues a statement, function call, data value, or rendered content.
L08176: continues a statement, function call, data value, or rendered content.
L08177: continues a statement, function call, data value, or rendered content.
L08179: continues a statement, function call, data value, or rendered content.
L08180: continues a statement, function call, data value, or rendered content.
L08181: continues a statement, function call, data value, or rendered content.
L08183: continues a statement, function call, data value, or rendered content.
L08184: continues a statement, function call, data value, or rendered content.
L08185: continues a statement, function call, data value, or rendered content.
L08187: continues a statement, function call, data value, or rendered content.
L08188: continues a statement, function call, data value, or rendered content.
L08189: continues a statement, function call, data value, or rendered content.
L08191: continues a statement, function call, data value, or rendered content.
L08192: continues a statement, function call, data value, or rendered content.
L08193: continues a statement, function call, data value, or rendered content.
L08195: continues a statement, function call, data value, or rendered content.
L08196: continues a statement, function call, data value, or rendered content.
L08197: continues a statement, function call, data value, or rendered content.
L08199: continues a statement, function call, data value, or rendered content.
L08200: continues a statement, function call, data value, or rendered content.
L08201: continues a statement, function call, data value, or rendered content.
L08203: continues a statement, function call, data value, or rendered content.
L08204: continues a statement, function call, data value, or rendered content.
L08205: opens or closes the current JavaScript structure.
L08207: opens or closes the current JavaScript structure.
L08210: declares the routeTitles JavaScript value.
L08212: continues a statement, function call, data value, or rendered content.
L08213: continues a statement, function call, data value, or rendered content.
L08215: continues a statement, function call, data value, or rendered content.
L08216: continues a statement, function call, data value, or rendered content.
L08218: continues a statement, function call, data value, or rendered content.
L08219: continues a statement, function call, data value, or rendered content.
L08221: continues a statement, function call, data value, or rendered content.
L08222: continues a statement, function call, data value, or rendered content.
L08224: continues a statement, function call, data value, or rendered content.
L08225: continues a statement, function call, data value, or rendered content.
L08227: continues a statement, function call, data value, or rendered content.
L08228: continues a statement, function call, data value, or rendered content.
L08230: continues a statement, function call, data value, or rendered content.
L08231: continues a statement, function call, data value, or rendered content.
L08233: continues a statement, function call, data value, or rendered content.
L08234: continues a statement, function call, data value, or rendered content.
L08236: continues a statement, function call, data value, or rendered content.
L08237: continues a statement, function call, data value, or rendered content.
L08239: continues a statement, function call, data value, or rendered content.
L08240: continues a statement, function call, data value, or rendered content.
L08242: continues a statement, function call, data value, or rendered content.
L08243: continues a statement, function call, data value, or rendered content.
L08245: continues a statement, function call, data value, or rendered content.
L08246: continues a statement, function call, data value, or rendered content.
L08248: continues a statement, function call, data value, or rendered content.
L08249: continues a statement, function call, data value, or rendered content.
L08251: continues a statement, function call, data value, or rendered content.
L08252: continues a statement, function call, data value, or rendered content.
L08254: opens or closes the current JavaScript structure.
L08257: declares the routeSections JavaScript value.
L08259: continues a statement, function call, data value, or rendered content.
L08261: opens or closes the current JavaScript structure.
L08264: declares the normalizeRouteHash JavaScript value.
L08266: continues a statement, function call, data value, or rendered content.
L08268: defines or continues an arrow function.
L08270: returns a value or exits the current function.
L08272: continues a statement, function call, data value, or rendered content.
L08274: continues a statement, function call, data value, or rendered content.
L08276: opens or closes the current JavaScript structure.
L08279: declares the setRouteNavigationState JavaScript value.
L08281: continues a statement, function call, data value, or rendered content.
L08283: defines or continues an arrow function.
L08285: continues a statement, function call, data value, or rendered content.
L08287: continues a statement, function call, data value, or rendered content.
L08289: continues a statement, function call, data value, or rendered content.
L08291: defines or continues an arrow function.
L08293: declares the href JavaScript value.
L08295: continues a statement, function call, data value, or rendered content.
L08297: continues a statement, function call, data value, or rendered content.
L08299: opens or closes the current JavaScript structure.
L08302: declares the active JavaScript value.
L08304: continues a statement, function call, data value, or rendered content.
L08306: continues a statement, function call, data value, or rendered content.
L08308: continues a statement, function call, data value, or rendered content.
L08310: continues a statement, function call, data value, or rendered content.
L08312: opens or closes the current JavaScript structure.
L08315: continues a statement, function call, data value, or rendered content.
L08317: continues a statement, function call, data value, or rendered content.
L08319: continues a statement, function call, data value, or rendered content.
L08321: opens or closes the current JavaScript structure.
L08324: starts a conditional branch.
L08326: continues a statement, function call, data value, or rendered content.
L08328: continues a statement, function call, data value, or rendered content.
L08330: continues a statement, function call, data value, or rendered content.
L08332: continues a statement, function call, data value, or rendered content.
L08334: continues a statement, function call, data value, or rendered content.
L08336: opens or closes the current JavaScript structure.
L08338: continues a statement, function call, data value, or rendered content.
L08340: continues a statement, function call, data value, or rendered content.
L08342: continues a statement, function call, data value, or rendered content.
L08344: opens or closes the current JavaScript structure.
L08346: opens or closes the current JavaScript structure.
L08348: opens or closes the current JavaScript structure.
L08350: opens or closes the current JavaScript structure.
L08352: opens or closes the current JavaScript structure.
L08355: declares the renderRoute JavaScript value.
L08357: continues a statement, function call, data value, or rendered content.
L08359: defines or continues an arrow function.
L08361: declares the routeHash JavaScript value.
L08363: continues a statement, function call, data value, or rendered content.
L08365: continues a statement, function call, data value, or rendered content.
L08367: opens or closes the current JavaScript structure.
L08370: declares the visibleIds JavaScript value.
L08372: continues a statement, function call, data value, or rendered content.
L08375: interacts with the browser document or window.
L08377: continues a statement, function call, data value, or rendered content.
L08380: interacts with the browser document or window.
L08382: continues a statement, function call, data value, or rendered content.
L08385: continues a statement, function call, data value, or rendered content.
L08387: defines or continues an arrow function.
L08389: declares the visible JavaScript value.
L08391: continues a statement, function call, data value, or rendered content.
L08393: continues a statement, function call, data value, or rendered content.
L08395: opens or closes the current JavaScript structure.
L08398: continues a statement, function call, data value, or rendered content.
L08400: continues a statement, function call, data value, or rendered content.
L08403: continues a statement, function call, data value, or rendered content.
L08405: continues a statement, function call, data value, or rendered content.
L08407: continues a statement, function call, data value, or rendered content.
L08409: opens or closes the current JavaScript structure.
L08411: opens or closes the current JavaScript structure.
L08413: opens or closes the current JavaScript structure.
L08416: continues a statement, function call, data value, or rendered content.
L08418: continues a statement, function call, data value, or rendered content.
L08420: continues a statement, function call, data value, or rendered content.
L08422: defines or continues an arrow function.
L08424: continues a statement, function call, data value, or rendered content.
L08426: continues a statement, function call, data value, or rendered content.
L08428: opens or closes the current JavaScript structure.
L08430: opens or closes the current JavaScript structure.
L08433: starts a conditional branch.
L08435: continues a statement, function call, data value, or rendered content.
L08437: continues a statement, function call, data value, or rendered content.
L08439: continues a statement, function call, data value, or rendered content.
L08441: continues a statement, function call, data value, or rendered content.
L08443: opens or closes the current JavaScript structure.
L08445: continues a statement, function call, data value, or rendered content.
L08447: continues a statement, function call, data value, or rendered content.
L08449: continues a statement, function call, data value, or rendered content.
L08451: continues a statement, function call, data value, or rendered content.
L08453: continues a statement, function call, data value, or rendered content.
L08455: opens or closes the current JavaScript structure.
L08457: opens or closes the current JavaScript structure.
L08460: continues a statement, function call, data value, or rendered content.
L08462: continues a statement, function call, data value, or rendered content.
L08464: opens or closes the current JavaScript structure.
L08467: continues a statement, function call, data value, or rendered content.
L08469: continues a statement, function call, data value, or rendered content.
L08471: opens or closes the current JavaScript structure.
L08474: continues a statement, function call, data value, or rendered content.
L08476: continues a statement, function call, data value, or rendered content.
L08478: opens or closes the current JavaScript structure.
L08481: interacts with the browser document or window.
L08483: defines or continues an arrow function.
L08485: interacts with the browser document or window.
L08487: defines the top property in the current object.
L08488: continues a statement, function call, data value, or rendered content.
L08490: defines the behavior property in the current object.
L08491: continues a statement, function call, data value, or rendered content.
L08493: continues a statement, function call, data value, or rendered content.
L08495: continues a statement, function call, data value, or rendered content.
L08497: continues a statement, function call, data value, or rendered content.
L08499: continues a statement, function call, data value, or rendered content.
L08501: continues a statement, function call, data value, or rendered content.
L08503: opens or closes the current JavaScript structure.
L08505: opens or closes the current JavaScript structure.
L08508: interacts with the browser document or window.
L08510: continues a statement, function call, data value, or rendered content.
L08512: continues a statement, function call, data value, or rendered content.
L08514: continues a statement, function call, data value, or rendered content.
L08516: defines or continues an arrow function.
L08518: declares the routeLink JavaScript value.
L08520: continues a statement, function call, data value, or rendered content.
L08522: continues a statement, function call, data value, or rendered content.
L08524: opens or closes the current JavaScript structure.
L08527: starts a conditional branch.
L08529: continues a statement, function call, data value, or rendered content.
L08531: continues a statement, function call, data value, or rendered content.
L08533: returns a value or exits the current function.
L08535: opens or closes the current JavaScript structure.
L08538: declares the href JavaScript value.
L08540: continues a statement, function call, data value, or rendered content.
L08542: continues a statement, function call, data value, or rendered content.
L08544: opens or closes the current JavaScript structure.
L08547: starts a conditional branch.
L08549: continues a statement, function call, data value, or rendered content.
L08551: continues a statement, function call, data value, or rendered content.
L08553: returns a value or exits the current function.
L08555: opens or closes the current JavaScript structure.
L08558: continues a statement, function call, data value, or rendered content.
L08561: starts a conditional branch.
L08563: interacts with the browser document or window.
L08565: continues a statement, function call, data value, or rendered content.
L08567: continues a statement, function call, data value, or rendered content.
L08569: continues a statement, function call, data value, or rendered content.
L08571: opens or closes the current JavaScript structure.
L08573: continues a statement, function call, data value, or rendered content.
L08575: interacts with the browser document or window.
L08577: continues a statement, function call, data value, or rendered content.
L08579: opens or closes the current JavaScript structure.
L08581: continues a statement, function call, data value, or rendered content.
L08583: continues a statement, function call, data value, or rendered content.
L08585: opens or closes the current JavaScript structure.
L08588: interacts with the browser document or window.
L08590: continues a statement, function call, data value, or rendered content.
L08592: defines or continues an arrow function.
L08594: interacts with the browser document or window.
L08596: opens or closes the current JavaScript structure.
L08598: opens or closes the current JavaScript structure.
L08601: continues JavaScript documentation for maintainers.
L08602: continues a statement, function call, data value, or rendered content.
L08603: continues JavaScript documentation for maintainers.
L08605: interacts with the browser document or window.
L08607: continues a statement, function call, data value, or rendered content.
L08609: continues a statement, function call, data value, or rendered content.
L08611: continues a statement, function call, data value, or rendered content.
L08613: defines or continues an arrow function.
L08615: declares the prefillLink JavaScript value.
L08617: continues a statement, function call, data value, or rendered content.
L08619: continues a statement, function call, data value, or rendered content.
L08621: opens or closes the current JavaScript structure.
L08624: starts a conditional branch.
L08626: continues a statement, function call, data value, or rendered content.
L08628: continues a statement, function call, data value, or rendered content.
L08630: returns a value or exits the current function.
L08632: opens or closes the current JavaScript structure.
L08635: declares the subject JavaScript value.
L08637: continues a statement, function call, data value, or rendered content.
L08640: interacts with the browser document or window.
L08642: defines or continues an arrow function.
L08644: starts a conditional branch.
L08646: continues a statement, function call, data value, or rendered content.
L08648: continues a statement, function call, data value, or rendered content.
L08650: continues a statement, function call, data value, or rendered content.
L08652: continues a statement, function call, data value, or rendered content.
L08654: opens or closes the current JavaScript structure.
L08656: continues a statement, function call, data value, or rendered content.
L08658: continues a statement, function call, data value, or rendered content.
L08660: opens or closes the current JavaScript structure.
L08662: opens or closes the current JavaScript structure.
L08664: opens or closes the current JavaScript structure.
L08667: continues JavaScript documentation for maintainers.
L08668: continues a statement, function call, data value, or rendered content.
L08669: continues JavaScript documentation for maintainers.
L08671: continues a statement, function call, data value, or rendered content.
L08673: continues a statement, function call, data value, or rendered content.
L08675: continues a statement, function call, data value, or rendered content.
L08677: defines or continues an arrow function.
L08679: continues a statement, function call, data value, or rendered content.
L08681: continues a statement, function call, data value, or rendered content.
L08683: defines or continues an arrow function.
L08685: declares the email JavaScript value.
L08687: continues a statement, function call, data value, or rendered content.
L08689: continues a statement, function call, data value, or rendered content.
L08692: starts protected error-handling logic.
L08694: waits for an asynchronous operation.
L08696: continues a statement, function call, data value, or rendered content.
L08698: opens or closes the current JavaScript structure.
L08701: continues a statement, function call, data value, or rendered content.
L08703: defines the title property in the current object.
L08704: continues a statement, function call, data value, or rendered content.
L08706: defines the message property in the current object.
L08707: continues a template string used to render interface content.
L08709: defines the type property in the current object.
L08710: continues a statement, function call, data value, or rendered content.
L08712: continues a statement, function call, data value, or rendered content.
L08714: continues a statement, function call, data value, or rendered content.
L08716: continues a statement, function call, data value, or rendered content.
L08718: continues a statement, function call, data value, or rendered content.
L08720: continues a statement, function call, data value, or rendered content.
L08722: defines the title property in the current object.
L08723: continues a statement, function call, data value, or rendered content.
L08725: defines the message property in the current object.
L08726: continues a statement, function call, data value, or rendered content.
L08728: defines the type property in the current object.
L08729: continues a statement, function call, data value, or rendered content.
L08731: continues a statement, function call, data value, or rendered content.
L08733: opens or closes the current JavaScript structure.
L08735: opens or closes the current JavaScript structure.
L08737: opens or closes the current JavaScript structure.
L08739: opens or closes the current JavaScript structure.
L08741: opens or closes the current JavaScript structure.
L08744: continues JavaScript documentation for maintainers.
L08745: continues a statement, function call, data value, or rendered content.
L08746: continues JavaScript documentation for maintainers.
L08748: continues a statement, function call, data value, or rendered content.
L08750: continues a statement, function call, data value, or rendered content.
L08752: continues a statement, function call, data value, or rendered content.
L08754: defines or continues an arrow function.
L08756: continues a statement, function call, data value, or rendered content.
L08758: continues a statement, function call, data value, or rendered content.
L08760: defines or continues an arrow function.
L08762: declares the input JavaScript value.
L08764: continues a template string used to render interface content.
L08766: opens or closes the current JavaScript structure.
L08769: starts a conditional branch.
L08771: continues a statement, function call, data value, or rendered content.
L08773: continues a statement, function call, data value, or rendered content.
L08775: returns a value or exits the current function.
L08777: opens or closes the current JavaScript structure.
L08780: declares the showing JavaScript value.
L08782: continues a statement, function call, data value, or rendered content.
L08785: continues a statement, function call, data value, or rendered content.
L08787: continues a statement, function call, data value, or rendered content.
L08789: continues a statement, function call, data value, or rendered content.
L08791: continues a statement, function call, data value, or rendered content.
L08794: continues a statement, function call, data value, or rendered content.
L08796: continues a statement, function call, data value, or rendered content.
L08798: continues a statement, function call, data value, or rendered content.
L08800: continues a statement, function call, data value, or rendered content.
L08803: continues a statement, function call, data value, or rendered content.
L08805: continues a statement, function call, data value, or rendered content.
L08807: continues a statement, function call, data value, or rendered content.
L08809: continues a statement, function call, data value, or rendered content.
L08811: continues a statement, function call, data value, or rendered content.
L08813: opens or closes the current JavaScript structure.
L08815: opens or closes the current JavaScript structure.
L08817: opens or closes the current JavaScript structure.
L08819: opens or closes the current JavaScript structure.
L08821: opens or closes the current JavaScript structure.
L08824: continues JavaScript documentation for maintainers.
L08825: continues a statement, function call, data value, or rendered content.
L08826: continues JavaScript documentation for maintainers.
L08828: declares the portalStatus JavaScript value.
L08830: continues a statement, function call, data value, or rendered content.
L08832: opens or closes the current JavaScript structure.
L08835: declares the portalDashboard JavaScript value.
L08837: continues a statement, function call, data value, or rendered content.
L08839: opens or closes the current JavaScript structure.
L08842: declares the portalProfileSummary JavaScript value.
L08844: continues a statement, function call, data value, or rendered content.
L08846: opens or closes the current JavaScript structure.
L08849: declares the portalApprovalBanner JavaScript value.
L08851: continues a statement, function call, data value, or rendered content.
L08853: opens or closes the current JavaScript structure.
L08856: declares the privateContentList JavaScript value.
L08858: continues a statement, function call, data value, or rendered content.
L08860: opens or closes the current JavaScript structure.
L08863: declares the setPortalStatus JavaScript value.
L08865: continues a statement, function call, data value, or rendered content.
L08867: continues a statement, function call, data value, or rendered content.
L08869: defines or continues an arrow function.
L08871: starts a conditional branch.
L08873: continues a statement, function call, data value, or rendered content.
L08875: continues a statement, function call, data value, or rendered content.
L08877: continues a statement, function call, data value, or rendered content.
L08879: continues a statement, function call, data value, or rendered content.
L08882: continues a statement, function call, data value, or rendered content.
L08884: continues a statement, function call, data value, or rendered content.
L08886: opens or closes the current JavaScript structure.
L08888: opens or closes the current JavaScript structure.
L08891: declares the activatePortalTab JavaScript value.
L08893: continues a statement, function call, data value, or rendered content.
L08895: defines or continues an arrow function.
L08897: continues a statement, function call, data value, or rendered content.
L08899: continues a statement, function call, data value, or rendered content.
L08901: continues a statement, function call, data value, or rendered content.
L08903: defines or continues an arrow function.
L08905: declares the active JavaScript value.
L08907: continues a statement, function call, data value, or rendered content.
L08910: continues a statement, function call, data value, or rendered content.
L08912: continues a statement, function call, data value, or rendered content.
L08914: continues a statement, function call, data value, or rendered content.
L08916: opens or closes the current JavaScript structure.
L08919: continues a statement, function call, data value, or rendered content.
L08921: continues a statement, function call, data value, or rendered content.
L08923: continues a statement, function call, data value, or rendered content.
L08925: opens or closes the current JavaScript structure.
L08927: opens or closes the current JavaScript structure.
L08929: opens or closes the current JavaScript structure.
L08932: continues a statement, function call, data value, or rendered content.
L08934: continues a statement, function call, data value, or rendered content.
L08936: continues a statement, function call, data value, or rendered content.
L08938: defines or continues an arrow function.
L08940: continues a statement, function call, data value, or rendered content.
L08942: continues a statement, function call, data value, or rendered content.
L08944: opens or closes the current JavaScript structure.
L08946: opens or closes the current JavaScript structure.
L08948: opens or closes the current JavaScript structure.
L08951: continues a statement, function call, data value, or rendered content.
L08953: continues a statement, function call, data value, or rendered content.
L08955: continues a statement, function call, data value, or rendered content.
L08957: defines or continues an arrow function.
L08959: continues a statement, function call, data value, or rendered content.
L08961: continues a statement, function call, data value, or rendered content.
L08963: defines or continues an arrow function.
L08965: continues a statement, function call, data value, or rendered content.
L08967: opens or closes the current JavaScript structure.
L08969: opens or closes the current JavaScript structure.
L08971: opens or closes the current JavaScript structure.
L08973: opens or closes the current JavaScript structure.
L08976: continues JavaScript documentation for maintainers.
L08977: continues a statement, function call, data value, or rendered content.
L08978: continues JavaScript documentation for maintainers.
L08980: declares the portalSignInForm JavaScript value.
L08981: declares the portalRequestAccessForm JavaScript value.
L08982: declares the portalResetPasswordForm JavaScript value.
L08983: declares the portalNewPasswordForm JavaScript value.
L08984: declares the portalMagicLinkButton JavaScript value.
L08985: declares the portalResendConfirmationButton JavaScript value.
L08986: declares the portalSignOutButton JavaScript value.
L08988: declares the portalRedirectUrl JavaScript value.
L08989: declares the configured JavaScript value.
L08990: continues a statement, function call, data value, or rendered content.
L08991: continues a statement, function call, data value, or rendered content.
L08993: starts a conditional branch.
L08994: declares the configuredUrl JavaScript value.
L08995: continues a statement, function call, data value, or rendered content.
L08996: returns a value or exits the current function.
L08997: opens or closes the current JavaScript structure.
L08999: starts a conditional branch.
L09000: raises an error for the caller.
L09001: continues a statement, function call, data value, or rendered content.
L09002: opens or closes the current JavaScript structure.
L09003: opens or closes the current JavaScript structure.
L09005: continues JavaScript documentation for maintainers.
L09006: continues a statement, function call, data value, or rendered content.
L09007: continues a statement, function call, data value, or rendered content.
L09008: continues a statement, function call, data value, or rendered content.
L09009: continues a statement, function call, data value, or rendered content.
L09010: continues JavaScript documentation for maintainers.
L09011: declares the currentUrl JavaScript value.
L09012: continues a statement, function call, data value, or rendered content.
L09013: returns a value or exits the current function.
L09014: opens or closes the current JavaScript structure.
L09016: declares the describeSupabaseError JavaScript value.
L09017: continues a statement, function call, data value, or rendered content.
L09019: declares the possibleMessages JavaScript value.
L09020: continues a statement, function call, data value, or rendered content.
L09021: continues a statement, function call, data value, or rendered content.
L09022: continues a statement, function call, data value, or rendered content.
L09023: continues a statement, function call, data value, or rendered content.
L09024: continues a statement, function call, data value, or rendered content.
L09025: continues a statement, function call, data value, or rendered content.
L09026: continues a statement, function call, data value, or rendered content.
L09027: continues a statement, function call, data value, or rendered content.
L09028: continues a statement, function call, data value, or rendered content.
L09029: opens or closes the current JavaScript structure.
L09031: declares the message JavaScript value.
L09032: continues a statement, function call, data value, or rendered content.
L09033: defines or continues an arrow function.
L09034: continues a statement, function call, data value, or rendered content.
L09035: continues a statement, function call, data value, or rendered content.
L09036: continues a statement, function call, data value, or rendered content.
L09037: continues a statement, function call, data value, or rendered content.
L09038: opens or closes the current JavaScript structure.
L09039: continues a statement, function call, data value, or rendered content.
L09041: starts a conditional branch.
L09042: returns a value or exits the current function.
L09043: opens or closes the current JavaScript structure.
L09045: starts a conditional branch.
L09046: returns a value or exits the current function.
L09047: opens or closes the current JavaScript structure.
L09049: starts a conditional branch.
L09050: returns a value or exits the current function.
L09051: opens or closes the current JavaScript structure.
L09053: starts a conditional branch.
L09054: returns a value or exits the current function.
L09055: opens or closes the current JavaScript structure.
L09057: starts a conditional branch.
L09058: returns a value or exits the current function.
L09059: opens or closes the current JavaScript structure.
L09061: starts a conditional branch.
L09062: returns a value or exits the current function.
L09063: opens or closes the current JavaScript structure.
L09065: starts a conditional branch.
L09066: returns a value or exits the current function.
L09067: opens or closes the current JavaScript structure.
L09069: returns a value or exits the current function.
L09070: opens or closes the current JavaScript structure.
L09072: declares the getCurrentProfile JavaScript value.
L09073: declares the response JavaScript value.
L09074: continues a chained method call.
L09075: continues a chained method call.
L09076: continues a chained method call.
L09077: continues a chained method call.
L09079: starts a conditional branch.
L09080: declares the metadata JavaScript value.
L09082: continues a statement, function call, data value, or rendered content.
L09083: continues a statement, function call, data value, or rendered content.
L09084: opens or closes the current JavaScript structure.
L09085: defines the p_display_name property in the current object.
L09086: continues a statement, function call, data value, or rendered content.
L09087: continues a statement, function call, data value, or rendered content.
L09088: continues a statement, function call, data value, or rendered content.
L09089: defines the p_relationship property in the current object.
L09090: continues a statement, function call, data value, or rendered content.
L09091: continues a statement, function call, data value, or rendered content.
L09092: continues a statement, function call, data value, or rendered content.
L09093: defines the p_request_reason property in the current object.
L09094: continues a statement, function call, data value, or rendered content.
L09095: continues a statement, function call, data value, or rendered content.
L09096: opens or closes the current JavaScript structure.
L09097: opens or closes the current JavaScript structure.
L09099: starts a conditional branch.
L09100: raises an error for the caller.
L09101: opens or closes the current JavaScript structure.
L09103: continues a statement, function call, data value, or rendered content.
L09104: continues a chained method call.
L09105: continues a chained method call.
L09106: continues a chained method call.
L09107: continues a chained method call.
L09108: opens or closes the current JavaScript structure.
L09110: starts a conditional branch.
L09111: raises an error for the caller.
L09112: opens or closes the current JavaScript structure.
L09114: returns a value or exits the current function.
L09115: opens or closes the current JavaScript structure.
L09117: declares the formatPrivateDate JavaScript value.
L09118: starts a conditional branch.
L09119: returns a value or exits the current function.
L09120: opens or closes the current JavaScript structure.
L09122: declares the date JavaScript value.
L09124: starts a conditional branch.
L09125: returns a value or exits the current function.
L09126: opens or closes the current JavaScript structure.
L09128: returns a value or exits the current function.
L09129: defines the dateStyle property in the current object.
L09130: defines the timeStyle property in the current object.
L09131: continues a statement, function call, data value, or rendered content.
L09132: opens or closes the current JavaScript structure.
L09134: declares the renderPrivateContent JavaScript value.
L09135: starts a conditional branch.
L09136: returns a value or exits the current function.
L09137: opens or closes the current JavaScript structure.
L09139: continues a statement, function call, data value, or rendered content.
L09141: starts a conditional branch.
L09142: declares the empty JavaScript value.
L09143: continues a statement, function call, data value, or rendered content.
L09144: continues a statement, function call, data value, or rendered content.
L09145: continues a statement, function call, data value, or rendered content.
L09146: returns a value or exits the current function.
L09147: opens or closes the current JavaScript structure.
L09149: defines or continues an arrow function.
L09150: declares the article JavaScript value.
L09151: continues a statement, function call, data value, or rendered content.
L09153: declares the type JavaScript value.
L09154: continues a statement, function call, data value, or rendered content.
L09155: continues a statement, function call, data value, or rendered content.
L09157: declares the title JavaScript value.
L09158: continues a statement, function call, data value, or rendered content.
L09160: continues a statement, function call, data value, or rendered content.
L09162: starts a conditional branch.
L09163: declares the summary JavaScript value.
L09164: continues a statement, function call, data value, or rendered content.
L09165: continues a statement, function call, data value, or rendered content.
L09166: opens or closes the current JavaScript structure.
L09168: declares the details JavaScript value.
L09170: starts a conditional branch.
L09171: continues a statement, function call, data value, or rendered content.
L09172: opens or closes the current JavaScript structure.
L09174: starts a conditional branch.
L09175: continues a statement, function call, data value, or rendered content.
L09176: opens or closes the current JavaScript structure.
L09178: starts a conditional branch.
L09179: declares the meta JavaScript value.
L09180: continues a statement, function call, data value, or rendered content.
L09181: continues a statement, function call, data value, or rendered content.
L09182: continues a statement, function call, data value, or rendered content.
L09183: opens or closes the current JavaScript structure.
L09185: starts a conditional branch.
L09186: declares the link JavaScript value.
L09187: continues a statement, function call, data value, or rendered content.
L09188: continues a statement, function call, data value, or rendered content.
L09189: continues a statement, function call, data value, or rendered content.
L09190: continues a statement, function call, data value, or rendered content.
L09191: continues a statement, function call, data value, or rendered content.
L09192: continues a statement, function call, data value, or rendered content.
L09193: opens or closes the current JavaScript structure.
L09195: continues a statement, function call, data value, or rendered content.
L09196: continues a statement, function call, data value, or rendered content.
L09197: opens or closes the current JavaScript structure.
L09199: declares the refreshPortalSession JavaScript value.
L09200: starts a conditional branch.
L09201: continues a statement, function call, data value, or rendered content.
L09202: continues a statement, function call, data value, or rendered content.
L09203: continues a statement, function call, data value, or rendered content.
L09204: opens or closes the current JavaScript structure.
L09205: returns a value or exits the current function.
L09206: opens or closes the current JavaScript structure.
L09208: starts protected error-handling logic.
L09209: declares the session JavaScript value.
L09211: starts a conditional branch.
L09212: starts a conditional branch.
L09213: continues a statement, function call, data value, or rendered content.
L09214: opens or closes the current JavaScript structure.
L09216: continues a statement, function call, data value, or rendered content.
L09217: returns a value or exits the current function.
L09218: opens or closes the current JavaScript structure.
L09220: declares the profile JavaScript value.
L09222: continues a statement, function call, data value, or rendered content.
L09223: continues a statement, function call, data value, or rendered content.
L09224: continues a template string used to render interface content.
L09226: declares the status JavaScript value.
L09227: continues a statement, function call, data value, or rendered content.
L09229: starts a conditional branch.
L09230: continues a statement, function call, data value, or rendered content.
L09232: declares the bannerMessage JavaScript value.
L09234: continues a statement, function call, data value, or rendered content.
L09235: continues a statement, function call, data value, or rendered content.
L09236: continues a statement, function call, data value, or rendered content.
L09237: continues a statement, function call, data value, or rendered content.
L09238: continues a statement, function call, data value, or rendered content.
L09239: continues a statement, function call, data value, or rendered content.
L09241: continues a statement, function call, data value, or rendered content.
L09243: starts a conditional branch.
L09244: declares the resendButton JavaScript value.
L09246: continues a statement, function call, data value, or rendered content.
L09247: continues a statement, function call, data value, or rendered content.
L09248: continues a statement, function call, data value, or rendered content.
L09249: continues a statement, function call, data value, or rendered content.
L09251: defines or continues an arrow function.
L09252: continues a statement, function call, data value, or rendered content.
L09253: continues a statement, function call, data value, or rendered content.
L09255: starts protected error-handling logic.
L09256: declares the result JavaScript value.
L09257: defines the kind property in the current object.
L09258: defines the workflow property in the current object.
L09260: defines the name property in the current object.
L09261: continues a statement, function call, data value, or rendered content.
L09262: continues a statement, function call, data value, or rendered content.
L09263: continues a statement, function call, data value, or rendered content.
L09264: defines the email property in the current object.
L09265: continues a statement, function call, data value, or rendered content.
L09266: continues a statement, function call, data value, or rendered content.
L09267: continues a statement, function call, data value, or rendered content.
L09268: defines the audience property in the current object.
L09269: continues a statement, function call, data value, or rendered content.
L09270: continues a statement, function call, data value, or rendered content.
L09271: defines the subject property in the current object.
L09272: continues a statement, function call, data value, or rendered content.
L09273: defines the message property in the current object.
L09274: continues a statement, function call, data value, or rendered content.
L09275: continues a statement, function call, data value, or rendered content.
L09276: defines the website property in the current object.
L09277: defines the page property in the current object.
L09278: defines the authUserId property in the current object.
L09279: defines the relationship property in the current object.
L09280: continues a statement, function call, data value, or rendered content.
L09281: continues a statement, function call, data value, or rendered content.
L09282: continues a statement, function call, data value, or rendered content.
L09283: defines the requestedRole property in the current object.
L09284: continues a statement, function call, data value, or rendered content.
L09285: continues a statement, function call, data value, or rendered content.
L09286: defines the requestReason property in the current object.
L09287: continues a statement, function call, data value, or rendered content.
L09288: continues a statement, function call, data value, or rendered content.
L09289: continues a statement, function call, data value, or rendered content.
L09291: continues a statement, function call, data value, or rendered content.
L09292: continues a statement, function call, data value, or rendered content.
L09293: continues a statement, function call, data value, or rendered content.
L09294: continues a statement, function call, data value, or rendered content.
L09295: continues a statement, function call, data value, or rendered content.
L09296: continues a statement, function call, data value, or rendered content.
L09297: continues a statement, function call, data value, or rendered content.
L09298: opens or closes the current JavaScript structure.
L09299: continues a statement, function call, data value, or rendered content.
L09300: continues a statement, function call, data value, or rendered content.
L09301: continues a statement, function call, data value, or rendered content.
L09302: continues a statement, function call, data value, or rendered content.
L09303: opens or closes the current JavaScript structure.
L09305: continues a statement, function call, data value, or rendered content.
L09306: continues a statement, function call, data value, or rendered content.
L09307: continues a statement, function call, data value, or rendered content.
L09308: opens or closes the current JavaScript structure.
L09309: continues a statement, function call, data value, or rendered content.
L09310: defines or continues an arrow function.
L09311: continues a statement, function call, data value, or rendered content.
L09312: continues a statement, function call, data value, or rendered content.
L09313: continues a statement, function call, data value, or rendered content.
L09314: continues a statement, function call, data value, or rendered content.
L09315: opens or closes the current JavaScript structure.
L09316: continues a statement, function call, data value, or rendered content.
L09318: continues a statement, function call, data value, or rendered content.
L09319: opens or closes the current JavaScript structure.
L09321: continues a statement, function call, data value, or rendered content.
L09322: continues a statement, function call, data value, or rendered content.
L09323: continues a statement, function call, data value, or rendered content.
L09324: continues a statement, function call, data value, or rendered content.
L09325: opens or closes the current JavaScript structure.
L09326: returns a value or exits the current function.
L09327: opens or closes the current JavaScript structure.
L09329: continues a statement, function call, data value, or rendered content.
L09330: continues a statement, function call, data value, or rendered content.
L09332: continues a statement, function call, data value, or rendered content.
L09333: continues a chained method call.
L09334: continues a chained method call.
L09335: continues a statement, function call, data value, or rendered content.
L09336: opens or closes the current JavaScript structure.
L09337: continues a chained method call.
L09338: continues a chained method call.
L09339: continues a chained method call.
L09341: starts a conditional branch.
L09342: raises an error for the caller.
L09343: opens or closes the current JavaScript structure.
L09345: continues a statement, function call, data value, or rendered content.
L09346: continues a statement, function call, data value, or rendered content.
L09347: continues a statement, function call, data value, or rendered content.
L09348: continues a statement, function call, data value, or rendered content.
L09349: continues a statement, function call, data value, or rendered content.
L09350: opens or closes the current JavaScript structure.
L09351: opens or closes the current JavaScript structure.
L09353: defines or continues an arrow function.
L09354: continues a statement, function call, data value, or rendered content.
L09356: starts a conditional branch.
L09357: continues a statement, function call, data value, or rendered content.
L09358: returns a value or exits the current function.
L09359: opens or closes the current JavaScript structure.
L09361: declares the formData JavaScript value.
L09362: continues a statement, function call, data value, or rendered content.
L09363: continues a statement, function call, data value, or rendered content.
L09365: starts protected error-handling logic.
L09366: continues a statement, function call, data value, or rendered content.
L09367: defines the email property in the current object.
L09368: defines the password property in the current object.
L09369: continues a statement, function call, data value, or rendered content.
L09371: starts a conditional branch.
L09372: raises an error for the caller.
L09373: opens or closes the current JavaScript structure.
L09375: waits for an asynchronous operation.
L09376: continues a statement, function call, data value, or rendered content.
L09377: continues a statement, function call, data value, or rendered content.
L09378: continues a statement, function call, data value, or rendered content.
L09379: continues a statement, function call, data value, or rendered content.
L09380: opens or closes the current JavaScript structure.
L09381: continues a statement, function call, data value, or rendered content.
L09383: defines or continues an arrow function.
L09384: starts a conditional branch.
L09385: continues a statement, function call, data value, or rendered content.
L09386: returns a value or exits the current function.
L09387: opens or closes the current JavaScript structure.
L09389: declares the email JavaScript value.
L09391: starts a conditional branch.
L09392: continues a statement, function call, data value, or rendered content.
L09393: returns a value or exits the current function.
L09394: opens or closes the current JavaScript structure.
L09396: continues a statement, function call, data value, or rendered content.
L09398: starts protected error-handling logic.
L09399: continues a statement, function call, data value, or rendered content.
L09400: continues a statement, function call, data value, or rendered content.
L09401: defines the options property in the current object.
L09402: defines the shouldCreateUser property in the current object.
L09403: defines the emailRedirectTo property in the current object.
L09404: opens or closes the current JavaScript structure.
L09405: continues a statement, function call, data value, or rendered content.
L09407: starts a conditional branch.
L09408: raises an error for the caller.
L09409: opens or closes the current JavaScript structure.
L09411: continues a statement, function call, data value, or rendered content.
L09412: continues a statement, function call, data value, or rendered content.
L09413: continues a statement, function call, data value, or rendered content.
L09414: opens or closes the current JavaScript structure.
L09415: continues a statement, function call, data value, or rendered content.
L09416: continues a statement, function call, data value, or rendered content.
L09417: continues a statement, function call, data value, or rendered content.
L09418: continues a statement, function call, data value, or rendered content.
L09419: opens or closes the current JavaScript structure.
L09420: continues a statement, function call, data value, or rendered content.
L09423: defines or continues an arrow function.
L09424: starts a conditional branch.
L09425: continues a statement, function call, data value, or rendered content.
L09426: returns a value or exits the current function.
L09427: opens or closes the current JavaScript structure.
L09429: declares the email JavaScript value.
L09431: starts a conditional branch.
L09432: continues a statement, function call, data value, or rendered content.
L09433: returns a value or exits the current function.
L09434: opens or closes the current JavaScript structure.
L09436: continues a statement, function call, data value, or rendered content.
L09437: continues a statement, function call, data value, or rendered content.
L09439: starts protected error-handling logic.
L09440: continues a statement, function call, data value, or rendered content.
L09441: defines the type property in the current object.
L09442: continues a statement, function call, data value, or rendered content.
L09443: defines the options property in the current object.
L09444: defines the emailRedirectTo property in the current object.
L09445: opens or closes the current JavaScript structure.
L09446: continues a statement, function call, data value, or rendered content.
L09448: starts a conditional branch.
L09449: raises an error for the caller.
L09450: opens or closes the current JavaScript structure.
L09452: continues a statement, function call, data value, or rendered content.
L09453: continues a statement, function call, data value, or rendered content.
L09454: continues a statement, function call, data value, or rendered content.
L09455: opens or closes the current JavaScript structure.
L09456: continues a statement, function call, data value, or rendered content.
L09457: continues a statement, function call, data value, or rendered content.
L09458: continues a statement, function call, data value, or rendered content.
L09459: continues a statement, function call, data value, or rendered content.
L09460: opens or closes the current JavaScript structure.
L09461: continues a statement, function call, data value, or rendered content.
L09463: defines or continues an arrow function.
L09464: continues a statement, function call, data value, or rendered content.
L09466: starts a conditional branch.
L09467: continues a statement, function call, data value, or rendered content.
L09468: returns a value or exits the current function.
L09469: opens or closes the current JavaScript structure.
L09471: declares the formData JavaScript value.
L09472: declares the fullName JavaScript value.
L09473: declares the email JavaScript value.
L09474: declares the password JavaScript value.
L09475: declares the role JavaScript value.
L09476: declares the reason JavaScript value.
L09478: continues a statement, function call, data value, or rendered content.
L09479: continues a statement, function call, data value, or rendered content.
L09481: starts protected error-handling logic.
L09482: declares the redirectTo JavaScript value.
L09484: continues a statement, function call, data value, or rendered content.
L09485: continues a statement, function call, data value, or rendered content.
L09486: continues a statement, function call, data value, or rendered content.
L09487: defines the options property in the current object.
L09488: defines the emailRedirectTo property in the current object.
L09489: defines the data property in the current object.
L09490: defines the display_name property in the current object.
L09491: defines the relationship property in the current object.
L09492: continues a statement, function call, data value, or rendered content.
L09493: continues a statement, function call, data value, or rendered content.
L09494: continues a statement, function call, data value, or rendered content.
L09495: defines the request_reason property in the current object.
L09496: opens or closes the current JavaScript structure.
L09497: opens or closes the current JavaScript structure.
L09498: continues a statement, function call, data value, or rendered content.
L09500: starts a conditional branch.
L09501: raises an error for the caller.
L09502: opens or closes the current JavaScript structure.
L09504: continues JavaScript documentation for maintainers.
L09505: continues a statement, function call, data value, or rendered content.
L09506: continues a statement, function call, data value, or rendered content.
L09507: continues a statement, function call, data value, or rendered content.
L09508: continues JavaScript documentation for maintainers.
L09509: starts a conditional branch.
L09510: continues a statement, function call, data value, or rendered content.
L09511: continues a statement, function call, data value, or rendered content.
L09512: continues a statement, function call, data value, or rendered content.
L09513: continues a statement, function call, data value, or rendered content.
L09514: continues a statement, function call, data value, or rendered content.
L09515: continues a statement, function call, data value, or rendered content.
L09516: continues a statement, function call, data value, or rendered content.
L09517: continues a statement, function call, data value, or rendered content.
L09518: opens or closes the current JavaScript structure.
L09519: returns a value or exits the current function.
L09520: opens or closes the current JavaScript structure.
L09522: declares the notificationResult JavaScript value.
L09524: starts protected error-handling logic.
L09525: continues a statement, function call, data value, or rendered content.
L09526: defines the kind property in the current object.
L09527: defines the workflow property in the current object.
L09529: defines the name property in the current object.
L09530: continues a statement, function call, data value, or rendered content.
L09531: defines the audience property in the current object.
L09532: defines the subject property in the current object.
L09533: defines the message property in the current object.
L09534: defines the website property in the current object.
L09535: defines the page property in the current object.
L09536: defines the authUserId property in the current object.
L09537: defines the relationship property in the current object.
L09538: continues a statement, function call, data value, or rendered content.
L09539: continues a statement, function call, data value, or rendered content.
L09540: continues a statement, function call, data value, or rendered content.
L09541: defines the requestedRole property in the current object.
L09542: defines the requestReason property in the current object.
L09543: continues a statement, function call, data value, or rendered content.
L09544: continues a statement, function call, data value, or rendered content.
L09545: continues a statement, function call, data value, or rendered content.
L09546: continues a statement, function call, data value, or rendered content.
L09547: continues a statement, function call, data value, or rendered content.
L09548: opens or closes the current JavaScript structure.
L09549: opens or closes the current JavaScript structure.
L09551: continues a statement, function call, data value, or rendered content.
L09552: continues a statement, function call, data value, or rendered content.
L09554: starts a conditional branch.
L09555: continues a statement, function call, data value, or rendered content.
L09556: continues a statement, function call, data value, or rendered content.
L09557: continues a statement, function call, data value, or rendered content.
L09558: opens or closes the current JavaScript structure.
L09559: continues a statement, function call, data value, or rendered content.
L09560: continues a statement, function call, data value, or rendered content.
L09561: continues a statement, function call, data value, or rendered content.
L09562: continues a statement, function call, data value, or rendered content.
L09563: continues a statement, function call, data value, or rendered content.
L09564: continues a statement, function call, data value, or rendered content.
L09565: continues a statement, function call, data value, or rendered content.
L09566: continues a statement, function call, data value, or rendered content.
L09567: opens or closes the current JavaScript structure.
L09568: opens or closes the current JavaScript structure.
L09569: continues a statement, function call, data value, or rendered content.
L09570: continues a statement, function call, data value, or rendered content.
L09571: continues a statement, function call, data value, or rendered content.
L09572: continues a statement, function call, data value, or rendered content.
L09573: opens or closes the current JavaScript structure.
L09574: continues a statement, function call, data value, or rendered content.
L09576: defines or continues an arrow function.
L09577: continues a statement, function call, data value, or rendered content.
L09579: starts a conditional branch.
L09580: continues a statement, function call, data value, or rendered content.
L09581: returns a value or exits the current function.
L09582: opens or closes the current JavaScript structure.
L09584: declares the email JavaScript value.
L09585: continues a statement, function call, data value, or rendered content.
L09586: continues a statement, function call, data value, or rendered content.
L09588: continues a statement, function call, data value, or rendered content.
L09590: starts protected error-handling logic.
L09591: continues a statement, function call, data value, or rendered content.
L09592: continues a statement, function call, data value, or rendered content.
L09593: continues a statement, function call, data value, or rendered content.
L09594: opens or closes the current JavaScript structure.
L09596: starts a conditional branch.
L09597: raises an error for the caller.
L09598: opens or closes the current JavaScript structure.
L09600: continues a statement, function call, data value, or rendered content.
L09601: continues a statement, function call, data value, or rendered content.
L09602: continues a statement, function call, data value, or rendered content.
L09603: continues a statement, function call, data value, or rendered content.
L09604: continues a statement, function call, data value, or rendered content.
L09605: opens or closes the current JavaScript structure.
L09606: continues a statement, function call, data value, or rendered content.
L09608: defines or continues an arrow function.
L09609: continues a statement, function call, data value, or rendered content.
L09611: declares the password JavaScript value.
L09612: continues a statement, function call, data value, or rendered content.
L09613: opens or closes the current JavaScript structure.
L09615: continues a statement, function call, data value, or rendered content.
L09617: starts protected error-handling logic.
L09618: continues a statement, function call, data value, or rendered content.
L09620: starts a conditional branch.
L09621: raises an error for the caller.
L09622: opens or closes the current JavaScript structure.
L09624: continues a statement, function call, data value, or rendered content.
L09625: continues a statement, function call, data value, or rendered content.
L09626: continues a statement, function call, data value, or rendered content.
L09627: continues a statement, function call, data value, or rendered content.
L09628: continues a statement, function call, data value, or rendered content.
L09629: continues a statement, function call, data value, or rendered content.
L09630: opens or closes the current JavaScript structure.
L09631: continues a statement, function call, data value, or rendered content.
L09633: defines or continues an arrow function.
L09634: starts a conditional branch.
L09635: waits for an asynchronous operation.
L09636: opens or closes the current JavaScript structure.
L09638: continues a statement, function call, data value, or rendered content.
L09639: continues a statement, function call, data value, or rendered content.
L09640: continues a statement, function call, data value, or rendered content.
L09642: starts a conditional branch.
L09643: defines or continues an arrow function.
L09644: defines or continues an arrow function.
L09645: starts a conditional branch.
L09646: continues a statement, function call, data value, or rendered content.
L09647: continues a statement, function call, data value, or rendered content.
L09648: interacts with the browser document or window.
L09649: opens or closes the current JavaScript structure.
L09651: continues a statement, function call, data value, or rendered content.
L09652: continues a statement, function call, data value, or rendered content.
L09653: continues a statement, function call, data value, or rendered content.
L09654: continues a statement, function call, data value, or rendered content.
L09655: continues a statement, function call, data value, or rendered content.
L09656: continues a statement, function call, data value, or rendered content.
L09657: continues a statement, function call, data value, or rendered content.
L09658: opens or closes the current JavaScript structure.
L09659: opens or closes the current JavaScript structure.
L09662: continues JavaScript documentation for maintainers.
L09663: continues a statement, function call, data value, or rendered content.
L09664: continues JavaScript documentation for maintainers.
L09666: defines or continues an arrow function.
L09667: declares the trigger JavaScript value.
L09669: starts a conditional branch.
L09670: returns a value or exits the current function.
L09671: opens or closes the current JavaScript structure.
L09673: continues a statement, function call, data value, or rendered content.
L09674: interacts with the browser document or window.
L09676: continues a statement, function call, data value, or rendered content.
L09677: continues a statement, function call, data value, or rendered content.
L09678: continues a statement, function call, data value, or rendered content.
L09679: opens or closes the current JavaScript structure.
L09680: continues a statement, function call, data value, or rendered content.
L09683: continues JavaScript documentation for maintainers.
L09684: continues a statement, function call, data value, or rendered content.
L09685: continues JavaScript documentation for maintainers.
L09687: declares the publicCalendarFrame JavaScript value.
L09689: starts a conditional branch.
L09690: continues a statement, function call, data value, or rendered content.
L09691: continues a statement, function call, data value, or rendered content.
L09692: continues a statement, function call, data value, or rendered content.
L09693: declares the calendarUrl JavaScript value.
L09695: starts a conditional branch.
L09696: declares the iframe JavaScript value.
L09697: starts a conditional branch.
L09698: starts a conditional branch.
L09699: starts a conditional branch.
L09700: starts a conditional branch.
L09701: continues a statement, function call, data value, or rendered content.
L09702: opens or closes the current JavaScript structure.
L09703: opens or closes the current JavaScript structure.
L09706: continues JavaScript documentation for maintainers.
L09707: continues a statement, function call, data value, or rendered content.
L09708: continues JavaScript documentation for maintainers.
L09710: continues a statement, function call, data value, or rendered content.
L09711: continues a statement, function call, data value, or rendered content.
L09713: continues a statement, function call, data value, or rendered content.
L09714: continues a statement, function call, data value, or rendered content.
L09715: opens or closes the current JavaScript structure.
L09718: continues JavaScript documentation for maintainers.
L09719: continues a statement, function call, data value, or rendered content.
L09721: continues a statement, function call, data value, or rendered content.
L09722: continues a statement, function call, data value, or rendered content.
L09724: continues a statement, function call, data value, or rendered content.
L09725: continues a statement, function call, data value, or rendered content.
L09726: continues a statement, function call, data value, or rendered content.
L09727: continues a statement, function call, data value, or rendered content.
L09729: continues a statement, function call, data value, or rendered content.
L09730: continues a statement, function call, data value, or rendered content.
L09731: continues JavaScript documentation for maintainers.
L09733: declares the getAccessReviewFunctionUrl JavaScript value.
L09734: returns a value or exits the current function.
L09735: continues a statement, function call, data value, or rendered content.
L09736: continues a statement, function call, data value, or rendered content.
L09737: opens or closes the current JavaScript structure.
L09740: declares the callAccessReviewFunction JavaScript value.
L09741: continues a statement, function call, data value, or rendered content.
L09742: continues a statement, function call, data value, or rendered content.
L09743: continues a statement, function call, data value, or rendered content.
L09744: defines or continues an arrow function.
L09745: starts a conditional branch.
L09746: raises an error for the caller.
L09747: continues a statement, function call, data value, or rendered content.
L09748: opens or closes the current JavaScript structure.
L09749: opens or closes the current JavaScript structure.
L09751: declares the functionUrl JavaScript value.
L09753: starts a conditional branch.
L09754: continues a statement, function call, data value, or rendered content.
L09755: opens or closes the current JavaScript structure.
L09757: declares the response JavaScript value.
L09758: continues a statement, function call, data value, or rendered content.
L09759: defines the headers property in the current object.
L09760: continues a statement, function call, data value, or rendered content.
L09761: continues a statement, function call, data value, or rendered content.
L09762: continues a statement, function call, data value, or rendered content.
L09763: continues a template string used to render interface content.
L09764: continues a statement, function call, data value, or rendered content.
L09765: continues a statement, function call, data value, or rendered content.
L09766: defines the body property in the current object.
L09767: continues a statement, function call, data value, or rendered content.
L09768: continues a statement, function call, data value, or rendered content.
L09769: continues a statement, function call, data value, or rendered content.
L09770: continues a statement, function call, data value, or rendered content.
L09772: declares the body JavaScript value.
L09774: starts a conditional branch.
L09775: declares the error JavaScript value.
L09776: continues a statement, function call, data value, or rendered content.
L09777: continues a statement, function call, data value, or rendered content.
L09778: continues a template string used to render interface content.
L09779: opens or closes the current JavaScript structure.
L09781: continues a statement, function call, data value, or rendered content.
L09782: continues a statement, function call, data value, or rendered content.
L09784: raises an error for the caller.
L09785: opens or closes the current JavaScript structure.
L09787: returns a value or exits the current function.
L09788: opens or closes the current JavaScript structure.
L09791: declares the removeAccessReviewParameters JavaScript value.
L09792: declares the url JavaScript value.
L09794: continues a statement, function call, data value, or rendered content.
L09795: continues a statement, function call, data value, or rendered content.
L09797: continues a statement, function call, data value, or rendered content.
L09798: continues a statement, function call, data value, or rendered content.
L09799: continues a statement, function call, data value, or rendered content.
L09800: continues a template string used to render interface content.
L09801: opens or closes the current JavaScript structure.
L09802: opens or closes the current JavaScript structure.
L09805: declares the appendReviewDetail JavaScript value.
L09806: declares the row JavaScript value.
L09807: declares the strong JavaScript value.
L09809: continues a statement, function call, data value, or rendered content.
L09810: continues a statement, function call, data value, or rendered content.
L09811: continues a statement, function call, data value, or rendered content.
L09812: opens or closes the current JavaScript structure.
L09815: declares the showAccessReviewResult JavaScript value.
L09816: continues a statement, function call, data value, or rendered content.
L09817: continues a statement, function call, data value, or rendered content.
L09818: continues a statement, function call, data value, or rendered content.
L09819: defines or continues an arrow function.
L09820: continues a statement, function call, data value, or rendered content.
L09821: continues a statement, function call, data value, or rendered content.
L09822: continues a statement, function call, data value, or rendered content.
L09823: continues a statement, function call, data value, or rendered content.
L09824: continues a statement, function call, data value, or rendered content.
L09826: continues a statement, function call, data value, or rendered content.
L09828: declares the message JavaScript value.
L09830: continues a statement, function call, data value, or rendered content.
L09831: continues a statement, function call, data value, or rendered content.
L09832: continues a statement, function call, data value, or rendered content.
L09833: continues a statement, function call, data value, or rendered content.
L09835: continues a statement, function call, data value, or rendered content.
L09837: starts a conditional branch.
L09838: declares the notice JavaScript value.
L09840: continues a statement, function call, data value, or rendered content.
L09841: continues a statement, function call, data value, or rendered content.
L09842: continues a statement, function call, data value, or rendered content.
L09844: continues a statement, function call, data value, or rendered content.
L09845: opens or closes the current JavaScript structure.
L09847: continues a statement, function call, data value, or rendered content.
L09849: declares the closeButton JavaScript value.
L09851: continues a statement, function call, data value, or rendered content.
L09852: continues a statement, function call, data value, or rendered content.
L09853: continues a statement, function call, data value, or rendered content.
L09854: continues a statement, function call, data value, or rendered content.
L09856: continues a statement, function call, data value, or rendered content.
L09858: continues a statement, function call, data value, or rendered content.
L09859: opens or closes the current JavaScript structure.
L09862: declares the submitAccessReviewDecision JavaScript value.
L09863: continues a statement, function call, data value, or rendered content.
L09864: continues a statement, function call, data value, or rendered content.
L09865: continues a statement, function call, data value, or rendered content.
L09866: continues a statement, function call, data value, or rendered content.
L09867: defines or continues an arrow function.
L09868: defines or continues an arrow function.
L09869: continues a statement, function call, data value, or rendered content.
L09870: continues a statement, function call, data value, or rendered content.
L09872: declares the originalText JavaScript value.
L09874: continues a statement, function call, data value, or rendered content.
L09875: continues a statement, function call, data value, or rendered content.
L09876: continues a statement, function call, data value, or rendered content.
L09877: continues a statement, function call, data value, or rendered content.
L09879: starts protected error-handling logic.
L09880: declares the result JavaScript value.
L09881: defines the method property in the current object.
L09882: continues a statement, function call, data value, or rendered content.
L09883: continues a statement, function call, data value, or rendered content.
L09884: continues a statement, function call, data value, or rendered content.
L09886: continues a statement, function call, data value, or rendered content.
L09887: continues a statement, function call, data value, or rendered content.
L09888: defines the decisionEmailSent property in the current object.
L09889: defines the warning property in the current object.
L09890: continues a statement, function call, data value, or rendered content.
L09891: continues a statement, function call, data value, or rendered content.
L09892: continues a statement, function call, data value, or rendered content.
L09894: declares the errorMessage JavaScript value.
L09896: continues a statement, function call, data value, or rendered content.
L09897: continues a statement, function call, data value, or rendered content.
L09899: continues a statement, function call, data value, or rendered content.
L09901: defines or continues an arrow function.
L09902: continues a statement, function call, data value, or rendered content.
L09903: continues a statement, function call, data value, or rendered content.
L09905: continues a statement, function call, data value, or rendered content.
L09906: opens or closes the current JavaScript structure.
L09907: opens or closes the current JavaScript structure.
L09910: declares the openAccessReviewModal JavaScript value.
L09911: continues a statement, function call, data value, or rendered content.
L09912: continues a statement, function call, data value, or rendered content.
L09913: continues a statement, function call, data value, or rendered content.
L09914: defines or continues an arrow function.
L09915: starts a conditional branch.
L09916: returns a value or exits the current function.
L09917: opens or closes the current JavaScript structure.
L09919: continues a statement, function call, data value, or rendered content.
L09921: continues a statement, function call, data value, or rendered content.
L09922: continues a statement, function call, data value, or rendered content.
L09923: continues a statement, function call, data value, or rendered content.
L09924: continues a statement, function call, data value, or rendered content.
L09926: declares the intro JavaScript value.
L09928: continues a statement, function call, data value, or rendered content.
L09929: continues a statement, function call, data value, or rendered content.
L09931: continues a statement, function call, data value, or rendered content.
L09933: continues a statement, function call, data value, or rendered content.
L09934: continues a statement, function call, data value, or rendered content.
L09935: continues a statement, function call, data value, or rendered content.
L09936: continues a statement, function call, data value, or rendered content.
L09937: continues a statement, function call, data value, or rendered content.
L09938: continues a statement, function call, data value, or rendered content.
L09939: continues a statement, function call, data value, or rendered content.
L09940: continues a statement, function call, data value, or rendered content.
L09941: continues a statement, function call, data value, or rendered content.
L09942: continues a statement, function call, data value, or rendered content.
L09943: continues a statement, function call, data value, or rendered content.
L09944: opens or closes the current JavaScript structure.
L09945: continues a statement, function call, data value, or rendered content.
L09946: continues a statement, function call, data value, or rendered content.
L09947: continues a statement, function call, data value, or rendered content.
L09948: continues a statement, function call, data value, or rendered content.
L09949: continues a statement, function call, data value, or rendered content.
L09950: continues a statement, function call, data value, or rendered content.
L09951: opens or closes the current JavaScript structure.
L09953: declares the securityNotice JavaScript value.
L09955: continues a statement, function call, data value, or rendered content.
L09956: continues a statement, function call, data value, or rendered content.
L09958: continues a statement, function call, data value, or rendered content.
L09960: declares the approveButton JavaScript value.
L09961: declares the rejectButton JavaScript value.
L09962: declares the closeButton JavaScript value.
L09964: continues a statement, function call, data value, or rendered content.
L09965: continues a statement, function call, data value, or rendered content.
L09966: continues a statement, function call, data value, or rendered content.
L09968: continues a statement, function call, data value, or rendered content.
L09969: continues a statement, function call, data value, or rendered content.
L09970: continues a statement, function call, data value, or rendered content.
L09972: continues a statement, function call, data value, or rendered content.
L09973: continues a statement, function call, data value, or rendered content.
L09974: continues a statement, function call, data value, or rendered content.
L09976: starts a conditional branch.
L09977: continues a statement, function call, data value, or rendered content.
L09978: continues a statement, function call, data value, or rendered content.
L09979: continues a statement, function call, data value, or rendered content.
L09980: opens or closes the current JavaScript structure.
L09982: declares the actionButtons JavaScript value.
L09984: continues a statement, function call, data value, or rendered content.
L09985: continues a statement, function call, data value, or rendered content.
L09986: defines or continues an arrow function.
L09987: continues a statement, function call, data value, or rendered content.
L09988: continues a statement, function call, data value, or rendered content.
L09989: continues a statement, function call, data value, or rendered content.
L09990: continues a statement, function call, data value, or rendered content.
L09991: opens or closes the current JavaScript structure.
L09992: opens or closes the current JavaScript structure.
L09994: continues a statement, function call, data value, or rendered content.
L09995: continues a statement, function call, data value, or rendered content.
L09996: defines or continues an arrow function.
L09997: continues a statement, function call, data value, or rendered content.
L09998: continues a statement, function call, data value, or rendered content.
L09999: continues a statement, function call, data value, or rendered content.
L10000: continues a statement, function call, data value, or rendered content.
L10001: opens or closes the current JavaScript structure.
L10002: opens or closes the current JavaScript structure.
L10004: continues a statement, function call, data value, or rendered content.
L10006: continues a statement, function call, data value, or rendered content.
L10008: continues a statement, function call, data value, or rendered content.
L10009: interacts with the browser document or window.
L10011: defines or continues an arrow function.
L10012: opens or closes the current JavaScript structure.
L10015: declares the initializeAccessReviewFromEmail JavaScript value.
L10016: declares the parameters JavaScript value.
L10017: declares the token JavaScript value.
L10018: declares the suggestedAction JavaScript value.
L10019: continues a statement, function call, data value, or rendered content.
L10021: starts a conditional branch.
L10022: returns a value or exits the current function.
L10023: opens or closes the current JavaScript structure.
L10025: starts a conditional branch.
L10026: continues a statement, function call, data value, or rendered content.
L10027: continues a statement, function call, data value, or rendered content.
L10028: continues a statement, function call, data value, or rendered content.
L10029: continues a template string used to render interface content.
L10030: opens or closes the current JavaScript structure.
L10032: continues a statement, function call, data value, or rendered content.
L10033: opens or closes the current JavaScript structure.
L10035: continues a statement, function call, data value, or rendered content.
L10036: continues a statement, function call, data value, or rendered content.
L10037: continues a statement, function call, data value, or rendered content.
L10038: continues a statement, function call, data value, or rendered content.
L10039: continues a statement, function call, data value, or rendered content.
L10040: interacts with the browser document or window.
L10042: starts protected error-handling logic.
L10043: declares the result JavaScript value.
L10044: defines the method property in the current object.
L10045: continues a statement, function call, data value, or rendered content.
L10046: continues a statement, function call, data value, or rendered content.
L10048: continues a statement, function call, data value, or rendered content.
L10049: continues a statement, function call, data value, or rendered content.
L10050: continues a statement, function call, data value, or rendered content.
L10051: continues a statement, function call, data value, or rendered content.
L10052: opens or closes the current JavaScript structure.
L10053: continues a statement, function call, data value, or rendered content.
L10054: continues a statement, function call, data value, or rendered content.
L10056: continues a statement, function call, data value, or rendered content.
L10057: continues a statement, function call, data value, or rendered content.
L10058: continues a statement, function call, data value, or rendered content.
L10060: declares the closeButton JavaScript value.
L10062: continues a statement, function call, data value, or rendered content.
L10063: continues a statement, function call, data value, or rendered content.
L10064: continues a statement, function call, data value, or rendered content.
L10065: defines or continues an arrow function.
L10066: continues a statement, function call, data value, or rendered content.
L10067: continues a statement, function call, data value, or rendered content.
L10068: continues a statement, function call, data value, or rendered content.
L10070: continues a statement, function call, data value, or rendered content.
L10071: opens or closes the current JavaScript structure.
L10072: opens or closes the current JavaScript structure.
L10075: continues a statement, function call, data value, or rendered content.
L10079: continues JavaScript documentation for maintainers.
L10080: continues a statement, function call, data value, or rendered content.
L10081: continues a statement, function call, data value, or rendered content.
L10082: continues a statement, function call, data value, or rendered content.
L10083: continues a statement, function call, data value, or rendered content.
L10084: continues a statement, function call, data value, or rendered content.
L10085: continues JavaScript documentation for maintainers.
L10087: continues JavaScript documentation for maintainers.
L10088: continues a statement, function call, data value, or rendered content.
L10089: continues a statement, function call, data value, or rendered content.
L10090: continues a statement, function call, data value, or rendered content.
L10092: continues a statement, function call, data value, or rendered content.
L10093: continues a statement, function call, data value, or rendered content.
L10094: continues a statement, function call, data value, or rendered content.
L10095: continues JavaScript documentation for maintainers.
L10097: enables strict JavaScript execution rules.
L10099: defines or continues an arrow function.
L10100: declares the PUBLIC_READY JavaScript value.
L10101: defines the approved property in the current object.
L10102: defines the email property in the current object.
L10103: defines the profile property in the current object.
L10104: defines the privateItems property in the current object.
L10105: opens or closes the current JavaScript structure.
L10107: declares the $ JavaScript value.
L10108: declares the $$ JavaScript value.
L10110: declares the setText JavaScript value.
L10111: declares the element JavaScript value.
L10112: starts a conditional branch.
L10113: continues a statement, function call, data value, or rendered content.
L10114: opens or closes the current JavaScript structure.
L10115: returns a value or exits the current function.
L10116: opens or closes the current JavaScript structure.
L10118: declares the safeUrl JavaScript value.
L10119: starts protected error-handling logic.
L10120: declares the url JavaScript value.
L10121: returns a value or exits the current function.
L10122: continues a statement, function call, data value, or rendered content.
L10123: returns a value or exits the current function.
L10124: opens or closes the current JavaScript structure.
L10125: opens or closes the current JavaScript structure.
L10127: declares the escapeIcsText JavaScript value.
L10128: continues a chained method call.
L10129: continues a chained method call.
L10130: continues a chained method call.
L10131: continues a chained method call.
L10133: declares the formatIcsDate JavaScript value.
L10134: declares the date JavaScript value.
L10135: starts a conditional branch.
L10136: returns a value or exits the current function.
L10137: opens or closes the current JavaScript structure.
L10138: returns a value or exits the current function.
L10139: opens or closes the current JavaScript structure.
L10141: declares the formatPrivateDate JavaScript value.
L10142: declares the date JavaScript value.
L10143: starts a conditional branch.
L10144: returns a value or exits the current function.
L10145: opens or closes the current JavaScript structure.
L10146: returns a value or exits the current function.
L10147: defines the dateStyle property in the current object.
L10148: defines the timeStyle property in the current object.
L10149: continues a statement, function call, data value, or rendered content.
L10150: opens or closes the current JavaScript structure.
L10152: declares the showFriendlyStatus JavaScript value.
L10153: starts a conditional branch.
L10154: continues a statement, function call, data value, or rendered content.
L10155: returns a value or exits the current function.
L10156: opens or closes the current JavaScript structure.
L10158: declares the status JavaScript value.
L10159: starts a conditional branch.
L10160: continues a statement, function call, data value, or rendered content.
L10161: continues a statement, function call, data value, or rendered content.
L10162: opens or closes the current JavaScript structure.
L10163: opens or closes the current JavaScript structure.
L10165: declares the makeButton JavaScript value.
L10166: declares the element JavaScript value.
L10167: continues a statement, function call, data value, or rendered content.
L10168: continues a statement, function call, data value, or rendered content.
L10170: starts a conditional branch.
L10171: continues a statement, function call, data value, or rendered content.
L10172: starts a conditional branch.
L10173: continues a statement, function call, data value, or rendered content.
L10174: continues a statement, function call, data value, or rendered content.
L10175: opens or closes the current JavaScript structure.
L10176: continues a statement, function call, data value, or rendered content.
L10177: continues a statement, function call, data value, or rendered content.
L10178: opens or closes the current JavaScript structure.
L10180: starts a conditional branch.
L10181: continues a statement, function call, data value, or rendered content.
L10182: opens or closes the current JavaScript structure.
L10184: returns a value or exits the current function.
L10185: opens or closes the current JavaScript structure.
L10187: continues JavaScript documentation for maintainers.
L10188: continues a statement, function call, data value, or rendered content.
L10189: continues JavaScript documentation for maintainers.
L10191: declares the cleanPublicCopy JavaScript value.
L10192: declares the primaryHeroButton JavaScript value.
L10193: starts a conditional branch.
L10194: continues a statement, function call, data value, or rendered content.
L10195: defines or continues an arrow function.
L10196: starts a conditional branch.
L10197: continues a statement, function call, data value, or rendered content.
L10198: opens or closes the current JavaScript structure.
L10199: continues a statement, function call, data value, or rendered content.
L10200: opens or closes the current JavaScript structure.
L10202: continues a statement, function call, data value, or rendered content.
L10203: continues a statement, function call, data value, or rendered content.
L10204: continues a statement, function call, data value, or rendered content.
L10205: opens or closes the current JavaScript structure.
L10207: declares the heroPrivacy JavaScript value.
L10208: starts a conditional branch.
L10209: continues a template string used to render interface content.
L10210: continues a template string used to render interface content.
L10211: continues a statement, function call, data value, or rendered content.
L10212: continues a statement, function call, data value, or rendered content.
L10213: continues a template string used to render interface content.
L10214: opens or closes the current JavaScript structure.
L10216: declares the aboutIntro JavaScript value.
L10217: starts a conditional branch.
L10218: continues a statement, function call, data value, or rendered content.
L10219: continues a statement, function call, data value, or rendered content.
L10220: opens or closes the current JavaScript structure.
L10222: declares the aboutGrid JavaScript value.
L10223: starts a conditional branch.
L10224: continues a statement, function call, data value, or rendered content.
L10225: opens or closes the current JavaScript structure.
L10227: declares the aboutCards JavaScript value.
L10228: declares the feelCard JavaScript value.
L10229: declares the duplicatePriorities JavaScript value.
L10231: starts a conditional branch.
L10232: continues a statement, function call, data value, or rendered content.
L10233: declares the list JavaScript value.
L10234: starts a conditional branch.
L10235: continues a template string used to render interface content.
L10236: continues a template string used to render interface content.
L10237: continues a template string used to render interface content.
L10238: continues a template string used to render interface content.
L10239: continues a template string used to render interface content.
L10240: continues a template string used to render interface content.
L10241: opens or closes the current JavaScript structure.
L10242: opens or closes the current JavaScript structure.
L10244: starts a conditional branch.
L10245: continues a statement, function call, data value, or rendered content.
L10246: opens or closes the current JavaScript structure.
L10248: declares the whoWeAreButton JavaScript value.
L10249: starts a conditional branch.
L10250: continues a statement, function call, data value, or rendered content.
L10251: opens or closes the current JavaScript structure.
L10253: continues a statement, function call, data value, or rendered content.
L10254: continues a statement, function call, data value, or rendered content.
L10255: continues a statement, function call, data value, or rendered content.
L10256: opens or closes the current JavaScript structure.
L10258: continues a statement, function call, data value, or rendered content.
L10259: continues a statement, function call, data value, or rendered content.
L10260: continues a statement, function call, data value, or rendered content.
L10261: opens or closes the current JavaScript structure.
L10263: continues a statement, function call, data value, or rendered content.
L10264: continues a statement, function call, data value, or rendered content.
L10265: continues a statement, function call, data value, or rendered content.
L10266: opens or closes the current JavaScript structure.
L10268: declares the privacyNotice JavaScript value.
L10269: starts a conditional branch.
L10270: continues a statement, function call, data value, or rendered content.
L10271: continues a statement, function call, data value, or rendered content.
L10272: continues a statement, function call, data value, or rendered content.
L10273: continues a statement, function call, data value, or rendered content.
L10274: continues a statement, function call, data value, or rendered content.
L10275: continues a statement, function call, data value, or rendered content.
L10276: opens or closes the current JavaScript structure.
L10277: opens or closes the current JavaScript structure.
L10279: declares the announcementLink JavaScript value.
L10280: starts a conditional branch.
L10281: continues a statement, function call, data value, or rendered content.
L10282: continues a statement, function call, data value, or rendered content.
L10283: opens or closes the current JavaScript structure.
L10285: declares the growPiece JavaScript value.
L10286: starts a conditional branch.
L10287: continues a statement, function call, data value, or rendered content.
L10288: opens or closes the current JavaScript structure.
L10290: continues a statement, function call, data value, or rendered content.
L10291: continues a statement, function call, data value, or rendered content.
L10292: continues a statement, function call, data value, or rendered content.
L10293: opens or closes the current JavaScript structure.
L10295: declares the galleryHeading JavaScript value.
L10296: starts a conditional branch.
L10297: continues a statement, function call, data value, or rendered content.
L10298: opens or closes the current JavaScript structure.
L10300: declares the portalIntro JavaScript value.
L10301: starts a conditional branch.
L10302: continues a statement, function call, data value, or rendered content.
L10303: continues a statement, function call, data value, or rendered content.
L10304: opens or closes the current JavaScript structure.
L10306: declares the portalSecurity JavaScript value.
L10307: starts a conditional branch.
L10308: continues a statement, function call, data value, or rendered content.
L10309: continues a statement, function call, data value, or rendered content.
L10310: continues a statement, function call, data value, or rendered content.
L10311: continues a statement, function call, data value, or rendered content.
L10312: continues a statement, function call, data value, or rendered content.
L10313: opens or closes the current JavaScript structure.
L10314: opens or closes the current JavaScript structure.
L10316: declares the portalSteps JavaScript value.
L10317: starts a conditional branch.
L10318: continues a template string used to render interface content.
L10319: continues a template string used to render interface content.
L10320: continues a template string used to render interface content.
L10321: continues a template string used to render interface content.
L10322: continues a template string used to render interface content.
L10323: continues a template string used to render interface content.
L10324: opens or closes the current JavaScript structure.
L10326: declares the portalSmallNote JavaScript value.
L10327: starts a conditional branch.
L10328: continues a statement, function call, data value, or rendered content.
L10329: continues a statement, function call, data value, or rendered content.
L10330: opens or closes the current JavaScript structure.
L10332: declares the contactDeliveryNote JavaScript value.
L10333: starts a conditional branch.
L10334: continues a statement, function call, data value, or rendered content.
L10335: continues a statement, function call, data value, or rendered content.
L10336: opens or closes the current JavaScript structure.
L10338: declares the resourcesHeading JavaScript value.
L10339: starts a conditional branch.
L10340: continues a statement, function call, data value, or rendered content.
L10341: continues a statement, function call, data value, or rendered content.
L10342: opens or closes the current JavaScript structure.
L10344: declares the incomingResource JavaScript value.
L10345: starts a conditional branch.
L10346: continues a statement, function call, data value, or rendered content.
L10347: continues a statement, function call, data value, or rendered content.
L10348: continues a statement, function call, data value, or rendered content.
L10349: continues a statement, function call, data value, or rendered content.
L10350: continues a statement, function call, data value, or rendered content.
L10351: continues a statement, function call, data value, or rendered content.
L10352: continues a statement, function call, data value, or rendered content.
L10353: opens or closes the current JavaScript structure.
L10354: declares the button JavaScript value.
L10355: starts a conditional branch.
L10356: continues a statement, function call, data value, or rendered content.
L10357: continues a statement, function call, data value, or rendered content.
L10358: continues a statement, function call, data value, or rendered content.
L10359: opens or closes the current JavaScript structure.
L10360: opens or closes the current JavaScript structure.
L10362: declares the transparencyPanel JavaScript value.
L10363: starts a conditional branch.
L10364: continues a statement, function call, data value, or rendered content.
L10365: declares the content JavaScript value.
L10366: starts a conditional branch.
L10367: continues a template string used to render interface content.
L10368: continues a template string used to render interface content.
L10369: continues a template string used to render interface content.
L10370: continues a template string used to render interface content.
L10371: continues a template string used to render interface content.
L10372: continues a template string used to render interface content.
L10373: continues a template string used to render interface content.
L10374: continues a template string used to render interface content.
L10375: continues a template string used to render interface content.
L10376: continues a template string used to render interface content.
L10377: opens or closes the current JavaScript structure.
L10379: declares the notesButton JavaScript value.
L10380: starts a conditional branch.
L10381: continues a statement, function call, data value, or rendered content.
L10382: opens or closes the current JavaScript structure.
L10383: opens or closes the current JavaScript structure.
L10385: declares the teamIntro JavaScript value.
L10386: starts a conditional branch.
L10387: continues a statement, function call, data value, or rendered content.
L10388: continues a statement, function call, data value, or rendered content.
L10389: opens or closes the current JavaScript structure.
L10391: declares the teamCards JavaScript value.
L10392: defines or continues an arrow function.
L10393: declares the heading JavaScript value.
L10394: declares the paragraph JavaScript value.
L10395: declares the image JavaScript value.
L10397: starts a conditional branch.
L10398: continues a statement, function call, data value, or rendered content.
L10399: continues a statement, function call, data value, or rendered content.
L10400: continues a statement, function call, data value, or rendered content.
L10401: continues a statement, function call, data value, or rendered content.
L10402: continues a statement, function call, data value, or rendered content.
L10403: continues a statement, function call, data value, or rendered content.
L10404: continues a statement, function call, data value, or rendered content.
L10405: continues a statement, function call, data value, or rendered content.
L10406: continues a statement, function call, data value, or rendered content.
L10407: continues a statement, function call, data value, or rendered content.
L10408: continues a statement, function call, data value, or rendered content.
L10409: opens or closes the current JavaScript structure.
L10410: continues a statement, function call, data value, or rendered content.
L10412: declares the newsletter JavaScript value.
L10413: continues a statement, function call, data value, or rendered content.
L10415: declares the socialStrip JavaScript value.
L10416: continues a statement, function call, data value, or rendered content.
L10417: opens or closes the current JavaScript structure.
L10419: declares the updatePublicDataLibraries JavaScript value.
L10420: starts a conditional branch.
L10421: continues a statement, function call, data value, or rendered content.
L10422: opens or closes the current JavaScript structure.
L10423: defines the id property in the current object.
L10424: defines the featured property in the current object.
L10425: defines the category property in the current object.
L10426: defines the title property in the current object.
L10427: defines the dateLabel property in the current object.
L10428: defines the audience property in the current object.
L10429: defines the summary property in the current object.
L10430: continues a template string used to render interface content.
L10431: continues a template string used to render interface content.
L10432: continues a template string used to render interface content.
L10433: continues a template string used to render interface content.
L10434: continues a template string used to render interface content.
L10435: continues a template string used to render interface content.
L10436: continues a template string used to render interface content.
L10437: continues a template string used to render interface content.
L10438: continues a template string used to render interface content.
L10439: continues a template string used to render interface content.
L10440: continues a template string used to render interface content.
L10441: continues a statement, function call, data value, or rendered content.
L10442: opens or closes the current JavaScript structure.
L10443: defines the id property in the current object.
L10444: defines the featured property in the current object.
L10445: defines the category property in the current object.
L10446: defines the title property in the current object.
L10447: defines the dateLabel property in the current object.
L10448: defines the audience property in the current object.
L10449: defines the summary property in the current object.
L10450: continues a template string used to render interface content.
L10451: continues a template string used to render interface content.
L10452: continues a template string used to render interface content.
L10453: continues a template string used to render interface content.
L10454: continues a statement, function call, data value, or rendered content.
L10455: opens or closes the current JavaScript structure.
L10456: defines the id property in the current object.
L10457: defines the featured property in the current object.
L10458: defines the category property in the current object.
L10459: defines the title property in the current object.
L10460: defines the dateLabel property in the current object.
L10461: defines the audience property in the current object.
L10462: defines the summary property in the current object.
L10463: continues a template string used to render interface content.
L10464: continues a template string used to render interface content.
L10465: continues a template string used to render interface content.
L10466: continues a template string used to render interface content.
L10467: continues a statement, function call, data value, or rendered content.
L10468: opens or closes the current JavaScript structure.
L10469: defines the id property in the current object.
L10470: defines the featured property in the current object.
L10471: defines the category property in the current object.
L10472: defines the title property in the current object.
L10473: defines the dateLabel property in the current object.
L10474: defines the audience property in the current object.
L10475: defines the summary property in the current object.
L10476: continues a template string used to render interface content.
L10477: continues a template string used to render interface content.
L10478: continues a template string used to render interface content.
L10479: continues a template string used to render interface content.
L10480: opens or closes the current JavaScript structure.
L10481: opens or closes the current JavaScript structure.
L10483: starts a conditional branch.
L10484: continues a statement, function call, data value, or rendered content.
L10485: opens or closes the current JavaScript structure.
L10486: opens or closes the current JavaScript structure.
L10488: starts a conditional branch.
L10489: continues a statement, function call, data value, or rendered content.
L10490: continues a statement, function call, data value, or rendered content.
L10491: continues a statement, function call, data value, or rendered content.
L10492: continues a statement, function call, data value, or rendered content.
L10493: continues a statement, function call, data value, or rendered content.
L10494: opens or closes the current JavaScript structure.
L10495: opens or closes the current JavaScript structure.
L10497: starts a conditional branch.
L10498: continues a statement, function call, data value, or rendered content.
L10499: defines the eyebrow property in the current object.
L10500: defines the title property in the current object.
L10501: continues a template string used to render interface content.
L10502: continues a template string used to render interface content.
L10503: continues a template string used to render interface content.
L10504: continues a template string used to render interface content.
L10505: continues a template string used to render interface content.
L10506: continues a template string used to render interface content.
L10507: continues a template string used to render interface content.
L10508: continues a template string used to render interface content.
L10509: continues a template string used to render interface content.
L10510: continues a template string used to render interface content.
L10511: continues a template string used to render interface content.
L10512: defines the actions property in the current object.
L10513: continues a statement, function call, data value, or rendered content.
L10514: continues a statement, function call, data value, or rendered content.
L10515: opens or closes the current JavaScript structure.
L10516: opens or closes the current JavaScript structure.
L10518: continues a statement, function call, data value, or rendered content.
L10519: defines the eyebrow property in the current object.
L10520: defines the title property in the current object.
L10521: continues a template string used to render interface content.
L10522: continues a template string used to render interface content.
L10523: continues a template string used to render interface content.
L10524: continues a template string used to render interface content.
L10525: continues a template string used to render interface content.
L10526: continues a template string used to render interface content.
L10527: continues a template string used to render interface content.
L10528: continues a template string used to render interface content.
L10529: continues a template string used to render interface content.
L10530: continues a template string used to render interface content.
L10531: continues a template string used to render interface content.
L10532: defines the actions property in the current object.
L10533: continues a statement, function call, data value, or rendered content.
L10534: continues a statement, function call, data value, or rendered content.
L10535: opens or closes the current JavaScript structure.
L10536: opens or closes the current JavaScript structure.
L10538: continues a statement, function call, data value, or rendered content.
L10539: defines the eyebrow property in the current object.
L10540: defines the title property in the current object.
L10541: continues a template string used to render interface content.
L10542: continues a template string used to render interface content.
L10543: continues a template string used to render interface content.
L10544: continues a template string used to render interface content.
L10545: continues a template string used to render interface content.
L10546: continues a template string used to render interface content.
L10547: continues a template string used to render interface content.
L10548: continues a template string used to render interface content.
L10549: continues a template string used to render interface content.
L10550: continues a template string used to render interface content.
L10551: continues a template string used to render interface content.
L10552: defines the actions property in the current object.
L10553: continues a statement, function call, data value, or rendered content.
L10554: continues a statement, function call, data value, or rendered content.
L10555: opens or closes the current JavaScript structure.
L10556: opens or closes the current JavaScript structure.
L10558: continues a statement, function call, data value, or rendered content.
L10559: defines the eyebrow property in the current object.
L10560: defines the title property in the current object.
L10561: continues a template string used to render interface content.
L10562: continues a template string used to render interface content.
L10563: continues a template string used to render interface content.
L10564: continues a template string used to render interface content.
L10565: continues a template string used to render interface content.
L10566: continues a template string used to render interface content.
L10567: continues a template string used to render interface content.
L10568: continues a template string used to render interface content.
L10569: continues a template string used to render interface content.
L10570: continues a template string used to render interface content.
L10571: continues a template string used to render interface content.
L10572: defines the actions property in the current object.
L10573: continues a statement, function call, data value, or rendered content.
L10574: continues a statement, function call, data value, or rendered content.
L10575: opens or closes the current JavaScript structure.
L10576: opens or closes the current JavaScript structure.
L10578: continues a statement, function call, data value, or rendered content.
L10579: defines the eyebrow property in the current object.
L10580: defines the title property in the current object.
L10581: continues a template string used to render interface content.
L10582: continues a template string used to render interface content.
L10583: continues a template string used to render interface content.
L10584: continues a template string used to render interface content.
L10585: continues a template string used to render interface content.
L10586: continues a template string used to render interface content.
L10587: continues a template string used to render interface content.
L10588: continues a template string used to render interface content.
L10589: continues a template string used to render interface content.
L10590: continues a template string used to render interface content.
L10591: continues a template string used to render interface content.
L10592: defines the actions property in the current object.
L10593: continues a statement, function call, data value, or rendered content.
L10594: continues a statement, function call, data value, or rendered content.
L10595: opens or closes the current JavaScript structure.
L10596: opens or closes the current JavaScript structure.
L10597: opens or closes the current JavaScript structure.
L10599: starts a conditional branch.
L10600: continues a statement, function call, data value, or rendered content.
L10601: defines the eyebrow property in the current object.
L10602: defines the title property in the current object.
L10603: continues a template string used to render interface content.
L10604: continues a template string used to render interface content.
L10605: continues a template string used to render interface content.
L10606: continues a template string used to render interface content.
L10607: continues a template string used to render interface content.
L10608: continues a template string used to render interface content.
L10609: continues a template string used to render interface content.
L10610: continues a template string used to render interface content.
L10611: continues a template string used to render interface content.
L10612: continues a template string used to render interface content.
L10613: continues a template string used to render interface content.
L10614: defines the actions property in the current object.
L10615: continues a statement, function call, data value, or rendered content.
L10616: continues a statement, function call, data value, or rendered content.
L10617: opens or closes the current JavaScript structure.
L10618: opens or closes the current JavaScript structure.
L10620: continues a statement, function call, data value, or rendered content.
L10621: defines the eyebrow property in the current object.
L10622: defines the title property in the current object.
L10623: continues a template string used to render interface content.
L10624: continues a template string used to render interface content.
L10625: continues a template string used to render interface content.
L10626: continues a template string used to render interface content.
L10627: continues a template string used to render interface content.
L10628: continues a template string used to render interface content.
L10629: continues a template string used to render interface content.
L10630: continues a template string used to render interface content.
L10631: continues a template string used to render interface content.
L10632: continues a template string used to render interface content.
L10633: defines the actions property in the current object.
L10634: continues a statement, function call, data value, or rendered content.
L10635: continues a statement, function call, data value, or rendered content.
L10636: opens or closes the current JavaScript structure.
L10637: opens or closes the current JavaScript structure.
L10639: continues a statement, function call, data value, or rendered content.
L10640: defines the eyebrow property in the current object.
L10641: defines the title property in the current object.
L10642: continues a template string used to render interface content.
L10643: continues a template string used to render interface content.
L10644: continues a template string used to render interface content.
L10645: continues a template string used to render interface content.
L10646: continues a template string used to render interface content.
L10647: continues a template string used to render interface content.
L10648: continues a template string used to render interface content.
L10649: continues a template string used to render interface content.
L10650: continues a template string used to render interface content.
L10651: continues a template string used to render interface content.
L10652: continues a template string used to render interface content.
L10653: defines the actions property in the current object.
L10654: continues a statement, function call, data value, or rendered content.
L10655: continues a statement, function call, data value, or rendered content.
L10656: opens or closes the current JavaScript structure.
L10657: opens or closes the current JavaScript structure.
L10658: opens or closes the current JavaScript structure.
L10660: starts a conditional branch.
L10661: continues a statement, function call, data value, or rendered content.
L10662: defines the eyebrow property in the current object.
L10663: defines the title property in the current object.
L10664: continues a template string used to render interface content.
L10665: continues a template string used to render interface content.
L10666: continues a template string used to render interface content.
L10667: continues a template string used to render interface content.
L10668: continues a template string used to render interface content.
L10669: continues a template string used to render interface content.
L10670: continues a template string used to render interface content.
L10671: continues a template string used to render interface content.
L10672: continues a template string used to render interface content.
L10673: continues a template string used to render interface content.
L10674: defines the actions property in the current object.
L10675: continues a statement, function call, data value, or rendered content.
L10676: continues a statement, function call, data value, or rendered content.
L10677: opens or closes the current JavaScript structure.
L10678: opens or closes the current JavaScript structure.
L10680: continues a statement, function call, data value, or rendered content.
L10681: defines the eyebrow property in the current object.
L10682: defines the title property in the current object.
L10683: continues a template string used to render interface content.
L10684: continues a template string used to render interface content.
L10685: continues a template string used to render interface content.
L10686: continues a template string used to render interface content.
L10687: continues a template string used to render interface content.
L10688: continues a template string used to render interface content.
L10689: continues a template string used to render interface content.
L10690: continues a template string used to render interface content.
L10691: continues a template string used to render interface content.
L10692: continues a template string used to render interface content.
L10693: continues a template string used to render interface content.
L10694: defines the actions property in the current object.
L10695: continues a statement, function call, data value, or rendered content.
L10696: continues a statement, function call, data value, or rendered content.
L10697: opens or closes the current JavaScript structure.
L10698: opens or closes the current JavaScript structure.
L10700: continues a statement, function call, data value, or rendered content.
L10701: defines the eyebrow property in the current object.
L10702: defines the title property in the current object.
L10703: continues a template string used to render interface content.
L10704: continues a template string used to render interface content.
L10705: continues a template string used to render interface content.
L10706: continues a template string used to render interface content.
L10707: continues a template string used to render interface content.
L10708: continues a template string used to render interface content.
L10709: continues a template string used to render interface content.
L10710: continues a template string used to render interface content.
L10711: continues a template string used to render interface content.
L10712: continues a template string used to render interface content.
L10713: continues a template string used to render interface content.
L10714: defines the actions property in the current object.
L10715: continues a statement, function call, data value, or rendered content.
L10716: continues a statement, function call, data value, or rendered content.
L10717: opens or closes the current JavaScript structure.
L10718: opens or closes the current JavaScript structure.
L10719: opens or closes the current JavaScript structure.
L10720: opens or closes the current JavaScript structure.
L10722: continues JavaScript documentation for maintainers.
L10723: continues a statement, function call, data value, or rendered content.
L10724: continues JavaScript documentation for maintainers.
L10726: declares the preparePortalNav JavaScript value.
L10727: declares the portalLinks JavaScript value.
L10728: continues a statement, function call, data value, or rendered content.
L10729: opens or closes the current JavaScript structure.
L10731: defines or continues an arrow function.
L10732: declares the isMobilePortalLink JavaScript value.
L10733: continues a statement, function call, data value, or rendered content.
L10735: continues a statement, function call, data value, or rendered content.
L10737: continues JavaScript documentation for maintainers.
L10738: continues a statement, function call, data value, or rendered content.
L10739: continues a statement, function call, data value, or rendered content.
L10740: continues a statement, function call, data value, or rendered content.
L10741: continues JavaScript documentation for maintainers.
L10742: continues a statement, function call, data value, or rendered content.
L10743: continues a template string used to render interface content.
L10744: continues a template string used to render interface content.
L10745: continues a template string used to render interface content.
L10746: continues a template string used to render interface content.
L10747: continues a template string used to render interface content.
L10748: continues a template string used to render interface content.
L10749: continues a template string used to render interface content.
L10750: continues a template string used to render interface content.
L10751: continues a template string used to render interface content.
L10752: continues a template string used to render interface content.
L10753: continues a template string used to render interface content.
L10754: continues a template string used to render interface content.
L10755: continues a template string used to render interface content.
L10756: continues a statement, function call, data value, or rendered content.
L10757: opens or closes the current JavaScript structure.
L10759: declares the updatePortalNav JavaScript value.
L10760: declares the mobileAccount JavaScript value.
L10761: continues a statement, function call, data value, or rendered content.
L10763: declares the mobileAccountEmail JavaScript value.
L10764: continues a statement, function call, data value, or rendered content.
L10766: defines or continues an arrow function.
L10767: declares the label JavaScript value.
L10768: declares the use JavaScript value.
L10769: declares the isMobilePortalLink JavaScript value.
L10770: continues a statement, function call, data value, or rendered content.
L10772: starts a conditional branch.
L10773: continues a statement, function call, data value, or rendered content.
L10774: continues a statement, function call, data value, or rendered content.
L10776: continues JavaScript documentation for maintainers.
L10777: continues a statement, function call, data value, or rendered content.
L10778: continues a statement, function call, data value, or rendered content.
L10779: continues a statement, function call, data value, or rendered content.
L10780: continues JavaScript documentation for maintainers.
L10781: starts a conditional branch.
L10782: continues a statement, function call, data value, or rendered content.
L10783: continues a statement, function call, data value, or rendered content.
L10784: continues a statement, function call, data value, or rendered content.
L10785: opens or closes the current JavaScript structure.
L10787: continues a statement, function call, data value, or rendered content.
L10788: continues a statement, function call, data value, or rendered content.
L10789: continues a statement, function call, data value, or rendered content.
L10790: continues a statement, function call, data value, or rendered content.
L10792: starts a conditional branch.
L10793: continues a statement, function call, data value, or rendered content.
L10794: opens or closes the current JavaScript structure.
L10796: continues a statement, function call, data value, or rendered content.
L10797: opens or closes the current JavaScript structure.
L10798: continues a statement, function call, data value, or rendered content.
L10800: starts a conditional branch.
L10801: starts a conditional branch.
L10802: continues a statement, function call, data value, or rendered content.
L10803: continues a statement, function call, data value, or rendered content.
L10805: continues a statement, function call, data value, or rendered content.
L10806: continues a statement, function call, data value, or rendered content.
L10807: continues a statement, function call, data value, or rendered content.
L10808: continues a statement, function call, data value, or rendered content.
L10809: continues a statement, function call, data value, or rendered content.
L10811: continues a statement, function call, data value, or rendered content.
L10812: continues a statement, function call, data value, or rendered content.
L10813: opens or closes the current JavaScript structure.
L10814: opens or closes the current JavaScript structure.
L10815: opens or closes the current JavaScript structure.
L10817: continues JavaScript documentation for maintainers.
L10818: continues a statement, function call, data value, or rendered content.
L10819: continues JavaScript documentation for maintainers.
L10821: declares the createLockCard JavaScript value.
L10822: declares the card JavaScript value.
L10823: continues a statement, function call, data value, or rendered content.
L10824: continues a template string used to render interface content.
L10825: continues a template string used to render interface content.
L10826: continues a template string used to render interface content.
L10827: continues a template string used to render interface content.
L10828: continues a template string used to render interface content.
L10829: continues a template string used to render interface content.
L10830: continues a template string used to render interface content.
L10831: continues a template string used to render interface content.
L10832: continues a template string used to render interface content.
L10833: continues a template string used to render interface content.
L10834: returns a value or exits the current function.
L10835: opens or closes the current JavaScript structure.
L10837: declares the prepareProtectedGallery JavaScript value.
L10838: declares the gallery JavaScript value.
L10839: declares the shell JavaScript value.
L10840: starts a conditional branch.
L10841: returns a value or exits the current function.
L10842: opens or closes the current JavaScript structure.
L10844: declares the heading JavaScript value.
L10845: declares the protectedContent JavaScript value.
L10846: continues a statement, function call, data value, or rendered content.
L10847: continues a statement, function call, data value, or rendered content.
L10848: continues a statement, function call, data value, or rendered content.
L10850: defines or continues an arrow function.
L10851: starts a conditional branch.
L10852: continues a statement, function call, data value, or rendered content.
L10853: opens or closes the current JavaScript structure.
L10854: continues a statement, function call, data value, or rendered content.
L10856: declares the note JavaScript value.
L10857: starts a conditional branch.
L10858: continues a statement, function call, data value, or rendered content.
L10859: continues a statement, function call, data value, or rendered content.
L10860: continues a statement, function call, data value, or rendered content.
L10861: opens or closes the current JavaScript structure.
L10863: declares the lockCard JavaScript value.
L10864: defines the title property in the current object.
L10865: defines the text property in the current object.
L10866: continues a statement, function call, data value, or rendered content.
L10867: continues a statement, function call, data value, or rendered content.
L10869: continues a statement, function call, data value, or rendered content.
L10870: opens or closes the current JavaScript structure.
L10872: declares the prepareProtectedUpdates JavaScript value.
L10873: declares the schedulePanel JavaScript value.
L10874: declares the eventsPanel JavaScript value.
L10876: continues a statement, function call, data value, or rendered content.
L10877: continues a statement, function call, data value, or rendered content.
L10879: declares the scheduleSummary JavaScript value.
L10880: starts a conditional branch.
L10881: continues a statement, function call, data value, or rendered content.
L10882: continues a statement, function call, data value, or rendered content.
L10883: opens or closes the current JavaScript structure.
L10885: continues a statement, function call, data value, or rendered content.
L10886: continues a statement, function call, data value, or rendered content.
L10887: continues a statement, function call, data value, or rendered content.
L10888: defines or continues an arrow function.
L10889: starts a conditional branch.
L10890: returns a value or exits the current function.
L10891: opens or closes the current JavaScript structure.
L10893: declares the existingChildren JavaScript value.
L10894: declares the protectedContent JavaScript value.
L10895: continues a statement, function call, data value, or rendered content.
L10896: continues a statement, function call, data value, or rendered content.
L10897: continues a statement, function call, data value, or rendered content.
L10899: defines or continues an arrow function.
L10901: declares the lockCard JavaScript value.
L10902: defines the title property in the current object.
L10903: defines the text property in the current object.
L10904: continues a statement, function call, data value, or rendered content.
L10905: continues a statement, function call, data value, or rendered content.
L10906: continues a statement, function call, data value, or rendered content.
L10908: continues a statement, function call, data value, or rendered content.
L10909: continues a statement, function call, data value, or rendered content.
L10911: defines or continues an arrow function.
L10912: declares the tab JavaScript value.
L10913: continues a statement, function call, data value, or rendered content.
L10914: continues a statement, function call, data value, or rendered content.
L10915: opens or closes the current JavaScript structure.
L10917: declares the setProtectedVisibility JavaScript value.
L10918: interacts with the browser document or window.
L10919: interacts with the browser document or window.
L10921: declares the galleryLock JavaScript value.
L10922: declares the galleryContent JavaScript value.
L10923: starts a conditional branch.
L10924: starts a conditional branch.
L10926: defines or continues an arrow function.
L10927: declares the lock JavaScript value.
L10928: declares the content JavaScript value.
L10929: declares the tab JavaScript value.
L10931: starts a conditional branch.
L10932: starts a conditional branch.
L10933: continues a statement, function call, data value, or rendered content.
L10934: continues a statement, function call, data value, or rendered content.
L10935: continues a statement, function call, data value, or rendered content.
L10936: opens or closes the current JavaScript structure.
L10938: defines or continues an arrow function.
L10939: declares the privateTab JavaScript value.
L10940: starts a conditional branch.
L10941: returns a value or exits the current function.
L10942: opens or closes the current JavaScript structure.
L10944: continues a statement, function call, data value, or rendered content.
L10945: continues a statement, function call, data value, or rendered content.
L10946: interacts with the browser document or window.
L10947: continues a statement, function call, data value, or rendered content.
L10948: continues a statement, function call, data value, or rendered content.
L10949: continues a statement, function call, data value, or rendered content.
L10950: opens or closes the current JavaScript structure.
L10951: continues a statement, function call, data value, or rendered content.
L10953: continues JavaScript documentation for maintainers.
L10954: continues a statement, function call, data value, or rendered content.
L10955: continues JavaScript documentation for maintainers.
L10957: declares the eventItems JavaScript value.
L10958: continues a statement, function call, data value, or rendered content.
L10959: opens or closes the current JavaScript structure.
L10961: declares the calendarSubscriptionItem JavaScript value.
L10962: continues a statement, function call, data value, or rendered content.
L10963: opens or closes the current JavaScript structure.
L10965: declares the buildIcs JavaScript value.
L10966: declares the events JavaScript value.
L10967: defines or continues an arrow function.
L10968: defines or continues an arrow function.
L10969: declares the start JavaScript value.
L10970: declares the end JavaScript value.
L10971: starts a conditional branch.
L10973: returns a value or exits the current function.
L10974: continues a statement, function call, data value, or rendered content.
L10975: continues a template string used to render interface content.
L10976: continues a template string used to render interface content.
L10977: continues a template string used to render interface content.
L10978: continues a template string used to render interface content.
L10979: continues a template string used to render interface content.
L10980: continues a template string used to render interface content.
L10981: continues a template string used to render interface content.
L10982: continues a statement, function call, data value, or rendered content.
L10983: continues a statement, function call, data value, or rendered content.
L10984: continues a statement, function call, data value, or rendered content.
L10985: continues a chained method call.
L10987: returns a value or exits the current function.
L10988: continues a statement, function call, data value, or rendered content.
L10989: continues a statement, function call, data value, or rendered content.
L10990: continues a statement, function call, data value, or rendered content.
L10991: continues a statement, function call, data value, or rendered content.
L10992: continues a statement, function call, data value, or rendered content.
L10993: continues a chained method call.
L10994: continues a statement, function call, data value, or rendered content.
L10995: continues a statement, function call, data value, or rendered content.
L10996: opens or closes the current JavaScript structure.
L10998: declares the downloadIcs JavaScript value.
L10999: declares the usableItems JavaScript value.
L11000: starts a conditional branch.
L11001: continues a statement, function call, data value, or rendered content.
L11002: returns a value or exits the current function.
L11003: opens or closes the current JavaScript structure.
L11005: declares the blob JavaScript value.
L11006: declares the url JavaScript value.
L11007: declares the link JavaScript value.
L11008: continues a statement, function call, data value, or rendered content.
L11009: continues a statement, function call, data value, or rendered content.
L11010: interacts with the browser document or window.
L11011: continues a statement, function call, data value, or rendered content.
L11012: continues a statement, function call, data value, or rendered content.
L11013: continues a statement, function call, data value, or rendered content.
L11014: opens or closes the current JavaScript structure.
L11016: declares the renderEventCard JavaScript value.
L11017: declares the card JavaScript value.
L11018: continues a statement, function call, data value, or rendered content.
L11020: declares the type JavaScript value.
L11021: continues a statement, function call, data value, or rendered content.
L11022: continues a statement, function call, data value, or rendered content.
L11024: declares the title JavaScript value.
L11025: continues a statement, function call, data value, or rendered content.
L11027: continues a statement, function call, data value, or rendered content.
L11029: starts a conditional branch.
L11030: declares the summary JavaScript value.
L11031: continues a statement, function call, data value, or rendered content.
L11032: continues a statement, function call, data value, or rendered content.
L11033: opens or closes the current JavaScript structure.
L11035: declares the metaParts JavaScript value.
L11036: continues a statement, function call, data value, or rendered content.
L11037: continues a statement, function call, data value, or rendered content.
L11038: continues a statement, function call, data value, or rendered content.
L11040: starts a conditional branch.
L11041: declares the meta JavaScript value.
L11042: continues a statement, function call, data value, or rendered content.
L11043: continues a statement, function call, data value, or rendered content.
L11044: continues a statement, function call, data value, or rendered content.
L11045: opens or closes the current JavaScript structure.
L11047: declares the actions JavaScript value.
L11048: continues a statement, function call, data value, or rendered content.
L11050: starts a conditional branch.
L11051: continues a statement, function call, data value, or rendered content.
L11052: defines the label property in the current object.
L11053: defines or continues an arrow function.
L11054: continues a statement, function call, data value, or rendered content.
L11055: opens or closes the current JavaScript structure.
L11057: declares the itemLink JavaScript value.
L11058: starts a conditional branch.
L11059: continues a statement, function call, data value, or rendered content.
L11060: opens or closes the current JavaScript structure.
L11062: starts a conditional branch.
L11063: continues a statement, function call, data value, or rendered content.
L11064: opens or closes the current JavaScript structure.
L11066: returns a value or exits the current function.
L11067: opens or closes the current JavaScript structure.
L11069: declares the dedupePrivateItems JavaScript value.
L11070: declares the seen JavaScript value.
L11072: returns a value or exits the current function.
L11073: declares the key JavaScript value.
L11074: continues a statement, function call, data value, or rendered content.
L11075: continues a statement, function call, data value, or rendered content.
L11076: continues a statement, function call, data value, or rendered content.
L11077: continues a statement, function call, data value, or rendered content.
L11078: continues a statement, function call, data value, or rendered content.
L11080: starts a conditional branch.
L11081: returns a value or exits the current function.
L11082: opens or closes the current JavaScript structure.
L11084: continues a statement, function call, data value, or rendered content.
L11085: returns a value or exits the current function.
L11086: continues a statement, function call, data value, or rendered content.
L11087: opens or closes the current JavaScript structure.
L11089: declares the cleanRenderedPrivateContent JavaScript value.
L11090: declares the list JavaScript value.
L11091: starts a conditional branch.
L11092: returns a value or exits the current function.
L11093: opens or closes the current JavaScript structure.
L11095: declares the seen JavaScript value.
L11097: defines or continues an arrow function.
L11098: declares the type JavaScript value.
L11099: declares the title JavaScript value.
L11100: declares the link JavaScript value.
L11101: declares the key JavaScript value.
L11103: continues JavaScript documentation for maintainers.
L11104: starts a conditional branch.
L11105: continues a statement, function call, data value, or rendered content.
L11106: continues a statement, function call, data value, or rendered content.
L11107: returns a value or exits the current function.
L11108: opens or closes the current JavaScript structure.
L11110: starts a conditional branch.
L11111: continues a statement, function call, data value, or rendered content.
L11112: returns a value or exits the current function.
L11113: opens or closes the current JavaScript structure.
L11115: continues a statement, function call, data value, or rendered content.
L11116: continues a statement, function call, data value, or rendered content.
L11117: opens or closes the current JavaScript structure.
L11119: declares the observePrivateContentList JavaScript value.
L11120: declares the list JavaScript value.
L11121: starts a conditional branch.
L11122: returns a value or exits the current function.
L11123: opens or closes the current JavaScript structure.
L11125: continues a statement, function call, data value, or rendered content.
L11126: declares the observer JavaScript value.
L11127: continues a statement, function call, data value, or rendered content.
L11128: continues a statement, function call, data value, or rendered content.
L11129: opens or closes the current JavaScript structure.
L11131: declares the createCalendarPanel JavaScript value.
L11132: continues a statement, function call, data value, or rendered content.
L11133: continues a statement, function call, data value, or rendered content.
L11134: continues a statement, function call, data value, or rendered content.
L11135: continues a statement, function call, data value, or rendered content.
L11136: continues a statement, function call, data value, or rendered content.
L11137: continues a statement, function call, data value, or rendered content.
L11138: continues a statement, function call, data value, or rendered content.
L11139: defines or continues an arrow function.
L11140: declares the panel JavaScript value.
L11141: continues a statement, function call, data value, or rendered content.
L11142: continues a statement, function call, data value, or rendered content.
L11143: continues a statement, function call, data value, or rendered content.
L11144: continues a template string used to render interface content.
L11145: continues a template string used to render interface content.
L11146: continues a template string used to render interface content.
L11147: continues a template string used to render interface content.
L11148: continues a template string used to render interface content.
L11149: continues a template string used to render interface content.
L11150: continues a template string used to render interface content.
L11151: continues a template string used to render interface content.
L11152: continues a template string used to render interface content.
L11153: continues a template string used to render interface content.
L11154: continues a template string used to render interface content.
L11155: returns a value or exits the current function.
L11156: opens or closes the current JavaScript structure.
L11158: declares the ensurePrivateCalendarPanel JavaScript value.
L11159: declares the dashboard JavaScript value.
L11160: declares the privateContentList JavaScript value.
L11161: starts a conditional branch.
L11162: returns a value or exits the current function.
L11163: opens or closes the current JavaScript structure.
L11165: declares the panel JavaScript value.
L11166: defines the panelId property in the current object.
L11167: defines the actionsId property in the current object.
L11168: defines the eventsId property in the current object.
L11169: defines the eyebrow property in the current object.
L11170: defines the title property in the current object.
L11171: defines the description property in the current object.
L11172: continues a statement, function call, data value, or rendered content.
L11174: continues a statement, function call, data value, or rendered content.
L11175: opens or closes the current JavaScript structure.
L11177: declares the ensureUpdatesCalendarPanel JavaScript value.
L11178: declares the updatesPanel JavaScript value.
L11179: starts a conditional branch.
L11180: returns a value or exits the current function.
L11181: opens or closes the current JavaScript structure.
L11183: declares the panel JavaScript value.
L11184: defines the panelId property in the current object.
L11185: defines the actionsId property in the current object.
L11186: defines the eventsId property in the current object.
L11187: defines the eyebrow property in the current object.
L11188: defines the title property in the current object.
L11189: defines the description property in the current object.
L11190: defines the extraClass property in the current object.
L11191: continues a statement, function call, data value, or rendered content.
L11193: continues a statement, function call, data value, or rendered content.
L11194: opens or closes the current JavaScript structure.
L11196: declares the renderPrivateScheduleViews JavaScript value.
L11197: declares the items JavaScript value.
L11198: continues a statement, function call, data value, or rendered content.
L11199: opens or closes the current JavaScript structure.
L11201: defines or continues an arrow function.
L11202: declares the view JavaScript value.
L11203: starts a conditional branch.
L11205: declares the oldGrid JavaScript value.
L11206: continues a statement, function call, data value, or rendered content.
L11208: declares the grid JavaScript value.
L11209: continues a statement, function call, data value, or rendered content.
L11211: declares the filtered JavaScript value.
L11212: defines or continues an arrow function.
L11213: continues a statement, function call, data value, or rendered content.
L11215: starts a conditional branch.
L11216: declares the empty JavaScript value.
L11217: continues a statement, function call, data value, or rendered content.
L11218: continues a statement, function call, data value, or rendered content.
L11219: continues a statement, function call, data value, or rendered content.
L11220: continues a statement, function call, data value, or rendered content.
L11221: defines or continues an arrow function.
L11222: opens or closes the current JavaScript structure.
L11224: continues a statement, function call, data value, or rendered content.
L11225: continues a statement, function call, data value, or rendered content.
L11226: opens or closes the current JavaScript structure.
L11228: declares the renderCalendarPanel JavaScript value.
L11229: declares the panel JavaScript value.
L11230: declares the actions JavaScript value.
L11231: declares the events JavaScript value.
L11232: starts a conditional branch.
L11233: returns a value or exits the current function.
L11234: opens or closes the current JavaScript structure.
L11236: continues a statement, function call, data value, or rendered content.
L11237: continues a statement, function call, data value, or rendered content.
L11238: continues a statement, function call, data value, or rendered content.
L11240: starts a conditional branch.
L11241: returns a value or exits the current function.
L11242: opens or closes the current JavaScript structure.
L11244: declares the datedItems JavaScript value.
L11245: declares the subscription JavaScript value.
L11247: starts a conditional branch.
L11248: continues a statement, function call, data value, or rendered content.
L11249: defines the label property in the current object.
L11250: defines the href property in the current object.
L11251: defines the primary property in the current object.
L11252: continues a statement, function call, data value, or rendered content.
L11253: opens or closes the current JavaScript structure.
L11255: continues a statement, function call, data value, or rendered content.
L11256: defines the label property in the current object.
L11257: defines or continues an arrow function.
L11258: continues a statement, function call, data value, or rendered content.
L11260: starts a conditional branch.
L11261: declares the empty JavaScript value.
L11262: continues a statement, function call, data value, or rendered content.
L11263: continues a statement, function call, data value, or rendered content.
L11264: continues a statement, function call, data value, or rendered content.
L11265: continues a statement, function call, data value, or rendered content.
L11266: continues a statement, function call, data value, or rendered content.
L11267: returns a value or exits the current function.
L11268: opens or closes the current JavaScript structure.
L11270: defines or continues an arrow function.
L11271: opens or closes the current JavaScript structure.
L11273: declares the renderPrivateCalendar JavaScript value.
L11274: continues a statement, function call, data value, or rendered content.
L11275: continues a statement, function call, data value, or rendered content.
L11277: continues a statement, function call, data value, or rendered content.
L11278: defines the panelSelector property in the current object.
L11279: defines the actionsSelector property in the current object.
L11280: defines the eventsSelector property in the current object.
L11281: continues a statement, function call, data value, or rendered content.
L11283: continues a statement, function call, data value, or rendered content.
L11284: defines the panelSelector property in the current object.
L11285: defines the actionsSelector property in the current object.
L11286: defines the eventsSelector property in the current object.
L11287: continues a statement, function call, data value, or rendered content.
L11289: continues a statement, function call, data value, or rendered content.
L11290: opens or closes the current JavaScript structure.
L11292: continues JavaScript documentation for maintainers.
L11293: continues a statement, function call, data value, or rendered content.
L11294: continues JavaScript documentation for maintainers.
L11296: declares the clearApprovedState JavaScript value.
L11297: continues a statement, function call, data value, or rendered content.
L11298: continues a statement, function call, data value, or rendered content.
L11299: continues a statement, function call, data value, or rendered content.
L11300: continues a statement, function call, data value, or rendered content.
L11301: continues a statement, function call, data value, or rendered content.
L11302: continues a statement, function call, data value, or rendered content.
L11303: continues a statement, function call, data value, or rendered content.
L11304: opens or closes the current JavaScript structure.
L11306: declares the loadPublicReadyAccessState JavaScript value.
L11307: starts a conditional branch.
L11308: continues a statement, function call, data value, or rendered content.
L11309: returns a value or exits the current function.
L11310: opens or closes the current JavaScript structure.
L11312: starts protected error-handling logic.
L11313: declares the session JavaScript value.
L11314: starts a conditional branch.
L11315: continues a statement, function call, data value, or rendered content.
L11316: returns a value or exits the current function.
L11317: opens or closes the current JavaScript structure.
L11319: continues a statement, function call, data value, or rendered content.
L11320: continues a chained method call.
L11321: continues a chained method call.
L11322: continues a chained method call.
L11323: continues a chained method call.
L11325: starts a conditional branch.
L11326: raises an error for the caller.
L11327: opens or closes the current JavaScript structure.
L11329: declares the approved JavaScript value.
L11330: continues a statement, function call, data value, or rendered content.
L11332: continues a statement, function call, data value, or rendered content.
L11333: continues a statement, function call, data value, or rendered content.
L11334: continues a statement, function call, data value, or rendered content.
L11335: continues a statement, function call, data value, or rendered content.
L11337: starts a conditional branch.
L11338: continues a statement, function call, data value, or rendered content.
L11339: continues a chained method call.
L11340: continues a chained method call.
L11341: continues a chained method call.
L11342: continues a chained method call.
L11343: continues a chained method call.
L11345: starts a conditional branch.
L11346: raises an error for the caller.
L11347: opens or closes the current JavaScript structure.
L11349: continues a statement, function call, data value, or rendered content.
L11350: opens or closes the current JavaScript structure.
L11352: continues a statement, function call, data value, or rendered content.
L11353: continues a statement, function call, data value, or rendered content.
L11354: continues a statement, function call, data value, or rendered content.
L11355: continues a statement, function call, data value, or rendered content.
L11356: interacts with the browser document or window.
L11357: continues a statement, function call, data value, or rendered content.
L11358: continues a statement, function call, data value, or rendered content.
L11359: continues a statement, function call, data value, or rendered content.
L11360: opens or closes the current JavaScript structure.
L11361: opens or closes the current JavaScript structure.
L11363: declares the connectPortalState JavaScript value.
L11364: continues a statement, function call, data value, or rendered content.
L11366: starts a conditional branch.
L11367: defines or continues an arrow function.
L11368: defines or continues an arrow function.
L11369: continues a statement, function call, data value, or rendered content.
L11370: opens or closes the current JavaScript structure.
L11372: defines or continues an arrow function.
L11373: interacts with the browser document or window.
L11374: continues a statement, function call, data value, or rendered content.
L11375: opens or closes the current JavaScript structure.
L11377: declares the initialize JavaScript value.
L11378: continues a statement, function call, data value, or rendered content.
L11379: continues a statement, function call, data value, or rendered content.
L11380: continues a statement, function call, data value, or rendered content.
L11381: continues a statement, function call, data value, or rendered content.
L11382: continues a statement, function call, data value, or rendered content.
L11383: continues a statement, function call, data value, or rendered content.
L11384: continues a statement, function call, data value, or rendered content.
L11385: continues a statement, function call, data value, or rendered content.
L11386: continues a statement, function call, data value, or rendered content.
L11387: continues a statement, function call, data value, or rendered content.
L11388: continues a statement, function call, data value, or rendered content.
L11389: opens or closes the current JavaScript structure.
L11391: starts a conditional branch.
L11392: interacts with the browser document or window.
L11393: continues a statement, function call, data value, or rendered content.
L11394: continues a statement, function call, data value, or rendered content.
L11395: opens or closes the current JavaScript structure.
L11396: continues a statement, function call, data value, or rendered content.
*/
