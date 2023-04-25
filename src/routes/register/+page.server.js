import { AuthApiError } from '@supabase/supabase-js';
import { error, redirect, fail } from '@sveltejs/kit';
export const load = async ({ locals: { getSession } }) => {
	const session = await getSession();

	if (session) {
		throw redirect(303, '/');
	}
};
export const actions = {
	register: async ({ request, locals }) => {
		const body = Object.fromEntries(await request.formData());
		const { data, error: err } = await locals.supabase.auth.signUp({
			email: body.email,
			password: body.password
		});
		if (err) {
			console.log(err);
			if (err instanceof AuthApiError && err.status !== 500) {
				return fail(err.status, {
					error: true,
					message: err.message
				});
			}
			throw error(err.status, {
				message: `Error del servidor, intente de nuevo. Si el error persiste, porfavor reportar al Administrador. Error: ${err.message}(${err.code})`
			});
		}

		return {
			success: true
		};
	}
};
