
import { supabase } from '../config/supabase.js';
import { getUserId } from '../utils/userId.js';


export const getTasks = async (req, res, next) => {
  try {
    const userId = getUserId(req);
    const { category, completed } = req.query;

    let query = supabase
      .from('tasks')
      .select('*')
      .eq('user_id', userId)
      .order('order_index', { ascending: true })
      .order('due_date', { ascending: true });

    if (category) query = query.eq('category', category);
    if (completed !== undefined)
      query = query.eq('completed', completed === 'true');

    const { data, error } = await query;

    if (error) throw error;

    res.json(data || []);
  } catch (err) {
    next(err);
  }
};


export const createTask = async (req, res, next) => {
  try {
    const userId = getUserId(req);
    const { title, category, priority, due_date, order_index } = req.body;

    if (!title) {
      return res.status(400).json({ message: 'Title is required' });
    }

   
    const { data: maxOrder, error: maxError } = await supabase
      .from('tasks')
      .select('order_index')
      .eq('user_id', userId)
      .order('order_index', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (maxError) throw maxError;

    const order =
      order_index ?? ((maxOrder?.order_index ?? 0) + 1);

    const { data, error } = await supabase
      .from('tasks')
      .insert({
        user_id: userId,
        title,
        category: category || 'personal',
        priority: priority || 'medium',
        due_date,
        order_index: order
      })
      .select()
      .single();

    if (error) throw error;

    res.status(201).json(data);
  } catch (err) {
    next(err);
  }
};


export const updateTask = async (req, res, next) => {
  try {
    const userId = getUserId(req);
    const { id } = req.params;

    const { data, error } = await supabase
      .from('tasks')
      .update({
        ...req.body,
        updated_at: new Date().toISOString()
      })
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


export const reorderTasks = async (req, res, next) => {
  try {
    const userId = getUserId(req);
    const { items } = req.body; // [{ id, order_index }]

    if (!Array.isArray(items)) {
      return res.status(400).json({ message: 'Invalid reorder data' });
    }

    for (const item of items) {
      await supabase
        .from('tasks')
        .update({ order_index: item.order_index })
        .eq('id', item.id)
        .eq('user_id', userId);
    }

    res.json({ success: true });
  } catch (err) {
    next(err);
  }
};


export const deleteTask = async (req, res, next) => {
  try {
    const userId = getUserId(req);
    const { id } = req.params;

    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', id)
      .eq('user_id', userId);

    if (error) throw error;

    res.status(204).send();
  } catch (err) {
    next(err);
  }
};