import { supabase } from '../config/supabase.js';
import { getUserId } from '../utils/userId.js';

export const getMoodLogs = async (req, res, next) => {
  try {
    const userId = getUserId(req);
    const { start_date, end_date } = req.query;
    let query = supabase.from('mood_logs').select('*').eq('user_id', userId).order('log_date', { ascending: false });
    if (start_date) query = query.gte('log_date', start_date);
    if (end_date) query = query.lte('log_date', end_date);
    const { data, error } = await query;
    if (error) throw error;
    res.json(data || []);
  } catch (err) {
    next(err);
  }
};

export const logMood = async (req, res, next) => {
  try {
    const userId = getUserId(req);
    const { log_date, mood, note } = req.body;
    const date = log_date || new Date().toISOString().split('T')[0];
    const { data: existing } = await supabase
      .from('mood_logs')
      .select('id')
      .eq('user_id', userId)
      .eq('log_date', date)
      .maybeSingle();
    if (existing) {
      const { data, error } = await supabase
        .from('mood_logs')
        .update({ mood, note, updated_at: new Date().toISOString() })
        .eq('id', existing.id)
        .select()
        .single();
      if (error) throw error;
      return res.json(data);
    }
    const { data, error } = await supabase
      .from('mood_logs')
      .insert({ user_id: userId, log_date: date, mood, note })
      .select()
      .single();
    if (error) throw error;
    res.status(201).json(data);
  } catch (err) {
    next(err);
  }
};

export const deleteMoodLog = async (req, res, next) => {
  try {
    const userId = getUserId(req);
    const { id } = req.params;
    const { error } = await supabase.from('mood_logs').delete().eq('id', id).eq('user_id', userId);
    if (error) throw error;
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};
