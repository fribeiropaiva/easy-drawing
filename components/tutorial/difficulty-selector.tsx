"use client";

import { Clock, Lock } from "lucide-react";
import Link from "next/link";
import { useRef, useState, type ReactNode } from "react";

import { Button, buttonVariants } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DIFFICULTY_LABELS,
  getNextDifficulty,
  isDifficulty,
  type LevelSummary,
} from "@/lib/tutorials/levels";
import type { Difficulty } from "@/types/tutorial";

export interface LevelView extends LevelSummary {
  /** True when this viewer cannot open the level (premium without entitlement). Decided on the server. */
  locked: boolean;
}

interface DifficultySelectorProps {
  title: string;
  levels: LevelView[];
  defaultDifficulty: Difficulty;
  /** Server-rendered content for each level: viewer, paywall or coming-soon state. */
  panels: Record<Difficulty, ReactNode>;
}

const SR_TEXT: Record<LevelSummary["availability"], string> = {
  free: "",
  premium: ", premium",
  "coming-soon": ", coming soon",
};

export function DifficultySelector({
  title,
  levels,
  defaultDifficulty,
  panels,
}: DifficultySelectorProps) {
  const [difficulty, setDifficulty] = useState<Difficulty>(defaultDifficulty);
  const topRef = useRef<HTMLDivElement>(null);

  function jumpTo(next: Difficulty) {
    setDifficulty(next);
    topRef.current?.scrollIntoView({ block: "start" });
  }

  return (
    <div ref={topRef} className="scroll-mt-6">
      <Tabs
        value={difficulty}
        onValueChange={(value) => {
          if (isDifficulty(value)) {
            setDifficulty(value);
          }
        }}
      >
        <TabsList
          aria-label="Difficulty"
          activateOnFocus
          className="h-11 w-full sm:w-fit sm:self-start"
        >
          {levels.map((level) => (
            <TabsTrigger
              key={level.difficulty}
              value={level.difficulty}
              className="h-full sm:min-w-36 sm:px-4"
            >
              {level.label}
              {level.availability === "premium" ? (
                <Lock
                  data-icon="inline-end"
                  className="text-premium"
                  aria-hidden="true"
                />
              ) : null}
              {level.availability === "coming-soon" ? (
                <Clock data-icon="inline-end" aria-hidden="true" />
              ) : null}
              <span className="sr-only">{SR_TEXT[level.availability]}</span>
            </TabsTrigger>
          ))}
        </TabsList>
        {levels.map((level) => (
          <TabsContent
            key={level.difficulty}
            value={level.difficulty}
            className="mt-6 text-base"
          >
            {panels[level.difficulty]}
          </TabsContent>
        ))}
      </Tabs>
      <ProgressionCta
        title={title}
        current={difficulty}
        levels={levels}
        onSelect={jumpTo}
      />
    </div>
  );
}

interface ProgressionCtaProps {
  title: string;
  current: Difficulty;
  levels: LevelView[];
  onSelect: (difficulty: Difficulty) => void;
}

/**
 * Answers "what should I draw next?" (PROJECT_PLAN.md §95). Shown only under a
 * level the viewer can actually see: a paywall or coming-soon panel already
 * carries its own call to action.
 */
function ProgressionCta({
  title,
  current,
  levels,
  onSelect,
}: ProgressionCtaProps) {
  const subject = title.toLowerCase();
  const currentLevel = levels.find((level) => level.difficulty === current);
  if (
    !currentLevel ||
    currentLevel.locked ||
    currentLevel.availability === "coming-soon"
  ) {
    return null;
  }

  const nextDifficulty = getNextDifficulty(current);
  const next = nextDifficulty
    ? levels.find((level) => level.difficulty === nextDifficulty)
    : undefined;

  if (!nextDifficulty || !next) {
    return (
      <aside className="mt-10 rounded-md sheet p-6 sm:p-8">
        <h2 className="text-xl font-medium">
          That is the most detailed {subject} we have.
        </h2>
        <p className="mt-1 text-muted-foreground">
          Pick another subject and keep going from the level you are comfortable
          with.
        </p>
        <Link
          href="/draw"
          className={buttonVariants({
            variant: "outline",
            size: "lg",
            className: "mt-5",
          })}
        >
          Find your next subject
        </Link>
      </aside>
    );
  }

  const nextLabel = DIFFICULTY_LABELS[nextDifficulty].toLowerCase();

  if (next.availability === "coming-soon") {
    return (
      <aside className="mt-10 rounded-md sheet p-6 sm:p-8">
        <h2 className="text-xl font-medium">
          The {nextLabel} {subject} is coming soon.
        </h2>
        <p className="mt-1 text-muted-foreground">
          We are drawing it now. Try another subject at your level in the
          meantime.
        </p>
        <Link
          href="/draw"
          className={buttonVariants({
            variant: "outline",
            size: "lg",
            className: "mt-5",
          })}
        >
          Browse tutorials
        </Link>
      </aside>
    );
  }

  return (
    <aside className="mt-10 rounded-md sheet p-6 sm:p-8">
      <h2 className="text-xl font-medium">Ready for a challenge?</h2>
      <p className="mt-1 text-muted-foreground">
        Try the {nextLabel} {subject}. Same subject, more steps and more detail.
      </p>
      <div className="mt-5 flex flex-wrap items-center gap-3">
        <Button size="lg" onClick={() => onSelect(nextDifficulty)}>
          Try the {nextLabel} version
        </Button>
        {next.locked ? (
          <span className="inline-flex items-center gap-1 text-sm text-premium">
            <Lock className="size-3.5" aria-hidden="true" />
            Premium tutorial
          </span>
        ) : null}
      </div>
    </aside>
  );
}
