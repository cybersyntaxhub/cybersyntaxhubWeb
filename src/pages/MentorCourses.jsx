import { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useAppAuth } from '@/lib/appAuth.jsx';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { BookOpen, Plus, Trash2, GripVertical, Eye, EyeOff, ArrowLeft, PlusCircle, FileText, ClipboardList } from 'lucide-react';

function generateId() {
  return Math.random().toString(36).substring(2, 10);
}

export default function MentorCourses() {
  const { currentUser } = useAppAuth();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingCourse, setEditingCourse] = useState(null);
  const [showCreate, setShowCreate] = useState(false);
  const { toast } = useToast();

  useEffect(() => { load(); }, []);

  const load = async () => {
    const data = await base44.entities.Course.filter({ mentor_id: currentUser.id }, '-created_date');
    setCourses(data);
    setLoading(false);
  };

  if (loading) return <div className="flex justify-center py-12"><div className="w-5 h-5 border-2 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin" /></div>;

  if (editingCourse || showCreate) {
    return <CourseEditor
      course={editingCourse}
      mentorId={currentUser.id}
      mentorName={currentUser.full_name}
      onSave={() => { setEditingCourse(null); setShowCreate(false); load(); }}
      onCancel={() => { setEditingCourse(null); setShowCreate(false); }}
    />;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Courses</h1>
        <Button onClick={() => setShowCreate(true)} className="bg-cyan-500 hover:bg-cyan-400 text-black text-sm">
          <Plus className="w-4 h-4 mr-1" /> Create Course
        </Button>
      </div>

      {courses.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          <BookOpen className="w-10 h-10 mx-auto mb-3 opacity-30" />
          <p>No courses yet. Create your first one!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {courses.map((c, i) => (
            <motion.div key={c.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              className="p-4 rounded-xl border border-white/5 bg-card flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold">{c.title}</h3>
                  <span className={`px-2 py-0.5 rounded-full text-xs ${c.published ? 'bg-emerald-500/10 text-emerald-400' : 'bg-yellow-500/10 text-yellow-400'}`}>
                    {c.published ? 'Published' : 'Draft'}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">{c.category} · {c.steps?.length || 0} steps</p>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" onClick={() => setEditingCourse(c)} className="text-xs">Edit</Button>
                <Button variant="ghost" size="sm" onClick={async () => {
                  await base44.entities.Course.update(c.id, { published: !c.published });
                  toast({ title: c.published ? 'Course unpublished' : 'Course published!' });
                  load();
                }} className="text-xs">
                  {c.published ? <EyeOff className="w-3 h-3 mr-1" /> : <Eye className="w-3 h-3 mr-1" />}
                  {c.published ? 'Unpublish' : 'Publish'}
                </Button>
                <Button variant="ghost" size="sm" onClick={async () => {
                  await base44.entities.Course.delete(c.id);
                  toast({ title: 'Course deleted' });
                  load();
                }} className="text-xs text-red-400 hover:text-red-300">
                  <Trash2 className="w-3 h-3" />
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

function CourseEditor({ course, mentorId, mentorName, onSave, onCancel }) {
  const [title, setTitle] = useState(course?.title || '');
  const [description, setDescription] = useState(course?.description || '');
  const [category, setCategory] = useState(course?.category || 'CyberSecurity');
  const [steps, setSteps] = useState(course?.steps || []);
  const [saving, setSaving] = useState(false);
  const [editingStep, setEditingStep] = useState(null);
  const { toast } = useToast();

  const addStep = (type) => {
    const newStep = {
      id: generateId(),
      title: '',
      content: '',
      type,
      test_questions: type === 'test' ? [] : undefined,
    };
    setSteps(prev => [...prev, newStep]);
    setEditingStep(newStep.id);
  };

  const updateStep = (stepId, data) => {
    setSteps(prev => prev.map(s => s.id === stepId ? { ...s, ...data } : s));
  };

  const removeStep = (stepId) => {
    setSteps(prev => prev.filter(s => s.id !== stepId));
    if (editingStep === stepId) setEditingStep(null);
  };

  const handleSave = async () => {
    setSaving(true);
    const data = { title, description, category, steps, mentor_id: mentorId, mentor_name: mentorName };
    if (course?.id) {
      await base44.entities.Course.update(course.id, data);
      toast({ title: 'Course updated!' });
    } else {
      await base44.entities.Course.create(data);
      toast({ title: 'Course created!' });
    }
    setSaving(false);
    onSave();
  };

  return (
    <div>
      <button onClick={onCancel} className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-4">
        <ArrowLeft className="w-4 h-4" /> Back to Courses
      </button>
      <h1 className="text-2xl font-bold mb-6">{course ? 'Edit Course' : 'Create Course'}</h1>

      <div className="space-y-4 mb-8">
        <div>
          <Label>Title</Label>
          <Input value={title} onChange={e => setTitle(e.target.value)} placeholder="Course title" className="mt-1 bg-background border-white/10" />
        </div>
        <div>
          <Label>Description</Label>
          <Textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Course description" className="mt-1 bg-background border-white/10 min-h-[80px]" />
        </div>
        <div>
          <Label>Category</Label>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="mt-1 bg-background border-white/10"><SelectValue /></SelectTrigger>
            <SelectContent>
              {['CyberSecurity', 'BioTech', 'Finance', 'Data Science'].map(c => (
                <SelectItem key={c} value={c}>{c}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-bold">Steps ({steps.length})</h2>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => addStep('lesson')} className="text-xs border-white/10">
            <FileText className="w-3 h-3 mr-1" /> Add Lesson
          </Button>
          <Button variant="outline" size="sm" onClick={() => addStep('test')} className="text-xs border-white/10">
            <ClipboardList className="w-3 h-3 mr-1" /> Add Test
          </Button>
        </div>
      </div>

      <div className="space-y-3 mb-8">
        {steps.map((step, idx) => (
          <div key={step.id} className="rounded-xl border border-white/5 bg-card overflow-hidden">
            <div
              className="p-3 flex items-center justify-between cursor-pointer hover:bg-white/[0.02]"
              onClick={() => setEditingStep(editingStep === step.id ? null : step.id)}
            >
              <div className="flex items-center gap-3">
                <span className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-xs">{idx + 1}</span>
                <div>
                  <p className="text-sm font-medium">{step.title || 'Untitled Step'}</p>
                  <p className="text-xs text-muted-foreground capitalize">{step.type}</p>
                </div>
              </div>
              <button onClick={(e) => { e.stopPropagation(); removeStep(step.id); }} className="text-muted-foreground hover:text-red-400">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            {editingStep === step.id && (
              <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} className="px-3 pb-3 border-t border-white/5 pt-3 space-y-3">
                <div>
                  <Label className="text-xs">Step Title</Label>
                  <Input value={step.title} onChange={e => updateStep(step.id, { title: e.target.value })} placeholder="Step title" className="mt-1 bg-background border-white/10 text-sm" />
                </div>
                <div>
                  <Label className="text-xs">Content</Label>
                  <Textarea value={step.content} onChange={e => updateStep(step.id, { content: e.target.value })} placeholder="Step content..." className="mt-1 bg-background border-white/10 text-sm min-h-[80px]" />
                </div>

                {step.type === 'test' && (
                  <TestQuestionsEditor
                    questions={step.test_questions || []}
                    onChange={(q) => updateStep(step.id, { test_questions: q })}
                  />
                )}
              </motion.div>
            )}
          </div>
        ))}

        {steps.length === 0 && (
          <p className="text-center text-muted-foreground text-sm py-8">Add lessons and tests to build your course.</p>
        )}
      </div>

      <div className="flex gap-2">
        <Button onClick={handleSave} disabled={saving || !title || !description} className="bg-cyan-500 hover:bg-cyan-400 text-black">
          {saving ? 'Saving...' : course ? 'Save Changes' : 'Create Course'}
        </Button>
        <Button variant="ghost" onClick={onCancel}>Cancel</Button>
      </div>
    </div>
  );
}

function TestQuestionsEditor({ questions, onChange }) {
  const addQuestion = () => {
    onChange([...questions, { question: '', options: ['', '', '', ''], correct_index: 0 }]);
  };

  const updateQuestion = (idx, data) => {
    const updated = [...questions];
    updated[idx] = { ...updated[idx], ...data };
    onChange(updated);
  };

  const updateOption = (qIdx, oIdx, value) => {
    const updated = [...questions];
    const opts = [...updated[qIdx].options];
    opts[oIdx] = value;
    updated[qIdx] = { ...updated[qIdx], options: opts };
    onChange(updated);
  };

  const removeQuestion = (idx) => {
    onChange(questions.filter((_, i) => i !== idx));
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <Label className="text-xs">Test Questions</Label>
        <Button variant="ghost" size="sm" onClick={addQuestion} className="text-xs text-cyan-400">
          <PlusCircle className="w-3 h-3 mr-1" /> Add Question
        </Button>
      </div>

      <div className="space-y-4">
        {questions.map((q, qi) => (
          <div key={qi} className="p-3 rounded-lg bg-background border border-white/5">
            <div className="flex items-start justify-between mb-2">
              <Label className="text-xs">Question {qi + 1}</Label>
              <button onClick={() => removeQuestion(qi)} className="text-muted-foreground hover:text-red-400"><Trash2 className="w-3 h-3" /></button>
            </div>
            <Input value={q.question} onChange={e => updateQuestion(qi, { question: e.target.value })} placeholder="Question text..." className="mb-2 bg-card border-white/10 text-sm" />
            <div className="space-y-1.5">
              {q.options.map((opt, oi) => (
                <div key={oi} className="flex items-center gap-2">
                  <button
                    onClick={() => updateQuestion(qi, { correct_index: oi })}
                    className={`w-5 h-5 rounded-full border flex-shrink-0 flex items-center justify-center ${
                      q.correct_index === oi ? 'border-emerald-500 bg-emerald-500' : 'border-white/20'
                    }`}
                  >
                    {q.correct_index === oi && <div className="w-2 h-2 bg-black rounded-full" />}
                  </button>
                  <Input value={opt} onChange={e => updateOption(qi, oi, e.target.value)} placeholder={`Option ${oi + 1}`} className="bg-card border-white/10 text-xs" />
                </div>
              ))}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Click the circle to mark the correct answer</p>
          </div>
        ))}
      </div>
    </div>
  );
}