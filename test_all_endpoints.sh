#!/bin/bash

echo "=========================================="
echo "MEDIVOY BACKEND - COMPREHENSIVE ENDPOINT TEST"
echo "=========================================="
echo ""

BASE_URL="http://localhost:5000/api/v1"
ERRORS=0
SUCCESS=0

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

test_endpoint() {
    local method=$1
    local endpoint=$2
    local description=$3
    local data=$4
    
    echo -n "Testing: $description ... "
    
    if [ "$method" = "GET" ]; then
        response=$(curl -s -w "\n%{http_code}" "$BASE_URL$endpoint")
    elif [ "$method" = "POST" ]; then
        response=$(curl -s -w "\n%{http_code}" -X POST "$BASE_URL$endpoint" -H "Content-Type: application/json" -d "$data")
    fi
    
    http_code=$(echo "$response" | tail -n1)
    body=$(echo "$response" | sed '$d')
    
    # Check if response is valid (200-499 are expected, 500+ are errors)
    if [ "$http_code" -ge 200 ] && [ "$http_code" -lt 500 ]; then
        echo -e "${GREEN}✓ OK${NC} (HTTP $http_code)"
        SUCCESS=$((SUCCESS + 1))
    else
        echo -e "${RED}✗ FAILED${NC} (HTTP $http_code)"
        ERRORS=$((ERRORS + 1))
    fi
}

echo "1. HEALTH & MONITORING ENDPOINTS"
echo "-----------------------------------"
test_endpoint "GET" "/health" "API Health Check"
echo ""

echo "2. AUTHENTICATION ENDPOINTS"
echo "-----------------------------------"
test_endpoint "POST" "/auth/register" "Register (validation error expected)" '{"email":"test"}'
test_endpoint "POST" "/auth/login" "Login (validation error expected)" '{"email":"test"}'
test_endpoint "POST" "/auth/forgot-password" "Forgot Password (validation error expected)" '{"email":"test"}'
echo ""

echo "3. USER MANAGEMENT ENDPOINTS"
echo "-----------------------------------"
test_endpoint "GET" "/users" "List Users (auth required)"
test_endpoint "GET" "/users/1" "Get User by ID (auth required)"
echo ""

echo "4. PATIENT MANAGEMENT ENDPOINTS"
echo "-----------------------------------"
test_endpoint "GET" "/patients" "List Patients (auth required)"
test_endpoint "GET" "/patients/1" "Get Patient by ID (auth required)"
echo ""

echo "5. DOCTOR MANAGEMENT ENDPOINTS"
echo "-----------------------------------"
test_endpoint "GET" "/doctors" "List Doctors (auth required)"
test_endpoint "GET" "/doctors/1" "Get Doctor by ID (auth required)"
test_endpoint "GET" "/doctors/search" "Search Doctors (auth required)"
echo ""

echo "6. HOSPITAL MANAGEMENT ENDPOINTS"
echo "-----------------------------------"
test_endpoint "GET" "/hospitals" "List Hospitals (auth required)"
test_endpoint "GET" "/hospitals/1" "Get Hospital by ID (auth required)"
echo ""

echo "7. TREATMENT MANAGEMENT ENDPOINTS"
echo "-----------------------------------"
test_endpoint "GET" "/treatments" "List Treatments (auth required)"
test_endpoint "GET" "/treatments/1" "Get Treatment by ID (auth required)"
test_endpoint "GET" "/treatments/search" "Search Treatments (auth required)"
echo ""

echo "8. BOOKING MANAGEMENT ENDPOINTS"
echo "-----------------------------------"
test_endpoint "GET" "/bookings" "List Bookings (auth required)"
test_endpoint "GET" "/bookings/1" "Get Booking by ID (auth required)"
echo ""

echo "9. APPOINTMENT MANAGEMENT ENDPOINTS"
echo "-----------------------------------"
test_endpoint "GET" "/appointments" "List Appointments (auth required)"
test_endpoint "GET" "/appointments/1" "Get Appointment by ID (auth required)"
echo ""

echo "10. PAYMENT MANAGEMENT ENDPOINTS"
echo "-----------------------------------"
test_endpoint "GET" "/payments" "List Payments (auth required)"
test_endpoint "GET" "/payments/1" "Get Payment by ID (auth required)"
echo ""

echo "11. ANALYTICS ENDPOINTS"
echo "-----------------------------------"
test_endpoint "GET" "/analytics/dashboard" "Dashboard Stats (auth required)"
test_endpoint "GET" "/analytics/bookings" "Booking Analytics (auth required)"
test_endpoint "GET" "/analytics/revenue" "Revenue Analytics (auth required)"
echo ""

echo "12. SYSTEM SETTINGS ENDPOINTS"
echo "-----------------------------------"
test_endpoint "GET" "/system-settings" "List Settings (auth required)"
test_endpoint "GET" "/system-settings/public" "Public Settings"
echo ""

echo "13. TRANSLATION ENDPOINTS"
echo "-----------------------------------"
test_endpoint "GET" "/translation/languages" "Supported Languages"
test_endpoint "POST" "/translation/detect" "Detect Language (auth required)" '{"text":"hello"}'
echo ""

echo "14. MEDIA ENDPOINTS"
echo "-----------------------------------"
test_endpoint "GET" "/media" "List Media (auth required)"
test_endpoint "GET" "/media/auth/params" "Get Auth Params (auth required)"
echo ""

echo "15. CHAT ENDPOINTS"
echo "-----------------------------------"
test_endpoint "GET" "/chat/conversations" "List Conversations (auth required)"
echo ""

echo "16. VIDEO CALL ENDPOINTS"
echo "-----------------------------------"
test_endpoint "GET" "/video-calls/history" "Call History (auth required)"
echo ""

echo "17. SUPPORT ENDPOINTS"
echo "-----------------------------------"
test_endpoint "GET" "/support" "List Tickets (auth required)"
echo ""

echo "18. NOTIFICATION ENDPOINTS"
echo "-----------------------------------"
test_endpoint "GET" "/notifications" "List Notifications (auth required)"
test_endpoint "GET" "/notifications/unread-count" "Unread Count (auth required)"
echo ""

echo "19. REVIEW ENDPOINTS"
echo "-----------------------------------"
test_endpoint "GET" "/reviews" "List Reviews (auth required)"
echo ""

echo "20. FAQ ENDPOINTS"
echo "-----------------------------------"
test_endpoint "GET" "/faqs" "List FAQs (auth required)"
echo ""

echo ""
echo "=========================================="
echo "TEST SUMMARY"
echo "=========================================="
echo -e "${GREEN}Successful: $SUCCESS${NC}"
echo -e "${RED}Failed: $ERRORS${NC}"
echo "Total: $((SUCCESS + ERRORS))"
echo ""

if [ $ERRORS -eq 0 ]; then
    echo -e "${GREEN}✓ ALL TESTS PASSED!${NC}"
    exit 0
else
    echo -e "${RED}✗ SOME TESTS FAILED${NC}"
    exit 1
fi