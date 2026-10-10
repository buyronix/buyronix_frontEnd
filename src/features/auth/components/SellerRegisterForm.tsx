"use client";

import React, { useState } from "react";
import { ArrowLeftIcon, CheckIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Spinner } from "@/components/ui/spinner";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FieldGroup, Field, FieldLabel } from "@/components/ui/field";

interface SellerRegisterFormProps {
  onBack: () => void;
  onSwitchToLogin: () => void;
}

export function SellerRegisterForm({
  onBack,
  onSwitchToLogin,
}: SellerRegisterFormProps) {
  const [businessName, setBusinessName] = useState("");
  const [category, setCategory] = useState("Design & Objects");
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!businessName || !email) return;
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
    }, 800);
  };

  return (
    <div className="flex flex-1 flex-col justify-between py-2">
      {/* Top Header */}
      <header className="flex items-center justify-between w-full pb-3">
        <Button variant="ghost" size="sm" onClick={onBack}>
          <ArrowLeftIcon data-icon="inline-start" />
          Back
        </Button>
        <span className="font-serif font-black tracking-tight text-[20px] text-foreground select-none">
          ritual.biz
        </span>
        <Button variant="ghost" size="sm" onClick={onSwitchToLogin}>
          Sign In
        </Button>
      </header>

      {/* Main Content */}
      <div className="flex flex-1 flex-col justify-center my-auto py-2">
        <div className="mb-6">
          <Badge variant="secondary" className="mb-2">
            Merchant Registration
          </Badge>
          <h2 className="font-serif text-[33px] sm:text-[38px] leading-[1.08] tracking-tight font-normal text-foreground italic">
            seven minutes.
          </h2>
          <p className="text-[10px] tracking-[0.22em] font-medium text-muted-foreground uppercase mt-2">
            ALL YOURS. REGISTER YOUR STUDIO
          </p>
        </div>

        {submitted ? (
          <Card className="animate-fade-in text-center">
            <CardContent className="flex flex-col items-center gap-3 p-5">
              <div className="flex size-10 items-center justify-center rounded-full bg-primary text-primary-foreground">
                <CheckIcon />
              </div>
              <h3 className="font-serif text-lg font-medium text-foreground">
                Registration Received
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                We have dispatched your onboarding dossier to{" "}
                <strong>{email}</strong>.
              </p>
              <Button
                onClick={onSwitchToLogin}
                className="mt-2 rounded-full"
              >
                Go to Merchant Login
              </Button>
            </CardContent>
          </Card>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="brand-name">
                  Studio or Brand Name
                </FieldLabel>
                <Input
                  id="brand-name"
                  type="text"
                  required
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  placeholder="e.g. Atelier Vesper"
                  className="h-11 rounded-xl"
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="brand-category">
                  Curated Category
                </FieldLabel>
                <Select value={category} onValueChange={(val) => val && setCategory(val)}>
                  <SelectTrigger className="h-11 w-full rounded-xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="Design & Objects">
                        Design & Objects
                      </SelectItem>
                      <SelectItem value="Apparel & Textiles">
                        Apparel & Textiles
                      </SelectItem>
                      <SelectItem value="Artisan Ceramics">
                        Artisan Ceramics
                      </SelectItem>
                      <SelectItem value="Apothecary & Fragrance">
                        Apothecary & Fragrance
                      </SelectItem>
                      <SelectItem value="Books & Editorial Print">
                        Books & Editorial Print
                      </SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </Field>

              <Field>
                <FieldLabel htmlFor="contact-email">
                  Founder / Contact Email
                </FieldLabel>
                <Input
                  id="contact-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="founder@studio.com"
                  className="h-11 rounded-xl"
                />
              </Field>
            </FieldGroup>

            <Button
              type="submit"
              disabled={isSubmitting}
              size="lg"
              className="mt-2 h-[50px] w-full rounded-full text-[14.5px] tracking-tight"
            >
              {isSubmitting ? (
                <>
                  <Spinner data-icon="inline-start" />
                  Generating Onboarding Dossier...
                </>
              ) : (
                "Begin 7-Minute Registration →"
              )}
            </Button>
          </form>
        )}
      </div>

      {/* Footer Switch */}
      <footer className="pt-3">
        <Separator className="mb-4" />
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>Already have an account?</span>
          <Button
            variant="link"
            size="sm"
            onClick={onSwitchToLogin}
            className="font-semibold text-foreground"
          >
            Sign In
          </Button>
        </div>
      </footer>
    </div>
  );
}
