"use client";

import { useState } from "react";
import {
  TermConfig,
  AssessmentScore,
  defaultTermConfig,
  initialScores,
} from "@/lib/output-of-work-data";
import { Button } from "@/components/ui/button";
import { TermConfiguration } from "@/components/output-of-work/term-config";
import { ScoreEntry } from "@/components/output-of-work/score-entry";
import { ScoreSummary } from "@/components/output-of-work/score-summary";
import { Settings, PenLine, BarChart3 } from "lucide-react";
import { cn } from "@/lib/utils";

type Tab = "configuration" | "score-entry" | "summary";

const tabs: { key: Tab; label: string; icon: React.ElementType }[] = [
  { key: "configuration", label: "Configuration", icon: Settings },
  { key: "score-entry", label: "Score Entry", icon: PenLine },
  { key: "summary", label: "Summary", icon: BarChart3 },
];

export default function OutputOfWorkPage() {
  const [activeTab, setActiveTab] = useState<Tab>("configuration");
  const [termConfig, setTermConfig] = useState<TermConfig>(defaultTermConfig);
  const [scores, setScores] = useState<AssessmentScore[]>(initialScores);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Output of Work</h1>
        <p className="text-muted-foreground">
          Record and manage weekly assessment scores for students
        </p>
      </div>

      {/* Tab Switcher */}
      <div className="inline-flex items-center gap-1 rounded-lg bg-muted p-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <Button
              key={tab.key}
              variant={activeTab === tab.key ? "default" : "ghost"}
              size="sm"
              onClick={() => setActiveTab(tab.key)}
              className={cn(
                "gap-2",
                activeTab !== tab.key && "text-muted-foreground"
              )}
            >
              <Icon className="h-4 w-4" />
              {tab.label}
            </Button>
          );
        })}
      </div>

      {/* Tab Content */}
      {activeTab === "configuration" && (
        <TermConfiguration config={termConfig} onConfigChange={setTermConfig} />
      )}
      {activeTab === "score-entry" && (
        <ScoreEntry
          config={termConfig}
          scores={scores}
          onScoresChange={setScores}
        />
      )}
      {activeTab === "summary" && (
        <ScoreSummary config={termConfig} scores={scores} />
      )}
    </div>
  );
}
