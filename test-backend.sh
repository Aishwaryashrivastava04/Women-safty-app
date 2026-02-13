#!/bin/bash
# test-backend.sh - Test all endpoints to verify backend is working

echo "🧪 Testing Women Safety App Backend"
echo "=================================="
echo ""

# Color codes
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

API_URL="http://localhost:3000"
TEST_EMAIL="testuser$(date +%s)@test.com"
TEST_PASSWORD="TestPass123"

# Test 1: API Health Check
echo -e "${YELLOW}📌 Test 1: Health Check${NC}"
RESPONSE=$(curl -s -w "\n%{http_code}" "$API_URL/api")
HTTP_CODE=$(echo "$RESPONSE" | tail -n 1)
BODY=$(echo "$RESPONSE" | head -n -1)

if [ "$HTTP_CODE" = "200" ]; then
  echo -e "${GREEN}✅ Backend responding${NC}"
  echo "Response: $BODY"
else
  echo -e "${RED}❌ Backend not responding${NC}"
  exit 1
fi
echo ""

# Test 2: Register New User
echo -e "${YELLOW}📌 Test 2: Register New User${NC}"
REGISTER_RESPONSE=$(curl -s -X POST "$API_URL/users/register" \
  -H "Content-Type: application/json" \
  -d "{
    \"name\": \"Test User\",
    \"email\": \"$TEST_EMAIL\",
    \"password\": \"$TEST_PASSWORD\",
    \"contact\": \"+91 9999999999\"
  }")

if echo "$REGISTER_RESPONSE" | grep -q '"success":true'; then
  echo -e "${GREEN}✅ Registration successful${NC}"
  echo "User: $TEST_EMAIL"
else
  echo -e "${RED}❌ Registration failed${NC}"
  echo "Response: $REGISTER_RESPONSE"
fi
echo ""

# Test 3: Login with Registered User
echo -e "${YELLOW}📌 Test 3: Login${NC}"
LOGIN_RESPONSE=$(curl -s -X POST "$API_URL/users/login" \
  -H "Content-Type: application/json" \
  -d "{
    \"email\": \"$TEST_EMAIL\",
    \"password\": \"$TEST_PASSWORD\"
  }")

if echo "$LOGIN_RESPONSE" | grep -q '"success":true'; then
  echo -e "${GREEN}✅ Login successful${NC}"
  TOKEN=$(echo "$LOGIN_RESPONSE" | grep -o '"token":"[^"]*"' | cut -d'"' -f4)
  echo "Token: $TOKEN"
else
  echo -e "${RED}❌ Login failed${NC}"
  echo "Response: $LOGIN_RESPONSE"
fi
echo ""

# Test 4: Wrong Password
echo -e "${YELLOW}📌 Test 4: Login with Wrong Password${NC}"
WRONG_PASS=$(curl -s -X POST "$API_URL/users/login" \
  -H "Content-Type: application/json" \
  -d "{
    \"email\": \"$TEST_EMAIL\",
    \"password\": \"WrongPassword\"
  }")

if echo "$WRONG_PASS" | grep -q '"success":false'; then
  echo -e "${GREEN}✅ Correctly rejected wrong password${NC}"
else
  echo -e "${RED}❌ Should reject wrong password${NC}"
fi
echo ""

echo -e "${GREEN}=================================="
echo "✅ All tests completed!"
echo "==================================${NC}"
echo ""
echo "📝 Summary:"
echo "  • Mac IP: 192.168.0.102"
echo "  • Backend: 0.0.0.0:3000"
echo "  • Emulator: Use 10.0.2.2:3000"
echo "  • Physical Device: Use 192.168.0.102:3000"
