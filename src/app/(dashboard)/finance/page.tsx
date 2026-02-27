"use client";

import { useState, useMemo } from "react";
import {
  Bill,
  StudentBill,
  Payment,
  PaymentStatus,
  initialBills,
  initialStudentBills,
  paymentStatusConfig,
  paymentMethodConfig,
  formatCurrency,
  generateBillNumber,
  exportStudentBillsToCSV,
} from "@/lib/finance-data";
import { BillForm } from "@/components/finance/bill-form";
import { BillDetails } from "@/components/finance/bill-details";
import { StudentBillDetails } from "@/components/finance/student-bill-details";
import { RecordPayment } from "@/components/finance/record-payment";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import {
  Search,
  Plus,
  MoreHorizontal,
  Eye,
  Pencil,
  Trash2,
  Download,
  DollarSign,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  BarChart3,
  FileText,
  Users,
  CreditCard,
} from "lucide-react";

type Tab = "overview" | "bills" | "student-bills" | "defaulters";

type ModalMode =
  | "view-bill"
  | "add-bill"
  | "edit-bill"
  | "view-student-bill"
  | "record-payment"
  | null;

const tabs: { key: Tab; label: string; icon: React.ElementType }[] = [
  { key: "overview", label: "Overview", icon: BarChart3 },
  { key: "bills", label: "Bills", icon: FileText },
  { key: "student-bills", label: "Student Bills", icon: Users },
  { key: "defaulters", label: "Defaulters", icon: AlertTriangle },
];

export default function FinancePage() {
  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const [bills, setBills] = useState<Bill[]>(initialBills);
  const [studentBills, setStudentBills] =
    useState<StudentBill[]>(initialStudentBills);

  const [modalMode, setModalMode] = useState<ModalMode>(null);
  const [selectedBill, setSelectedBill] = useState<Bill | null>(null);
  const [selectedStudentBill, setSelectedStudentBill] =
    useState<StudentBill | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Filters for student bills tab
  const [searchQuery, setSearchQuery] = useState("");
  const [billFilter, setBillFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [gradeFilter, setGradeFilter] = useState("all");

  // Stats
  const stats = useMemo(() => {
    const totalBilled = studentBills.reduce((sum, sb) => sum + sb.totalDue, 0);
    const totalCollected = studentBills.reduce(
      (sum, sb) => sum + sb.totalPaid,
      0
    );
    const outstanding = studentBills.reduce((sum, sb) => sum + sb.balance, 0);
    const defaultersCount = studentBills.filter(
      (sb) => sb.status === "unpaid" || sb.status === "overdue"
    ).length;
    return { totalBilled, totalCollected, outstanding, defaultersCount };
  }, [studentBills]);

  // Recent payments (last 5)
  const recentPayments = useMemo(() => {
    const allPayments: { payment: Payment; studentName: string }[] = [];
    studentBills.forEach((sb) => {
      sb.payments.forEach((p) => {
        allPayments.push({ payment: p, studentName: sb.studentName });
      });
    });
    return allPayments
      .sort(
        (a, b) =>
          new Date(b.payment.recordedAt).getTime() -
          new Date(a.payment.recordedAt).getTime()
      )
      .slice(0, 5);
  }, [studentBills]);

  // Filtered student bills
  const filteredStudentBills = useMemo(() => {
    return studentBills.filter((sb) => {
      const query = searchQuery.toLowerCase();
      const matchesSearch =
        sb.studentName.toLowerCase().includes(query) ||
        sb.studentId.toLowerCase().includes(query);
      const matchesBill = billFilter === "all" || sb.billId === billFilter;
      const matchesStatus =
        statusFilter === "all" || sb.status === statusFilter;
      const matchesGrade = gradeFilter === "all" || sb.grade === gradeFilter;
      return matchesSearch && matchesBill && matchesStatus && matchesGrade;
    });
  }, [studentBills, searchQuery, billFilter, statusFilter, gradeFilter]);

  // Defaulters (unpaid + overdue)
  const defaulters = useMemo(() => {
    return studentBills.filter(
      (sb) => sb.status === "unpaid" || sb.status === "overdue"
    );
  }, [studentBills]);

  // Unique grades for filter
  const grades = useMemo(() => {
    return [...new Set(studentBills.map((sb) => sb.grade))].sort();
  }, [studentBills]);

  // Modal helpers
  const openBillModal = (mode: ModalMode, bill?: Bill) => {
    setModalMode(mode);
    setSelectedBill(bill || null);
    setSelectedStudentBill(null);
  };

  const openStudentBillModal = (mode: ModalMode, sb: StudentBill) => {
    setModalMode(mode);
    setSelectedStudentBill(sb);
    const parentBill = bills.find((b) => b.id === sb.billId) || null;
    setSelectedBill(parentBill);
  };

  const closeModal = () => {
    setModalMode(null);
    setSelectedBill(null);
    setSelectedStudentBill(null);
  };

  // CRUD handlers
  const handleAddBill = async (
    data: Omit<Bill, "id" | "billNumber" | "createdAt">
  ) => {
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 500));

    const newBill: Bill = {
      ...data,
      id: `bill-${Date.now()}`,
      billNumber: generateBillNumber(),
      createdAt: new Date().toISOString(),
    };
    setBills((prev) => [...prev, newBill]);
    setIsSubmitting(false);
    closeModal();
  };

  const handleEditBill = async (
    data: Omit<Bill, "id" | "billNumber" | "createdAt">
  ) => {
    if (!selectedBill) return;

    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 500));

    setBills((prev) =>
      prev.map((b) =>
        b.id === selectedBill.id
          ? {
              ...data,
              id: selectedBill.id,
              billNumber: selectedBill.billNumber,
              createdAt: selectedBill.createdAt,
            }
          : b
      )
    );
    setIsSubmitting(false);
    closeModal();
  };

  const handleDeleteBill = (bill: Bill) => {
    if (
      confirm(`Are you sure you want to delete "${bill.title}"?`)
    ) {
      setBills((prev) => prev.filter((b) => b.id !== bill.id));
      setStudentBills((prev) =>
        prev.filter((sb) => sb.billId !== bill.id)
      );
    }
  };

  const handleRecordPayment = async (
    data: Omit<Payment, "id" | "recordedAt">
  ) => {
    if (!selectedStudentBill) return;

    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 500));

    const newPayment: Payment = {
      ...data,
      id: `pay-${Date.now()}`,
      recordedAt: new Date().toISOString(),
    };

    setStudentBills((prev) =>
      prev.map((sb) => {
        if (sb.id !== selectedStudentBill.id) return sb;
        const newTotalPaid = sb.totalPaid + data.amount;
        const newBalance = sb.totalDue - newTotalPaid;
        let newStatus: PaymentStatus = sb.status;
        if (newBalance <= 0) {
          newStatus = "paid";
        } else if (newTotalPaid > 0) {
          newStatus = "partial";
        }
        return {
          ...sb,
          totalPaid: newTotalPaid,
          balance: Math.max(0, newBalance),
          status: newStatus,
          payments: [...sb.payments, newPayment],
        };
      })
    );
    setIsSubmitting(false);
    closeModal();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Finance</h1>
          <p className="text-muted-foreground">
            Manage student fees, billing, and payments
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => exportStudentBillsToCSV(studentBills)}
          >
            <Download className="mr-2 h-4 w-4" />
            Export CSV
          </Button>
          <Button onClick={() => openBillModal("add-bill")}>
            <Plus className="mr-2 h-4 w-4" />
            Add Bill
          </Button>
        </div>
      </div>

      {/* Tab Switcher */}
      <div className="inline-flex items-center gap-1 rounded-lg bg-muted p-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <Button
              key={tab.key}
              variant={activeTab === tab.key ? "default" : "ghost"}
              size="sm"
              onClick={() => setActiveTab(tab.key)}
              className={cn(
                "gap-2",
                activeTab !== tab.key && "text-muted-foreground"
              )}
            >
              <Icon className="h-4 w-4" />
              {tab.label}
            </Button>
          );
        })}
      </div>

      {/* ============ OVERVIEW TAB ============ */}
      {activeTab === "overview" && (
        <div className="space-y-6">
          {/* Stat Cards */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Billed
                </CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {formatCurrency(stats.totalBilled)}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Collected
                </CardTitle>
                <TrendingUp className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {formatCurrency(stats.totalCollected)}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">
                  Outstanding
                </CardTitle>
                <TrendingDown className="h-4 w-4 text-red-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">
                  {formatCurrency(stats.outstanding)}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">
                  Defaulters
                </CardTitle>
                <AlertTriangle className="h-4 w-4 text-orange-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {stats.defaultersCount}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Payments */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Recent Payments</CardTitle>
            </CardHeader>
            <CardContent>
              {recentPayments.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No payments recorded yet.
                </p>
              ) : (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Student</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead className="hidden sm:table-cell">
                          Method
                        </TableHead>
                        <TableHead className="hidden md:table-cell">
                          Reference
                        </TableHead>
                        <TableHead className="text-right">Amount</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {recentPayments.map(({ payment, studentName }) => (
                        <TableRow key={payment.id}>
                          <TableCell className="font-medium">
                            {studentName}
                          </TableCell>
                          <TableCell>{formatDate(payment.date)}</TableCell>
                          <TableCell className="hidden sm:table-cell">
                            {paymentMethodConfig[payment.method].label}
                          </TableCell>
                          <TableCell className="hidden md:table-cell">
                            {payment.reference}
                          </TableCell>
                          <TableCell className="text-right font-medium">
                            {formatCurrency(payment.amount)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* ============ BILLS TAB ============ */}
      {activeTab === "bills" && (
        <div className="space-y-4">
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Bill</TableHead>
                  <TableHead>Semester</TableHead>
                  <TableHead className="hidden sm:table-cell">
                    Academic Year
                  </TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {bills.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center">
                      No bills created yet.
                    </TableCell>
                  </TableRow>
                ) : (
                  bills.map((bill) => (
                    <TableRow key={bill.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{bill.title}</div>
                          <div className="text-xs text-muted-foreground">
                            {bill.billNumber}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{bill.semester}</TableCell>
                      <TableCell className="hidden sm:table-cell">
                        {bill.academicYear}
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        {formatCurrency(bill.totalAmount)}
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() =>
                                openBillModal("view-bill", bill)
                              }
                            >
                              <Eye className="mr-2 h-4 w-4" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() =>
                                openBillModal("edit-bill", bill)
                              }
                            >
                              <Pencil className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleDeleteBill(bill)}
                              className="text-destructive"
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
          <div className="text-sm text-muted-foreground">
            Showing {bills.length} bill{bills.length !== 1 ? "s" : ""}
          </div>
        </div>
      )}

      {/* ============ STUDENT BILLS TAB ============ */}
      {activeTab === "student-bills" && (
        <div className="space-y-4">
          {/* Filters */}
          <div className="flex flex-col gap-4 sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by name or student ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={billFilter} onValueChange={setBillFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="All Bills" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Bills</SelectItem>
                {bills.map((bill) => (
                  <SelectItem key={bill.id} value={bill.id}>
                    {bill.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[150px]">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                {(
                  Object.keys(paymentStatusConfig) as PaymentStatus[]
                ).map((status) => (
                  <SelectItem key={status} value={status}>
                    {paymentStatusConfig[status].label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={gradeFilter} onValueChange={setGradeFilter}>
              <SelectTrigger className="w-full sm:w-[150px]">
                <SelectValue placeholder="All Grades" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Grades</SelectItem>
                {grades.map((grade) => (
                  <SelectItem key={grade} value={grade}>
                    {grade}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student</TableHead>
                  <TableHead className="hidden sm:table-cell">Grade</TableHead>
                  <TableHead className="text-right hidden md:table-cell">
                    Due
                  </TableHead>
                  <TableHead className="text-right">Paid</TableHead>
                  <TableHead className="text-right hidden sm:table-cell">
                    Balance
                  </TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStudentBills.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center">
                      No student bills found.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredStudentBills.map((sb) => {
                    const statusConf = paymentStatusConfig[sb.status];
                    return (
                      <TableRow key={sb.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{sb.studentName}</div>
                            <div className="text-xs text-muted-foreground">
                              {sb.studentId}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="hidden sm:table-cell">
                          {sb.grade}
                        </TableCell>
                        <TableCell className="text-right hidden md:table-cell">
                          {formatCurrency(sb.totalDue)}
                        </TableCell>
                        <TableCell className="text-right">
                          {formatCurrency(sb.totalPaid)}
                        </TableCell>
                        <TableCell className="text-right hidden sm:table-cell">
                          {formatCurrency(sb.balance)}
                        </TableCell>
                        <TableCell>
                          <Badge className={statusConf.color}>
                            {statusConf.label}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                onClick={() =>
                                  openStudentBillModal(
                                    "view-student-bill",
                                    sb
                                  )
                                }
                              >
                                <Eye className="mr-2 h-4 w-4" />
                                View Details
                              </DropdownMenuItem>
                              {sb.balance > 0 && (
                                <DropdownMenuItem
                                  onClick={() =>
                                    openStudentBillModal(
                                      "record-payment",
                                      sb
                                    )
                                  }
                                >
                                  <CreditCard className="mr-2 h-4 w-4" />
                                  Record Payment
                                </DropdownMenuItem>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
          <div className="text-sm text-muted-foreground">
            Showing {filteredStudentBills.length} of {studentBills.length}{" "}
            student bills
          </div>
        </div>
      )}

      {/* ============ DEFAULTERS TAB ============ */}
      {activeTab === "defaulters" && (
        <div className="space-y-4">
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student</TableHead>
                  <TableHead className="hidden sm:table-cell">Grade</TableHead>
                  <TableHead className="text-right hidden md:table-cell">
                    Due
                  </TableHead>
                  <TableHead className="text-right">Paid</TableHead>
                  <TableHead className="text-right hidden sm:table-cell">
                    Balance
                  </TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {defaulters.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center">
                      No defaulters found.
                    </TableCell>
                  </TableRow>
                ) : (
                  defaulters.map((sb) => {
                    const statusConf = paymentStatusConfig[sb.status];
                    return (
                      <TableRow key={sb.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{sb.studentName}</div>
                            <div className="text-xs text-muted-foreground">
                              {sb.studentId}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="hidden sm:table-cell">
                          {sb.grade}
                        </TableCell>
                        <TableCell className="text-right hidden md:table-cell">
                          {formatCurrency(sb.totalDue)}
                        </TableCell>
                        <TableCell className="text-right">
                          {formatCurrency(sb.totalPaid)}
                        </TableCell>
                        <TableCell className="text-right hidden sm:table-cell">
                          {formatCurrency(sb.balance)}
                        </TableCell>
                        <TableCell>
                          <Badge className={statusConf.color}>
                            {statusConf.label}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                onClick={() =>
                                  openStudentBillModal(
                                    "view-student-bill",
                                    sb
                                  )
                                }
                              >
                                <Eye className="mr-2 h-4 w-4" />
                                View Details
                              </DropdownMenuItem>
                              {sb.balance > 0 && (
                                <DropdownMenuItem
                                  onClick={() =>
                                    openStudentBillModal(
                                      "record-payment",
                                      sb
                                    )
                                  }
                                >
                                  <CreditCard className="mr-2 h-4 w-4" />
                                  Record Payment
                                </DropdownMenuItem>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
          <div className="text-sm text-muted-foreground">
            {defaulters.length} defaulter{defaulters.length !== 1 ? "s" : ""}{" "}
            found
          </div>
        </div>
      )}

      {/* ============ MODALS ============ */}

      {/* View Bill Details */}
      <Dialog
        open={modalMode === "view-bill"}
        onOpenChange={() => closeModal()}
      >
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Bill Details</DialogTitle>
            <DialogDescription>
              View detailed bill information.
            </DialogDescription>
          </DialogHeader>
          {selectedBill && (
            <BillDetails
              bill={selectedBill}
              studentBills={studentBills.filter(
                (sb) => sb.billId === selectedBill.id
              )}
              onEdit={() => setModalMode("edit-bill")}
              onClose={closeModal}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Add Bill */}
      <Dialog
        open={modalMode === "add-bill"}
        onOpenChange={() => closeModal()}
      >
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add Bill</DialogTitle>
            <DialogDescription>
              Create a new bill for student fees.
            </DialogDescription>
          </DialogHeader>
          <BillForm
            onSubmit={handleAddBill}
            onCancel={closeModal}
            isSubmitting={isSubmitting}
          />
        </DialogContent>
      </Dialog>

      {/* Edit Bill */}
      <Dialog
        open={modalMode === "edit-bill"}
        onOpenChange={() => closeModal()}
      >
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Bill</DialogTitle>
            <DialogDescription>
              Update the bill details below.
            </DialogDescription>
          </DialogHeader>
          {selectedBill && (
            <BillForm
              bill={selectedBill}
              onSubmit={handleEditBill}
              onCancel={closeModal}
              isSubmitting={isSubmitting}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* View Student Bill */}
      <Dialog
        open={modalMode === "view-student-bill"}
        onOpenChange={() => closeModal()}
      >
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Student Bill Details</DialogTitle>
            <DialogDescription>
              View student billing and payment information.
            </DialogDescription>
          </DialogHeader>
          {selectedStudentBill && selectedBill && (
            <StudentBillDetails
              studentBill={selectedStudentBill}
              bill={selectedBill}
              onRecordPayment={() => setModalMode("record-payment")}
              onClose={closeModal}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Record Payment */}
      <Dialog
        open={modalMode === "record-payment"}
        onOpenChange={() => closeModal()}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Record Payment</DialogTitle>
            <DialogDescription>
              Record a new payment for this student.
            </DialogDescription>
          </DialogHeader>
          {selectedStudentBill && (
            <RecordPayment
              studentBill={selectedStudentBill}
              onSubmit={handleRecordPayment}
              onCancel={closeModal}
              isSubmitting={isSubmitting}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
