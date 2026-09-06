import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://vydymabffpgfrigkbtax.supabase.co'
const SUPABASE_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ5ZHltYWJmZnBnZnJpZ2tidGF4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODg2Mjc4MjgsImV4cCI6MjEwNDIwMzgyOH0.BS8ooeHsQHVLhjDEsu9GoDeZAlvUBQblH16BnzndDIY'

const anonClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

async function runAdversarialTests() {
  console.log('--- STARTING ADVERSARIAL RLS SECURITY TESTS ---')

  // 1. Attempt reading a draft row from businesses
  console.log('\n[Test 1] Anon attempt: Reading draft row from `businesses`...')
  const readDraftResult = await anonClient
    .from('businesses')
    .select('id, name, status')
    .eq('status', 'draft')

  console.log('Result:', JSON.stringify(readDraftResult, null, 2))
  if (readDraftResult.data && readDraftResult.data.length === 0) {
    console.log('PASSED: Anon cannot see any draft rows (returned empty array).')
  } else {
    console.error('FAILED: Draft rows exposed to anon!')
  }

  // 2. Attempt inserting into businesses
  console.log('\n[Test 2] Anon attempt: Inserting row into `businesses`...')
  const insertBizResult = await anonClient
    .from('businesses')
    .insert({
      name: 'Adversarial Test Business',
      slug: 'adversarial-test-business',
      status: 'published',
    })
    .select()

  console.log('Result:', JSON.stringify(insertBizResult, null, 2))
  if (insertBizResult.error) {
    console.log('PASSED: Anon insert blocked with error:', insertBizResult.error.message, `(code: ${insertBizResult.error.code})`)
  } else {
    console.error('FAILED: Anon was able to insert into businesses!')
  }

  // 3. Attempt updating an existing row in businesses
  console.log('\n[Test 3] Anon attempt: Updating a row in `businesses`...')
  const updateBizResult = await anonClient
    .from('businesses')
    .update({ name: 'Tampered Name' })
    .neq('id', '00000000-0000-0000-0000-000000000000')
    .select()

  console.log('Result:', JSON.stringify(updateBizResult, null, 2))
  if (updateBizResult.error || (updateBizResult.data && updateBizResult.data.length === 0)) {
    console.log('PASSED: Anon update blocked (error or 0 rows modified).')
  } else {
    console.error('FAILED: Anon was able to update businesses!')
  }

  // 4. Attempt reading submissions
  console.log('\n[Test 4] Anon attempt: Reading rows from `submissions`...')
  const readSubmissionsResult = await anonClient
    .from('submissions')
    .select('*')

  console.log('Result:', JSON.stringify(readSubmissionsResult, null, 2))
  if (readSubmissionsResult.error || (readSubmissionsResult.data && readSubmissionsResult.data.length === 0)) {
    console.log('PASSED: Anon select on submissions blocked/empty.')
  } else {
    console.error('FAILED: Submissions leaked to anon!')
  }

  // 5. Verify anon insert on submissions works as expected
  console.log('\n[Test 5] Anon attempt: Authorized insert into `submissions`...')
  const insertSubResult = await anonClient
    .from('submissions')
    .insert({
      contact_name: 'Maria Teste',
      contact_phone: '77999990000',
      contact_email: 'maria@example.com',
      target_domain: 'business',
      payload: { business_name: 'Boutique da Maria' },
      ip_address: '127.0.0.1',
    })

  console.log('Result:', JSON.stringify(insertSubResult, null, 2))
  if (!insertSubResult.error) {
    console.log('PASSED: Public submission successfully inserted.')
  } else {
    console.error('FAILED: Valid public submission failed:', insertSubResult.error)
  }

  console.log('\n--- ADVERSARIAL TESTS COMPLETE ---')
}

runAdversarialTests().catch(console.error)
