const { Client } = require('pg');

const client = new Client({
  host: '127.0.0.1',
  port: 5432,
  user: 'sdp',
  password: 'sdp',
  database: 'sdp'
});

async function setupOrg() {
  await client.connect();
  
  const orgId = 'org_' + require('crypto').randomUUID().replace(/-/g, '').substring(0, 24);
  const memberId = 'mem_' + require('crypto').randomUUID().replace(/-/g, '').substring(0, 24);
  const authOrgId = 'aoi_' + require('crypto').randomUUID().replace(/-/g, '').substring(0, 24);
  
  const clerkOrgId = 'org_3Fnfgmd22Ph2NIkuhVoCMQKtAYZ';
  const userId = 'usr_5cf0085a-5b0b-495d-a5f6-2342fcdbd0d2';
  
  // Insert organization
  await client.query(`
    INSERT INTO organizations (id, name, slug, tier, status, created_at, updated_at)
    VALUES ($1, 'Default Org', 'default-org', 'enterprise', 'active', 
      to_char(timezone('UTC', now()), 'YYYY-MM-DD HH24:MI:SS'),
      to_char(timezone('UTC', now()), 'YYYY-MM-DD HH24:MI:SS'))
  `, [orgId]);
  
  console.log('Created organization:', orgId);
  
  // Insert auth organization identity
  await client.query(`
    INSERT INTO auth_organization_identities (id, provider, provider_org_id, organization_id, slug, created_at, updated_at)
    VALUES ($1, 'clerk', $2, $3, 'default-org',
      to_char(timezone('UTC', now()), 'YYYY-MM-DD HH24:MI:SS'),
      to_char(timezone('UTC', now()), 'YYYY-MM-DD HH24:MI:SS'))
  `, [authOrgId, clerkOrgId, orgId]);
  
  console.log('Created auth org identity:', authOrgId);
  
  // Insert organization member
  await client.query(`
    INSERT INTO organization_members (id, organization_id, user_id, role, status, created_at)
    VALUES ($1, $2, $3, 'admin', 'active',
      to_char(timezone('UTC', now()), 'YYYY-MM-DD HH24:MI:SS'))
  `, [memberId, orgId, userId]);
  
  console.log('Created organization member:', memberId);
  
  await client.end();
  console.log('Done!');
}

setupOrg().catch(err => {
  console.error('Error:', err.message);
  process.exit(1);
});
