"use client";

import React, { useState } from "react";
import { ArrowLeftIcon, MailIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Spinner } from "@/components/ui/spinner";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent } from "@/components/ui/card";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import {
  FieldGroup,
  Field,
  FieldLabel,
  FieldDescription,
} from "@/components/ui/field";

interface BuyerLoginFormProps {
  onBack: () => void;
  onSwitchToSeller: () => void;
}

export function BuyerLoginForm({
  onBack,
  onSwitchToSeller,
}: BuyerLoginFormProps) {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sentCode, setSentCode] = useState(false);
  const [otp, setOtp] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSendLink = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError("Please enter your email or phone number.");
      return;
    }
    setError(null);
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setSentCode(true);
    }, 700);
  };

  const handleFillDemo = () => {
    setEmail("collector@ritual.biz");
    setError(null);
  };

  return (
    <div className="flex w-full flex-1 flex-col justify-between py-2">
      {/* Top Header */}
      <header className="flex items-center justify-between w-full pb-4 border-b border-border mb-6">
        <Button variant="ghost" size="sm" onClick={onBack}>
          <ArrowLeftIcon data-icon="inline-start" />
          Back to selection
        </Button>

        <span className="font-serif font-black tracking-tight text-[22px] text-foreground select-none lg:hidden">
          ritual.biz
        </span>

        <Button variant="ghost" size="sm" onClick={onSwitchToSeller}>
          Seller mode?
        </Button>
      </header>

      {/* Main Content Form */}
      <div className="flex flex-1 flex-col justify-center my-auto">
        <div className="mb-6">
          <Badge variant="secondary" className="mb-2">
            Buyer Access
          </Badge>
          <h2 className="font-serif text-[38px] sm:text-[44px] leading-[1.08] tracking-tight font-normal text-foreground italic">
            welcome back
          </h2>
          <p className="text-[10px] tracking-[0.22em] font-medium text-muted-foreground uppercase mt-2">
            EXPLORE THE CURATED MARKETPLACE
          </p>
        </div>

        {sentCode ? (
          <Card className="animate-fade-in my-4 text-center">
            <CardContent className="flex flex-col items-center gap-3 p-6">
              <div className="flex size-12 items-center justify-center rounded-full bg-primary text-primary-foreground">
                <MailIcon />
              </div>
              <h3 className="font-serif text-xl font-medium text-foreground">
                One-time pass sent
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed max-w-sm">
                We sent a 6-digit magic code to <strong>{email}</strong>.
              </p>

              <div className="my-3 flex justify-center">
                <InputOTP maxLength={6} value={otp} onChange={setOtp}>
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                  </InputOTPGroup>
                </InputOTP>
              </div>

              <Button
                onClick={() => alert("Welcome! Signed into buyer session.")}
                className="w-full rounded-full"
                size="lg"
              >
                Verify & Enter Store
              </Button>
            </CardContent>
          </Card>
        ) : (
          <form onSubmit={handleSendLink} className="flex flex-col gap-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="buyer-email">
                  Email or Mobile Number
                </FieldLabel>
                <Input
                  id="buyer-email"
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@domain.com"
                  className="h-12 rounded-xl"
                />
                <FieldDescription>
                  Passwordless magic link sign-in
                </FieldDescription>
              </Field>
            </FieldGroup>

            <div className="flex items-center justify-end pt-0.5">
              <Button
                type="button"
                variant="link"
                size="xs"
                onClick={handleFillDemo}
                className="text-muted-foreground"
              >
                Auto-fill demo
              </Button>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isLoading}
              size="lg"
              className="mt-2 h-[52px] w-full rounded-full text-[15px] tracking-tight"
            >
              {isLoading ? (
                <>
                  <Spinner data-icon="inline-start" />
                  Sending access link...
                </>
              ) : (
                "Continue as Buyer →"
              )}
            </Button>

            {/* Guest Browsing */}
            <Button
              type="button"
              variant="outline"
              size="lg"
              onClick={() => alert("Continuing as Guest Shopper")}
              className="h-[50px] w-full rounded-full text-[14.5px] tracking-tight"
            >
              Browse as Guest
            </Button>
          </form>
        )}
      </div>

      {/* Footer Switch */}
      <footer className="mt-6 pt-6">
        <Separator className="mb-4" />
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>Looking to sell?</span>
          <Button
            variant="link"
            size="sm"
            onClick={onSwitchToSeller}
            className="font-bold text-foreground"
          >
            Seller Portal
          </Button>
        </div>
      </footer>
    </div>
  );
}
