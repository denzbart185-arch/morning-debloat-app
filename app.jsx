import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { CheckCircle2, Flame } from "lucide-react";

const routine = [
  { title: "Drink Water", time: 60, desc: "Drink one full glass of water." },
  { title: "Neck Rolls", time: 120, desc: "Slow neck rolls to activate lymph flow." },
  { title: "Face Massage", time: 180, desc: "Jaw, cheeks, under-eye gentle drainage." },
  { title: "Jaw Release", time: 120, desc: "Lion face + jaw stretch." },
  { title: "Posture & Breathing", time: 60, desc: "Straight posture, deep breathing." },
];

export default function MorningDebloatApp() {
  const [step, setStep] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState(routine[0].time);
  const [completed, setCompleted] = useState(false);
  const [streak, setStreak] = useState(0);

  // Load streak
  useEffect(() => {
    const savedStreak = localStorage.getItem("streak") || 0;
    setStreak(Number(savedStreak));
  }, []);

  // Timer
  useEffect(() => {
    if (completed) return;
    const timer = setInterval(() => {
      setSecondsLeft((s) => (s > 0 ? s - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [step, completed]);

  // Step vibration
  useEffect(() => {
    if (navigator.vibrate) navigator.vibrate(30);
  }, [step]);

  // Morning reminder (9 AM default)
  useEffect(() => {
    if ("Notification" in window) {
      Notification.requestPermission();
    }
  }, []);

  const nextStep = () => {
    if (step < routine.length - 1) {
      setStep(step + 1);
      setSecondsLeft(routine[step + 1].time);
    } else {
      const newStreak = streak + 1;
      localStorage.setItem("streak", newStreak);
      setStreak(newStreak);
      setCompleted(true);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-950 text-white p-4">
      <Card className="w-full max-w-sm rounded-2xl shadow-xl bg-neutral-900">
        <CardContent className="p-6 text-center space-y-6">
          <div className="flex justify-center items-center gap-2 text-orange-400 text-sm">
            <Flame size={16} /> {streak}-day streak
          </div>

          {!completed ? (
            <motion.div
              key={step}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <h1 className="text-xl font-semibold">{routine[step].title}</h1>
              <p className="text-sm text-neutral-400">{Math.ceil(secondsLeft / 60)} min</p>
              <p className="text-neutral-300 mt-2">{routine[step].desc}</p>

              <div className="mt-4 text-3xl font-mono">
                {Math.floor(secondsLeft / 60)}:{String(secondsLeft % 60).padStart(2, "0")}
              </div>

              <Button onClick={nextStep} className="mt-6 w-full rounded-xl">
                Done
              </Button>
            </motion.div>
          ) : (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
              <CheckCircle2 className="mx-auto h-10 w-10 text-green-400" />
              <h2 className="text-lg font-semibold">Routine Complete</h2>
              <p className="text-neutral-400 text-sm">See you tomorrow. Keep the streak alive.</p>
            </motion.div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
