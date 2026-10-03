// Your name, intro, contact info and the text of the About / Capabilities / Philosophy sections.
module.exports = {
  name: 'Rines',
  role: 'Developer',
  intro: 'Grading, attendance, shop management and game servers. Software for people I actually know.',

  email: 'princelorenzmdg@gmail.com',
  github: 'https://github.com/RinesTech',   // full link
  githubUser: 'RinesTech',                  // used to load your latest repos
  formspreeId: 'YOUR_FORM_ID',              // from formspree.io, makes the contact form work

  // The "Building ..." line in the hero that types by itself
  typedWords: ['grading systems', 'game servers', 'shop systems', 'things people use'],
  yearsOnSamp: 4,                           // shown in the hero counters

  about: {
    facts: [                                // small list on the left of About
      ['Identity', 'Rines'],
      ['Core Focus', 'Web systems & game servers'],
      ['Specialization', 'PHP / SQL / Pawn (SA-MP)'],
    ],
    paragraphs: [                           // one paragraph per line
      "I'm Rines, a developer who builds grading, attendance, and shop management systems, plus game servers.",
      "I like software for people I actually know: my mom's store, a computer shop in our barangay, my school. When real people use it, bugs get reported fast and the work stays honest.",
      "I've also scripted SA-MP servers in Pawn from 2021 to 2025, and I'm building a Tekken-style fighting game.",
      "I'd rather build something useful, maintainable, and finished than make it complicated.",
    ],
  },

  projectsIntro: 'Selected projects covering school systems, business management and game server development.',

  domains: [                                // "What I build" tiles: [title, description]
    ['Management Systems', 'Grading, attendance, tabulation, store and shop systems for schools and local businesses.'],
    ['Game Server Systems', 'SA-MP / open.mp scripting in Pawn: gamemodes, multiplayer features and server-side gameplay.'],
    ['Game Development', 'A Tekken-style fighting game and Roblox systems in Luau.'],
    ['Mobile Apps', 'Apps built with React Native and Java.'],
  ],

  philosophy: {
    title: 'Useful. Maintainable. Finished.',
    text: 'I build for the people who will actually use the system. I ship it, listen to what breaks, fix it, and keep it simple enough to maintain.',
  },
};
