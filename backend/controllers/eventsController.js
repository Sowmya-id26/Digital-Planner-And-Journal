import { supabase } from '../config/supabase.js';
import { getUserId } from '../utils/userId.js';

export const getEvents = async (req, res, next) => {
  try {
    const userId = getUserId(req);
    const { start, end } = req.query;
    let query = supabase.from('events').select('*').eq('user_id', userId).order('start_time');
    if (start) query = query.gte('start_time', start);
    if (end) query = query.lte('end_time', end);
    const { data, error } = await query;
    if (error) throw error;
    res.json(data || []);
  } catch (err) {
    next(err);
  }
};

export const createEvent = async (req, res, next) => {
  try {
    const userId = getUserId(req);
    const { title, start_time, end_time, description, color } = req.body;
    const { data, error } = await supabase
      .from('events')
      .insert({ user_id: userId, title, start_time, end_time, description, color })
      .select()
      .single();
    if (error) throw error;
    res.status(201).json(data);
  } catch (err) {
    next(err);
  }
};

export const updateEvent = async (req, res, next) => {
  try {
    const userId = getUserId(req);
    const { id } = req.params;
    const { title, start_time, end_time, description, color } = req.body;
    const { data, error } = await supabase
      .from('events')
      .update({ title, start_time, end_time, description, color, updated_at: new Date().toISOString() })
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

export const deleteEvent = async (req, res, next) => {
  try {
    const userId = getUserId(req);
    const { id } = req.params;
    const { error } = await supabase.from('events').delete().eq('id', id).eq('user_id', userId);
    if (error) throw error;
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};
