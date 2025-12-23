"use client"

import { useState } from "react"
import { Star, CheckCircle, ThumbsUp, ExternalLink } from "lucide-react"

export interface FeedbackContent {
  title: string
  subtitle: string
  step1Question: string
  step2Question: string
  step3Question: string
  step3Helper: string
  thankYouHeadline: string
  thankYouText: string
  reviewPrompt: string
  buttonText: string
  ctaSubtext: string
  backLinkText: string
}

interface FeedbackWizardProps {
  content: FeedbackContent
  googleReviewLink?: string | null
}

export function FeedbackWizard({ content, googleReviewLink }: FeedbackWizardProps) {
  const [currentStep, setCurrentStep] = useState(1)
  const [rating, setRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)
  const [feedback, setFeedback] = useState("")
  const [satisfaction, setSatisfaction] = useState("")
  const [satisfactionComment, setSatisfactionComment] = useState("")
  const [recommendation, setRecommendation] = useState(0)

  const totalSteps = 4

  const handleNextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep((prev) => prev + 1)
    }
  }

  const progressPercent = Math.round((currentStep / totalSteps) * 100)

  const satisfactionOptions = [
    { value: "very-satisfied", label: "Very satisfied", emoji: "😊" },
    { value: "satisfied", label: "Satisfied", emoji: "🙂" },
    { value: "neutral", label: "Neutral", emoji: "😐" },
    { value: "unsatisfied", label: "Unsatisfied", emoji: "😕" },
  ]

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
      <div className="text-center mb-12">
        <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-4">{content.title}</h1>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto">{content.subtitle}</p>
      </div>

      <div className="mb-8">
        <div className="flex justify-between items-center mb-3">
          <span className="text-sm font-medium text-slate-600">
            Step {currentStep} of {totalSteps}
          </span>
          <span className="text-sm text-slate-500">{progressPercent}% Complete</span>
        </div>
        <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[#BA1C1C] to-[#2CD4BD] transition-all duration-500 ease-out"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-6 sm:p-10 mb-8">
        {currentStep === 1 && (
          <div className="animate-fadeIn">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">{content.step1Question}</h2>

            <div className="flex justify-center gap-3 mb-8">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-[#2CD4BD] rounded-lg p-2"
                >
                  <Star
                    className={`w-12 h-12 sm:w-14 sm:h-14 transition-colors ${
                      star <= (hoverRating || rating)
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-slate-300"
                    }`}
                  />
                </button>
              ))}
            </div>

            {rating > 0 && (
              <div className="animate-fadeIn">
                <label className="block text-sm font-medium text-slate-700 mb-2">Tell us more (optional)</label>
                <textarea
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  rows={4}
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#2CD4BD] focus:border-transparent resize-none text-slate-900"
                  placeholder="Share your thoughts about your experience..."
                />

                <button
                  onClick={handleNextStep}
                  className="mt-6 w-full sm:w-auto px-8 py-3 bg-[#BA1C1C] hover:bg-[#2CD4BD] text-white font-semibold rounded-xl transition-all duration-300 hover:scale-105 shadow-lg"
                >
                  Next Step
                </button>
              </div>
            )}
          </div>
        )}

        {currentStep === 2 && (
          <div className="animate-fadeIn">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">{content.step2Question}</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              {satisfactionOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => setSatisfaction(option.value)}
                  className={`p-5 rounded-xl border-2 transition-all duration-300 ${
                    satisfaction === option.value
                      ? "border-[#2CD4BD] bg-[#2CD4BD]/10 shadow-lg"
                      : "border-slate-200 hover:border-[#2CD4BD]/50 hover:shadow-md"
                  }`}
                >
                  <div className="text-4xl mb-2">{option.emoji}</div>
                  <div className="font-semibold text-slate-900">{option.label}</div>
                </button>
              ))}
            </div>

            {satisfaction && (
              <div className="animate-fadeIn">
                <label className="block text-sm font-medium text-slate-700 mb-2">Additional comments (optional)</label>
                <textarea
                  value={satisfactionComment}
                  onChange={(e) => setSatisfactionComment(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#2CD4BD] focus:border-transparent resize-none text-slate-900"
                  placeholder="Tell us more about your experience..."
                />

                <button
                  onClick={handleNextStep}
                  className="mt-6 w-full sm:w-auto px-8 py-3 bg-[#BA1C1C] hover:bg-[#2CD4BD] text-white font-semibold rounded-xl transition-all duration-300 hover:scale-105 shadow-lg"
                >
                  Next Step
                </button>
              </div>
            )}
          </div>
        )}

        {currentStep === 3 && (
          <div className="animate-fadeIn">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">{content.step3Question}</h2>
            <p className="text-sm text-slate-500 mb-6">{content.step3Helper}</p>

            <div className="grid grid-cols-5 sm:grid-cols-10 gap-2 mb-6">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                <button
                  key={num}
                  onClick={() => setRecommendation(num)}
                  className={`aspect-square rounded-xl font-bold text-lg transition-all duration-300 ${
                    recommendation === num
                      ? "bg-[#2CD4BD] text-slate-900 shadow-lg scale-110"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200 hover:scale-105"
                  }`}
                >
                  {num}
                </button>
              ))}
            </div>

            <div className="flex justify-between text-xs text-slate-500 mb-6">
              <span>Not likely</span>
              <span>Very likely</span>
            </div>

            {recommendation > 0 && (
              <button
                onClick={handleNextStep}
                className="mt-2 w-full sm:w-auto px-8 py-3 bg-[#BA1C1C] hover:bg-[#2CD4BD] text-white font-semibold rounded-xl transition-all duration-300 hover:scale-105 shadow-lg"
              >
                Next Step
              </button>
            )}
          </div>
        )}

        {currentStep === 4 && (
          <div className="animate-fadeIn text-center">
            <div className="mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                <CheckCircle className="w-10 h-10 text-green-600" />
              </div>
              <h2 className="text-3xl font-bold text-slate-900 mb-4">{content.thankYouHeadline}</h2>
              <p className="text-lg text-slate-600 mb-6">{content.thankYouText}</p>
            </div>

            <div className="bg-gradient-to-br from-[#BA1C1C]/5 to-[#2CD4BD]/5 rounded-2xl p-8 mb-8">
              <ThumbsUp className="w-12 h-12 text-[#2CD4BD] mx-auto mb-4" />
              <p className="text-slate-700 mb-6 leading-relaxed">{content.reviewPrompt}</p>

              <a
                href={googleReviewLink || "#"}
                target="_blank"
                rel="noopener noreferrer"
                className={`inline-flex items-center gap-3 px-8 py-4 text-white font-bold text-lg rounded-xl transition-all duration-300 hover:scale-105 shadow-lg ${
                  googleReviewLink ? "bg-[#BA1C1C] hover:bg-[#2CD4BD]" : "bg-slate-300 cursor-not-allowed"
                }`}
              >
                {content.buttonText}
                <ExternalLink className="w-5 h-5" />
              </a>

              <p className="text-sm text-slate-500 mt-4">{content.ctaSubtext}</p>
            </div>

            <a
              href="/"
              className="inline-block text-slate-600 hover:text-slate-900 font-medium transition-colors"
            >
              ← {content.backLinkText}
            </a>
          </div>
        )}
      </div>

      {currentStep < 4 && (
        <div className="text-center text-sm text-slate-500">
          <p>Your feedback is confidential and helps us serve you better.</p>
        </div>
      )}
    </div>
  )
}
