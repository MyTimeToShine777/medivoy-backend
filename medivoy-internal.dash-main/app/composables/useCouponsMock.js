// composables/useCouponsMock.js
export const useCouponsMock = () => {
  const coupons = ref([
    {
      id: 1,
      code: "NEWUSER50",
      title: "New User Discount",
      description: "50% off on first consultation for new users",
      type: "percentage",
      value: 50,
      minOrderAmount: 500,
      maxDiscountAmount: 250,
      usageLimit: 1000,
      usageCount: 234,
      userLimit: 1,
      validFrom: "2025-10-01",
      validTo: "2025-12-31",
      status: "active",
      applicableFor: "first_time",
      categories: ["Consultation"],
      excludedCategories: [],
      isPublic: true,
      autoApply: false,
      createdAt: "2025-10-01T10:00:00Z",
      totalSavings: 58500,
    },
    {
      id: 2,
      code: "HEALTH20",
      title: "Health Package Discount",
      description: "₹200 off on health packages above ₹1000",
      type: "fixed",
      value: 200,
      minOrderAmount: 1000,
      maxDiscountAmount: 200,
      usageLimit: 500,
      usageCount: 89,
      userLimit: 2,
      validFrom: "2025-09-15",
      validTo: "2025-11-15",
      status: "active",
      applicableFor: "all",
      categories: ["Health Packages", "Lab Tests"],
      excludedCategories: ["Emergency"],
      isPublic: true,
      autoApply: true,
      createdAt: "2025-09-15T08:00:00Z",
      totalSavings: 17800,
    },
    {
      id: 3,
      code: "FREESHIP",
      title: "Free Home Delivery",
      description: "Free shipping on medicine orders",
      type: "free_shipping",
      value: 0,
      minOrderAmount: 299,
      maxDiscountAmount: 0,
      usageLimit: null,
      usageCount: 1456,
      userLimit: 5,
      validFrom: "2025-08-01",
      validTo: "2025-10-31",
      status: "active",
      applicableFor: "all",
      categories: ["Prescription"],
      excludedCategories: [],
      isPublic: true,
      autoApply: true,
      createdAt: "2025-08-01T12:00:00Z",
      totalSavings: 72800,
    },
    {
      id: 4,
      code: "SUMMER30",
      title: "Summer Health Check",
      description: "30% discount on comprehensive health packages",
      type: "percentage",
      value: 30,
      minOrderAmount: 2000,
      maxDiscountAmount: 600,
      usageLimit: 200,
      usageCount: 187,
      userLimit: 1,
      validFrom: "2025-06-01",
      validTo: "2025-09-30",
      status: "expired",
      applicableFor: "all",
      categories: ["Health Packages", "Lab Tests"],
      excludedCategories: [],
      isPublic: false,
      autoApply: false,
      createdAt: "2025-06-01T06:00:00Z",
      totalSavings: 42300,
    },
    {
      id: 5,
      code: "FAMILY15",
      title: "Family Health Plan",
      description: "15% off on family health packages",
      type: "percentage",
      value: 15,
      minOrderAmount: 1500,
      maxDiscountAmount: 500,
      usageLimit: 300,
      usageCount: 45,
      userLimit: 1,
      validFrom: "2025-10-15",
      validTo: "2025-12-15",
      status: "active",
      applicableFor: "all",
      categories: ["Health Packages"],
      excludedCategories: ["Lab Tests"],
      isPublic: true,
      autoApply: false,
      createdAt: "2025-10-15T14:00:00Z",
      totalSavings: 9750,
    },
    {
      id: 6,
      code: "URGENT10",
      title: "Emergency Consultation",
      description: "₹100 off on emergency consultations",
      type: "fixed",
      value: 100,
      minOrderAmount: 500,
      maxDiscountAmount: 100,
      usageLimit: 50,
      usageCount: 12,
      userLimit: 3,
      validFrom: "2025-10-01",
      validTo: "2025-11-30",
      status: "active",
      applicableFor: "all",
      categories: ["Emergency", "Consultation"],
      excludedCategories: [],
      isPublic: false,
      autoApply: false,
      createdAt: "2025-10-01T16:00:00Z",
      totalSavings: 1200,
    },
  ]);

  const couponStats = computed(() => {
    const totalCoupons = coupons.value.length;
    const activeCoupons = coupons.value.filter(
      (c) => c.status === "active"
    ).length;
    const expiredCoupons = coupons.value.filter(
      (c) => c.status === "expired"
    ).length;
    const totalSavings = coupons.value.reduce(
      (sum, c) => sum + (c.totalSavings || 0),
      0
    );

    return {
      totalCoupons,
      activeCoupons,
      expiredCoupons,
      totalSavings,
    };
  });

  const addCoupon = (couponData) => {
    const newCoupon = {
      ...couponData,
      id: Math.max(...coupons.value.map((c) => c.id)) + 1,
      usageCount: 0,
      totalSavings: 0,
      createdAt: new Date().toISOString(),
    };
    coupons.value.unshift(newCoupon);
  };

  const updateCoupon = (id, couponData) => {
    const index = coupons.value.findIndex((c) => c.id === id);
    if (index !== -1) {
      coupons.value[index] = { ...coupons.value[index], ...couponData };
    }
  };

  const deleteCoupon = (id) => {
    coupons.value = coupons.value.filter((c) => c.id !== id);
  };

  return {
    coupons: readonly(coupons),
    couponStats,
    addCoupon,
    updateCoupon,
    deleteCoupon,
  };
};
