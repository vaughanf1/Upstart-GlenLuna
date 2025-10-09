'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, ArrowRight, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface QuizAnswers {
  technicalSkills: number
  designSkills: number
  marketingSkills: number
  salesSkills: number
  industryExperience: string[]
  yearsExperience: number
  riskTolerance: number
  timeCommitment: 'part-time' | 'full-time'
  fundingCapacity: 'bootstrapped' | 'angel' | 'vc'
  preferredBuildTypes: string[]
  preferredTags: string[]
}

const industries = [
  'AI/ML', 'E-commerce', 'FinTech', 'HealthTech', 'EdTech',
  'SaaS', 'Gaming', 'Social Media', 'Enterprise', 'Consumer'
]

const buildTypes = [
  'SaaS', 'AI Agent', 'Mobile App', 'Web App', 'API',
  'Tool', 'Platform', 'Marketplace'
]

const tags = [
  'AI', 'E-commerce', 'FinTech', 'EdTech', 'HealthTech',
  'Productivity', 'Social', 'Analytics', 'Automation',
  'Mobile', 'Web3', 'Gaming', 'Creator Economy'
]

export default function FounderFitQuiz() {
  const router = useRouter()
  const [questionIndex, setQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState<QuizAnswers>({
    technicalSkills: 3,
    designSkills: 3,
    marketingSkills: 3,
    salesSkills: 3,
    industryExperience: [],
    yearsExperience: 0,
    riskTolerance: 3,
    timeCommitment: 'part-time',
    fundingCapacity: 'bootstrapped',
    preferredBuildTypes: [],
    preferredTags: [],
  })
  const [loading, setLoading] = useState(false)

  const questions = [
    {
      id: 'technicalSkills',
      title: 'Technical Skills',
      subtitle: 'Rate your coding and engineering abilities',
      type: 'rating' as const,
      labels: ['Beginner', 'Basic', 'Intermediate', 'Advanced', 'Expert']
    },
    {
      id: 'designSkills',
      title: 'Design Skills',
      subtitle: 'Rate your UI/UX and visual design abilities',
      type: 'rating' as const,
      labels: ['Beginner', 'Basic', 'Intermediate', 'Advanced', 'Expert']
    },
    {
      id: 'marketingSkills',
      title: 'Marketing Skills',
      subtitle: 'Rate your growth, content, and SEO abilities',
      type: 'rating' as const,
      labels: ['Beginner', 'Basic', 'Intermediate', 'Advanced', 'Expert']
    },
    {
      id: 'salesSkills',
      title: 'Sales Skills',
      subtitle: 'Rate your B2B, B2C, and partnership abilities',
      type: 'rating' as const,
      labels: ['Beginner', 'Basic', 'Intermediate', 'Advanced', 'Expert']
    },
    {
      id: 'industryExperience',
      title: 'Industry Experience',
      subtitle: 'Select all industries you have experience in',
      type: 'multiselect' as const,
      options: industries
    },
    {
      id: 'yearsExperience',
      title: 'Years of Experience',
      subtitle: 'How many years of professional experience do you have?',
      type: 'select' as const,
      options: [
        { value: 0, label: '0-1 years' },
        { value: 2, label: '2-3 years' },
        { value: 5, label: '5-7 years' },
        { value: 10, label: '10+ years' }
      ]
    },
    {
      id: 'riskTolerance',
      title: 'Risk Tolerance',
      subtitle: 'How comfortable are you with taking risks?',
      type: 'rating' as const,
      labels: ['Very Low', 'Low', 'Medium', 'High', 'Very High']
    },
    {
      id: 'timeCommitment',
      title: 'Time Commitment',
      subtitle: 'How much time can you dedicate to your startup?',
      type: 'choice' as const,
      options: [
        { value: 'part-time', label: 'Part-Time' },
        { value: 'full-time', label: 'Full-Time' }
      ]
    },
    {
      id: 'fundingCapacity',
      title: 'Funding Approach',
      subtitle: 'What is your preferred funding strategy?',
      type: 'choice' as const,
      options: [
        { value: 'bootstrapped', label: 'Bootstrapped' },
        { value: 'angel', label: 'Angel' },
        { value: 'vc', label: 'VC' }
      ]
    },
    {
      id: 'preferredBuildTypes',
      title: 'Preferred Build Types',
      subtitle: 'What types of projects do you prefer to build?',
      type: 'multiselect' as const,
      options: buildTypes
    },
    {
      id: 'preferredTags',
      title: 'Areas of Interest',
      subtitle: 'What areas are you most interested in?',
      type: 'multiselect' as const,
      options: tags
    }
  ]

  const totalSteps = questions.length
  const currentQuestion = questions[questionIndex]

  const handleSubmit = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/founder-profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(answers),
      })

      if (response.ok) {
        router.push('/founder-fit/results')
      } else {
        alert('Please sign in to save your profile')
        router.push('/auth/signin')
      }
    } catch (error) {
      console.error('Error saving profile:', error)
      alert('Error saving profile. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const toggleArrayItem = <K extends keyof QuizAnswers>(
    field: K,
    value: string
  ) => {
    const current = answers[field] as string[]
    setAnswers({
      ...answers,
      [field]: current.includes(value)
        ? current.filter(v => v !== value)
        : [...current, value]
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <header className="bg-white/80 backdrop-blur-sm border-b sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center text-gray-600 hover:text-gray-900">
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to Home
            </Link>
            <div className="text-sm text-gray-600">
              Question {questionIndex + 1} of {totalSteps}
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Founder Fit Quiz
          </h1>
          <p className="text-lg text-gray-600">
            Help us match you with ideas that align with your skills, experience, and goals
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 transition-all duration-300"
              style={{ width: `${((questionIndex + 1) / totalSteps) * 100}%` }}
            />
          </div>
        </div>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl">{currentQuestion.title}</CardTitle>
            <p className="text-gray-600 mt-2">{currentQuestion.subtitle}</p>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Render current question based on type */}
            {currentQuestion.type === 'rating' && (
              <SkillRating
                label=""
                value={answers[currentQuestion.id as keyof QuizAnswers] as number}
                onChange={(v) => setAnswers({ ...answers, [currentQuestion.id]: v })}
                labels={currentQuestion.labels}
              />
            )}

            {currentQuestion.type === 'multiselect' && (
              <div className="grid grid-cols-2 gap-3">
                {currentQuestion.options?.map((option: string) => (
                  <button
                    key={option}
                    onClick={() => toggleArrayItem(currentQuestion.id as keyof QuizAnswers, option)}
                    className={`px-4 py-3 rounded-lg border-2 text-sm font-medium transition-all ${
                      (answers[currentQuestion.id as keyof QuizAnswers] as string[]).includes(option)
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    {(answers[currentQuestion.id as keyof QuizAnswers] as string[]).includes(option) && (
                      <Check className="w-4 h-4 inline mr-2" />
                    )}
                    {option}
                  </button>
                ))}
              </div>
            )}

            {currentQuestion.type === 'select' && (
              <select
                value={answers[currentQuestion.id as keyof QuizAnswers] as number}
                onChange={(e) => setAnswers({ ...answers, [currentQuestion.id]: parseInt(e.target.value) })}
                className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 bg-white text-gray-900 focus:border-blue-500 focus:outline-none text-base"
              >
                {currentQuestion.options?.map((opt: any) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            )}

            {currentQuestion.type === 'choice' && (
              <div className={`grid gap-4 ${currentQuestion.options?.length === 2 ? 'grid-cols-2' : 'grid-cols-3'}`}>
                {currentQuestion.options?.map((opt: any) => (
                  <button
                    key={opt.value}
                    onClick={() => setAnswers({ ...answers, [currentQuestion.id]: opt.value })}
                    className={`px-6 py-4 rounded-lg border-2 text-base font-medium transition-all ${
                      answers[currentQuestion.id as keyof QuizAnswers] === opt.value
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between pt-6 border-t">
              <Button
                variant="outline"
                onClick={() => setQuestionIndex(questionIndex - 1)}
                disabled={questionIndex === 0}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Previous
              </Button>

              {questionIndex < totalSteps - 1 ? (
                <Button onClick={() => setQuestionIndex(questionIndex + 1)}>
                  Next
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              ) : (
                <Button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700"
                >
                  {loading ? 'Saving...' : 'See My Matches'}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function SkillRating({
  label,
  value,
  onChange,
  labels = ['Beginner', 'Basic', 'Intermediate', 'Advanced', 'Expert']
}: {
  label: string
  value: number
  onChange: (value: number) => void
  labels?: string[]
}) {
  return (
    <div>
      {label && (
        <label className="block text-base font-medium text-gray-900 mb-3">
          {label}
        </label>
      )}
      <div className="flex items-center justify-between gap-2">
        {[1, 2, 3, 4, 5].map((rating) => (
          <button
            key={rating}
            onClick={() => onChange(rating)}
            className={`flex-1 px-4 py-3 rounded-lg border-2 text-sm font-medium transition-all ${
              value === rating
                ? 'border-blue-500 bg-blue-50 text-blue-700'
                : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
            }`}
          >
            <div className="text-center">
              <div className="text-lg font-bold">{rating}</div>
              <div className="text-xs mt-1">{labels[rating - 1]}</div>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}