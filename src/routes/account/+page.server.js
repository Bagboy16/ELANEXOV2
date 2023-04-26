import { fail, redirect } from '@sveltejs/kit';

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

	return { session, profile };
};

export const actions = {
    update: async ({ request, locals: { supabase, getSession } }) => {
        const formData = await request.formData()
        const username = formData.get('username')
        const bio = formData.get('bio')
        const avatarUrl = formData.get('avatarUrl')
        const userIp = formData.get('userIp')
        console.log(userIp)
        const session = await getSession()

        const { error } = await supabase.from('profiles').upsert({
            id: session?.user.id,
            username: username,
            bio: bio,
            avatar_url: avatarUrl,
            updated_at: new Date(),
            ip: userIp
        })

        if (error) {
            return fail(500, {
                error: true,
                username,
                bio,
                avatarUrl
            })
        }

        return {
            success: true,
            username,
            bio,
            avatarUrl,
        }
    },
    signout: async ({ locals: { supabase, getSession } }) => {
		const session = await getSession();
		if (session) {
			await supabase.auth.signOut();
			throw redirect(303, '/login');
		}
	}
};