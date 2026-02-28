import { supabase } from '../config/supabase.js';
import { getUserId } from '../utils/userId.js';

export const getSettings = async (req, res, next) => {
  try {
    const userId = getUserId(req);
    const { data, error } = await supabase
      .from('user_settings')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();
    if (error) throw error;
    res.json(data || { theme: 'light', layout: [], accent_color: '#6366f1' });
  } catch (err) {
    next(err);
  }
};

export const updateSettings = async (req, res, next) => {
  try {
    const userId = getUserId(req);
    const { theme, layout, accent_color } = req.body;
    const { data: existing } = await supabase.from('user_settings').select('id').eq('user_id', userId).maybeSingle();
    const payload = { user_id: userId, theme, layout, accent_color, updated_at: new Date().toISOString() };
    if (existing) {
      const { data, error } = await supabase
        .from('user_settings')
        .update(payload)
        .eq('id', existing.id)
        .select()
        .single();
      if (error) throw error;
      return res.json(data);
    }
    const { data, error } = await supabase.from('user_settings').insert(payload).select().single();
    if (error) throw error;
    res.json(data);
  } catch (err) {
    next(err);
  }
};
