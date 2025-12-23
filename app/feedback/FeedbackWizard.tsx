"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { ArrowLeft, ArrowRight, CheckCircle2, Star } from "lucide-react"

interface StepContent {
  progress: string
  question: string
  helper?: string
  scaleMax: number
}

export interface QuestionnaireContent {
  title: string
  subtitle: string
  steps: [StepContent, StepContent, StepContent]
  step4Progress: string
  thankYouHeadline: string
  thankYouText: string
  reviewPrompt: string
  buttonText: string
  ctaSubtext: string
  backLinkText: string
}

interface FeedbackWizardProps {
  content: QuestionnaireContent
  googleReviewLink?: string | null
  backHref?: string
}

function RatingScale({
  value,
  onChange,
  max,
  label,
}: {
  value: number
  onChange: (value: number) => void
  max: number
  label: string
}) {
  const options = useMemo(() => Array.from({ length: max }, (_, i) => i + 1), [max])

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2">
        {options.map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => onChange(option)}
            className={`flex h-12 w-12 items-center justify-center rounded-full border text-sm font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-[var(--accent-hover,#2CD4BD)] focus:ring-offset-2 focus:ring-offset-white ${
              value === option
                ? "border-transparent bg-[var(--accent-primary,#BA1C1C)] text-white shadow-lg shadow-red-900/20"
                : "border-slate-200 bg-white text-slate-700 hover:border-slate-300"
            }`}
          >
            {label === "stars" ? <Star className="h-4 w-4" fill={value >= option ? "currentColor" : "none"} /> : option}
          </button>
        ))}
      </div>
      {max === 10 ? (
        <div className="flex justify-between text-[11px] text-slate-500">
          <span>Not likely</span>
          <span>Extremely likely</span>
        </div>
      ) : null}
    </div>
  )
}

export function FeedbackWizard({ content, googleReviewLink, backHref = "/" }: FeedbackWizardProps) {
  const [step, setStep] = useState(0)
  const [rating, setRating] = useState(0)
  const [team, setTeam] = useState(0)
  const [recommend, setRecommend] = useState(0)

  const totalSteps = 4

  const canProceed =
    (step === 0 && rating > 0) || (step === 1 && team > 0) || (step === 2 && recommend > 0) || step >= totalSteps - 1

  const goNext = () => setStep((prev) => Math.min(totalSteps - 1, prev + 1))
  const goBack = () => setStep((prev) => Math.max(0, prev - 1))

  const progressPercent = ((step + 1) / totalSteps) * 100

  return (
    <div className="min-h-[70vh] bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 py-12">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-3xl">
          <div className="rounded-3xl border border-slate-800/80 bg-white/5 p-6 shadow-2xl shadow-slate-900/40 backdrop-blur">
            <div className="mb-6 flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-wide text-slate-200">Feedback</p>
                <h1 className="text-3xl font-extrabold text-white sm:text-4xl">{content.title}</h1>
                <p className="mt-2 text-sm text-slate-200/80">{content.subtitle}</p>
              </div>
              <div className="hidden sm:block text-right">
                <p className="text-xs font-medium text-slate-200">Step {step + 1} of {totalSteps}</p>
                <div className="mt-2 h-2 w-32 rounded-full bg-slate-800">
                  <div className="h-full rounded-full bg-[var(--accent-primary,#BA1C1C)] transition-all" style={{ width: `${progressPercent}%` }} />
                </div>
              </div>
            </div>

            <div className="space-y-3 rounded-2xl bg-white p-6 shadow-xl">
              <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wide text-slate-500">
                <span>{[content.steps[0].progress, content.steps[1].progress, content.steps[2].progress, content.step4Progress][step] || content.steps[step]?.progress}</span>
                <span>Step {step + 1} of {totalSteps}</span>
              </div>

              <div className="h-px bg-slate-100" />

              {step === 0 && (
                <div className="space-y-4">
                  <h2 className="text-xl font-bold text-slate-900">{content.steps[0].question}</h2>
                  <RatingScale
                    value={rating}
                    onChange={setRating}
                    max={content.steps[0].scaleMax}
                    label={content.steps[0].scaleMax > 5 ? "numbers" : "stars"}
                  />
                </div>
              )}

              {step === 1 && (
                <div className="space-y-4">
                  <h2 className="text-xl font-bold text-slate-900">{content.steps[1].question}</h2>
                  <RatingScale
                    value={team}
                    onChange={setTeam}
                    max={content.steps[1].scaleMax}
                    label={content.steps[1].scaleMax > 5 ? "numbers" : "stars"}
                  />
                </div>
              )}

              {step === 2 && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <h2 className="text-xl font-bold text-slate-900">{content.steps[2].question}</h2>
                    {content.steps[2].helper ? <p className="text-sm text-slate-600">{content.steps[2].helper}</p> : null}
                  </div>
                  <RatingScale
                    value={recommend}
                    onChange={setRecommend}
                    max={content.steps[2].scaleMax}
                    label={content.steps[2].scaleMax > 5 ? "numbers" : "stars"}
                  />
                </div>
              )}

              {step === 3 && (
                <div className="space-y-3 text-center">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-green-100 text-green-700">
                    <CheckCircle2 className="h-8 w-8" />
                  </div>
                  <h2 className="text-2xl font-bold text-slate-900">{content.thankYouHeadline}</h2>
                  <p className="text-sm text-slate-600">{content.thankYouText}</p>
                  <div className="mt-4 space-y-3">
                    <p className="text-sm font-semibold text-slate-800">{content.reviewPrompt}</p>
                    <a
                      href={googleReviewLink || "#"}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`inline-flex w-full items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-red-600/30 transition ${
                        googleReviewLink
                          ? "bg-[var(--accent-primary,#BA1C1C)] hover:bg-[var(--accent-hover,#2CD4BD)] hover:text-slate-900"
                          : "cursor-not-allowed bg-slate-300 text-slate-600"
                      }`}
                    >
                      {content.buttonText}
                      <ArrowRight className="h-4 w-4" />
                    </a>
                    <p className="text-xs text-slate-500">{content.ctaSubtext}</p>
                  </div>
                </div>
              )}

              <div className="flex flex-wrap items-center justify-between gap-3 pt-4">
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <ArrowLeft className="h-4 w-4" />
                  <Link href={backHref} className="font-semibold text-slate-800 hover:text-[var(--accent-primary,#BA1C1C)]">
                    {content.backLinkText}
                  </Link>
                </div>
                {step < totalSteps - 1 ? (
                  <div className="flex gap-2">
                    {step > 0 && (
                      <button
                        type="button"
                        onClick={goBack}
                        className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
                      >
                        <ArrowLeft className="h-4 w-4" /> Back
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={goNext}
                      disabled={!canProceed}
                      className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold text-white shadow-md shadow-red-900/20 transition ${
                        canProceed
                          ? "bg-[var(--accent-primary,#BA1C1C)] hover:bg-[var(--accent-hover,#2CD4BD)] hover:text-slate-900"
                          : "cursor-not-allowed bg-slate-200 text-slate-500"
                      }`}
                    >
                      Next
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <div className="text-sm font-semibold text-green-700">All steps complete</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
