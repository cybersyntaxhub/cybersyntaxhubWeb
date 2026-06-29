import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAppAuth } from '@/lib/appAuth.jsx';
import { Zap, ArrowRight } from 'lucide-react';

export default function Signin() {
  const [email, setEmail] = useState('');
  const [passcode, setPasscode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAppAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const user = await login(email, passcode);
      navigate(user.role === 'mentor' ? '/mentor' : '/student');
    } catch (err) {
      setError(err.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <Link to="/" className="flex items-center gap-2 mb-8 justify-center">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-cyan-600 flex items-center justify-center">
            <Zap className="w-5 h-5 text-black" />
          </div>
          <span className="text-lg font-bold">CyberSyntax<span className="text-cyan-400">Hub</span></span>
        </Link>

        <div className="rounded-2xl border border-white/10 bg-card p-8">
          <h2 className="text-2xl font-bold mb-1 text-center">Welcome back</h2>
          <p className="text-muted-foreground text-center mb-6 text-sm">Sign in to your account</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label>Email</Label>
              <Input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@email.com" className="mt-1 bg-background border-white/10" required />
            </div>
            <div>
              <Label>Passcode</Label>
              <Input type="password" value={passcode} onChange={e => setPasscode(e.target.value)} placeholder="Your passcode" className="mt-1 bg-background border-white/10" required />
            </div>
            {error && <p className="text-red-400 text-sm">{error}</p>}
            <Button type="submit" className="w-full bg-cyan-500 hover:bg-cyan-400 text-black font-semibold" disabled={loading}>
              {loading ? 'Signing in...' : 'Sign In'}
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </form>
        </div>

        <p className="text-center text-sm text-muted-foreground mt-4">
          Don't have an account? <Link to="/signup" className="text-cyan-400 hover:underline">Sign up</Link>
        </p>
      </motion.div>
    </div>
  );
}