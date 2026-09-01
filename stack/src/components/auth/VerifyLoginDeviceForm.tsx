import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { useTranslation } from "react-i18next";

interface VerifyLoginDeviceFormProps {
  otp: string;
  setOtp: (value: string) => void;
  loading: boolean;
  onVerify: () => void;
}

const VerifyLoginDeviceForm = ({
  otp,
  setOtp,
  loading,
  onVerify,
}: VerifyLoginDeviceFormProps) => {
  const { t } =
    useTranslation("auth");

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>
            {t(
              "login_device.verify_new_device"
            )}
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          <p className="text-sm text-gray-600">
            {t(
              "login_device.new_device_message"
            )}
          </p>

          <Input
            type="text"
            inputMode="numeric"
            maxLength={6}
            placeholder={t(
              "login_device.enter_otp"
            )}
            value={otp}
            onChange={(event) => {
              setOtp(
                event.target.value.replace(
                  /\D/g,
                  ""
                )
              );
            }}
          />

          <Button
            type="button"
            onClick={onVerify}
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700"
          >
            {loading
              ? t(
                  "login_device.verifying"
                )
              : t(
                  "login_device.verify_device"
                )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default VerifyLoginDeviceForm;