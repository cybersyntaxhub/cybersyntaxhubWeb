import { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useAppAuth } from '@/lib/appAuth.jsx';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, CheckCircle, Lock, Play, ChevronRight, ArrowLeft, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

export default function StudentCourses() {
  const { currentUser } = useAppAuth();
  const [courses, setCourses] = useState([]);
  const [progress, setProgress] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCourse, setActiveCourse] = useState(null);
  const [activeStepIdx, setActiveStepIdx] = useState(0);
  const [testMode, setTestMode] = useState(false);
  const [answers, setAnswers] = useState({});
  const [testSubmitted, setTestSubmitted] = useState(false);
  const [testScore, setTestScore] = useState(null);
  const { toast } = useToast();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const [c, p] = await Promise.all([
      base44.entities.Course.filter({ published: true }),
      base44.entities.CourseProgress.filter({ student_id: currentUser.id }),
    ]);
    setCourses(c);
    setProgress(p);
    setLoading(false);
  };

  const getProgress = (courseId) => progress.find(p => p.course_id === courseId);

  const isStepCompleted = (courseId, stepId) => {
    const prog = getProgress(courseId);
    return prog?.completed_steps?.includes(stepId) || false;
  };

  const completeStep = async (courseId, stepId) => {
    let prog = getProgress(courseId);
    if (!prog) {
      prog = await base44.entities.CourseProgress.create({
        student_id: currentUser.id,
        course_id: courseId,
        completed_steps: [stepId],
        test_scores: [],
      });
    } else {
      const completed = [...(prog.completed_steps || [])];
      if (!completed.includes(stepId)) completed.push(stepId);
      prog = await base44.entities.CourseProgress.update(prog.id, { completed_steps: completed });
    }
    await loadData();
  };

  const submitTest = async (course, step) => {
    const questions = step.test_questions || [];
    let correct = 0;
    questions.forEach((q, i) => {
      if (answers[i] === q.correct_index) correct++;
    });
    setTestScore({ correct, total: questions.length });
    setTestSubmitted(true);

    let prog = getProgress(course.id);
    const scoreEntry = { step_id: step.id, score: correct, total: questions.length };
    if (!prog) {
      await base44.entities.CourseProgress.create({
        student_id: currentUser.id,
        course_id: course.id,
        completed_steps: [step.id],
        test_scores: [scoreEntry],
      });
    } else {
      const completed = [...(prog.completed_steps || [])];
      if (!completed.includes(step.id)) completed.push(step.id);
      const scores = [...(prog.test_scores || []), scoreEntry];
      await base44.entities.CourseProgress.update(prog.id, { completed_steps: completed, test_scores: scores });
    }
    await loadData();
  };

  if (loading) return <div className="flex justify-center py-12"><div className="w-5 h-5 border-2 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin" /></div>;

  // Test locked mode
  if (testMode && activeCourse) {
    const step = activeCourse.steps[activeStepIdx];
    const questions = step?.test_questions || [];

    return (
      <div className="fixed inset-0 z-50 bg-background flex flex-col">
        <div className="bg-red-500/10 border-b border-red-500/20 px-4 py-3 flex items-center gap-3">
          <Lock className="w-5 h-5 text-red-400" />
          <div>
            <p className="text-sm font-bold text-red-400">LOCKED TEST MODE</p>
            <p className="text-xs text-red-400/70">You cannot leave until you submit. Do not switch tabs.</p>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-6 max-w-2xl mx-auto w-full">
          <h2 className="text-xl font-bold mb-6">{step.title}</h2>
          {testSubmitted ? (
            <div className="text-center py-12">
              <CheckCircle className="w-16 h-16 text-emerald-400 mx-auto mb-4" />
              <h3 className="text-2xl font-bold mb-2">Test Complete!</h3>
              <p className="text-lg text-muted-foreground">Score: {testScore.correct}/{testScore.total}</p>
              <Button
                className="mt-6 bg-cyan-500 hover:bg-cyan-400 text-black"
                onClick={() => { setTestMode(false); setTestSubmitted(false); setAnswers({}); }}
              >
                Return to Course
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              {questions.map((q, qi) => (
                <div key={qi} className="p-4 rounded-xl border border-white/5 bg-card">
                  <p className="font-medium mb-3">{qi + 1}. {q.question}</p>
                  <div className="space-y-2">
                    {q.options?.map((opt, oi) => (
                      <button
                        key={oi}
                        onClick={() => setAnswers(prev => ({ ...prev, [qi]: oi }))}
                        className={`w-full text-left px-4 py-2.5 rounded-lg border text-sm transition-all ${
                          answers[qi] === oi
                            ? 'border-cyan-500 bg-cyan-500/10 text-cyan-400'
                            : 'border-white/10 text-muted-foreground hover:border-white/20'
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
              <Button
                className="w-full bg-cyan-500 hover:bg-cyan-400 text-black font-semibold"
                disabled={Object.keys(answers).length < questions.length}
                onClick={() => submitTest(activeCourse, step)}
              >
                Submit Test ({Object.keys(answers).length}/{questions.length} answered)
              </Button>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Course detail view with timeline
  if (activeCourse) {
    const steps = activeCourse.steps || [];
    const activeStep = steps[activeStepIdx];

    return (
      <div>
        <button onClick={() => { setActiveCourse(null); setActiveStepIdx(0); }} className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-4">
          <ArrowLeft className="w-4 h-4" /> Back to Courses
        </button>
        <h1 className="text-2xl font-bold mb-2">{activeCourse.title}</h1>
        <p className="text-muted-foreground mb-8">{activeCourse.description}</p>

        <div className="flex gap-8 flex-col lg:flex-row">
          {/* Timeline */}
          <div className="lg:w-72 flex-shrink-0">
            <div className="relative">
              {steps.map((step, i) => {
                const completed = isStepCompleted(activeCourse.id, step.id);
                const isCurrent = i === activeStepIdx;
                return (
                  <motion.div
                    key={step.id}
                    initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="flex gap-3 mb-1 last:mb-0"
                  >
                    <div className="flex flex-col items-center">
                      <motion.div
                        whileHover={{ scale: 1.1 }}
                        onClick={() => setActiveStepIdx(i)}
                        className={`w-8 h-8 rounded-full flex items-center justify-center cursor-pointer transition-colors ${
                          completed ? 'bg-emerald-500 text-black' :
                          isCurrent ? 'bg-cyan-500 text-black' :
                          'bg-white/10 text-muted-foreground'
                        }`}
                      >
                        {completed ? <CheckCircle className="w-4 h-4" /> :
                         step.type === 'test' ? <Lock className="w-4 h-4" /> :
                         <span className="text-xs font-bold">{i + 1}</span>}
                      </motion.div>
                      {i < steps.length - 1 && (
                        <div className={`w-0.5 h-8 ${completed ? 'bg-emerald-500' : 'bg-white/10'}`} />
                      )}
                    </div>
                    <div
                      onClick={() => setActiveStepIdx(i)}
                      className={`cursor-pointer pt-1 pb-4 ${isCurrent ? 'text-foreground' : 'text-muted-foreground'}`}
                    >
                      <p className="text-sm font-medium">{step.title}</p>
                      <p className="text-xs text-muted-foreground capitalize">{step.type}</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Content */}
          <div className="flex-1">
            {activeStep && (
              <motion.div
                key={activeStep.id}
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                className="p-6 rounded-xl border border-white/5 bg-card"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold">{activeStep.title}</h3>
                  {isStepCompleted(activeCourse.id, activeStep.id) && (
                    <span className="text-xs text-emerald-400 flex items-center gap-1">
                      <CheckCircle className="w-3 h-3" /> Completed
                    </span>
                  )}
                </div>

                {activeStep.type === 'lesson' && (
                  <>
                    <div className="prose prose-sm prose-invert max-w-none">
                      <p className="text-sm text-muted-foreground whitespace-pre-wrap">{activeStep.content}</p>
                    </div>
                    {!isStepCompleted(activeCourse.id, activeStep.id) && (
                      <Button
                        className="mt-6 bg-emerald-500 hover:bg-emerald-400 text-black"
                        onClick={() => completeStep(activeCourse.id, activeStep.id)}
                      >
                        <CheckCircle className="w-4 h-4 mr-2" /> Mark as Complete
                      </Button>
                    )}
                  </>
                )}

                {activeStep.type === 'test' && (
                  <>
                    <div className="p-4 rounded-lg bg-red-500/5 border border-red-500/20 mb-4">
                      <div className="flex items-center gap-2 mb-1">
                        <AlertTriangle className="w-4 h-4 text-red-400" />
                        <p className="text-sm font-medium text-red-400">Locked Test</p>
                      </div>
                      <p className="text-xs text-red-400/70">This test will lock your screen. You cannot leave or switch tabs until you submit.</p>
                    </div>
                    <p className="text-sm text-muted-foreground mb-4">{activeStep.content}</p>
                    {isStepCompleted(activeCourse.id, activeStep.id) ? (
                      <p className="text-emerald-400 text-sm flex items-center gap-1"><CheckCircle className="w-4 h-4" /> Test completed</p>
                    ) : (
                      <Button
                        className="bg-red-500 hover:bg-red-400 text-white"
                        onClick={() => { setTestMode(true); setAnswers({}); setTestSubmitted(false); }}
                      >
                        <Lock className="w-4 h-4 mr-2" /> Start Locked Test
                      </Button>
                    )}
                  </>
                )}

                <div className="flex justify-between mt-6 pt-4 border-t border-white/5">
                  <Button
                    variant="ghost" disabled={activeStepIdx === 0}
                    onClick={() => setActiveStepIdx(prev => prev - 1)}
                  >Previous</Button>
                  <Button
                    variant="ghost" disabled={activeStepIdx === steps.length - 1}
                    onClick={() => setActiveStepIdx(prev => prev + 1)}
                  >
                    Next <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Course list
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Courses</h1>
      {courses.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          <BookOpen className="w-10 h-10 mx-auto mb-3 opacity-30" />
          <p>No courses available yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {courses.map((c, i) => {
            const prog = getProgress(c.id);
            const total = c.steps?.length || 0;
            const done = prog?.completed_steps?.length || 0;
            const pct = total > 0 ? Math.round((done / total) * 100) : 0;

            return (
              <motion.div
                key={c.id}
                initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                onClick={() => setActiveCourse(c)}
                className="p-5 rounded-xl border border-white/5 bg-card hover:border-white/10 transition-colors cursor-pointer group"
              >
                <div className="flex items-start justify-between mb-3">
                  <span className="text-xs font-mono px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400">{c.category}</span>
                  <Play className="w-4 h-4 text-muted-foreground group-hover:text-cyan-400 transition-colors" />
                </div>
                <h3 className="font-bold text-lg mb-1">{c.title}</h3>
                <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{c.description}</p>
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }} animate={{ width: `${pct}%` }}
                      className="h-full bg-cyan-500 rounded-full"
                    />
                  </div>
                  <span className="text-xs text-muted-foreground">{pct}%</span>
                </div>
                <p className="text-xs text-muted-foreground mt-2">by {c.mentor_name || 'Mentor'} · {total} steps</p>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}