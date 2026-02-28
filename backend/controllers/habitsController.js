import { supabase } from '../config/supabase.js';
import { getUserId } from '../utils/userId.js';

export const getHabits = async (req, res, next) => {
  try {
    const userId = getUserId(req);
    const { data, error } = await supabase
      .from('habits')
      .select('*')
      .eq('user_id', userId)
      .order('order_index');
    if (error) throw error;
    res.json(data || []);
  } catch (err) {
    next(err);
  }
};

export const getHabitCompletions = async (req, res, next) => {
  try {
    const userId = getUserId(req);
    const { start_date, end_date } = req.query;
    let query = supabase.from('habit_completions').select('*').eq('user_id', userId);
    if (start_date) query = query.gte('completion_date', start_date);
    if (end_date) query = query.lte('completion_date', end_date);
    const { data, error } = await query;
    if (error) throw error;
    res.json(data || []);
  } catch (err) {
    next(err);
  }
};

export const createHabit = async (req, res, next) => {
  try {
    const userId = getUserId(req);
    const { name, icon, order_index } = req.body;
    const { data: maxOrder } = await supabase.from('habits').select('order_index').eq('user_id', userId).order('order_index', { ascending: false }).limit(1).single();
    const order = order_index ?? (maxOrder?.order_index ?? 0) + 1;
    const { data, error } = await supabase
      .from('habits')
      .insert({ user_id: userId, name, icon: icon || '✓', order_index: order })
      .select()
      .single();
    if (error) throw error;
    res.status(201).json(data);
  } catch (err) {
    next(err);
  }
};

export const toggleHabitCompletion = async (req, res, next) => {
  try {
    const userId = getUserId(req);
    const { habit_id, completion_date } = req.body;
    const date = completion_date || new Date().toISOString().split('T')[0];
    const { data: existing } = await supabase
      .from('habit_completions')
      .select('id')
      .eq('user_id', userId)
      .eq('habit_id', habit_id)
      .eq('completion_date', date)
      .maybeSingle();
    if (existing) {
      await supabase.from('habit_completions').delete().eq('id', existing.id);
      return res.json({ completed: false });
    }
    const { data, error } = await supabase
      .from('habit_completions')
      .insert({ user_id: userId, habit_id, completion_date: date })
      .select()
      .single();
    if (error) throw error;
    res.json({ ...data, completed: true });
  } catch (err) {
    next(err);
  }
};

export const updateHabit = async (req, res, next) => {
  try {
    const userId = getUserId(req);
    const { id } = req.params;
    const body = { ...req.body, updated_at: new Date().toISOString() };
    const { data, error } = await supabase
      .from('habits')
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

export const deleteHabit = async (req, res, next) => {
  try {
    const userId = getUserId(req);
    const { id } = req.params;
    await supabase.from('habit_completions').delete().eq('habit_id', id);
    const { error } = await supabase.from('habits').delete().eq('id', id).eq('user_id', userId);
    if (error) throw error;
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};
