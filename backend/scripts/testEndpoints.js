const http = require('http');

const API_BASE = 'http://127.0.0.1:5000';

function makeRequest(method, path, body = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, API_BASE);
    const options = {
      method,
      hostname: url.hostname,
      port: url.port,
      path: url.pathname + url.search,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          resolve({ status: res.statusCode, data: parsed });
        } catch {
          resolve({ status: res.statusCode, data });
        }
      });
    });

    req.on('error', reject);

    if (body) {
      req.write(JSON.stringify(body));
    }
    req.end();
  });
}

async function runTests() {
  console.log('--- STARTING REST API AUTOMATED VERIFICATION ---');
  let passed = 0;
  let failed = 0;

  function assert(condition, description) {
    if (condition) {
      console.log(`✓ PASS: ${description}`);
      passed++;
    } else {
      console.error(`✗ FAIL: ${description}`);
      failed++;
    }
  }

  try {
    // 1. Health check
    const health = await makeRequest('GET', '/api/health');
    assert(health.status === 200 && health.data.status === 'ok', 'GET /api/health returns 200 OK');
    assert(health.data.database.connected === true, 'Database status reports connected: true');

    // 2. Get all students
    const all = await makeRequest('GET', '/api/students');
    assert(all.status === 200 && Array.isArray(all.data.data), 'GET /api/students returns 200 and list');
    assert(all.data.total >= 10, `Total seeded students is at least 10 (got ${all.data.total})`);

    // 3. Create new student
    const testStudent = {
      studentId: 'CS2026-999',
      name: 'Verification Bot',
      email: 'bot@college.edu',
      department: 'Computer Science & Engineering',
      semester: 4,
      contactNumber: '+91 99999 88888',
    };
    const createRes = await makeRequest('POST', '/api/students', testStudent);
    assert(createRes.status === 201 && createRes.data.success === true, 'POST /api/students returns 201 Created');
    assert(createRes.data.data.studentId === 'CS2026-999', 'Returned student matches submitted studentId');

    // 4. Test duplicate student ID
    const duplicateRes = await makeRequest('POST', '/api/students', testStudent);
    assert(duplicateRes.status === 409 && duplicateRes.data.success === false, 'POST duplicate studentId returns 409 Conflict');

    // 5. Get student by ID
    const getSingle = await makeRequest('GET', '/api/students/CS2026-999');
    assert(getSingle.status === 200 && getSingle.data.data.name === 'Verification Bot', 'GET /api/students/:id finds student by studentId');

    // 6. Search students
    const searchRes = await makeRequest('GET', '/api/students?search=Verification');
    assert(searchRes.status === 200 && searchRes.data.data.length >= 1, 'GET /api/students?search=Verification returns matching student');

    // 7. Update student
    const updateRes = await makeRequest('PUT', '/api/students/CS2026-999', {
      name: 'Verification Bot Updated',
      semester: 5,
    });
    assert(updateRes.status === 200 && updateRes.data.data.name === 'Verification Bot Updated', 'PUT /api/students/:id updates details');

    // 8. Delete student
    const deleteRes = await makeRequest('DELETE', '/api/students/CS2026-999');
    assert(deleteRes.status === 200 && deleteRes.data.success === true, 'DELETE /api/students/:id returns 200 OK');

    // 9. Verify deletion (404)
    const verifyDelete = await makeRequest('GET', '/api/students/CS2026-999');
    assert(verifyDelete.status === 404, 'GET deleted student returns 404 Not Found');

    // 10. Dashboard stats
    const statsRes = await makeRequest('GET', '/api/students/stats');
    assert(statsRes.status === 200 && statsRes.data.data.totalStudents >= 10, 'GET /api/students/stats returns aggregated metrics');

    console.log(`\nTEST SUMMARY: ${passed} Passed, ${failed} Failed.`);
    if (failed > 0) {
      process.exit(1);
    } else {
      console.log('ALL API CHECKS PASSED PERFECTLY!\n');
      process.exit(0);
    }
  } catch (err) {
    console.error('Test execution error:', err.message);
    process.exit(1);
  }
}

runTests();
