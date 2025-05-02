
import { QrCode } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface RegistrationQrCodeProps {
  registrationCode: string;
}

export function RegistrationQrCode({ registrationCode }: RegistrationQrCodeProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Registration QR Code</CardTitle>
        <CardDescription>
          Present this code on the exam day
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center pt-4 pb-6">
        <div className="p-4 bg-white shadow-sm rounded-md">
          <div className="w-48 h-48 bg-gray-100 flex items-center justify-center">
            <QrCode className="w-32 h-32 text-gray-300" />
          </div>
        </div>
        <p className="text-center mt-4 font-mono tracking-wider text-lg">
          {registrationCode}
        </p>
      </CardContent>
    </Card>
  );
}
