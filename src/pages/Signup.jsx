import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { useAppAuth } from '@/lib/appAuth.jsx';
import { base44 } from '@/api/base44Client';
import { GraduationCap, Users, ArrowRight, ArrowLeft, Upload, AlertTriangle } from 'lucide-react';
import { Link } from 'react-router-dom';

const EDUCATOR_KEY = 'CYBERSYNTAX2025';

const interestOptions = ['CyberSecurity', 'BioTech', 'Finance', 'Data Science'];

export default function Signup() {
  const urlParams = new URLSearchParams(window.location.search);
  const initialRole = urlParams.get('role') === 'mentor' ? 'mentor' : null;

  const [step, setStep] = useState(initialRole ? 1 : 0);
  const [role, setRole] = useState(initialRole || 'student');
  const [formData, setFormData] = useState({
    full_name: '', email: '', passcode: '', confirm_passcode: '',
    educator_key: '', bio: '', address: '', phone_number: '', grade: '', school_name: '', how_heard: '', fit_explanation: '', interests: [], experience_level: 'beginner', goals: '', linkedin_url: '', github_url: '',
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
      interests: prev.interests.includes(interest) ? [] : [interest],
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
    ];

    if (requiredFields.some(value => !value) || formData.interests.length === 0) {
      return 'Please fill in every required field and select one primary track.';
    }

    return '';
  };

  const handleSubmit = async () => {
    setError('');
    if (formData.passcode !== formData.confirm_passcode) {
      setError('Passcodes do not match');
      return;
    }
    if (role === 'mentor' && formData.educator_key !== EDUCATOR_KEY) {
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
        experience_level: formData.experience_level,
        goals: formData.goals.trim(),
        linkedin_url: formData.linkedin_url.trim(),
        github_url: formData.github_url.trim(),
        resume_url,
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
                    if (role === 'mentor' && formData.educator_key !== EDUCATOR_KEY) { setError('Invalid educator key'); return; }
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
                <h2 className="text-2xl font-bold mb-1">Complete Your Application</h2>
                <p className="text-muted-foreground mb-4 text-sm">Tell us about yourself so mentors can review your profile.</p>

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
                    <Label className="mb-2 block">Primary Track / Topic</Label>
                    <p className="text-xs text-muted-foreground mb-2">Choose one track for your capstone focus.</p>
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