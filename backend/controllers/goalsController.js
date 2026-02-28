

import { supabase } from '../config/supabase.js';
import { getUserId } from '../utils/userId.js';


export const getGoals = async (req, res, next) => {
  try {
    const userId = getUserId(req);

    const { data, error } = await supabase
      .from('goals')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    res.json(data || []);
  } catch (err) {
    console.error("GET GOALS ERROR:", err);
    next(err);
  }
};


export const createGoal = async (req, res, next) => {
  try {
    const userId = getUserId(req);
    const {
      title,
      type = 'personal',
      target_value = 100,
      current_value = 0,
      unit = '',
      deadline = null
    } = req.body;

    if (!title) {
      return res.status(400).json({ message: 'Title is required' });
    }

    const { data, error } = await supabase
      .from('goals')
      .insert({
        user_id: userId,
        title,
        type,
        target_value,
        current_value,
        unit,
        deadline: deadline || null
      })
      .select()
      .single();

    if (error) throw error;

    res.status(201).json(data);
  } catch (err) {
    console.error("CREATE GOAL ERROR:", err);
    next(err);
  }
};


export const updateGoal = async (req, res, next) => {
  try {
    const userId = getUserId(req);
    const { id } = req.params;

    const { data, error } = await supabase
      .from('goals')
      .update(req.body)
      .eq('id', id)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) throw error;

    res.json(data);
  } catch (err) {
    console.error("UPDATE GOAL ERROR:", err);
    next(err);
  }
};


export const deleteGoal = async (req, res, next) => {
  try {
    const userId = getUserId(req);
    const { id } = req.params;

    const { error } = await supabase
      .from('goals')
      .delete()
      .eq('id', id)
      .eq('user_id', userId);

    if (error) throw error;

    res.status(204).send();
  } catch (err) {
    console.error("DELETE GOAL ERROR:", err);
    next(err);
  }
};