// composables/useAppointmentsMock.ts
import { ref } from "vue";

export type AppointmentRow = {
  id: number;
  name: string;
  patientId: string;
  avatar: string;
  doctor: string;
  treatment: string;
  mobile: string;
  email: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
};

function iso(addDays = 0) {
  const d = new Date();
  d.setDate(d.getDate() + addDays);
  return d.toISOString().slice(0, 10);
}

function pickColor(t: string) {
  const k = t.toLowerCase();
  if (k.includes("operation") || k.includes("surgery")) return "#26A65B";
  if (k.includes("cancer")) return "#ff5c57";
  if (k.includes("infertility") || k.includes("prostate")) return "#ff2d87";
  return "#3B82F6";
}

export const useAppointmentsMock = () => {
  const rows = ref<AppointmentRow[]>([
    {
      id: 1,
      name: "Della Reichert",
      patientId: "PID-1001",
      avatar: "https://i.pravatar.cc/80?img=1",
      doctor: "Dr. Della",
      treatment: "Operation",
      mobile: "621-885-7123",
      email: "d.reichert@example.com",
      date: iso(0),
      time: "09:00",
    },
    {
      id: 2,
      name: "Celia Duesberry",
      patientId: "PID-1002",
      avatar: "https://i.pravatar.cc/80?img=5",
      doctor: "Dr. Celia",
      treatment: "Prostate",
      mobile: "784-383-0430",
      email: "c.duesberry@example.com",
      date: iso(0),
      time: "10:30",
    },
    {
      id: 3,
      name: "Randene Verrechia",
      patientId: "PID-1003",
      avatar: "https://i.pravatar.cc/80?img=12",
      doctor: "Dr. Randene",
      treatment: "Cancer",
      mobile: "634-616-0235",
      email: "r.verrechia@example.com",
      date: iso(0),
      time: "13:00",
    },
    {
      id: 4,
      name: "Abdel Guerreru",
      patientId: "PID-1005",
      avatar: "https://i.pravatar.cc/80?img=23",
      doctor: "Dr. Abdel",
      treatment: "Infertility",
      mobile: "493-812-8700",
      email: "a.guerreru@example.com",
      date: iso(0),
      time: "15:15",
    },
    {
      id: 5,
      name: "Morse Constance",
      patientId: "PID-1006",
      avatar: "https://i.pravatar.cc/80?img=15",
      doctor: "Dr. Morse",
      treatment: "Surgery",
      mobile: "211-516-4560",
      email: "m.constance@example.com",
      date: iso(1),
      time: "09:45",
    },
    {
      id: 6,
      name: "Andrea Buckland",
      patientId: "PID-1007",
      avatar: "https://i.pravatar.cc/80?img=11",
      doctor: "Dr. Celia",
      treatment: "Checkup",
      mobile: "123-345-3454",
      email: "andrea.b@example.com",
      date: iso(1),
      time: "11:30",
    },
    {
      id: 7,
      name: "Bernardo James",
      patientId: "PID-1008",
      avatar: "https://i.pravatar.cc/80?img=21",
      doctor: "Dr. Della",
      treatment: "Operation",
      mobile: "800-555-1007",
      email: "bernardo.j@example.com",
      date: iso(1),
      time: "16:00",
    },
    {
      id: 8,
      name: "Celia Duesberry",
      patientId: "PID-1002",
      avatar: "https://i.pravatar.cc/80?img=5",
      doctor: "Dr. Randene",
      treatment: "Prostate",
      mobile: "784-383-0430",
      email: "c.duesberry@example.com",
      date: iso(2),
      time: "10:00",
    },
    {
      id: 9,
      name: "Randene Verrechia",
      patientId: "PID-1003",
      avatar: "https://i.pravatar.cc/80?img=12",
      doctor: "Dr. Abdel",
      treatment: "Infertility",
      mobile: "634-616-0235",
      email: "r.verrechia@example.com",
      date: iso(2),
      time: "14:30",
    },
    {
      id: 10,
      name: "Della Reichert",
      patientId: "PID-1001",
      avatar: "https://i.pravatar.cc/80?img=1",
      doctor: "Dr. Morse",
      treatment: "Surgery",
      mobile: "621-885-7123",
      email: "d.reichert@example.com",
      date: iso(-1),
      time: "17:30",
    },
  ]);

  const addAppointment = (data: {
    firstName: string;
    lastName: string;
    mobile: string;
    email: string;
    date: string;
    from: string; // HH:mm
    doctor: string;
    treatment: string;
    avatar?: string;
    patientId?: string;
  }) => {
    const newId =
      (rows.value.length ? Math.max(...rows.value.map((r) => r.id)) : 0) + 1;
    const name =
      `${data.firstName} ${data.lastName}`.trim() || `Appointment ${newId}`;
    rows.value.unshift({
      id: newId,
      name,
      patientId: data.patientId || `PID-${1000 + newId}`,
      avatar: data.avatar || `https://i.pravatar.cc/80?img=${(newId % 40) + 1}`,
      doctor: data.doctor || "Dr. Unknown",
      treatment: data.treatment || "Checkup",
      mobile: data.mobile,
      email: data.email || "unknown@example.com",
      date: data.date,
      time: data.from || "09:00",
    });
  };

  const updateAppointment = (
    updated: Partial<AppointmentRow> & { id: number }
  ) => {
    const i = rows.value.findIndex((r) => r.id === updated.id);
    if (i !== -1) rows.value[i] = { ...rows.value[i], ...updated };
  };

  const removeAppointment = (id: number) => {
    rows.value = rows.value.filter((r) => r.id !== id);
  };

  const toEvents = (list: AppointmentRow[], defaultMinutes = 60) =>
    list.map((r) => {
      const start = new Date(`${r.date}T${r.time}:00`);
      const end = new Date(start);
      end.setMinutes(end.getMinutes() + defaultMinutes);
      const color = pickColor(r.treatment);
      return {
        id: String(r.id),
        title: r.treatment,
        start,
        end,
        backgroundColor: color,
        borderColor: color,
        extendedProps: {
          patient: r.name,
          doctor: r.doctor,
          email: r.email,
          mobile: r.mobile,
          avatar: r.avatar,
        },
      };
    });

  return {
    rows,
    addAppointment,
    updateAppointment,
    removeAppointment,
    toEvents,
  };
};
