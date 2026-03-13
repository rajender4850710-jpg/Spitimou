import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CheckCircle, Mail, Loader2 } from "lucide-react";

export default function OtpVerificationModal({ email, onVerified, onClose }) {
  const [otp, setOtp] = useState("");
  const [sending, setSending] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const sendOtp = async () => {
    setSending(true);
    setError("");
    await base44.functions.invoke("sendOtp", { email });
    setSending(false);
    setSent(true);
  };

  const verifyOtp = async () => {
    setVerifying(true);
    setError("");
    const res = await base44.functions.invoke("verifyOtp", { email, code: otp });
    setVerifying(false);
    if (res.data?.valid) {
      onVerified();
    } else {
      setError(res.data?.error || "Invalid code. Please try again.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-sm mx-4">
        <div className="flex flex-col items-center text-center mb-6">
          <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center mb-3">
            <Mail className="w-7 h-7 text-slate-600" />
          </div>
          <h2 className="text-xl font-bold text-slate-900">Verify your contact details</h2>
          <p className="text-sm text-slate-500 mt-1">We'll send a 6-digit code to <span className="font-semibold text-slate-700">{email}</span></p>
        </div>

        {!sent ? (
          <Button onClick={sendOtp} disabled={sending} className="w-full rounded-xl bg-slate-900 hover:bg-slate-800">
            {sending ? <><Loader2 className="w-4 h-4 animate-spin mr-2" />Sending...</> : "Send Verification Code"}
          </Button>
        ) : (
          <div className="space-y-4">
            <div>
              <Label className="text-sm font-medium text-slate-700">Enter 6-digit code</Label>
              <Input
                className="mt-1 rounded-xl text-center text-2xl font-bold tracking-widest"
                maxLength={6}
                value={otp}
                onChange={e => { setOtp(e.target.value.replace(/\D/g, "")); setError(""); }}
                placeholder="______"
              />
              {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
            </div>
            <Button onClick={verifyOtp} disabled={verifying || otp.length !== 6} className="w-full rounded-xl bg-slate-900 hover:bg-slate-800">
              {verifying ? <><Loader2 className="w-4 h-4 animate-spin mr-2" />Verifying...</> : <><CheckCircle className="w-4 h-4 mr-2" />Verify</>}
            </Button>
            <button onClick={sendOtp} disabled={sending} className="w-full text-sm text-slate-500 hover:text-slate-700 underline">
              {sending ? "Resending..." : "Resend code"}
            </button>
          </div>
        )}

        <button onClick={onClose} className="mt-4 w-full text-sm text-slate-400 hover:text-slate-600">Cancel</button>
      </div>
    </div>
  );
}