export type PaymentStatus = "paid" | "partial" | "unpaid" | "overdue";

export type PaymentMethod =
  | "cash"
  | "bank_transfer"
  | "mobile_money"
  | "cheque";

export interface FeeItem {
  id: string;
  name: string;
  amount: number;
}

export interface Payment {
  id: string;
  date: string;
  amount: number;
  method: PaymentMethod;
  reference: string;
  recordedAt: string;
}

export interface Bill {
  id: string;
  billNumber: string;
  title: string;
  semester: string;
  academicYear: string;
  feeItems: FeeItem[];
  totalAmount: number;
  createdAt: string;
}

export interface StudentBill {
  id: string;
  billId: string;
  studentId: string;
  studentName: string;
  grade: string;
  status: PaymentStatus;
  totalDue: number;
  totalPaid: number;
  balance: number;
  payments: Payment[];
}

// Status display config
export const paymentStatusConfig: Record<
  PaymentStatus,
  { label: string; color: string }
> = {
  paid: {
    label: "Paid",
    color: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  },
  partial: {
    label: "Partial",
    color:
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
  },
  unpaid: {
    label: "Unpaid",
    color: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300",
  },
  overdue: {
    label: "Overdue",
    color: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
  },
};

// Payment method config
export const paymentMethodConfig: Record<
  PaymentMethod,
  { label: string }
> = {
  cash: { label: "Cash" },
  bank_transfer: { label: "Bank Transfer" },
  mobile_money: { label: "Mobile Money" },
  cheque: { label: "Cheque" },
};

// Generate bill number
export function generateBillNumber(): string {
  const year = new Date().getFullYear();
  const random = Math.floor(Math.random() * 10000)
    .toString()
    .padStart(4, "0");
  return `BILL${year}${random}`;
}

// Format currency
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-GH", {
    style: "currency",
    currency: "GHS",
  }).format(amount);
}

// Export student bills to CSV
export function exportStudentBillsToCSV(studentBills: StudentBill[]): void {
  const headers = [
    "Student Name",
    "Grade",
    "Status",
    "Total Due",
    "Total Paid",
    "Balance",
  ];

  const rows = studentBills.map((sb) => [
    `"${sb.studentName.replace(/"/g, '""')}"`,
    sb.grade,
    sb.status,
    sb.totalDue.toFixed(2),
    sb.totalPaid.toFixed(2),
    sb.balance.toFixed(2),
  ]);

  const csvContent = [
    headers.join(","),
    ...rows.map((row) => row.join(",")),
  ].join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);

  link.setAttribute("href", url);
  link.setAttribute(
    "download",
    `student_bills_export_${new Date().toISOString().split("T")[0]}.csv`
  );
  link.style.visibility = "hidden";

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// Mock bills
export const initialBills: Bill[] = [
  {
    id: "bill-001",
    billNumber: "BILL20250001",
    title: "Term 1 School Fees",
    semester: "Term 1",
    academicYear: "2024/2025",
    feeItems: [
      { id: "fi-001", name: "Tuition Fee", amount: 1200 },
      { id: "fi-002", name: "Library Fee", amount: 150 },
      { id: "fi-003", name: "ICT Fee", amount: 200 },
      { id: "fi-004", name: "Sports Fee", amount: 100 },
    ],
    totalAmount: 1650,
    createdAt: "2024-09-01T08:00:00Z",
  },
  {
    id: "bill-002",
    billNumber: "BILL20250002",
    title: "Term 2 School Fees",
    semester: "Term 2",
    academicYear: "2024/2025",
    feeItems: [
      { id: "fi-005", name: "Tuition Fee", amount: 1200 },
      { id: "fi-006", name: "Library Fee", amount: 150 },
      { id: "fi-007", name: "Examination Fee", amount: 300 },
    ],
    totalAmount: 1650,
    createdAt: "2025-01-10T08:00:00Z",
  },
  {
    id: "bill-003",
    billNumber: "BILL20250003",
    title: "Term 3 School Fees",
    semester: "Term 3",
    academicYear: "2024/2025",
    feeItems: [
      { id: "fi-008", name: "Tuition Fee", amount: 1200 },
      { id: "fi-009", name: "Library Fee", amount: 150 },
      { id: "fi-010", name: "Graduation Fee", amount: 500 },
    ],
    totalAmount: 1850,
    createdAt: "2025-04-15T08:00:00Z",
  },
];

// Mock student bills
export const initialStudentBills: StudentBill[] = [
  // --- PAID (3) ---
  {
    id: "sb-001",
    billId: "bill-001",
    studentId: "STD001",
    studentName: "Kwame Asante",
    grade: "Grade 10",
    status: "paid",
    totalDue: 1650,
    totalPaid: 1650,
    balance: 0,
    payments: [
      {
        id: "pay-001",
        date: "2024-09-05",
        amount: 1650,
        method: "bank_transfer",
        reference: "TRF-2024-0901",
        recordedAt: "2024-09-05T10:00:00Z",
      },
    ],
  },
  {
    id: "sb-002",
    billId: "bill-001",
    studentId: "STD002",
    studentName: "Ama Mensah",
    grade: "Grade 11",
    status: "paid",
    totalDue: 1650,
    totalPaid: 1650,
    balance: 0,
    payments: [
      {
        id: "pay-002",
        date: "2024-09-10",
        amount: 1000,
        method: "mobile_money",
        reference: "MM-2024-0910",
        recordedAt: "2024-09-10T09:00:00Z",
      },
      {
        id: "pay-003",
        date: "2024-10-01",
        amount: 650,
        method: "cash",
        reference: "CASH-2024-1001",
        recordedAt: "2024-10-01T11:00:00Z",
      },
    ],
  },
  {
    id: "sb-003",
    billId: "bill-002",
    studentId: "STD003",
    studentName: "Kofi Owusu",
    grade: "Grade 9",
    status: "paid",
    totalDue: 1650,
    totalPaid: 1650,
    balance: 0,
    payments: [
      {
        id: "pay-004",
        date: "2025-01-15",
        amount: 1650,
        method: "cheque",
        reference: "CHQ-2025-0115",
        recordedAt: "2025-01-15T14:00:00Z",
      },
    ],
  },
  // --- PARTIAL (3) ---
  {
    id: "sb-004",
    billId: "bill-002",
    studentId: "STD004",
    studentName: "Abena Darko",
    grade: "Grade 10",
    status: "partial",
    totalDue: 1650,
    totalPaid: 800,
    balance: 850,
    payments: [
      {
        id: "pay-005",
        date: "2025-01-20",
        amount: 800,
        method: "mobile_money",
        reference: "MM-2025-0120",
        recordedAt: "2025-01-20T09:30:00Z",
      },
    ],
  },
  {
    id: "sb-005",
    billId: "bill-001",
    studentId: "STD005",
    studentName: "Yaw Boateng",
    grade: "Grade 12",
    status: "partial",
    totalDue: 1650,
    totalPaid: 1000,
    balance: 650,
    payments: [
      {
        id: "pay-006",
        date: "2024-09-08",
        amount: 500,
        method: "cash",
        reference: "CASH-2024-0908",
        recordedAt: "2024-09-08T10:00:00Z",
      },
      {
        id: "pay-007",
        date: "2024-10-15",
        amount: 500,
        method: "bank_transfer",
        reference: "TRF-2024-1015",
        recordedAt: "2024-10-15T12:00:00Z",
      },
    ],
  },
  {
    id: "sb-006",
    billId: "bill-003",
    studentId: "STD006",
    studentName: "Efua Ankrah",
    grade: "Grade 11",
    status: "partial",
    totalDue: 1850,
    totalPaid: 1200,
    balance: 650,
    payments: [
      {
        id: "pay-008",
        date: "2025-04-20",
        amount: 1200,
        method: "bank_transfer",
        reference: "TRF-2025-0420",
        recordedAt: "2025-04-20T09:00:00Z",
      },
    ],
  },
  // --- UNPAID (2) ---
  {
    id: "sb-007",
    billId: "bill-002",
    studentId: "STD007",
    studentName: "Nana Agyeman",
    grade: "Grade 9",
    status: "unpaid",
    totalDue: 1650,
    totalPaid: 0,
    balance: 1650,
    payments: [],
  },
  {
    id: "sb-008",
    billId: "bill-003",
    studentId: "STD008",
    studentName: "Akosua Frimpong",
    grade: "Grade 10",
    status: "unpaid",
    totalDue: 1850,
    totalPaid: 0,
    balance: 1850,
    payments: [],
  },
  // --- OVERDUE (2) ---
  {
    id: "sb-009",
    billId: "bill-001",
    studentId: "STD009",
    studentName: "Kwesi Appiah",
    grade: "Grade 12",
    status: "overdue",
    totalDue: 1650,
    totalPaid: 0,
    balance: 1650,
    payments: [],
  },
  {
    id: "sb-010",
    billId: "bill-001",
    studentId: "STD010",
    studentName: "Adjoa Tetteh",
    grade: "Grade 11",
    status: "overdue",
    totalDue: 1650,
    totalPaid: 500,
    balance: 1150,
    payments: [
      {
        id: "pay-009",
        date: "2024-09-15",
        amount: 500,
        method: "cash",
        reference: "CASH-2024-0915",
        recordedAt: "2024-09-15T10:30:00Z",
      },
    ],
  },
];
