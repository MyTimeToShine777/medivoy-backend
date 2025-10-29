#!/bin/bash

echo "Testing Medivoy Backend API Endpoints"
echo "======================================"
echo ""

BASE_URL="http://localhost:5000/api/v1"

# Test health endpoint
echo "1. Testing Health Endpoint..."
curl -s "$BASE_URL/health" | jq . || echo "Failed"
echo ""

# Test auth endpoints (should return 400 or validation errors without data)
echo "2. Testing Auth Endpoints..."
echo "   - POST /auth/register (without data - should return validation error)"
curl -s -X POST "$BASE_URL/auth/register" -H "Content-Type: application/json" | jq . || echo "Failed"
echo ""

# Test public endpoints
echo "3. Testing Public Endpoints..."
echo "   - GET /hospitals (should work without auth)"
curl -s "$BASE_URL/hospitals?page=1&limit=5" | jq . || echo "Failed"
echo ""

echo "   - GET /doctors (should work without auth)"
curl -s "$BASE_URL/doctors?page=1&limit=5" | jq . || echo "Failed"
echo ""

echo "   - GET /treatments (should work without auth)"
curl -s "$BASE_URL/treatments?page=1&limit=5" | jq . || echo "Failed"
echo ""

# Test protected endpoints (should return 401 without token)
echo "4. Testing Protected Endpoints (should return 401)..."
echo "   - GET /patients (requires auth)"
curl -s "$BASE_URL/patients" | jq . || echo "Failed"
echo ""

echo "   - GET /bookings (requires auth)"
curl -s "$BASE_URL/bookings" | jq . || echo "Failed"
echo ""

echo "5. Testing Analytics Endpoints (requires auth)..."
curl -s "$BASE_URL/analytics/dashboard" | jq . || echo "Failed"
echo ""

echo "6. Testing System Settings (requires auth)..."
curl -s "$BASE_URL/system-settings" | jq . || echo "Failed"
echo ""

echo "======================================"
echo "Endpoint Testing Complete!"
echo "======================================"