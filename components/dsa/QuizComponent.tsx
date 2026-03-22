"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { CheckCircle2, XCircle, ArrowRight, Trophy, Info } from "lucide-react"
import { QuizQuestion } from "@/lib/dsa-course-data"

interface QuizComponentProps {
    questions: QuizQuestion[]
    onComplete: (score: number) => void
}

export default function QuizComponent({ questions, onComplete }: QuizComponentProps) {
    const [currentStep, setCurrentStep] = useState(0)
    const [selectedOption, setSelectedOption] = useState<number | null>(null)
    const [isSubmitted, setIsSubmitted] = useState(false)
    const [score, setScore] = useState(0)
    const [showResults, setShowResults] = useState(false)

    const currentQuestion = questions[currentStep]

    const handleOptionSelect = (index: number) => {
        if (isSubmitted) return
        setSelectedOption(index)
    }

    const handleSubmit = () => {
        if (selectedOption === null || isSubmitted) return
        
        const correct = selectedOption === currentQuestion.correctAnswer
        if (correct) setScore(prev => prev + 1)
        setIsSubmitted(true)
    }

    const handleNext = () => {
        if (currentStep < questions.length - 1) {
            setCurrentStep(prev => prev + 1)
            setSelectedOption(null)
            setIsSubmitted(false)
        } else {
            setShowResults(true)
            onComplete(score + (selectedOption === currentQuestion.correctAnswer ? 1 : 0))
        }
    }

    if (showResults) {
        const finalScore = score
        const percentage = (finalScore / questions.length) * 100

        return (
            <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center p-8 text-center space-y-6 bg-white/5 border border-white/10 rounded-2xl"
            >
                <div className="w-20 h-20 rounded-full bg-accent/20 flex items-center justify-center text-accent">
                    <Trophy size={40} />
                </div>
                <div className="space-y-2">
                    <h3 className="text-2xl font-black font-mono tracking-tighter uppercase">Assessment Complete</h3>
                    <p className="text-white/40 font-mono text-sm leading-relaxed">
                        SYNCHRONIZATION STATUS: <span className="text-accent">{percentage}%</span>
                    </p>
                </div>
                <div className="w-full max-w-xs bg-white/5 h-2 rounded-full overflow-hidden">
                    <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${percentage}%` }}
                        className="h-full bg-accent shadow-[0_0_10px_#00ffcc]"
                    />
                </div>
                <p className="text-white/60 font-mono text-xs max-w-[250px]">
                    {percentage === 100 
                        ? "Perfect score! System integrity verified at 100%." 
                        : "Assessment recorded. Further study of core concepts recommended."}
                </p>
            </motion.div>
        )
    }

    return (
        <div className="space-y-6">
            {/* Progress Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="px-2 py-0.5 rounded bg-accent/10 border border-accent/30 text-[10px] font-mono font-bold text-accent uppercase tracking-widest">
                        Assessment {currentStep + 1}/{questions.length}
                    </div>
                </div>
                <div className="text-[10px] font-mono text-white/30 uppercase tracking-widest">
                    Time: --:--
                </div>
            </div>

            {/* Question */}
            <div className="space-y-4">
                <h4 className="text-lg font-bold text-white leading-snug">
                    {currentQuestion.question}
                </h4>

                <div className="grid gap-3">
                    {currentQuestion.options.map((option, idx) => {
                        const isSelected = selectedOption === idx
                        const isCorrect = isSubmitted && idx === currentQuestion.correctAnswer
                        const isWrong = isSubmitted && isSelected && idx !== currentQuestion.correctAnswer

                        return (
                            <button
                                key={idx}
                                onClick={() => handleOptionSelect(idx)}
                                disabled={isSubmitted}
                                className={`
                                    w-full p-4 rounded-xl border text-left transition-all duration-200 group relative overflow-hidden
                                    ${isSelected && !isSubmitted ? "bg-accent/10 border-accent/50 text-accent ring-1 ring-accent/20" : 
                                      isCorrect ? "bg-emerald-500/10 border-emerald-500/50 text-emerald-400" :
                                      isWrong ? "bg-rose-500/10 border-rose-500/50 text-rose-400" :
                                      "bg-white/5 border-white/10 text-white/60 hover:bg-white/10 hover:border-white/20"}
                                `}
                            >
                                <div className="flex items-center justify-between relative z-10">
                                    <span className="font-medium">{option}</span>
                                    {isCorrect && <CheckCircle2 size={18} />}
                                    {isWrong && <XCircle size={18} />}
                                </div>
                                {isSelected && !isSubmitted && (
                                    <motion.div 
                                        layoutId="quiz-active"
                                        className="absolute inset-0 bg-accent/5"
                                    />
                                )}
                            </button>
                        )
                    })}
                </div>
            </div>

            {/* Feedback & Actions */}
            <AnimatePresence mode="wait">
                {isSubmitted ? (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="p-4 rounded-xl bg-blue-500/5 border border-blue-500/20 space-y-2"
                    >
                        <div className="flex items-center gap-2 text-blue-400 font-mono text-[10px] uppercase font-bold tracking-widest">
                            <Info size={12} />
                            Explanation
                        </div>
                        <p className="text-white/60 text-sm leading-relaxed italic">
                            {currentQuestion.explanation}
                        </p>
                        <button
                            onClick={handleNext}
                            className="mt-4 w-full py-3 rounded-xl bg-white text-black font-bold flex items-center justify-center gap-2 hover:bg-accent transition-colors"
                        >
                            {currentStep === questions.length - 1 ? "Complete Verification" : "Next Question"}
                            <ArrowRight size={18} />
                        </button>
                    </motion.div>
                ) : (
                    <button
                        onClick={handleSubmit}
                        disabled={selectedOption === null}
                        className={`
                            w-full py-4 rounded-xl font-black font-mono uppercase tracking-widest transition-all
                            ${selectedOption !== null 
                                ? "bg-accent text-black shadow-[0_0_20px_rgba(0,255,204,0.3)] hover:scale-[1.02] active:scale-[0.98]" 
                                : "bg-white/5 text-white/20 cursor-not-allowed"}
                        `}
                    >
                        Submit Answer
                    </button>
                )}
            </AnimatePresence>
        </div>
    )
}
