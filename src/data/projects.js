// All your projects. Copy a block, change the text, save.
//
// Fields:
//   id          short name, no spaces. Its screenshot is assets/img/<id>.jpg (optional)
//   category    Thesis | Real users | Games   (any word works)
//   title, kind, description
//   focus       topics list            (big cards only)
//   features    what it can do         (big cards only)
//   tech        technologies used
//   badge       small tag on big cards (defaults to category)
//   preview     YouTube / Google Drive / mp4 / image links, separated by spaces
//   folder      OR a folder name inside assets/img/ with many images -> shows a titled gallery
//   demo, repo  link buttons (leave '' to hide)
const GH = 'https://github.com/RinesTech';

module.exports = {
  // Big cards (Selected Projects)
  featured: [
    {
      id: 'grading', category: 'Thesis', title: 'School Grading System', kind: 'Web Application',
      description: 'A web-based system for recording student grades and computing them for the school. Built as a thesis project.',
      focus: ['Grade recording', 'Grade computation', 'Student records', 'Database design', 'Web application'],
      features: ['Grade entry with automatic computation', 'Student and class records kept in a database', 'Built and presented as a thesis project'],
      tech: ['PHP', 'SQL', 'JavaScript'],
      preview: '', folder: '', demo: '', repo: GH,
    },
    {
      id: 'tabulation', category: 'Thesis', title: 'Tabulation System', kind: 'Web Application',
      description: 'A system that scores entries and tabulates the results automatically. Built as a thesis project.',
      focus: ['Score entry', 'Result tabulation', 'Ranking', 'Database design', 'Web application'],
      features: ['Automatic computation of scores and totals', 'Results ready to read without manual counting', 'Built and presented as a thesis project'],
      tech: ['PHP', 'SQL', 'JavaScript'],
      preview: '', folder: '', demo: '', repo: GH,
    },
    {
      id: 'comshop', category: 'Real users', title: 'Comshop Management', kind: 'Business Management System',
      description: 'A management system made for a computer shop in our barangay and used for its day-to-day operations.',
      focus: ['Shop operations', 'Record keeping', 'Reports', 'Database design', 'Real-world use'],
      features: ['Replaces manual tracking for the shop', 'Built around how the shop owner actually works', 'Improved from real feedback'],
      tech: ['PHP', 'SQL', 'JavaScript'],
      preview: '', folder: '', demo: '', repo: GH,
    },
    {
      id: 'samp', category: 'Games', badge: '2021 to 2025', title: 'SA-MP Development', kind: 'Game Server Systems',
      description: 'Scripted and developed gamemode systems for SA-MP servers in Pawn, from 2021 until 2025.',
      focus: ['Pawn scripting', 'Gamemode systems', 'Multiplayer features', 'Server-side gameplay', 'SA-MP / open.mp'],
      features: ['Four years of server-side scripting', 'Custom gameplay systems written in Pawn', 'Worked with live player communities'],
      tech: ['Pawn', 'SA-MP', 'open.mp'],
      preview: '', folder: '', demo: '', repo: GH,
    },
  ],

  // Small tap-to-open cards (More projects)
  more: [
    { id: 'store', category: 'Real users', title: 'Store Management', description: "Inventory and sales for my mom's shop.", tech: [], preview: '', folder: '', demo: '', repo: '' },
    { id: 'attendance', category: 'Real users', title: 'Attendance System', description: 'Attendance tracking for my school.', tech: [], preview: '', folder: '', demo: '', repo: '' },
    { id: 'fighter', category: 'Games', title: 'Tekken-style Game', description: 'A fighting game inspired by Tekken.', tech: [], preview: '', folder: '', demo: '', repo: '' },
  ],
};
