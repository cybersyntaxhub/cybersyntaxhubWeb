import { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useAppAuth } from '@/lib/appAuth.jsx';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { Megaphone, Plus, Trash2, Image, X } from 'lucide-react';
import moment from 'moment';

export default function MentorAnnouncements() {
  const { currentUser } = useAppAuth();
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [posting, setPosting] = useState(false);
  const { toast } = useToast();

  useEffect(() => { load(); }, []);

  const load = async () => {
    const data = await base44.entities.Announcement.list('-created_date', 50);
    setAnnouncements(data);
    setLoading(false);
  };

  const handlePost = async () => {
    setPosting(true);
    let image_url = '';
    if (imageFile) {
      const result = await base44.integrations.Core.UploadFile({ file: imageFile });
      image_url = result.file_url;
    }
    await base44.entities.Announcement.create({
      title, content, image_url,
      mentor_id: currentUser.id,
      mentor_name: currentUser.full_name,
    });
    toast({ title: 'Announcement posted!' });
    setTitle(''); setContent(''); setImageFile(null); setShowForm(false);
    setPosting(false);
    load();
  };

  const handleDelete = async (id) => {
    await base44.entities.Announcement.delete(id);
    toast({ title: 'Announcement deleted' });
    load();
  };

  if (loading) return <div className="flex justify-center py-12"><div className="w-5 h-5 border-2 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin" /></div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Announcements</h1>
        <Button onClick={() => setShowForm(!showForm)} className="bg-cyan-500 hover:bg-cyan-400 text-black text-sm">
          <Plus className="w-4 h-4 mr-1" /> New
        </Button>
      </div>

      {showForm && (
        <motion.div
          initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
          className="p-5 rounded-xl border border-white/5 bg-card mb-6 space-y-4"
        >
          <div>
            <Label>Title</Label>
            <Input value={title} onChange={e => setTitle(e.target.value)} placeholder="Announcement title" className="mt-1 bg-background border-white/10" />
          </div>
          <div>
            <Label>Content</Label>
            <Textarea value={content} onChange={e => setContent(e.target.value)} placeholder="Write your announcement..." className="mt-1 bg-background border-white/10 min-h-[100px]" />
          </div>
          <div>
            <Label>Image / Screenshot (optional)</Label>
            <div className="mt-1 flex items-center gap-3">
              <input type="file" accept="image/*" onChange={e => setImageFile(e.target.files[0])} className="text-sm text-muted-foreground" />
              {imageFile && <button onClick={() => setImageFile(null)} className="text-xs text-red-400"><X className="w-3 h-3" /></button>}
            </div>
          </div>
          <div className="flex gap-2">
            <Button onClick={handlePost} disabled={posting || !title.trim() || !content.trim()} className="bg-cyan-500 hover:bg-cyan-400 text-black text-sm">
              {posting ? 'Posting...' : 'Post Announcement'}
            </Button>
            <Button variant="ghost" onClick={() => setShowForm(false)} className="text-sm">Cancel</Button>
          </div>
        </motion.div>
      )}

      {announcements.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          <Megaphone className="w-10 h-10 mx-auto mb-3 opacity-30" />
          <p>No announcements yet. Create one!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {announcements.map((a, i) => (
            <motion.div key={a.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="p-5 rounded-xl border border-white/5 bg-card">
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-bold text-lg">{a.title}</h3>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">{moment(a.created_date).fromNow()}</span>
                  {a.mentor_id === currentUser.id && (
                    <button onClick={() => handleDelete(a.id)} className="text-muted-foreground hover:text-red-400">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
              <p className="text-sm text-muted-foreground whitespace-pre-wrap">{a.content}</p>
              {a.image_url && <img src={a.image_url} alt="" className="mt-4 rounded-lg max-w-full max-h-80 object-cover" />}
              <p className="text-xs text-muted-foreground mt-3">— {a.mentor_name || 'Mentor'}</p>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}