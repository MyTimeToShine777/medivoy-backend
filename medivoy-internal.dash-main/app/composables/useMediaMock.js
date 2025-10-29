// composables/useMediaMock.js
export const useMediaMock = () => {
  const mediaItems = ref([
    {
      id: 1,
      title: "Welcome to Our International Healthcare Network",
      description:
        "A comprehensive overview of our world-class medical facilities across the Middle East, offering advanced healthcare services with cultural sensitivity and multilingual support",
      type: "video",
      category: "promotional",
      fileUrl: "/media/videos/healthcare-network-tour.mp4",
      thumbnailUrl: "/media/thumbnails/healthcare-network-thumb.jpg",
      fileSize: "48.5 MB",
      duration: "4:20",
      resolution: "1920x1080",
      format: "MP4",
      uploadedBy: "Marketing Team",
      uploadDate: "2025-09-15T10:30:00Z",
      lastModified: "2025-10-01T14:20:00Z",
      status: "published",
      visibility: "public",
      tags: [
        "healthcare",
        "international",
        "middle east",
        "facilities",
        "multilingual",
      ],
      languages: ["arabic", "english", "french"],
      viewCount: 3250,
      downloadCount: 145,
      isActive: true,
      isFeatured: true,
      seoTitle:
        "International Healthcare Network - Advanced Medical Services across Middle East",
      seoDescription:
        "Explore our world-class healthcare facilities across the Middle East with cutting-edge technology and culturally sensitive medical care.",
      altText:
        "Modern international medical facility showcasing advanced equipment and diverse medical staff",
      copyrightInfo:
        "© 2025 International Healthcare Network. All rights reserved.",
      expiryDate: null,
    },
    {
      id: 2,
      title: "COVID-19 Safety Protocols - Arabic Version",
      description:
        "Comprehensive COVID-19 safety measures and protocols explained in Arabic for our Middle Eastern patients and staff, following WHO international guidelines",
      type: "video",
      category: "educational",
      fileUrl: "/media/videos/covid-safety-arabic.mp4",
      thumbnailUrl: "/media/thumbnails/covid-safety-arabic.jpg",
      fileSize: "32.8 MB",
      duration: "3:15",
      resolution: "1920x1080",
      format: "MP4",
      uploadedBy: "Medical Education Team",
      uploadDate: "2025-08-20T09:15:00Z",
      lastModified: "2025-09-10T11:45:00Z",
      status: "published",
      visibility: "public",
      tags: ["covid", "safety", "protocols", "arabic", "WHO guidelines"],
      languages: ["arabic", "english"],
      viewCount: 2890,
      downloadCount: 256,
      isActive: true,
      isFeatured: true,
      seoTitle: "COVID-19 Safety Protocols in Arabic - Healthcare Guidelines",
      seoDescription:
        "Learn about our comprehensive COVID-19 safety measures in Arabic following WHO international standards.",
      altText:
        "Healthcare workers demonstrating COVID safety protocols with Arabic subtitles",
      copyrightInfo: "© 2025 International Healthcare Network",
      expiryDate: null,
    },
    {
      id: 3,
      title: "Patient Testimonial - Cardiac Surgery Success UAE",
      description:
        "Inspiring success story of cardiac surgery performed at our Dubai facility, featuring bilingual testimonial from Emirati patient and family",
      type: "video",
      category: "testimonials",
      fileUrl: "/media/videos/testimonial-cardiac-uae.mp4",
      thumbnailUrl: "/media/thumbnails/testimonial-cardiac-uae.jpg",
      fileSize: "41.2 MB",
      duration: "5:30",
      resolution: "1920x1080",
      format: "MP4",
      uploadedBy: "Patient Relations Dubai",
      uploadDate: "2025-07-30T16:00:00Z",
      lastModified: "2025-08-05T12:30:00Z",
      status: "published",
      visibility: "public",
      tags: [
        "testimonial",
        "cardiac surgery",
        "UAE",
        "Dubai",
        "success story",
        "bilingual",
      ],
      languages: ["arabic", "english"],
      viewCount: 4200,
      downloadCount: 89,
      isActive: true,
      isFeatured: false,
      seoTitle: "Cardiac Surgery Success Story UAE - Patient Testimonial Dubai",
      seoDescription:
        "Hear from our Emirati patient about their successful cardiac surgery experience at our Dubai facility.",
      altText:
        "Emirati patient and family sharing their positive cardiac surgery experience",
      copyrightInfo: "© 2025 International Healthcare Network UAE",
      expiryDate: null,
    },
    {
      id: 4,
      title: "International Medical Team 2025 - Middle East",
      description:
        "Professional team photo featuring our diverse international medical staff from across the Middle East, Europe, and North America",
      type: "image",
      category: "staff",
      fileUrl: "/media/images/international-medical-team-2025.jpg",
      thumbnailUrl: "/media/thumbnails/international-team-thumb.jpg",
      fileSize: "3.4 MB",
      duration: null,
      resolution: "2880x1920",
      format: "JPEG",
      uploadedBy: "HR Department",
      uploadDate: "2025-09-01T08:00:00Z",
      lastModified: "2025-09-20T14:15:00Z",
      status: "published",
      visibility: "public",
      tags: [
        "medical team",
        "international",
        "diverse",
        "middle east",
        "multilingual staff",
      ],
      languages: ["universal"],
      viewCount: 1250,
      downloadCount: 345,
      isActive: true,
      isFeatured: true,
      seoTitle:
        "International Medical Team - Diverse Healthcare Professionals Middle East",
      seoDescription:
        "Meet our diverse team of international doctors and healthcare professionals across the Middle East.",
      altText:
        "Diverse group photo of international medical team representing multiple nationalities",
      copyrightInfo: "© 2025 International Healthcare Network",
      expiryDate: null,
    },
    {
      id: 5,
      title: "State-of-the-Art Hospital Infrastructure Qatar",
      description:
        "High-resolution images showcasing our modern hospital infrastructure in Doha, featuring advanced medical equipment and patient-centered design",
      type: "image",
      category: "infrastructure",
      fileUrl: "/media/images/hospital-infrastructure-qatar.jpg",
      thumbnailUrl: "/media/thumbnails/infrastructure-qatar-thumb.jpg",
      fileSize: "4.1 MB",
      duration: null,
      resolution: "3200x2133",
      format: "JPEG",
      uploadedBy: "Marketing Team Qatar",
      uploadDate: "2025-08-10T12:30:00Z",
      lastModified: "2025-08-25T10:45:00Z",
      status: "published",
      visibility: "public",
      tags: ["infrastructure", "Qatar", "Doha", "modern", "advanced equipment"],
      languages: ["universal"],
      viewCount: 1850,
      downloadCount: 267,
      isActive: true,
      isFeatured: false,
      seoTitle:
        "Modern Hospital Infrastructure Qatar - Advanced Medical Facilities Doha",
      seoDescription:
        "Explore our state-of-the-art hospital infrastructure and medical facilities in Doha, Qatar.",
      altText:
        "Modern hospital interior in Qatar showing advanced medical equipment and contemporary design",
      copyrightInfo: "© 2025 International Healthcare Network Qatar",
      expiryDate: null,
    },
    {
      id: 6,
      title: "Multilingual Health Education Guide 2025",
      description:
        "Comprehensive health education materials available in Arabic, English, French, and Urdu covering preventive care, wellness tips, and cultural health practices",
      type: "document",
      category: "educational",
      fileUrl: "/media/documents/multilingual-health-guide-2025.pdf",
      thumbnailUrl: "/media/thumbnails/multilingual-guide-thumb.jpg",
      fileSize: "6.8 MB",
      duration: null,
      resolution: null,
      format: "PDF",
      uploadedBy: "Medical Education International",
      uploadDate: "2025-06-15T14:20:00Z",
      lastModified: "2025-07-20T09:30:00Z",
      status: "published",
      visibility: "public",
      tags: [
        "education",
        "health",
        "multilingual",
        "cultural",
        "preventive care",
      ],
      languages: ["arabic", "english", "french", "urdu"],
      viewCount: 967,
      downloadCount: 645,
      isActive: true,
      isFeatured: false,
      seoTitle:
        "Multilingual Health Education Resources - Medical Information Guide Arabic English",
      seoDescription:
        "Download comprehensive health education materials in Arabic, English, French, and Urdu.",
      altText:
        "Multilingual health education guide cover with Arabic and English text",
      copyrightInfo: "© 2025 International Healthcare Network",
      expiryDate: "2025-12-31",
    },
    {
      id: 7,
      title: "Emergency Response Training - Arabic Audio Guide",
      description:
        "Detailed audio training guide in Arabic covering emergency response procedures, protocols, and life-saving techniques for medical staff across Middle East facilities",
      type: "audio",
      category: "training",
      fileUrl: "/media/audio/emergency-response-arabic.mp3",
      thumbnailUrl: "/media/thumbnails/audio-arabic-thumb.jpg",
      fileSize: "18.7 MB",
      duration: "24:45",
      resolution: null,
      format: "MP3",
      uploadedBy: "Emergency Training Team",
      uploadDate: "2025-05-20T11:00:00Z",
      lastModified: "2025-06-10T15:45:00Z",
      status: "published",
      visibility: "restricted",
      tags: ["emergency", "training", "arabic", "procedures", "medical staff"],
      languages: ["arabic"],
      viewCount: 434,
      downloadCount: 189,
      isActive: true,
      isFeatured: false,
      seoTitle:
        "Emergency Response Training Arabic Audio Guide - Medical Procedures",
      seoDescription:
        "Arabic audio training guide for emergency response procedures in healthcare settings.",
      altText: "Emergency response training audio guide in Arabic language",
      copyrightInfo: "© 2025 International Healthcare Network",
      expiryDate: null,
    },
    {
      id: 8,
      title: "International Surgical Standards Documentation",
      description:
        "Comprehensive documentation of international surgical procedures and standards, including cultural considerations for Middle Eastern patients",
      type: "document",
      category: "training",
      fileUrl: "/media/documents/international-surgical-standards.pdf",
      thumbnailUrl: "/media/thumbnails/surgical-standards-thumb.jpg",
      fileSize: "12.3 MB",
      duration: null,
      resolution: null,
      format: "PDF",
      uploadedBy: "International Surgery Department",
      uploadDate: "2025-04-25T10:15:00Z",
      lastModified: "2025-05-15T16:20:00Z",
      status: "review",
      visibility: "restricted",
      tags: [
        "surgery",
        "international standards",
        "documentation",
        "cultural considerations",
      ],
      languages: ["english", "arabic"],
      viewCount: 645,
      downloadCount: 223,
      isActive: true,
      isFeatured: false,
      seoTitle:
        "International Surgical Standards Documentation - Cultural Healthcare Guidelines",
      seoDescription:
        "Comprehensive guide to international surgical procedures with Middle Eastern cultural considerations.",
      altText:
        "International surgical procedures documentation with cultural guidelines",
      copyrightInfo: "© 2025 International Healthcare Network",
      expiryDate: null,
    },
    {
      id: 9,
      title: "International Healthcare Awards and Accreditations",
      description:
        "Collection of prestigious international awards, JCI accreditations, and recognitions received by our healthcare facilities across the Middle East",
      type: "image",
      category: "awards",
      fileUrl: "/media/images/international-awards-2024.jpg",
      thumbnailUrl: "/media/thumbnails/international-awards-thumb.jpg",
      fileSize: "2.6 MB",
      duration: null,
      resolution: "2560x1707",
      format: "JPEG",
      uploadedBy: "International Administration",
      uploadDate: "2025-03-10T13:45:00Z",
      lastModified: "2025-03-25T11:30:00Z",
      status: "published",
      visibility: "public",
      tags: [
        "awards",
        "JCI accreditation",
        "international recognition",
        "excellence",
        "Middle East",
      ],
      languages: ["universal"],
      viewCount: 1178,
      downloadCount: 298,
      isActive: true,
      isFeatured: true,
      seoTitle:
        "International Healthcare Awards JCI Accreditation - Excellence Middle East",
      seoDescription:
        "View our prestigious international healthcare awards and JCI accreditations across the Middle East.",
      altText:
        "Display of international healthcare awards and JCI accreditation certificates",
      copyrightInfo: "© 2025 International Healthcare Network",
      expiryDate: null,
    },
    {
      id: 10,
      title: "Wellness and Preventive Care Program - Saudi Arabia",
      description:
        "Engaging promotional video highlighting our comprehensive wellness programs in Saudi Arabia, including fitness activities, health screening, and traditional healing practices",
      type: "video",
      category: "promotional",
      fileUrl: "/media/videos/wellness-program-saudi.mp4",
      thumbnailUrl: "/media/thumbnails/wellness-saudi-thumb.jpg",
      fileSize: "59.2 MB",
      duration: "6:45",
      resolution: "1920x1080",
      format: "MP4",
      uploadedBy: "Wellness Team Saudi",
      uploadDate: "2025-02-14T09:20:00Z",
      lastModified: "2025-03-01T14:50:00Z",
      status: "draft",
      visibility: "public",
      tags: [
        "wellness",
        "Saudi Arabia",
        "preventive care",
        "traditional healing",
        "fitness",
      ],
      languages: ["arabic", "english"],
      viewCount: 823,
      downloadCount: 134,
      isActive: true,
      isFeatured: false,
      seoTitle:
        "Wellness Programs Saudi Arabia - Preventive Healthcare Traditional Healing",
      seoDescription:
        "Discover our comprehensive wellness programs in Saudi Arabia combining modern and traditional healing approaches.",
      altText:
        "Wellness program activities in Saudi Arabia featuring traditional and modern healthcare approaches",
      copyrightInfo: "© 2025 International Healthcare Network Saudi Arabia",
      expiryDate: "2025-12-31",
    },
    {
      id: 11,
      title: "Ramadan Healthcare Guidelines - Multilingual",
      description:
        "Special healthcare guidelines and medical advice for patients during Ramadan, available in Arabic, English, Urdu, and French with cultural sensitivity",
      type: "document",
      category: "cultural",
      fileUrl: "/media/documents/ramadan-healthcare-guide.pdf",
      thumbnailUrl: "/media/thumbnails/ramadan-guide-thumb.jpg",
      fileSize: "5.4 MB",
      duration: null,
      resolution: null,
      format: "PDF",
      uploadedBy: "Islamic Healthcare Committee",
      uploadDate: "2025-02-28T14:00:00Z",
      lastModified: "2025-03-15T10:30:00Z",
      status: "published",
      visibility: "public",
      tags: [
        "ramadan",
        "islamic healthcare",
        "cultural",
        "fasting",
        "medical advice",
      ],
      languages: ["arabic", "english", "urdu", "french"],
      viewCount: 2134,
      downloadCount: 567,
      isActive: true,
      isFeatured: true,
      seoTitle:
        "Ramadan Healthcare Guidelines Arabic English - Islamic Medical Advice",
      seoDescription:
        "Culturally sensitive healthcare guidelines for Muslim patients during Ramadan fasting period.",
      altText:
        "Ramadan healthcare guidelines with Islamic crescent moon and medical symbols",
      copyrightInfo: "© 2025 International Healthcare Network",
      expiryDate: null,
    },
    {
      id: 12,
      title: "Hajj Medical Preparation Video - Arabic",
      description:
        "Comprehensive medical preparation guide for pilgrims traveling to Hajj, covering vaccinations, health precautions, and emergency procedures in Arabic",
      type: "video",
      category: "religious",
      fileUrl: "/media/videos/hajj-medical-prep-arabic.mp4",
      thumbnailUrl: "/media/thumbnails/hajj-medical-thumb.jpg",
      fileSize: "67.3 MB",
      duration: "12:45",
      resolution: "1920x1080",
      format: "MP4",
      uploadedBy: "Hajj Medical Team",
      uploadDate: "2025-01-20T11:15:00Z",
      lastModified: "2025-02-10T16:45:00Z",
      status: "published",
      visibility: "public",
      tags: [
        "hajj",
        "pilgrimage",
        "medical preparation",
        "arabic",
        "vaccinations",
      ],
      languages: ["arabic", "english"],
      viewCount: 3567,
      downloadCount: 234,
      isActive: true,
      isFeatured: true,
      seoTitle:
        "Hajj Medical Preparation Arabic - Pilgrimage Health Guidelines Saudi Arabia",
      seoDescription:
        "Essential medical preparation guide for Hajj pilgrims with health precautions and vaccination requirements.",
      altText:
        "Hajj medical preparation video with Kaaba imagery and health symbols",
      copyrightInfo: "© 2025 International Healthcare Network Saudi Arabia",
      expiryDate: null,
    },
  ]);

  const mediaStats = computed(() => {
    const total = mediaItems.value.length;
    const published = mediaItems.value.filter(
      (m) => m.status === "published"
    ).length;
    const totalSize = mediaItems.value.reduce((sum, m) => {
      const size = parseFloat(m.fileSize.replace(/[^0-9.]/g, ""));
      return sum + size;
    }, 0);
    const totalViews = mediaItems.value.reduce(
      (sum, m) => sum + m.viewCount,
      0
    );
    const totalDownloads = mediaItems.value.reduce(
      (sum, m) => sum + m.downloadCount,
      0
    );

    const typeStats = {
      video: mediaItems.value.filter((m) => m.type === "video").length,
      image: mediaItems.value.filter((m) => m.type === "image").length,
      document: mediaItems.value.filter((m) => m.type === "document").length,
      audio: mediaItems.value.filter((m) => m.type === "audio").length,
    };

    return {
      totalItems: total,
      publishedItems: published,
      totalStorageUsed: `${totalSize.toFixed(1)} MB`,
      totalViews,
      totalDownloads,
      typeStats,
    };
  });

  const addMediaItem = (mediaData) => {
    const newMedia = {
      ...mediaData,
      id: Math.max(...mediaItems.value.map((m) => m.id)) + 1,
      uploadDate: new Date().toISOString(),
      lastModified: new Date().toISOString(),
      viewCount: 0,
      downloadCount: 0,
      uploadedBy: "Admin",
    };
    mediaItems.value.unshift(newMedia);
    console.log("Added new media item:", newMedia.title);
  };

  const updateMediaItem = (id, mediaData) => {
    const index = mediaItems.value.findIndex((m) => m.id === id);
    if (index !== -1) {
      mediaItems.value[index] = {
        ...mediaItems.value[index],
        ...mediaData,
        lastModified: new Date().toISOString(),
      };
      console.log("Updated media item:", mediaItems.value[index].title);
    }
  };

  const deleteMediaItem = (id) => {
    const index = mediaItems.value.findIndex((m) => m.id === id);
    if (index !== -1) {
      const deletedItem = mediaItems.value[index];
      mediaItems.value.splice(index, 1);
      console.log("Deleted media item:", deletedItem.title);
    }
  };

  const bulkUpdateStatus = (ids, status) => {
    let updated = 0;
    ids.forEach((id) => {
      const index = mediaItems.value.findIndex((m) => m.id === id);
      if (index !== -1) {
        mediaItems.value[index].status = status;
        mediaItems.value[index].lastModified = new Date().toISOString();
        updated++;
      }
    });
    console.log(`Bulk updated ${updated} items to status: ${status}`);
  };

  const bulkDelete = (ids) => {
    let deleted = 0;
    ids.forEach((id) => {
      const index = mediaItems.value.findIndex((m) => m.id === id);
      if (index !== -1) {
        mediaItems.value.splice(index, 1);
        deleted++;
      }
    });
    console.log(`Bulk deleted ${deleted} items`);
  };

  const incrementViewCount = (id) => {
    const media = mediaItems.value.find((m) => m.id === id);
    if (media) {
      media.viewCount++;
    }
  };

  const incrementDownloadCount = (id) => {
    const media = mediaItems.value.find((m) => m.id === id);
    if (media) {
      media.downloadCount++;
    }
  };

  return {
    mediaItems,
    mediaStats,
    addMediaItem,
    updateMediaItem,
    deleteMediaItem,
    bulkUpdateStatus,
    bulkDelete,
    incrementViewCount,
    incrementDownloadCount,
  };
};
