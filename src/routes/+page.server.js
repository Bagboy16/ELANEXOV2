import { redirect, fail } from '@sveltejs/kit';

export const load = async ({ locals: { supabase, getSession } }) => {
	const session = await getSession();

	if (!session) {
		throw redirect(303, '/login');
	}

	const { data: profile } = await supabase
		.from('profiles')
		.select(`*`)
		.eq('id', session.user.id)
		.single();

	if (!profile.username) {
		throw redirect(303, '/account');
	}
	let { data: msgs, error: err } = await supabase.from('messages').select(
		`id,
			content,
			userid: profiles(id, username, avatar_url),
			sent`
	).order('sent', { ascending: false }).range(0, 100);
	console.log(msgs)
	if (err) {
		console.error(err);
	}

	if (msgs) {
		msgs = msgs.reverse()
	}

	return { session, profile, msgs };
};

export const actions = {
	signout: async ({ locals: { supabase, getSession } }) => {
		const session = await getSession();
		if (session) {
			await supabase.auth.signOut();
			throw redirect(303, '/login');
		}
	},

	sendMessage: async ({ request, locals: { supabase, getSession } }) => {
		const session = await getSession();
		if (!session) {
		throw redirect(303, '/login');
		}
		const formData = await request.formData()
		const message = formData.get('message')
		if (message === '') {
			return fail(400, {
				error: true,
			})
		}
		const { data, error } = await supabase.from('messages').insert({
			content: message,
			userid: session.user.id,
			sent: new Date(Date.now())
		})

		if (error) {
			console.log(error)
		}

		console.log(data)
	}
};
