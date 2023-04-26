import { AuthApiError } from '@supabase/supabase-js';
import { error, redirect, fail } from '@sveltejs/kit';
export const load = async ({ locals: { getSession } }) => {
	const session = await getSession();

	if (session) {
		throw redirect(303, '/');
	}
};
export const actions = {
	login: async ({ request, locals }) => {
		const body = Object.fromEntries(await request.formData());

		// eslint-disable-next-line no-unused-vars
		const { data, error: err } = await locals.supabase.auth.signInWithPassword({
			email: body.email,
			password: body.password
		});
		if (err) {
			console.log(err);
			if (err instanceof AuthApiError && err.status !== 500) {
				return fail(err.status, {
					error: true,
					message: err.message,
				});
			}
			throw error(err.status, {
				message: `Error del servidor, intente de nuevo. Si el error persiste, porfavor reportar al Administrador. Error: ${err.message}(${err.code})`
			});
		}
		
        throw redirect(303, '/')
	}
};
