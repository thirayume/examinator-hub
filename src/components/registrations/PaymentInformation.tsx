
import { ExamSchedule, Registration } from "@/types/exams";

interface PaymentInformationProps {
  registration: Registration;
  examSchedule?: ExamSchedule;
}

export function PaymentInformation({ registration, examSchedule }: PaymentInformationProps) {
  if (!examSchedule) return null;
  
  return (
    <div>
      <h3 className="font-medium text-lg">Payment Information</h3>
      <div className="space-y-3 mt-2">
        <div className="grid grid-cols-2 gap-2">
          <div>
            <p className="text-sm text-muted-foreground">Price</p>
            <p className="font-medium">฿{examSchedule.price.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Payment Status</p>
            <p className="font-medium">{registration.payment_status}</p>
          </div>
          {registration.payment_method && (
            <>
              <div>
                <p className="text-sm text-muted-foreground">Payment Method</p>
                <p className="font-medium">{registration.payment_method}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Reference</p>
                <p className="font-medium">{registration.payment_reference || "N/A"}</p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
