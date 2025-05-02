
import { Badge } from "@/components/ui/badge";

interface StatusBadgeProps {
  status: string;
  type: "registration" | "payment";
}

export function RegistrationStatusBadge({ status, type }: StatusBadgeProps) {
  const getStatusConfig = () => {
    if (type === "registration") {
      const statusConfig: Record<string, { class: string, label: string }> = {
        pending: { class: "bg-yellow-100 text-yellow-800", label: "Pending" },
        confirmed: { class: "bg-green-100 text-green-800", label: "Confirmed" },
        cancelled: { class: "bg-red-100 text-red-800", label: "Cancelled" },
        waitlisted: { class: "bg-blue-100 text-blue-800", label: "Waitlisted" }
      };
      return statusConfig[status] || statusConfig.pending;
    } else {
      const statusConfig: Record<string, { class: string, label: string }> = {
        pending: { class: "bg-yellow-100 text-yellow-800", label: "Payment Pending" },
        paid: { class: "bg-green-100 text-green-800", label: "Paid" },
        failed: { class: "bg-red-100 text-red-800", label: "Payment Failed" },
        refunded: { class: "bg-purple-100 text-purple-800", label: "Refunded" }
      };
      return statusConfig[status] || statusConfig.pending;
    }
  };

  const config = getStatusConfig();
  
  return <Badge className={config.class}>{config.label}</Badge>;
}
