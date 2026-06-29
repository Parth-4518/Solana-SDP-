const { Client } = require('pg');

const client = new Client({
  host: '127.0.0.1',
  port: 5432,
  user: 'sdp',
  password: 'sdp',
  database: 'sdp'
});

async function setupProject() {
  await client.connect();
  
  const projectId = 'proj_' + require('crypto').randomUUID().replace(/-/g, '').substring(0, 24);
  const orgId = 'org_f7c49958f80940769e479364';
  
  const userId = 'usr_5cf0085a-5b0b-495d-a5f6-2342fcdbd0d2';
  
  const query = `
    INSERT INTO projects (id, organization_id, name, slug, description, environment, status, created_by, created_at, updated_at)
    VALUES ($1, $2, 'Default Project', 'default-project', 'Default project for testing', 'sandbox', 'active', $3,
      to_char(timezone('UTC', now()), 'YYYY-MM-DD HH24:MI:SS'),
      to_char(timezone('UTC', now()), 'YYYY-MM-DD HH24:MI:SS'))
  `;
  
  await client.query(query, [projectId, orgId, userId]);
  
  console.log('Created project:', projectId);
  
  await client.end();
  console.log('Done!');
}

setupProject().catch(err => {
  console.error('Error:', err.message);
  process.exit(1);
});
