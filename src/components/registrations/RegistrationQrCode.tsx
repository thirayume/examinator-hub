
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { QRCodeSVG } from "qrcode.react";
import { formatPromptPayQRCode } from "@/lib/payment-utils";

interface RegistrationQrCodeProps {
  registrationCode: string;
  isPayment?: boolean;
  paymentAmount?: number;
  promptPayID?: string;
}

export function RegistrationQrCode({ 
  registrationCode, 
  isPayment = false,
  paymentAmount = 0,
  promptPayID = "0105536092641" // Default PromptPay ID (can be configured)
}: RegistrationQrCodeProps) {
  // Generate appropriate QR code value based on type
  const qrValue = isPayment 
    ? formatPromptPayQRCode(promptPayID, paymentAmount)
    : registrationCode;
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">
          {isPayment ? "PromptPay QR Code" : "Registration QR Code"}
        </CardTitle>
        <CardDescription>
          {isPayment 
            ? `Scan to pay ฿${paymentAmount.toLocaleString()}`
            : "Present this code on the exam day"}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center pt-4 pb-6">
        <div className="p-4 bg-white shadow-sm rounded-md">
          <QRCodeSVG 
            value={qrValue}
            size={192}
            bgColor={"#ffffff"}
            fgColor={"#000000"}
            level={"H"}
            includeMargin={false}
          />
        </div>
        <p className="text-center mt-4 font-mono tracking-wider text-lg">
          {isPayment 
            ? `฿${paymentAmount.toLocaleString()}` 
            : registrationCode}
        </p>
      </CardContent>
    </Card>
  );
}
