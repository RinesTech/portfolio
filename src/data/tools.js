// The Stack section. A plain word is a normal tile.
// An object { name, folder, preview } becomes a tappable tile with a Preview button:
//   folder   = folder name inside assets/img/ with your images (gallery with titles)
//   preview  = links (YouTube, mp4, images) separated by spaces, used when there is no folder
module.exports = [
  { group: 'Languages',  kind: 'Language',  items: ['PHP', 'SQL', 'JavaScript', 'Java', 'Pawn (SA-MP)', 'Luau (Roblox)'] },
  { group: 'Frameworks', kind: 'Framework', items: ['React Native'] },
  { group: 'Tools',      kind: 'Tool',      items: ['Roblox Studio'] },
  { group: 'Graphics',   kind: 'Graphics',  items: [
    { name: 'Canva', folder: 'canva' },
    { name: 'Figma', folder: 'figma' },
    { name: 'Adobe Photoshop', folder: '', preview: '' },
  ] },
  { group: 'Video Editing', kind: 'Video editing', items: [
    { name: 'CapCut', folder: '', preview: '' },
    { name: 'DaVinci Resolve', folder: '', preview: '' },
  ] },
];
