// make-seed.js
const fs = require('fs');

const raw = fs.readFileSync('repos.json', 'utf8');
const repos = JSON.parse(raw);

const now = new Date();

function computeStatus(pushedAt) {
  if (!pushedAt) return 'archived';
  const pushed = new Date(pushedAt);
  const ageDays = (now - pushed) / 86400000;
  if (ageDays < 90) return 'live';
  if (ageDays < 365) return 'prototype';
  return 'archived';
}

const projects = repos.map(r => {
  const status = computeStatus(r.pushedAt);

  return {
    id: r.name,                       // you can swap to UUIDs later
    slug: r.name,                     // URL slug for SPA
    name: r.name,
    tagline: '',                      // fill manually
    shortDescription: r.description || '',
    longDescription: '',              // fill manually

    status,                           // 'live' | 'prototype' | 'archived'

    primaryRepoUrl: r.url,
    liveUrl: '',                      // optional demo link
    githubRepoFullName: r.nameWithOwner,

    createdAt: r.pushedAt || new Date().toISOString(),
    updatedAt: r.updatedAt || r.pushedAt || new Date().toISOString()
  };
});

const seed = {
  partitions: [
    {
      id: 'showcase',
      slug: 'showcase',
      name: 'Main Showcase',
      description: 'Curated apps, tools, and experiments built by DRCUOA.',
      sortOrder: 1
    }
  ],
  projects,
  projectPartitions: projects.map((p, idx) => ({
    projectId: p.id,
    partitionId: 'showcase',
    isFeatured: idx < 10,             // first 10 as “featured” by default
    sortOrder: idx + 1
  }))
};

fs.writeFileSync('seed.json', JSON.stringify(seed, null, 2));
console.log(`Wrote seed.json with ${projects.length} projects.`);
