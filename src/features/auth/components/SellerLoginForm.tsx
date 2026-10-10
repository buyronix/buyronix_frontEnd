"use client";

import React, { useState } from "react";
import { ArrowLeftIcon, CheckIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Spinner } from "@/components/ui/spinner";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent } from "@/components/ui/card";
import { FieldGroup, Field, FieldLabel } from "@/components/ui/field";

interface SellerLoginFormProps {
  onBack: () => void;
  onSwitchToBuyer: () => void;
  onSwitchToRegister: () => void;
}

export function SellerLoginForm({
  onBack,
  onSwitchToBuyer,
  onSwitchToRegister,
}: SellerLoginFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email) {
      setError("Please enter your registered merchant email.");
      return;
    }
    if (!password) {
      setError("Please enter your password.");
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setSuccess(true);
    }, 900);
  };

  const handleFillDemo = () => {
    setEmail("atelier@ritual.biz");
    setPassword("••••••••••••");
    setError(null);
  };

  return (
    <div className="flex w-full flex-1 flex-col justify-between py-2">
      {/* Top Header Controls */}
      <header className="flex items-center justify-between w-full pb-4 border-b border-border mb-6">
        <Button variant="ghost" size="sm" onClick={onBack}>
          <ArrowLeftIcon data-icon="inline-start" />
          Back to selection
        </Button>

        <span className="font-serif font-black tracking-tight text-[22px] text-foreground select-none lg:hidden">
          ritual.biz
        </span>

        <Button variant="ghost" size="sm" onClick={onSwitchToBuyer}>
          Buyer mode?
        </Button>
      </header>

      {/* Main Content Form */}
      <div className="flex flex-1 flex-col justify-center my-auto">
        <div className="mb-6">
          <Badge variant="secondary" className="mb-2">
            Merchant Access
          </Badge>
          <h2 className="font-serif text-[38px] sm:text-[44px] leading-[1.08] tracking-tight font-normal text-foreground italic">
            seller sign in
          </h2>
          <p className="text-[10px] tracking-[0.22em] font-medium text-muted-foreground uppercase mt-2">
            MANAGE YOUR CATALOG & ORDERS
          </p>
        </div>

        {success ? (
          <Card className="animate-fade-in my-4 text-center">
            <CardContent className="flex flex-col items-center gap-3 p-6">
              <div className="flex size-12 items-center justify-center rounded-full bg-primary text-primary-foreground">
                <CheckIcon />
              </div>
              <h3 className="font-serif text-xl font-medium text-foreground">
                Welcome back to your atelier
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed max-w-sm">
                Authenticated as <strong>{email}</strong>. Redirecting to your merchant dashboard...
              </p>
              <Button
                variant="link"
                size="sm"
                onClick={() => setSuccess(false)}
              >
                Reset view
              </Button>
            </CardContent>
          </Card>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <FieldGroup>
              {/* Email Field */}
              <Field>
                <FieldLabel htmlFor="seller-email">
                  Business Email
                </FieldLabel>
                <Input
                  id="seller-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="founder@studio.com"
                  className="h-12 rounded-xl"
                />
              </Field>

              {/* Password Field */}
              <Field>
                <div className="flex items-center justify-between">
                  <FieldLabel htmlFor="seller-password">
                    Password
                  </FieldLabel>
                  <Button
                    variant="link"
                    size="xs"
                    onClick={(e) => {
                      e.preventDefault();
                      alert("Password reset instructions sent to registered address.");
                    }}
                    className="text-muted-foreground"
                  >
                    Forgot?
                  </Button>
                </div>
                <Input
                  id="seller-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="h-12 rounded-xl"
                />
              </Field>
            </FieldGroup>

            {/* Remember Me / Demo fill */}
            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 text-xs text-muted-foreground cursor-pointer select-none">
                <Checkbox defaultChecked />
                Keep me signed in
              </label>

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
                  Verifying credentials...
                </>
              ) : (
                "Access Seller Portal →"
              )}
            </Button>
          </form>
        )}
      </div>

      {/* Footer Switch */}
      <footer className="mt-6 pt-6">
        <Separator className="mb-4" />
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>Need a merchant profile?</span>
          <Button
            variant="link"
            size="sm"
            onClick={onSwitchToRegister}
            className="font-bold text-foreground"
          >
            Register as Seller
          </Button>
        </div>
      </footer>
    </div>
  );
}
