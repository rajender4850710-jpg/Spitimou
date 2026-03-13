import React, { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Card } from "@/components/ui/card";
import { Calculator as CalcIcon, DollarSign, Percent, Clock, PieChart } from "lucide-react";
import { PieChart as RPieChart, Pie, Cell, ResponsiveContainer, Legend } from "recharts";

export default function Calculator() {
  const [price, setPrice] = useState(500000);
  const [downPayment, setDownPayment] = useState(20);
  const [rate, setRate] = useState(6.5);
  const [years, setYears] = useState(30);

  const calc = useMemo(() => {
    const principal = price * (1 - downPayment / 100);
    const monthlyRate = rate / 100 / 12;
    const totalPayments = years * 12;

    if (monthlyRate === 0) {
      const monthly = principal / totalPayments;
      return { monthly, totalInterest: 0, totalPayment: principal, principal };
    }

    const monthly = (principal * monthlyRate * Math.pow(1 + monthlyRate, totalPayments)) /
      (Math.pow(1 + monthlyRate, totalPayments) - 1);
    const totalPayment = monthly * totalPayments;
    const totalInterest = totalPayment - principal;

    return { monthly, totalInterest, totalPayment, principal };
  }, [price, downPayment, rate, years]);

  const pieData = [
    { name: "Principal", value: Math.round(calc.principal), color: "#1e293b" },
    { name: "Interest", value: Math.round(calc.totalInterest), color: "#f43f5e" },
    { name: "Down Payment", value: Math.round(price * downPayment / 100), color: "#10b981" },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-12 h-12 bg-gradient-to-br from-slate-900 to-slate-700 rounded-2xl flex items-center justify-center">
          <CalcIcon className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Mortgage Calculator</h1>
          <p className="text-slate-500">Estimate your monthly payments</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-8">
          <Card className="p-6 rounded-2xl border-slate-100">
            <div className="space-y-6">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label className="flex items-center gap-2 text-sm"><DollarSign className="w-4 h-4 text-slate-400" /> Property Price</Label>
                  <span className="font-semibold text-slate-900">${price.toLocaleString()}</span>
                </div>
                <Slider value={[price]} onValueChange={([v]) => setPrice(v)} min={50000} max={5000000} step={10000} className="mt-2" />
                <div className="flex justify-between text-xs text-slate-400 mt-1"><span>$50K</span><span>$5M</span></div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label className="flex items-center gap-2 text-sm"><Percent className="w-4 h-4 text-slate-400" /> Down Payment</Label>
                  <span className="font-semibold text-slate-900">{downPayment}% (${(price * downPayment / 100).toLocaleString()})</span>
                </div>
                <Slider value={[downPayment]} onValueChange={([v]) => setDownPayment(v)} min={0} max={90} step={5} className="mt-2" />
                <div className="flex justify-between text-xs text-slate-400 mt-1"><span>0%</span><span>90%</span></div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label className="flex items-center gap-2 text-sm"><Percent className="w-4 h-4 text-slate-400" /> Interest Rate</Label>
                  <span className="font-semibold text-slate-900">{rate}%</span>
                </div>
                <Slider value={[rate]} onValueChange={([v]) => setRate(v)} min={0.5} max={15} step={0.1} className="mt-2" />
                <div className="flex justify-between text-xs text-slate-400 mt-1"><span>0.5%</span><span>15%</span></div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label className="flex items-center gap-2 text-sm"><Clock className="w-4 h-4 text-slate-400" /> Loan Term</Label>
                  <span className="font-semibold text-slate-900">{years} years</span>
                </div>
                <Slider value={[years]} onValueChange={([v]) => setYears(v)} min={5} max={40} step={1} className="mt-2" />
                <div className="flex justify-between text-xs text-slate-400 mt-1"><span>5 yrs</span><span>40 yrs</span></div>
              </div>
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="p-6 rounded-2xl border-slate-100 bg-gradient-to-br from-slate-900 to-slate-800 text-white">
            <p className="text-sm text-slate-400 mb-1">Monthly Payment</p>
            <p className="text-4xl font-bold">${Math.round(calc.monthly).toLocaleString()}</p>
          </Card>

          <div className="grid grid-cols-3 gap-4">
            <Card className="p-4 rounded-2xl border-slate-100 text-center">
              <p className="text-xs text-slate-400 mb-1">Loan Amount</p>
              <p className="text-lg font-bold text-slate-900">${Math.round(calc.principal).toLocaleString()}</p>
            </Card>
            <Card className="p-4 rounded-2xl border-slate-100 text-center">
              <p className="text-xs text-slate-400 mb-1">Total Interest</p>
              <p className="text-lg font-bold text-rose-600">${Math.round(calc.totalInterest).toLocaleString()}</p>
            </Card>
            <Card className="p-4 rounded-2xl border-slate-100 text-center">
              <p className="text-xs text-slate-400 mb-1">Total Cost</p>
              <p className="text-lg font-bold text-slate-900">${Math.round(calc.totalPayment + price * downPayment / 100).toLocaleString()}</p>
            </Card>
          </div>

          <Card className="p-6 rounded-2xl border-slate-100">
            <h3 className="font-semibold text-slate-900 flex items-center gap-2 mb-4">
              <PieChart className="w-4 h-4 text-slate-400" /> Payment Breakdown
            </h3>
            <ResponsiveContainer width="100%" height={250}>
              <RPieChart>
                <Pie data={pieData} innerRadius={60} outerRadius={100} paddingAngle={3} dataKey="value">
                  {pieData.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>
                <Legend />
              </RPieChart>
            </ResponsiveContainer>
          </Card>
        </div>
      </div>
    </div>
  );
}