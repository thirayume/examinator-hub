
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { QRCodeSVG } from "qrcode.react";

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
          <QRCodeSVG 
            value={registrationCode}
            size={192}
            bgColor={"#ffffff"}
            fgColor={"#000000"}
            level={"H"}
            includeMargin={false}
          />
        </div>
        <p className="text-center mt-4 font-mono tracking-wider text-lg">
          {registrationCode}
        </p>
      </CardContent>
    </Card>
  );
}
