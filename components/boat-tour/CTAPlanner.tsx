"use client";

import { ArrowRight, ArrowUpRight, CalendarDays, MapPin, Minus, Plus, Users, X } from "lucide-react";
import { useId, useState } from "react";
import { Photo } from "@/components/ui/Photo";
import { Sheet, useSheet } from "@/components/ui/Sheet";
import { buttonClass } from "@/components/ui/button";
import { brand } from "@/data/brand";
import { media } from "@/data/media";
import { buildPlanShareMessage, getTourShareUrl } from "@/lib/share";
import { ShareButton } from "./ShareButton";

/** Por onde o planejamento começa: convite ("Gostou do que viu?") ou direto no formulário. */
export type PlannerEntry = "invite" | "form";
type Step = PlannerEntry | "done";

interface Plan {
  date: string;
  people: number;
}

const MAX_PEOPLE = 99;

function toIsoDate(date: Date) {
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${date.getFullYear()}-${month}-${day}`;
}

function formatPlanDate(iso: string) {
  const date = new Date(`${iso}T12:00:00`);
  const weekday = new Intl.DateTimeFormat("pt-BR", { weekday: "long" }).format(date);
  const dayMonth = new Intl.DateTimeFormat("pt-BR", { day: "numeric", month: "long" }).format(date);
  return {
    display: `${weekday.charAt(0).toUpperCase()}${weekday.slice(1)}, ${dayMonth}`,
    share: `dia ${dayMonth} (${weekday})`,
  };
}

const peopleLabel = (count: number) => (count === 1 ? "pessoa" : "pessoas");

interface CTAPlannerProps {
  open: boolean;
  entry: PlannerEntry;
  onClose: () => void;
  onContinueExploring: () => void;
}

/**
 * Conexão com a campanha "Quem marca, embarca".
 * Convite → data + tamanho do grupo → mandar no grupo / ver embarcações.
 * Protótipo: nada é enviado ou armazenado.
 */
export function CTAPlanner({ open, entry, onClose, onContinueExploring }: CTAPlannerProps) {
  const [step, setStep] = useState<Step>(entry);
  const [plan, setPlan] = useState<Plan | null>(null);

  const titles: Record<Step, string> = {
    invite: "Gostou do que viu?",
    form: "Planejar nosso passeio",
    done: "Mar marcado",
  };

  return (
    <Sheet
      open={open}
      onClose={onClose}
      eyebrow="Quem marca, embarca"
      title={titles[step]}
      description={step === "form" ? "Escolha a data, informe o tamanho do grupo e encontre uma embarcação." : undefined}
    >
      {step === "invite" && (
        <InviteStep onPlan={() => setStep("form")} onContinue={onContinueExploring} />
      )}
      {step === "form" && (
        <FormStep
          initial={plan}
          onSubmit={(value) => {
            setPlan(value);
            setStep("done");
          }}
        />
      )}
      {step === "done" && plan && (
        <DoneStep plan={plan} onEdit={() => setStep("form")} onContinue={onContinueExploring} />
      )}
    </Sheet>
  );
}

function ContinueExploringButton({ onContinue }: { onContinue: () => void }) {
  const { close } = useSheet();
  return (
    <button
      type="button"
      onClick={() => {
        close();
        onContinue();
      }}
      className={buttonClass({ variant: "link" })}
    >
      Continuar explorando
    </button>
  );
}

function InviteStep({ onPlan, onContinue }: { onPlan: () => void; onContinue: () => void }) {
  return (
    <div className="pt-1">
      <div className="relative aspect-[16/9] overflow-hidden rounded-3xl bg-navy-900">
        <Photo image={media.sunset} fill sizes="(min-width: 1024px) 420px, 100vw" className="object-cover" />
        <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-navy-950/85 via-navy-950/20 to-transparent" />
        <p className="absolute right-5 bottom-4 left-5 text-lg leading-snug font-bold text-white">
          O verão começa antes.
          <br />
          <span className="font-medium text-white/85">Começa quando alguém marca a data.</span>
        </p>
      </div>

      <p className="mt-5 text-lg leading-snug">
        Seu grupo já existe.
        <br />
        <span className="font-semibold">Agora falta marcar o mar.</span>
      </p>

      <button type="button" onClick={onPlan} className={buttonClass({ variant: "primary", size: "lg", block: true, className: "mt-5" })}>
        <CalendarDays className="size-5" aria-hidden="true" />
        Planejar nosso passeio
      </button>
      <p className="mt-2.5 text-center text-sm text-ink-500">
        Escolha a data, informe o tamanho do grupo e encontre uma embarcação.
      </p>
      <div className="mt-4 text-center">
        <ContinueExploringButton onContinue={onContinue} />
      </div>
    </div>
  );
}

function FormStep({ initial, onSubmit }: { initial: Plan | null; onSubmit: (plan: Plan) => void }) {
  const [today] = useState(() => toIsoDate(new Date()));
  const [date, setDate] = useState(initial?.date ?? "");
  const [people, setPeople] = useState(initial?.people ?? 6);
  const dateId = useId();
  const peopleId = useId();

  const setPeopleSafe = (value: number) => setPeople(Math.min(MAX_PEOPLE, Math.max(0, Math.round(value) || 0)));

  return (
    <form
      className="space-y-6 pt-2"
      onSubmit={(event) => {
        event.preventDefault();
        if (!date) return;
        onSubmit({ date, people: Math.max(1, people) });
      }}
    >
      <div>
        <label htmlFor={dateId} className="flex items-center gap-2 text-sm font-semibold">
          <CalendarDays className="size-4 text-ocean-500" aria-hidden="true" />
          Quando vai ser?
        </label>
        <input
          id={dateId}
          type="date"
          required
          min={today}
          value={date}
          onChange={(event) => setDate(event.target.value)}
          className="mt-2 h-12 w-full rounded-xl border border-line bg-white px-4 text-base text-navy-900"
        />
      </div>

      <div>
        <label htmlFor={peopleId} className="flex items-center gap-2 text-sm font-semibold">
          <Users className="size-4 text-ocean-500" aria-hidden="true" />
          Quantas pessoas vão?
        </label>
        <div className="mt-2 flex items-center gap-3">
          <button
            type="button"
            aria-label="Uma pessoa a menos"
            onClick={() => setPeopleSafe(people - 1)}
            disabled={people <= 1}
            className="grid size-12 shrink-0 place-items-center rounded-full ring-1 ring-line transition-colors hover:bg-mist disabled:opacity-40"
          >
            <Minus className="size-5" aria-hidden="true" />
          </button>
          <input
            id={peopleId}
            type="number"
            inputMode="numeric"
            min={1}
            max={MAX_PEOPLE}
            required
            value={people || ""}
            onChange={(event) => setPeopleSafe(Number(event.target.value))}
            className="h-12 w-20 rounded-xl border border-line bg-white text-center text-xl font-bold text-navy-900 tabular-nums"
          />
          <button
            type="button"
            aria-label="Uma pessoa a mais"
            onClick={() => setPeopleSafe(people + 1)}
            disabled={people >= MAX_PEOPLE}
            className="grid size-12 shrink-0 place-items-center rounded-full ring-1 ring-line transition-colors hover:bg-mist disabled:opacity-40"
          >
            <Plus className="size-5" aria-hidden="true" />
          </button>
          <span className="text-sm text-ink-500">{peopleLabel(people)}</span>
        </div>
      </div>

      <p className="flex items-center gap-2 rounded-2xl bg-mist px-4 py-3 text-sm text-ink-600">
        <MapPin className="size-4 shrink-0 text-ocean-500" aria-hidden="true" />
        Saída de Salvador · Baía de Todos os Santos
      </p>

      <div>
        <button type="submit" className={buttonClass({ variant: "primary", size: "lg", block: true })}>
          Encontrar embarcação
          <ArrowRight className="size-5" aria-hidden="true" />
        </button>
        <p className="mt-2.5 text-center text-xs text-ink-500">Protótipo: nenhum dado é enviado ou armazenado.</p>
      </div>
    </form>
  );
}

function DoneStep({ plan, onEdit, onContinue }: { plan: Plan; onEdit: () => void; onContinue: () => void }) {
  const labels = formatPlanDate(plan.date);

  return (
    <div className="pt-2">
      <div className="relative overflow-hidden rounded-3xl bg-navy-900 p-5 text-white">
        <p className="text-xs font-semibold tracking-[0.14em] text-sea-300 uppercase">A data está marcada</p>
        <p className="mt-2 text-2xl leading-tight font-bold tracking-tight">{labels.display}</p>
        <p className="mt-1 text-white/75">
          {plan.people} {peopleLabel(plan.people)} · Salvador
        </p>
        <svg aria-hidden="true" viewBox="0 0 200 40" className="absolute -right-4 bottom-3 w-40 text-sea-400/40">
          <path d="M0 20c25 0 25-10 50-10s25 10 50 10 25-10 50-10 25 10 50 10" fill="none" stroke="currentColor" strokeWidth="3" />
        </svg>
      </div>

      <p className="mt-5 text-ink-600">Agora é mandar no grupo e ver quem confirma.</p>

      <div className="mt-4 space-y-3">
        <ShareButton
          variant="primary"
          size="lg"
          block
          getPayload={() => buildPlanShareMessage(getTourShareUrl(), labels.share, plan.people)}
        />
        <a href={brand.siteUrl} target="_blank" rel="noopener noreferrer" className={buttonClass({ variant: "outline", size: "lg", block: true })}>
          Ver embarcações disponíveis
          <ArrowUpRight className="size-5" aria-hidden="true" />
          <span className="sr-only">(abre o site da Uboatt em nova aba)</span>
        </a>
      </div>
      <p className="mt-3 text-xs text-ink-500">
        No protótipo, este botão abre o site atual da Uboatt. Na versão final, as embarcações aparecem filtradas pela data e
        pelo tamanho do grupo.
      </p>

      <div className="mt-5 flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
        <button type="button" onClick={onEdit} className={buttonClass({ variant: "link" })}>
          Alterar data ou grupo
        </button>
        <ContinueExploringButton onContinue={onContinue} />
      </div>
    </div>
  );
}

/** Versão compacta do convite, dentro do tour (não bloqueia a navegação). */
export function CTAInviteCard({ onPlan, onDismiss }: { onPlan: () => void; onDismiss: () => void }) {
  const titleId = useId();
  return (
    <section
      aria-labelledby={titleId}
      className="absolute inset-x-2 bottom-2 z-20 animate-fade-up rounded-3xl bg-white p-5 text-navy-900 shadow-[0_24px_60px_-20px_rgb(4_28_56/0.65)] sm:inset-x-auto sm:right-4 sm:bottom-4 sm:w-[370px]"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold tracking-[0.14em] text-ocean-700 uppercase">Quem marca, embarca</p>
          <h2 id={titleId} className="mt-0.5 text-xl font-bold tracking-tight">
            Gostou do que viu?
          </h2>
        </div>
        <button
          type="button"
          onClick={onDismiss}
          aria-label="Fechar convite"
          className="-mt-1 -mr-2 grid size-11 shrink-0 place-items-center rounded-full hover:bg-mist"
        >
          <X className="size-5" aria-hidden="true" />
        </button>
      </div>
      <p className="mt-1 text-[15px] text-ink-600">Seu grupo já existe. Agora falta marcar o mar.</p>
      <button type="button" onClick={onPlan} className={buttonClass({ variant: "primary", block: true, className: "mt-4" })}>
        <CalendarDays className="size-[18px]" aria-hidden="true" />
        Planejar nosso passeio
      </button>
      <p className="mt-2 text-center text-xs text-ink-500">Escolha a data, informe o tamanho do grupo e encontre uma embarcação.</p>
      <div className="mt-2 text-center">
        <button type="button" onClick={onDismiss} className={buttonClass({ variant: "link" })}>
          Continuar explorando
        </button>
      </div>
    </section>
  );
}
