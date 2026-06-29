const { Client } = require('pg');

const client = new Client({
  host: '127.0.0.1',
  port: 5432,
  user: 'sdp',
  password: 'sdp',
  database: 'sdp'
});

async function addProjectMember() {
  await client.connect();
  
  const memberId = 'pjm_' + require('crypto').randomUUID().replace(/-/g, '').substring(0, 24);
  const projectId = 'proj_f841abd51f4e4a71bde0fc24';
  const userId = 'usr_5cf0085a-5b0b-495d-a5f6-2342fcdbd0d2';
  const orgId = 'org_f7c49958f80940769e479364';
  
  const query = `
    INSERT INTO project_members (id, project_id, user_id, role, created_at)
    VALUES ($1, $2, $3, 'admin',
      to_char(timezone('UTC', now()), 'YYYY-MM-DD HH24:MI:SS'))
  `;
  
  await client.query(query, [memberId, projectId, userId]);
  
  console.log('Added project member:', memberId);
  
  await client.end();
  console.log('Done!');
}

addProjectMember().catch(err => {
  console.error('Error:', err.message);
  process.exit(1);
});
