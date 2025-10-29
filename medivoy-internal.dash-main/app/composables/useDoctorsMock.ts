// composables/useDoctorsMock.js
import { ref } from "vue";

export const useDoctorsMock = () => {
  const doctors = ref([
    {
      id: 1,
      name: "Dr. Michael Chen",
      firstName: "Michael",
      lastName: "Chen",
      username: "michael_chen",
      avatar: "https://i.pravatar.cc/80?img=21",
      sex: "Male",
      gender: "Male",
      email: "michael.chen@mayo.edu",
      mobile: "+1-507-284-6444",
      degree: "MD, PhD",
      designation: "Chief of Cardiology",
      department: "Cardiology",
      joined: "15/03/2018",
      hospitalId: 1, // Mayo Clinic
      country: "United States",
    },
    {
      id: 2,
      name: "Dr. Sarah Williams",
      firstName: "Sarah",
      lastName: "Williams",
      username: "sarah_w",
      avatar: "https://i.pravatar.cc/80?img=22",
      sex: "Female",
      gender: "Female",
      email: "sarah.williams@jhmi.edu",
      mobile: "+1-410-955-6899",
      degree: "MD, MS",
      designation: "Neurosurgeon",
      department: "Neurosurgery",
      joined: "22/08/2019",
      hospitalId: 2, // Johns Hopkins
      country: "United States",
    },
    {
      id: 3,
      name: "Dr. Raj Patel",
      firstName: "Raj",
      lastName: "Patel",
      username: "raj_patel",
      avatar: "https://i.pravatar.cc/80?img=23",
      sex: "Male",
      gender: "Male",
      email: "raj.patel@sgh.com.sg",
      mobile: "+65-6222-9502",
      degree: "MBBS, FRCS",
      designation: "Senior Consultant",
      department: "Surgery",
      joined: "10/01/2020",
      hospitalId: 3, // Singapore General
      country: "Singapore",
    },
    {
      id: 4,
      name: "Dr. Klaus Müller",
      firstName: "Klaus",
      lastName: "Müller",
      username: "klaus_m",
      avatar: "https://i.pravatar.cc/80?img=24",
      sex: "Male",
      gender: "Male",
      email: "klaus.mueller@charite.de",
      mobile: "+49-30-450-5462",
      degree: "Dr. med., PhD",
      designation: "Professor of Medicine",
      department: "Internal Medicine",
      joined: "05/09/2017",
      hospitalId: 4, // Charité Berlin
      country: "Germany",
    },
    {
      id: 5,
      name: "Dr. Yuki Tanaka",
      firstName: "Yuki",
      lastName: "Tanaka",
      username: "yuki_t",
      avatar: "https://i.pravatar.cc/80?img=25",
      sex: "Female",
      gender: "Female",
      email: "yuki.tanaka@h.u-tokyo.ac.jp",
      mobile: "+81-3-3815-6353",
      degree: "MD, PhD",
      designation: "Associate Professor",
      department: "Pediatrics",
      joined: "18/07/2021",
      hospitalId: 5, // University of Tokyo
      country: "Japan",
    },
    {
      id: 6,
      name: "Dr. David Thompson",
      firstName: "David",
      lastName: "Thompson",
      username: "david_t",
      avatar: "https://i.pravatar.cc/80?img=26",
      sex: "Male",
      gender: "Male",
      email: "david.thompson@uhn.ca",
      mobile: "+1-416-340-5123",
      degree: "MD, FRCSC",
      designation: "Cardiac Surgeon",
      department: "Cardiothoracic Surgery",
      joined: "12/02/2019",
      hospitalId: 6, // Toronto General
      country: "Canada",
    },
    {
      id: 7,
      name: "Dr. Emily Johnson",
      firstName: "Emily",
      lastName: "Johnson",
      username: "emily_j",
      avatar: "https://i.pravatar.cc/80?img=27",
      sex: "Female",
      gender: "Female",
      email: "emily.johnson@gosh.nhs.uk",
      mobile: "+44-20-7405-4813",
      degree: "MBBS, FRCPCH",
      designation: "Consultant Pediatrician",
      department: "Pediatric Cardiology",
      joined: "06/12/2020",
      hospitalId: 7, // Great Ormond Street
      country: "United Kingdom",
    },
    {
      id: 8,
      name: "Dr. Lars Andersson",
      firstName: "Lars",
      lastName: "Andersson",
      username: "lars_a",
      avatar: "https://i.pravatar.cc/80?img=28",
      sex: "Male",
      gender: "Male",
      email: "lars.andersson@karolinska.se",
      mobile: "+46-8-517-2386",
      degree: "MD, PhD",
      designation: "Senior Physician",
      department: "Oncology",
      joined: "14/05/2018",
      hospitalId: 8, // Karolinska
      country: "Sweden",
    },
    {
      id: 9,
      name: "Dr. Priya Sharma",
      firstName: "Priya",
      lastName: "Sharma",
      username: "priya_s",
      avatar: "https://i.pravatar.cc/80?img=29",
      sex: "Female",
      gender: "Female",
      email: "priya.sharma@apollohospitals.com",
      mobile: "+91-44-2829-4507",
      degree: "MBBS, MD",
      designation: "Senior Consultant",
      department: "Neurology",
      joined: "22/05/2019",
      hospitalId: 9, // Apollo Chennai
      country: "India",
    },
    {
      id: 10,
      name: "Dr. Siriporn Wattana",
      firstName: "Siriporn",
      lastName: "Wattana",
      username: "siriporn_w",
      avatar: "https://i.pravatar.cc/80?img=30",
      sex: "Female",
      gender: "Female",
      email: "siriporn.wattana@bumrungrad.com",
      mobile: "+66-2-066-8706",
      degree: "MD, MS",
      designation: "Orthopedic Surgeon",
      department: "Orthopedics",
      joined: "30/12/2020",
      hospitalId: 10, // Bumrungrad Bangkok
      country: "Thailand",
    },
    {
      id: 11,
      name: "Dr. Carlos Silva",
      firstName: "Carlos",
      lastName: "Silva",
      username: "carlos_s",
      avatar: "https://i.pravatar.cc/80?img=31",
      sex: "Male",
      gender: "Male",
      email: "carlos.silva@einstein.br",
      mobile: "+55-11-2151-8901",
      degree: "MD, PhD",
      designation: "Head of Oncology",
      department: "Oncology",
      joined: "08/09/2017",
      hospitalId: 11, // Einstein São Paulo
      country: "Brazil",
    },
    {
      id: 12,
      name: "Dr. Nomsa Mbeki",
      firstName: "Nomsa",
      lastName: "Mbeki",
      username: "nomsa_m",
      avatar: "https://i.pravatar.cc/80?img=32",
      sex: "Female",
      gender: "Female",
      email: "nomsa.mbeki@chbah.org.za",
      mobile: "+27-11-933-5678",
      degree: "MBChB, FCP",
      designation: "Chief of Medicine",
      department: "Internal Medicine",
      joined: "15/04/2018",
      hospitalId: 12, // Baragwanath Soweto
      country: "South Africa",
    },
  ]);

  const addDoctor = (data) => {
    const newId =
      (doctors.value.length ? Math.max(...doctors.value.map((d) => d.id)) : 0) +
      1;
    const name = `${data.firstName} ${data.lastName}`.trim();
    doctors.value.unshift({
      id: newId,
      name: data.firstName || data.lastName ? name : `Doctor ${newId}`,
      firstName: data.firstName,
      lastName: data.lastName,
      username: data.username,
      avatar: `https://i.pravatar.cc/80?img=${(newId % 40) + 20}`,
      sex: data.gender,
      gender: data.gender,
      email: `${(data.firstName || "doctor").toLowerCase()}.${(
        data.lastName || newId.toString()
      ).toLowerCase()}@example.com`,
      mobile: data.mobile,
      degree: data.degree,
      designation: data.designation,
      department: data.department,
      joined: data.joined,
      hospitalId: data.hospitalId,
      country: data.country,
    });
  };

  const updateDoctor = (updated) => {
    const i = doctors.value.findIndex((d) => d.id === updated.id);
    if (i > -1) doctors.value[i] = { ...updated };
  };

  const removeDoctor = (id) => {
    const i = doctors.value.findIndex((d) => d.id === id);
    if (i > -1) doctors.value.splice(i, 1);
  };

  // Get doctors by hospital
  const getDoctorsByHospital = (hospitalId) => {
    return doctors.value.filter((d) => d.hospitalId === hospitalId);
  };

  // Get doctors by country
  const getDoctorsByCountry = (country) => {
    return doctors.value.filter((d) => d.country === country);
  };

  return {
    doctors,
    addDoctor,
    updateDoctor,
    removeDoctor,
    getDoctorsByHospital,
    getDoctorsByCountry,
  };
};
