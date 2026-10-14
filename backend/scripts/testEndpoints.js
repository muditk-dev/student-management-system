const http = require('http');

const API_BASE = 'http://127.0.0.1:5000';

function makeRequest(method, path, body = null, customHeaders = {}) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, API_BASE);
    const headers = {
      'Content-Type': 'application/json',
      ...customHeaders,
    };

    let payload = null;
    if (body !== null) {
      if (typeof body === 'string') {
        payload = body;
      } else {
        payload = JSON.stringify(body);
      }
      headers['Content-Length'] = Buffer.byteLength(payload);
    }

    const options = {
      method,
      hostname: url.hostname,
      port: url.port,
      path: url.pathname + url.search,
      headers,
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        let parsed = data;
        try {
          parsed = JSON.parse(data);
        } catch {}
        resolve({
          status: res.statusCode,
          headers: res.headers,
          data: parsed,
        });
      });
    });

    req.on('error', reject);

    if (payload) {
      req.write(payload);
    }
    req.end();
  });
}

async function runComprehensiveTests() {
  console.log('===============================================================');
  console.log('  EDUPULSE BACKEND API - COMPREHENSIVE VERIFICATION SUITE');
  console.log('===============================================================\n');

  let passed = 0;
  let failed = 0;
  const testResults = [];

  function assert(condition, testName, details = '') {
    if (condition) {
      console.log(`✓ [PASS] ${testName}`);
      passed++;
      testResults.push({ name: testName, status: 'PASS', details });
    } else {
      console.error(`✗ [FAIL] ${testName}: ${details}`);
      failed++;
      testResults.push({ name: testName, status: 'FAIL', details });
    }
  }

  const UNIQUE_TEST_ID = `TEST-${Date.now().toString().slice(-6)}`;
  let createdMongoId = null;

  try {
    // 1. Health check endpoint
    const health = await makeRequest('GET', '/api/health');
    assert(
      health.status === 200 && health.data.status === 'ok',
      'GET /api/health returns 200 OK with status: ok',
      `Got status ${health.status}`
    );
    assert(
      health.data.database && health.data.database.connected === true,
      'GET /api/health database reports connected: true',
      `Database state: ${health.data?.database?.status}`
    );

    // 2. CORS headers
    const corsGet = await makeRequest('GET', '/api/health', null, { Origin: 'http://localhost:5173' });
    assert(
      corsGet.headers['access-control-allow-origin'] === 'http://localhost:5173' ||
      corsGet.headers['access-control-allow-origin'] === '*',
      'CORS header Access-Control-Allow-Origin present for development frontend origin',
      `Got ${corsGet.headers['access-control-allow-origin']}`
    );

    // 3. CORS preflight OPTIONS
    const corsOptions = await makeRequest('OPTIONS', '/api/students', null, {
      Origin: 'http://localhost:5173',
      'Access-Control-Request-Method': 'POST',
    });
    assert(
      corsOptions.status === 204 || corsOptions.status === 200,
      'OPTIONS preflight returns 200/204 status',
      `Got status ${corsOptions.status}`
    );

    // 4. List all students
    const listRes = await makeRequest('GET', '/api/students');
    assert(
      listRes.status === 200 && Array.isArray(listRes.data.data),
      'GET /api/students returns 200 with data array',
      `Count: ${listRes.data?.data?.length}`
    );

    // 5. Validation: Empty body
    const emptyRes = await makeRequest('POST', '/api/students', {});
    assert(
      emptyRes.status === 400 && emptyRes.data.success === false,
      'POST /api/students with empty body returns 400 Bad Request',
      `Got status ${emptyRes.status}: ${emptyRes.data?.message}`
    );

    // 6. Validation: Missing contactNumber
    const missingFieldRes = await makeRequest('POST', '/api/students', {
      studentId: `${UNIQUE_TEST_ID}-A`,
      name: 'Partial Student',
      email: 'partial@college.edu',
      department: 'Computer Science & Engineering',
      semester: 1,
    });
    assert(
      missingFieldRes.status === 400 && missingFieldRes.data.success === false,
      'POST /api/students missing required contactNumber returns 400 Bad Request',
      `Got status ${missingFieldRes.status}`
    );

    // 7. Validation: Invalid email format
    const invalidEmailRes = await makeRequest('POST', '/api/students', {
      studentId: `${UNIQUE_TEST_ID}-B`,
      name: 'Bad Email Student',
      email: 'invalid-email-string',
      department: 'Information Technology',
      semester: 2,
      contactNumber: '+91 98765 43210',
    });
    assert(
      invalidEmailRes.status === 400 && invalidEmailRes.data.success === false,
      'POST /api/students with invalid email format returns 400 Validation Error',
      `Got status ${invalidEmailRes.status}`
    );

    // 8. Validation: Invalid semester number (> 8)
    const invalidSemRes = await makeRequest('POST', '/api/students', {
      studentId: `${UNIQUE_TEST_ID}-C`,
      name: 'Bad Semester Student',
      email: 'badsem@college.edu',
      department: 'Information Technology',
      semester: 12,
      contactNumber: '+91 98765 43210',
    });
    assert(
      invalidSemRes.status === 400 && invalidSemRes.data.success === false,
      'POST /api/students with semester=12 (max 8) returns 400 Validation Error',
      `Got status ${invalidSemRes.status}`
    );

    // 9. Validation: Invalid department (not in allowed enum)
    const invalidDeptRes = await makeRequest('POST', '/api/students', {
      studentId: `${UNIQUE_TEST_ID}-D`,
      name: 'Bad Dept Student',
      email: 'baddept@college.edu',
      department: 'Astrophysics & Magic',
      semester: 3,
      contactNumber: '+91 98765 43210',
    });
    assert(
      invalidDeptRes.status === 400 && invalidDeptRes.data.success === false,
      'POST /api/students with invalid department enum returns 400 Validation Error',
      `Got status ${invalidDeptRes.status}`
    );

    // 10. Malformed JSON payload
    const malformedRes = await makeRequest('POST', '/api/students', '{ bad_json: unclosed');
    assert(
      malformedRes.status === 400 && malformedRes.data.success === false,
      'POST /api/students with malformed JSON syntax returns 400 Bad Request',
      `Got status ${malformedRes.status}: ${malformedRes.data?.message}`
    );

    // 11. Create a valid test student
    const validTestRecord = {
      studentId: UNIQUE_TEST_ID,
      name: 'Autonomous Verification Student',
      email: `autoverify_${Date.now()}@college.edu`,
      department: 'Data Science & AI',
      semester: 4,
      contactNumber: '+91 98000 11111',
    };
    const createRes = await makeRequest('POST', '/api/students', validTestRecord);
    assert(
      createRes.status === 201 && createRes.data.success === true,
      `POST /api/students creates valid student (${UNIQUE_TEST_ID}) with 201 Created`,
      `Got status ${createRes.status}`
    );
    if (createRes.data && createRes.data.data) {
      createdMongoId = createRes.data.data._id;
    }

    // 12. Duplicate Student ID rejection
    const duplicateRes = await makeRequest('POST', '/api/students', validTestRecord);
    assert(
      duplicateRes.status === 409 && duplicateRes.data.success === false,
      'POST duplicate studentId returns 409 Conflict with friendly message',
      `Got status ${duplicateRes.status}: ${duplicateRes.data?.message}`
    );

    // 13. Retrieve student by custom studentId
    const getByCodeRes = await makeRequest('GET', `/api/students/${UNIQUE_TEST_ID}`);
    assert(
      getByCodeRes.status === 200 && getByCodeRes.data.data.studentId === UNIQUE_TEST_ID,
      `GET /api/students/:id retrieves student by studentId (${UNIQUE_TEST_ID})`,
      `Got status ${getByCodeRes.status}`
    );

    // 14. Retrieve student by MongoDB ObjectId
    if (createdMongoId) {
      const getByMongoId = await makeRequest('GET', `/api/students/${createdMongoId}`);
      assert(
        getByMongoId.status === 200 && getByMongoId.data.data._id === createdMongoId,
        `GET /api/students/:id retrieves student by MongoDB _id (${createdMongoId})`,
        `Got status ${getByMongoId.status}`
      );
    }

    // 15. Retrieve nonexistent student ID
    const notFoundRes = await makeRequest('GET', '/api/students/NONEXISTENT-99999');
    assert(
      notFoundRes.status === 404 && notFoundRes.data.success === false,
      'GET /api/students/:id with nonexistent ID returns 404 Not Found',
      `Got status ${notFoundRes.status}`
    );

    // 16. Search student by name/query
    const searchRes = await makeRequest('GET', `/api/students?search=${UNIQUE_TEST_ID}`);
    assert(
      searchRes.status === 200 && searchRes.data.data.some((s) => s.studentId === UNIQUE_TEST_ID),
      `GET /api/students?search=${UNIQUE_TEST_ID} returns matching student`,
      `Found ${searchRes.data?.data?.length} matches`
    );

    // 17. Filter by Department
    const deptFilterRes = await makeRequest('GET', '/api/students?department=Data%20Science%20%26%20AI');
    assert(
      deptFilterRes.status === 200 &&
      deptFilterRes.data.data.every((s) => s.department === 'Data Science & AI'),
      'GET /api/students?department=... filters results accurately',
      `Matches: ${deptFilterRes.data?.data?.length}`
    );

    // 18. Filter by Semester
    const semFilterRes = await makeRequest('GET', '/api/students?semester=4');
    assert(
      semFilterRes.status === 200 &&
      semFilterRes.data.data.every((s) => s.semester === 4),
      'GET /api/students?semester=4 filters results accurately',
      `Matches: ${semFilterRes.data?.data?.length}`
    );

    // 19. Update student record
    const updateRes = await makeRequest('PUT', `/api/students/${UNIQUE_TEST_ID}`, {
      name: 'Autonomous Verification Student (Updated)',
      semester: 6,
      contactNumber: '+91 99999 00000',
    });
    assert(
      updateRes.status === 200 &&
      updateRes.data.data.name === 'Autonomous Verification Student (Updated)' &&
      updateRes.data.data.semester === 6,
      `PUT /api/students/:id updates student fields successfully with 200 OK`,
      `Got status ${updateRes.status}`
    );

    // 20. Update with invalid data
    const badUpdateRes = await makeRequest('PUT', `/api/students/${UNIQUE_TEST_ID}`, {
      semester: 99,
    });
    assert(
      badUpdateRes.status === 400 && badUpdateRes.data.success === false,
      'PUT /api/students/:id with invalid semester (99) returns 400 Validation Error',
      `Got status ${badUpdateRes.status}`
    );

    // 21. Update nonexistent student
    const updateNotFound = await makeRequest('PUT', '/api/students/NONEXISTENT-99999', {
      name: 'Ghost Student',
    });
    assert(
      updateNotFound.status === 404 && updateNotFound.data.success === false,
      'PUT /api/students/:id for nonexistent ID returns 404 Not Found',
      `Got status ${updateNotFound.status}`
    );

    // 22. Delete nonexistent student
    const deleteNotFound = await makeRequest('DELETE', '/api/students/NONEXISTENT-99999');
    assert(
      deleteNotFound.status === 404 && deleteNotFound.data.success === false,
      'DELETE /api/students/:id for nonexistent ID returns 404 Not Found',
      `Got status ${deleteNotFound.status}`
    );

    // 23. Delete created test student
    const deleteRes = await makeRequest('DELETE', `/api/students/${UNIQUE_TEST_ID}`);
    assert(
      deleteRes.status === 200 && deleteRes.data.success === true,
      `DELETE /api/students/:id removes student (${UNIQUE_TEST_ID}) with 200 OK`,
      `Got status ${deleteRes.status}`
    );

    // 24. Verify deletion (must return 404 now)
    const verifyDelRes = await makeRequest('GET', `/api/students/${UNIQUE_TEST_ID}`);
    assert(
      verifyDelRes.status === 404,
      `GET /api/students/:id after deletion returns 404 Not Found`,
      `Got status ${verifyDelRes.status}`
    );

    // 25. Dashboard stats endpoint
    const statsRes = await makeRequest('GET', '/api/students/stats');
    assert(
      statsRes.status === 200 &&
      statsRes.data.success === true &&
      typeof statsRes.data.data.totalStudents === 'number' &&
      Array.isArray(statsRes.data.data.departmentStats),
      'GET /api/students/stats returns 200 with aggregated metrics',
      `Total students: ${statsRes.data?.data?.totalStudents}`
    );

    // 26. Database cleanup verification
    const leftoverCheck = await makeRequest('GET', `/api/students?search=${UNIQUE_TEST_ID}`);
    assert(
      leftoverCheck.status === 200 && leftoverCheck.data.data.length === 0,
      'Database cleanliness verified: 0 test records left in database',
      `Leftover records: ${leftoverCheck.data?.data?.length}`
    );

    console.log('\n===============================================================');
    console.log(`  VERIFICATION RESULTS: ${passed} PASSED, ${failed} FAILED (TOTAL: ${passed + failed})`);
    console.log('===============================================================\n');

    if (failed > 0) {
      process.exit(1);
    } else {
      process.exit(0);
    }
  } catch (err) {
    console.error('Test execution encountered unexpected error:', err);
    process.exit(1);
  }
}

runComprehensiveTests();
