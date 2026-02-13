"use client";

import { GlassCard } from "@/components/ui/GlassCard";
import {
  Quote,
  Star,
  Target,
  Zap,
  Trophy,
  Rocket,
  RefreshCw,
} from "lucide-react";
import { quotes } from "@/data/quotes";
import { useState, useEffect } from "react";

export default function MotivationPage() {
  const [currentQuote, setCurrentQuote] = useState(quotes[0]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Use the day of the year to select a daily quote initially
    const dayOfYear = Math.floor(
      (new Date().getTime() -
        new Date(new Date().getFullYear(), 0, 0).getTime()) /
        1000 /
        60 /
        60 /
        24,
    );
    setCurrentQuote(quotes[dayOfYear % quotes.length]);
  }, []);

  const generateNewQuote = () => {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    setCurrentQuote(quotes[randomIndex]);
  };

  if (!mounted) return null; // Prevent hydration mismatch

  return (
    <div className="min-h-screen p-4 lg:p-8 pt-16 lg:pt-8 text-foreground">
      {/* Header */}
      <div className="mb-6 lg:mb-8">
        <h1 className="text-2xl font-bold font-display">Motivation</h1>
        <p className="text-muted-foreground mt-1">
          Stay inspired and focused on your goals
        </p>
      </div>

      {/* Quote Card */}
      <GlassCard className="mb-6 lg:mb-8 p-6 lg:p-10 relative overflow-hidden">
        <div className="absolute top-4 left-4 opacity-10">
          <Quote className="h-16 lg:h-20 w-16 lg:w-20 text-[hsl(var(--primary))]" />
        </div>
        <div className="relative z-10 text-center max-w-2xl mx-auto">
          <p className="text-xl lg:text-3xl font-light leading-relaxed italic font-display">
            "{currentQuote.text}"
          </p>
          <p className="mt-4 text-sm font-medium text-muted-foreground">
            — {currentQuote.author}
          </p>
          <div className="mt-6 flex justify-center">
            <div className="h-1 w-20 bg-[hsl(var(--primary))] rounded-full opacity-50" />
          </div>
        </div>
      </GlassCard>

      {/* Action Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-5 mb-6 lg:mb-8">
        {/* Goals Card */}
        <GlassCard>
          <div className="flex items-center gap-3 mb-4 lg:mb-5">
            <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center">
              <Target className="h-5 w-5 text-orange-500" />
            </div>
            <h3 className="text-lg font-semibold font-display">Weekly Goals</h3>
          </div>
          <ul className="space-y-3">
            {[
              "Close 2 new deals",
              "Finish website redesign",
              "Update portfolio",
              "Send invoices",
            ].map((goal, i) => (
              <li
                key={i}
                className="flex items-center gap-3 text-muted-foreground text-sm"
              >
                <div className="w-5 h-5 rounded-md border border-[hsl(var(--border))] flex items-center justify-center flex-shrink-0">
                  <Star className="h-3 w-3 text-yellow-500" />
                </div>
                {goal}
              </li>
            ))}
          </ul>
        </GlassCard>

        {/* Achievements Card */}
        <GlassCard>
          <div className="flex items-center gap-3 mb-4 lg:mb-5">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center">
              <Trophy className="h-5 w-5 text-purple-500" />
            </div>
            <h3 className="text-lg font-semibold font-display">Achievements</h3>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-[hsl(var(--input))] p-3 lg:p-4 rounded-xl text-center">
              <span className="block text-2xl lg:text-3xl font-bold font-display">
                12
              </span>
              <span className="text-xs text-muted-foreground">
                Projects Done
              </span>
            </div>
            <div className="bg-[hsl(var(--input))] p-3 lg:p-4 rounded-xl text-center">
              <span className="block text-2xl lg:text-3xl font-bold text-[hsl(var(--primary))] font-display">
                $2.4k
              </span>
              <span className="text-xs text-muted-foreground">Earned</span>
            </div>
            <div className="bg-[hsl(var(--input))] p-3 lg:p-4 rounded-xl text-center">
              <span className="block text-2xl lg:text-3xl font-bold text-green-400 font-display">
                98%
              </span>
              <span className="text-xs text-muted-foreground">
                Satisfaction
              </span>
            </div>
            <div className="bg-[hsl(var(--input))] p-3 lg:p-4 rounded-xl text-center">
              <span className="block text-2xl lg:text-3xl font-bold text-blue-400 font-display">
                15
              </span>
              <span className="text-xs text-muted-foreground">Clients</span>
            </div>
          </div>
        </GlassCard>

        {/* Quick Actions Card */}
        <GlassCard className="md:col-span-2 lg:col-span-1">
          <div className="flex items-center gap-3 mb-4 lg:mb-5">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
              <Zap className="h-5 w-5 text-blue-500" />
            </div>
            <h3 className="text-lg font-semibold font-display">
              Quick Actions
            </h3>
          </div>
          <div className="space-y-3">
            <button className="w-full py-3 px-4 bg-[hsl(var(--input))] hover:bg-[hsl(var(--accent))] rounded-xl text-left text-muted-foreground hover:text-foreground transition-colors flex items-center gap-3 text-sm">
              <Rocket className="w-4 h-4 text-orange-500" />
              Start New Project
            </button>
            <button className="w-full py-3 px-4 bg-[hsl(var(--input))] hover:bg-[hsl(var(--accent))] rounded-xl text-left text-muted-foreground hover:text-foreground transition-colors flex items-center gap-3 text-sm">
              <Star className="w-4 h-4 text-yellow-500" />
              Review Goals
            </button>
            <button className="w-full py-3 px-4 bg-[hsl(var(--input))] hover:bg-[hsl(var(--accent))] rounded-xl text-left text-muted-foreground hover:text-foreground transition-colors flex items-center gap-3 text-sm">
              <Trophy className="w-4 h-4 text-purple-500" />
              View Achievements
            </button>
          </div>
        </GlassCard>
      </div>

      {/* Daily Affirmation */}
      <GlassCard className="text-center py-6 lg:py-8">
        <div className="max-w-xl mx-auto px-4">
          <p className="text-sm text-muted-foreground uppercase tracking-wider mb-3 font-display">
            Daily Affirmation
          </p>
          <h3 className="text-lg lg:text-xl font-semibold mb-6 font-display">
            I am capable of achieving great things. Every day I grow stronger
            and more skilled.
          </h3>
          <button
            onClick={generateNewQuote}
            className="btn-primary inline-flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Generate New Quote
          </button>
        </div>
      </GlassCard>
    </div>
  );
}
