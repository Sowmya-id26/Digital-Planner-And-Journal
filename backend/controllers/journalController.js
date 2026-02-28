
import { supabase } from '../config/supabase.js';
import { getUserId } from '../utils/userId.js';


export const getEntries = async (req, res, next) => {
  try {
    const userId = getUserId(req);

    const { data, error } = await supabase
      .from('journal_entries')
      .select('*')
      .eq('user_id', userId)
      .order('entry_date', { ascending: false });

    if (error) throw error;

    res.json(data || []);
  } catch (err) {
    next(err);
  }
};


export const getEntryByDate = async (req, res, next) => {
  try {
    const userId = getUserId(req);
    const { date } = req.params;

    const { data, error } = await supabase
      .from('journal_entries')
      .select('*')
      .eq('user_id', userId)
      .eq('entry_date', date)
      .maybeSingle();

    if (error) throw error;

    res.json(data || null);
  } catch (err) {
    next(err);
  }
};


export const saveEntry = async (req, res, next) => {
  try {
    const userId = getUserId(req);
    const { entry_date, content } = req.body;

    if (!entry_date) {
      return res.status(400).json({ message: 'Entry date required' });
    }

    const { data, error } = await supabase
      .from('journal_entries')
      .upsert(
        {
          user_id: userId,
          entry_date,
          content
        },
        { onConflict: 'user_id,entry_date' }
      )
      .select()
      .single();

    if (error) throw error;

    res.json(data);
  } catch (err) {
    next(err);
  }
};


export const deleteEntry = async (req, res, next) => {
  try {
    const userId = getUserId(req);
    const { id } = req.params;

    const { error } = await supabase
      .from('journal_entries')
      .delete()
      .eq('id', id)
      .eq('user_id', userId);

    if (error) throw error;

    res.status(204).send();
  } catch (err) {
    next(err);
  }
};