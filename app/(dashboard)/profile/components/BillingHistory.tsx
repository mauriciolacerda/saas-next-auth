import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table";
  import { Badge } from "@/components/ui/badge";
  import { Download } from "lucide-react";
  import { Button } from "@/components/ui/button";
  
  interface BillingRecord {
    id: string;
    date: string;
    amount: number;
    status: "paid" | "pending" | "failed";
    invoice: string;
  }
  
  const BILLING_HISTORY: BillingRecord[] = [
    {
      id: "1",
      date: "2024-03-01",
      amount: 29,
      status: "paid",
      invoice: "INV-2024-001",
    },
    {
      id: "2",
      date: "2024-02-01",
      amount: 29,
      status: "paid",
      invoice: "INV-2024-002",
    },
    {
      id: "3",
      date: "2024-01-01",
      amount: 29,
      status: "paid",
      invoice: "INV-2024-003",
    },
  ];
  
  const statusStyles = {
    paid: "bg-green-100 text-green-800",
    pending: "bg-yellow-100 text-yellow-800",
    failed: "bg-red-100 text-red-800",
  };
  
  export function BillingHistory() {
    return (
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Invoice</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {BILLING_HISTORY.map((record) => (
              <TableRow key={record.id}>
                <TableCell>{new Date(record.date).toLocaleDateString()}</TableCell>
                <TableCell>${record.amount.toFixed(2)}</TableCell>
                <TableCell>
                  <Badge variant="secondary" className={statusStyles[record.status]}>
                    {record.status}
                  </Badge>
                </TableCell>
                <TableCell>{record.invoice}</TableCell>
                <TableCell>
                  <Button variant="ghost" size="sm">
                    <Download className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }