import { supabase } from '../config/supabase.js';
import { getUserId } from '../utils/userId.js';

export const getReminders = async (req, res, next) => {
  try {
    const userId = getUserId(req);
    const { type } = req.query;
    let query = supabase.from('reminders').select('*').eq('user_id', userId).order('remind_at');
    if (type) query = query.eq('type', type);
    const { data, error } = await query;
    if (error) throw error;
    res.json(data || []);
  } catch (err) {
    next(err);
  }
};

export const createReminder = async (req, res, next) => {
  try {
    const userId = getUserId(req);
    const { title, remind_at, type, task_id, event_id, channel } = req.body;
    const { data, error } = await supabase
      .from('reminders')
      .insert({ user_id: userId, title, remind_at, type: type || 'task', task_id, event_id, channel: channel || 'push' })
      .select()
      .single();
    if (error) throw error;
    res.status(201).json(data);
  } catch (err) {
    next(err);
  }
};

export const updateReminder = async (req, res, next) => {
  try {
    const userId = getUserId(req);
    const { id } = req.params;
    const body = { ...req.body, updated_at: new Date().toISOString() };
    const { data, error } = await supabase
      .from('reminders')
      .update(body)
      .eq('id', id)
      .eq('user_id', userId)
      .select()
      .single();
    if (error) throw error;
    res.json(data);
  } catch (err) {
    next(err);
  }
};

export const deleteReminder = async (req, res, next) => {
  try {
    const userId = getUserId(req);
    const { id } = req.params;
    const { error } = await supabase.from('reminders').delete().eq('id', id).eq('user_id', userId);
    if (error) throw error;
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};
