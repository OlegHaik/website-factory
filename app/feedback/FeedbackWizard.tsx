"use client"

import { useMemo, useState } from "react"
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
    <div className="space-y-3">
      <div className="flex flex-wrap justify-center gap-3">
        {options.map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => onChange(option)}
            className={`flex h-14 w-14 items-center justify-center rounded-full border text-sm font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-orange-200 focus:ring-offset-2 focus:ring-offset-white ${
              value === option
                ? "border-transparent bg-amber-100 text-amber-400 shadow-lg shadow-amber-200"
                : "border-slate-200 bg-white text-slate-400 hover:border-slate-300"
            }`}
          >
            {label === "stars" ? (
              <Star
                className="h-7 w-7"
                strokeWidth={2.2}
                fill={value >= option ? "currentColor" : "none"}
              />
            ) : (
              option
            )}
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

export function FeedbackWizard({ content, googleReviewLink }: FeedbackWizardProps) {
  const [step, setStep] = useState(0)
  const [rating, setRating] = useState(0)
  const [team, setTeam] = useState(0)
  const [recommend, setRecommend] = useState(0)
  const [comment, setComment] = useState("")

  const totalSteps = 4

  const canProceed =
    (step === 0 && rating > 0) || (step === 1 && team > 0) || (step === 2 && recommend > 0) || step >= totalSteps - 1

  const goNext = () => setStep((prev) => Math.min(totalSteps - 1, prev + 1))
  const goBack = () => setStep((prev) => Math.max(0, prev - 1))

  const progressPercent = ((step + 1) / totalSteps) * 100

  return (
    <div className="bg-white py-10 sm:py-14">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-3xl font-extrabold text-slate-900 sm:text-4xl">{content.title}</h1>
          <p className="mt-2 text-base text-slate-600">{content.subtitle}</p>
        </div>

        <div className="mx-auto mt-8 max-w-3xl">
          <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-2xl shadow-slate-200 sm:p-8">
            <div className="mb-4 flex items-center justify-between text-xs font-semibold uppercase tracking-wide text-slate-600">
              <span>Step {step + 1} of {totalSteps}</span>
              <span>{Math.round(progressPercent)}% Complete</span>
            </div>
            <div className="mb-6 h-2 w-full overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full rounded-full bg-gradient-to-r from-red-600 via-orange-500 to-teal-400 transition-all"
                style={{ width: `${progressPercent}%` }}
              />
            </div>

            <div className="space-y-6">
              {step === 0 && (
                <div className="space-y-4 text-left">
                  <h2 className="text-xl font-bold text-slate-900">{content.steps[0].question}</h2>
                  <RatingScale
                    value={rating}
                    onChange={setRating}
                    max={content.steps[0].scaleMax}
                    label={content.steps[0].scaleMax > 5 ? "numbers" : "stars"}
                  />
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">Tell us more (optional)</label>
                    <textarea
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      rows={4}
                      className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 shadow-sm outline-none transition focus:border-red-400 focus:ring-2 focus:ring-red-100"
                      placeholder="Share your thoughts about your experience..."
                    />
                  </div>
                </div>
              )}

              {step === 1 && (
                <div className="space-y-4 text-left">
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
                <div className="space-y-4 text-left">
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
                <div className="space-y-4 text-center">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-green-700">
                    <CheckCircle2 className="h-9 w-9" />
                  </div>
                  <h2 className="text-2xl font-bold text-slate-900">{content.thankYouHeadline}</h2>
                  <p className="text-sm text-slate-600">{content.thankYouText}</p>
                  <div className="mt-4 space-y-3">
                    <p className="text-sm font-semibold text-slate-800">{content.reviewPrompt}</p>
                    <a
                      href={googleReviewLink || "#"}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`inline-flex w-full items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold text-white shadow-md transition ${
                        googleReviewLink
                          ? "bg-red-600 hover:bg-red-700"
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

              <div className="flex items-center justify-center gap-3 pt-2">
                {step > 0 && step < totalSteps - 1 ? (
                  <button
                    type="button"
                    onClick={goBack}
                    className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
                  >
                    <ArrowLeft className="h-4 w-4" /> Back
                  </button>
                ) : null}
                {step < totalSteps - 1 ? (
                  <button
                    type="button"
                    onClick={goNext}
                    disabled={!canProceed}
                    className={`inline-flex min-w-[130px] items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-semibold text-white shadow-md transition ${
                      canProceed
                        ? "bg-red-600 hover:bg-red-700"
                        : "cursor-not-allowed bg-slate-200 text-slate-500"
                    }`}
                  >
                    Next Step
                    <ArrowRight className="h-4 w-4" />
                  </button>
                ) : null}
              </div>
            </div>
          </div>

          <p className="mt-6 text-center text-xs text-slate-500">
            Your feedback is confidential and helps us serve you better.
          </p>
        </div>
      </div>
    </div>
  )
}
