export type Patient = {
  id: number;
  name: string;
  firstName: string;
  lastName: string;
  username: string;
  avatar: string;
  sex: string;
  gender: "Male" | "Female";
  address: string;
  mobile: string;
  birth: string;
  age: number;
  blood: string;
  status: string;
  email: string;
  sugar: string;
  bp: string;
  injury: string;
};

export const usePatientsMock = () => {
  const patients = ref<Patient[]>([
    {
      id: 1,
      name: "Keary",
      firstName: "Keary",
      lastName: "Johnson",
      username: "keary_634",
      avatar: "https://i.pravatar.cc/80?img=11",
      sex: "Male",
      gender: "Male",
      address: "73 Dwight Way",
      mobile: "280-974-3062",
      birth: "2013-06-25",
      age: 11,
      blood: "O+",
      status: "Recovered",
      email: "keary.johnson@email.com",
      sugar: "85",
      bp: "110/70",
      injury: "Minor cuts from playground",
    },
    {
      id: 2,
      name: "Stanton",
      firstName: "Stanton",
      lastName: "Moore",
      username: "stanton_m",
      avatar: "https://i.pravatar.cc/80?img=12",
      sex: "Male",
      gender: "Male",
      address: "7134 Bluejay Pass",
      mobile: "570-561-3067",
      birth: "1944-05-23",
      age: 80,
      blood: "A+",
      status: "Check up",
      email: "stanton.moore@email.com",
      sugar: "120",
      bp: "140/90",
      injury: "Arthritis",
    },
    {
      id: 3,
      name: "Juan",
      firstName: "Juan",
      lastName: "Castillo",
      username: "juan_259",
      avatar: "https://i.pravatar.cc/80?img=13",
      sex: "Male",
      gender: "Male",
      address: "1 Hollow Ridge Terrace",
      mobile: "259-988-8177",
      birth: "1979-06-16",
      age: 45,
      blood: "O+",
      status: "Operation",
      email: "juan.castillo@email.com",
      sugar: "110",
      bp: "120/78",
      injury: "Hernia repair",
    },
    {
      id: 4,
      name: "Saundra",
      firstName: "Saundra",
      lastName: "Wilson",
      username: "saundra_w",
      avatar: "https://i.pravatar.cc/80?img=14",
      sex: "Female",
      gender: "Female",
      address: "32 Dawn Place",
      mobile: "847-813-3202",
      birth: "1991-10-08",
      age: 33,
      blood: "AB+",
      status: "Check up",
      email: "saundra.wilson@email.com",
      sugar: "88",
      bp: "125/80",
      injury: "Routine checkup",
    },
    {
      id: 5,
      name: "Deirdre",
      firstName: "Deirdre",
      lastName: "Thompson",
      username: "deirdre_t",
      avatar: "https://i.pravatar.cc/80?img=15",
      sex: "Female",
      gender: "Female",
      address: "456 Bluejay Lane",
      mobile: "110-537-7287",
      birth: "2003-12-04",
      age: 21,
      blood: "AB+",
      status: "Check up",
      email: "deirdre.thompson@email.com",
      sugar: "82",
      bp: "118/75",
      injury: "Annual screening",
    },
    {
      id: 6,
      name: "Berri",
      firstName: "Berri",
      lastName: "Davis",
      username: "berri_d",
      avatar: "https://i.pravatar.cc/80?img=16",
      sex: "Female",
      gender: "Female",
      address: "5 Hermina Plaza",
      mobile: "148-133-5389",
      birth: "1948-05-21",
      age: 76,
      blood: "O+",
      status: "Operation",
      email: "berri.davis@email.com",
      sugar: "135",
      bp: "150/95",
      injury: "Cataract surgery scheduled",
    },
  ]);

  const addPatient = (data: {
    firstName: string;
    lastName: string;
    username: string;
    address: string;
    blood: string;
    sugar: string;
    mobile: string;
    age: string;
    gender: "Male" | "Female";
    birth: string;
    bp: string;
    injury: string;
  }) => {
    const newId = Math.max(...patients.value.map((p) => p.id)) + 1;
    const name = `${data.firstName} ${data.lastName}`.trim();
    patients.value.push({
      id: newId,
      name: data.firstName || data.lastName ? name : `Patient ${newId}`,
      firstName: data.firstName,
      lastName: data.lastName,
      username: data.username,
      avatar: `https://i.pravatar.cc/80?img=${(newId % 40) + 10}`,
      sex: data.gender,
      gender: data.gender,
      address: data.address,
      mobile: data.mobile,
      birth: data.birth,
      age: parseInt(data.age || "0"),
      blood: data.blood,
      status: "New",
      email: `${(data.firstName || "user").toLowerCase()}.${(
        data.lastName || newId.toString()
      ).toLowerCase()}@example.com`,
      sugar: data.sugar,
      bp: data.bp,
      injury: data.injury,
    });
  };

  return { patients, addPatient };
};
