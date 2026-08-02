import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { useAppAuth } from '@/lib/appAuth.jsx';
import { currentCohort } from '@/lib/cohort';
import { base44 } from '@/api/base44Client';
import { GraduationCap, Users, ArrowRight, ArrowLeft, Upload, AlertTriangle } from 'lucide-react';
import { Link } from 'react-router-dom';

const interestOptions = ['CyberSecurity', 'BioTech', 'Finance', 'Data Science'];

const preferredTrackOptions = [
  { label: 'Course', value: 'course' },
  { label: 'Research', value: 'research' },
  { label: 'Capstone Mentorship', value: 'capstone' },
];

// The educator key is checked on the server so it's never readable in the
// browser bundle. See POST /api/validate-educator-key in server.js.
const validateEducatorKey = async (key) => {
  try {
    const res = await fetch('/api/validate-educator-key', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ key }),
    });
    if (!res.ok) return false;
    const data = await res.json();
    return !!data.valid;
  } catch (e) {
    return false;
  }
};

// Map Google Form interest strings to our internal values
const mapInterest = (raw) => {
  if (!raw) return [];
  const str = typeof raw === 'string' ? raw : String(raw);
  const mapped = [];
  if (/cyber/i.test(str)) mapped.push('CyberSecurity');
  if (/bio/i.test(str)) mapped.push('BioTech');
  if (/finance/i.test(str)) mapped.push('Finance');
  if (/data/i.test(str)) mapped.push('Data Science');
  return mapped;
};

export default function Signup() {
  const urlParams = new URLSearchParams(window.location.search);
  const initialRole = urlParams.get('role') === 'mentor' ? 'mentor' : null;

  const [step, setStep] = useState(initialRole ? 1 : 0);
  const [role, setRole] = useState(initialRole || 'student');
  const [formData, setFormData] = useState({
    full_name: '', email: '', passcode: '', confirm_passcode: '',
    educator_key: '', bio: '', address: '', phone_number: '', grade: '', school_name: '', how_heard: '', fit_explanation: '', interests: [], preferred_track: '', excitement: '', fundamental_course: '', external_experience: '', consider_regular: '', experience_level: 'beginner', goals: '', linkedin_url: '', github_url: '',
  });
  const [resumeFile, setResumeFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { signup, currentUser, loading: authLoading } = useAppAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (!authLoading && currentUser) {
      navigate(currentUser.role === 'mentor' ? '/mentor' : '/student');
    }
  }, [authLoading, currentUser, navigate]);

  const update = (field, value) => setFormData(prev => ({ ...prev, [field]: value }));

  const toggleInterest = (interest) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest],
    }));
  };

  const validateStudentApplication = () => {
    const requiredFields = [
      formData.bio.trim(),
      formData.address.trim(),
      formData.phone_number.trim(),
      formData.grade.trim(),
      formData.school_name.trim(),
      formData.how_heard.trim(),
      formData.fit_explanation.trim(),
      formData.goals.trim(),
      formData.preferred_track.trim(),
      formData.excitement.trim(),
    ];

    if (requiredFields.some(value => !value) || formData.interests.length === 0) {
      return 'Please fill in every required field, choose what excites you most, and select your preferred track.';
    }

    if (formData.preferred_track === 'capstone') {
      const capstoneFields = [
        formData.fundamental_course.trim(),
        formData.external_experience.trim(),
        formData.consider_regular.trim(),
      ];
      if (capstoneFields.some(value => !value)) {
        return 'For capstone mentorship, please answer all capstone-specific questions.';
      }
    }

    return '';
  };

  const handleSubmit = async () => {
    setError('');
    if (formData.passcode !== formData.confirm_passcode) {
      setError('Passcodes do not match');
      return;
    }
    if (role === 'mentor' && !(await validateEducatorKey(formData.educator_key))) {
      setError('Invalid educator key');
      return;
    }

    if (role === 'student') {
      const studentError = validateStudentApplication();
      if (studentError) {
        setError(studentError);
        return;
      }
    }

    setLoading(true);
    try {
      let resume_url = '';
      if (resumeFile) {
        const result = await base44.integrations.Core.UploadFile({ file: resumeFile });
        resume_url = result.file_url;
      }

      const userData = {
        full_name: formData.full_name.trim(),
        email: formData.email.trim(),
        passcode: formData.passcode,
        role,
        status: role === 'mentor' ? 'accepted' : 'pending',
        bio: formData.bio.trim(),
        address: formData.address.trim(),
        phone_number: formData.phone_number.trim(),
        grade: formData.grade.trim(),
        school_name: formData.school_name.trim(),
        how_heard: formData.how_heard.trim(),
        fit_explanation: formData.fit_explanation.trim(),
        interests: formData.interests,
        preferred_track: formData.preferred_track,
        excitement: formData.excitement.trim(),
        fundamental_course: formData.fundamental_course.trim(),
        external_experience: formData.external_experience.trim(),
        consider_regular: formData.consider_regular,
        experience_level: formData.experience_level,
        goals: formData.goals.trim(),
        linkedin_url: formData.linkedin_url.trim(),
        github_url: formData.github_url.trim(),
        resume_url,
        applied_cohort: role === 'student' ? currentCohort : undefined,
        next_cohort_eligible: false,
      };

      await signup(userData);
      toast({ title: role === 'mentor' ? 'Welcome, Mentor!' : 'Application Submitted!', description: role === 'mentor' ? 'Redirecting to your dashboard...' : 'A mentor will review your application soon.' });
      navigate(role === 'mentor' ? '/mentor' : '/student');
    } catch (err) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const slideVariants = {
    enter: { x: 50, opacity: 0 },
    center: { x: 0, opacity: 1 },
    exit: { x: -50, opacity: 0 },
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-lg"
      >
        <Link to="/" className="flex items-center gap-2 mb-8 justify-center">
          <img src="/logo.png" alt="Logo" className="w-8 h-8 object-contain" />
          <span className="text-lg font-bold">CyberSyntax<span className="text-cyan-400">Hub</span></span>
        </Link>

        <div className="rounded-2xl border border-white/10 bg-card p-8">
          <AnimatePresence mode="wait">
            {step === 0 && (
              <motion.div key="role" variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.3 }}>
                <h2 className="text-2xl font-bold mb-2 text-center">Join CyberSyntax Hub</h2>
                <p className="text-muted-foreground text-center mb-8">Choose your account type</p>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => { setRole('student'); setStep(1); }}
                    className="group p-6 rounded-xl border border-white/10 hover:border-cyan-500/40 transition-all text-left hover:bg-cyan-500/5"
                  >
                    <GraduationCap className="w-8 h-8 text-cyan-400 mb-3" />
                    <div className="font-bold">Student</div>
                    <div className="text-xs text-muted-foreground mt-1">Apply for mentorship</div>
                  </button>
                  <button
                    onClick={() => { setRole('mentor'); setStep(1); }}
                    className="group p-6 rounded-xl border border-white/10 hover:border-purple-500/40 transition-all text-left hover:bg-purple-500/5"
                  >
                    <Users className="w-8 h-8 text-purple-400 mb-3" />
                    <div className="font-bold">Mentor</div>
                    <div className="text-xs text-muted-foreground mt-1">Requires educator key</div>
                  </button>
                </div>
              </motion.div>
            )}

            {step === 1 && (
              <motion.div key="account" variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.3 }}>
                <button onClick={() => setStep(0)} className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1 mb-4">
                  <ArrowLeft className="w-4 h-4" /> Back
                </button>
                <h2 className="text-2xl font-bold mb-1">Create your account</h2>
                <p className="text-muted-foreground mb-6 text-sm">
                  {role === 'student' ? 'Student Account' : 'Mentor Account'}
                </p>

                <div className="space-y-4">
                  <div>
                    <Label>Full Name</Label>
                    <Input value={formData.full_name} onChange={e => update('full_name', e.target.value)} placeholder="Your full name" className="mt-1 bg-background border-white/10" />
                  </div>
                  <div>
                    <Label>Email</Label>
                    <Input type="email" value={formData.email} onChange={e => update('email', e.target.value)} placeholder="you@email.com" className="mt-1 bg-background border-white/10" />
                  </div>
                  <div>
                    <Label>Passcode</Label>
                    <Input type="password" value={formData.passcode} onChange={e => update('passcode', e.target.value)} placeholder="Create a passcode" className="mt-1 bg-background border-white/10" />
                    <div className="flex items-start gap-2 mt-2 p-2 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
                      <AlertTriangle className="w-4 h-4 text-yellow-500 flex-shrink-0 mt-0.5" />
                      <p className="text-xs text-yellow-500/90">Do NOT use your real password. Create a unique passcode for this platform only.</p>
                    </div>
                  </div>
                  <div>
                    <Label>Confirm Passcode</Label>
                    <Input type="password" value={formData.confirm_passcode} onChange={e => update('confirm_passcode', e.target.value)} placeholder="Confirm passcode" className="mt-1 bg-background border-white/10" />
                  </div>
                  {role === 'mentor' && (
                    <div>
                      <Label>Educator Key</Label>
                      <Input type="password" value={formData.educator_key} onChange={e => update('educator_key', e.target.value)} placeholder="Enter your educator key" className="mt-1 bg-background border-white/10" />
                    </div>
                  )}
                </div>

                {error && <p className="text-red-400 text-sm mt-3">{error}</p>}

                <Button
                  className="w-full mt-6 bg-cyan-500 hover:bg-cyan-400 text-black font-semibold"
                  disabled={!formData.full_name.trim() || !formData.email.trim() || !formData.passcode || !formData.confirm_passcode}
                  onClick={async () => {
                    setError('');
                    if (formData.passcode !== formData.confirm_passcode) { setError('Passcodes do not match'); return; }
                    if (role === 'mentor' && !(await validateEducatorKey(formData.educator_key))) { setError('Invalid educator key'); return; }
                    if (role === 'mentor') { handleSubmit(); } else { setStep(2); }
                  }}
                >
                  {role === 'mentor' ? 'Create Mentor Account' : 'Next: Complete Profile'}
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </motion.div>
            )}

            {step === 2 && role === 'student' && (
              <motion.div key="profile" variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.3 }}>
                <button onClick={() => setStep(1)} className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1 mb-4">
                  <ArrowLeft className="w-4 h-4" /> Back
                </button>
                <h2 className="text-2xl font-bold mb-1">Complete Your {currentCohort} Application</h2>
                <p className="text-muted-foreground mb-4 text-sm">Tell us about yourself so mentors can review your application for {currentCohort}.</p>

                <div className="space-y-4">
                  <div className="grid grid-cols-1 gap-3">
                    <div>
                      <Label>Address</Label>
                      <Input value={formData.address} onChange={e => update('address', e.target.value)} placeholder="Street, city, state" className="mt-1 bg-background border-white/10" />
                    </div>
                    <div>
                      <Label>Phone Number</Label>
                      <Input value={formData.phone_number} onChange={e => update('phone_number', e.target.value)} placeholder="(555) 123-4567" className="mt-1 bg-background border-white/10" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label>Grade Level</Label>
                      <Input value={formData.grade} onChange={e => update('grade', e.target.value)} placeholder="e.g. 11th grade" className="mt-1 bg-background border-white/10" />
                    </div>
                    <div>
                      <Label>School / Institution</Label>
                      <Input value={formData.school_name} onChange={e => update('school_name', e.target.value)} placeholder="School or program name" className="mt-1 bg-background border-white/10" />
                    </div>
                  </div>

                  <div>
                    <Label>How did you hear about CyberSyntaxHub?</Label>
                    <Input value={formData.how_heard} onChange={e => update('how_heard', e.target.value)} placeholder="Friend, school, social media, event..." className="mt-1 bg-background border-white/10" />
                  </div>

                  <div>
                    <Label>Short Bio</Label>
                    <Textarea value={formData.bio} onChange={e => update('bio', e.target.value)} placeholder="A brief intro about yourself..." className="mt-1 bg-background border-white/10 min-h-[80px]" />
                  </div>

                  <div>
                    <Label>Why do you want to join CyberSyntaxHub?</Label>
                    <Textarea value={formData.fit_explanation} onChange={e => update('fit_explanation', e.target.value)} placeholder="Share why this program fits your goals and what you hope to contribute." className="mt-1 bg-background border-white/10 min-h-[80px]" />
                  </div>

                  <div>
                    <Label className="mb-2 block">Preferred Track</Label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      {preferredTrackOptions.map(option => (
                        <button
                          key={option.value}
                          onClick={() => update('preferred_track', option.value)}
                          className={`px-3 py-3 rounded-lg border text-sm text-left transition-all ${
                            formData.preferred_track === option.value
                              ? 'border-cyan-500 bg-cyan-500/10 text-cyan-400'
                              : 'border-white/10 text-muted-foreground hover:border-white/20'
                          }`}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label className="mb-2 block">What excites you most?</Label>
                    <div className="grid grid-cols-2 gap-2">
                      {interestOptions.map(opt => (
                        <button
                          key={opt}
                          onClick={() => toggleInterest(opt)}
                          className={`px-3 py-2 rounded-lg border text-sm text-left transition-all ${
                            formData.interests.includes(opt)
                              ? 'border-cyan-500 bg-cyan-500/10 text-cyan-400'
                              : 'border-white/10 text-muted-foreground hover:border-white/20'
                          }`}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>

                  {formData.preferred_track === 'capstone' && (
                    <div className="space-y-4 rounded-2xl border border-white/10 bg-white/5 p-4">
                      <div className="text-sm font-semibold text-cyan-200">Capstone Mentorship Questions</div>
                      <div>
                        <Label>Which fundamental course did you complete and are looking for capstone alignment with?</Label>
                        <Textarea value={formData.fundamental_course} onChange={e => update('fundamental_course', e.target.value)} placeholder="If none, write N/A" className="mt-1 bg-background border-white/10 min-h-[80px]" />
                      </div>
                      <div>
                        <Label>If you did not complete any courses, what external experience do you have for capstone mentorship?</Label>
                        <Textarea value={formData.external_experience} onChange={e => update('external_experience', e.target.value)} placeholder="If none, write N/A" className="mt-1 bg-background border-white/10 min-h-[80px]" />
                      </div>
                      <div>
                        <Label>Would you like to be considered for regular mentorship if this capstone application is not accepted?</Label>
                        <div className="flex gap-2 mt-2">
                          {['yes', 'no'].map(option => (
                            <button
                              key={option}
                              onClick={() => update('consider_regular', option)}
                              className={`flex-1 px-3 py-2 rounded-lg border text-sm capitalize transition-all ${
                                formData.consider_regular === option
                                  ? 'border-cyan-500 bg-cyan-500/10 text-cyan-400'
                                  : 'border-white/10 text-muted-foreground hover:border-white/20'
                              }`}
                            >
                              {option}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  <div>
                    <Label>Goals</Label>
                    <Textarea value={formData.goals} onChange={e => update('goals', e.target.value)} placeholder="What do you hope to achieve?" className="mt-1 bg-background border-white/10 min-h-[60px]" />
                  </div>

                  <div>
                    <Label>Experience Level</Label>
                    <div className="flex gap-2 mt-1">
                      {['beginner', 'intermediate', 'advanced'].map(lvl => (
                        <button
                          key={lvl}
                          onClick={() => update('experience_level', lvl)}
                          className={`flex-1 px-3 py-2 rounded-lg border text-sm capitalize transition-all ${
                            formData.experience_level === lvl
                              ? 'border-cyan-500 bg-cyan-500/10 text-cyan-400'
                              : 'border-white/10 text-muted-foreground hover:border-white/20'
                          }`}
                        >
                          {lvl}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label>Resume (optional, recommended)</Label>
                    <div className="mt-1 border border-dashed border-white/10 rounded-lg p-4 text-center">
                      <input
                        type="file"
                        accept=".pdf,.doc,.docx"
                        onChange={e => setResumeFile(e.target.files[0])}
                        className="hidden"
                        id="resume-upload"
                      />
                      <label htmlFor="resume-upload" className="cursor-pointer flex flex-col items-center gap-2">
                        <Upload className="w-6 h-6 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">
                          {resumeFile ? resumeFile.name : 'Click to upload PDF or DOC'}
                        </span>
                      </label>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label>LinkedIn (optional)</Label>
                      <Input value={formData.linkedin_url} onChange={e => update('linkedin_url', e.target.value)} placeholder="linkedin.com/in/..." className="mt-1 bg-background border-white/10" />
                    </div>
                    <div>
                      <Label>GitHub (optional)</Label>
                      <Input value={formData.github_url} onChange={e => update('github_url', e.target.value)} placeholder="github.com/..." className="mt-1 bg-background border-white/10" />
                    </div>
                  </div>
                </div>

                {error && <p className="text-red-400 text-sm mt-3">{error}</p>}

                <Button
                  className="w-full mt-6 bg-cyan-500 hover:bg-cyan-400 text-black font-semibold"
                  disabled={loading}
                  onClick={handleSubmit}
                >
                  {loading ? 'Submitting...' : 'Submit Application'}
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <p className="text-center text-sm text-muted-foreground mt-4">
          Already have an account? <Link to="/signin" className="text-cyan-400 hover:underline">Sign in</Link>
        </p>
      </motion.div>
    </div>
  );
}