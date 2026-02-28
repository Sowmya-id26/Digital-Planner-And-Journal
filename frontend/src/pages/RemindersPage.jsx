import {useState, useEffect} from 'react';
import {format} from 'date-fns';
import {Card, CardHeader, CardTitle, CardContent} from '@/components/ui/Card';
import {Button} from '@/components/ui/Button';
import {Input} from '@/components/ui/Input';
import {remindersApi} from '@/services/api';
import {Plus, Trash2} from 'lucide-react';

export function RemindersPage() {
	const [reminders, setReminders] = useState([]);
	const [modal, setModal] = useState(false);
	const [form, setForm] = useState({title: '', remind_at: '', type: 'task', channel: 'push'});

	const load = async () => {
		try {
			const r = await remindersApi.list();
			setReminders(r.data);
		} catch (err) {
			console.error("Failed to load reminders:", err);
		}
	};

	useEffect(() => {
		load();
	}, []);

	const save = () => {
		if (!form.title || !form.remind_at) 
			return;
		
		remindersApi.create(form).then(() => {
			setModal(false);
			setForm({title: '', remind_at: '', type: 'task', channel: 'push'});
			load();
		});
	};

	return (
		<div className="space-y-6">
			<div className="flex flex-wrap items-center justify-between gap-4">
				<div>
					<h1 className="text-3xl font-bold">Reminders</h1>
					<p className="text-muted-foreground">Notifications for tasks and events</p>
				</div>
				<Button onClick={
					() => setModal(true)
				}><Plus className="h-4 w-4 mr-2"/>Add reminder</Button>
			</div>

			<Card>
				<CardContent className="pt-6">
					<ul className="space-y-2">
						{
						reminders.map((r) => (
							<li key={
									r.id
								}
								className="flex items-center justify-between rounded-lg border border-border p-3">
								<div>
									<p className="font-medium">
										{
										r.title
									}</p>
									<p className="text-sm text-muted-foreground">
										{
										format(new Date(r.remind_at), 'PPp')
									}
										· {
										r.type
									}
										· {
										r.channel
									}</p>
								</div>
								<Button variant="ghost" size="icon"
									onClick={
										() => remindersApi.delete(r.id).then(load)
								}><Trash2 className="h-4 w-4 text-destructive"/></Button>
							</li>
						))
					} </ul>
					{
					reminders.length === 0 && <p className="text-muted-foreground text-center py-8">No reminders. Add one to get notified.</p>
				} </CardContent>
			</Card>

			{
			modal && (
				<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
					onClick={
						() => setModal(false)
				}>
					<div className="bg-card rounded-xl shadow-lg max-w-md w-full mx-4 p-6 space-y-4"
						onClick={
							(e) => e.stopPropagation()
					}>
						<h3 className="text-lg font-semibold">New reminder</h3>
						<Input placeholder="Title"
							value={
								form.title
							}
							onChange={
								(e) => setForm((f) => ({
									...f,
									title: e.target.value
								}))
							}/>
						<input type="datetime-local" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
							value={
								form.remind_at
							}
							onChange={
								(e) => setForm((f) => ({
									...f,
									remind_at: e.target.value
								}))
							}/>
						<select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
							value={
								form.type
							}
							onChange={
								(e) => setForm((f) => ({
									...f,
									type: e.target.value
								}))
						}>
							<option value="task">Task</option>
							<option value="event">Event</option>
							<option value="self_care">Self-care</option>
						</select>
						<select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
							value={
								form.channel
							}
							onChange={
								(e) => setForm((f) => ({
									...f,
									channel: e.target.value
								}))
						}>
							<option value="push">Push</option>
							<option value="email">Email</option>
							<option value="sms">SMS</option>
						</select>
						<div className="flex gap-2">
							<Button onClick={save}>Save</Button>
							<Button variant="outline"
								onClick={
									() => setModal(false)
							}>Cancel</Button>
						</div>
					</div>
				</div>
			)
		} </div>
	);
}
