<script>
	import { enhance } from '$app/forms';
	import Avatar from './Avatar.svelte';
	import Fa from 'svelte-fa/src/fa.svelte';
	import { faRightFromBracket, faMessage } from '@fortawesome/free-solid-svg-icons';
	export let data;
	export let form;
	let { session, profile, supabase } = data;
	let profileForm;
	let loading = false;
	let username = profile?.username;
	let avatarUrl = profile?.avatar_url;
	let bio = profile?.bio;
	let code = profile?.code.toString().padStart(4, '0');
	let email = session.user.email;
	function handleSubmit() {
		loading = true;
		return async () => {
			loading = false;
		};
	}
	let errorClass,
		inputClass = '',
		textError,
		textAreaClass = '';
	$: if (form?.error) {
		errorClass = 'border border-red-500';
		inputClass = 'input-error';
		textError = 'text-red-500';
		textAreaClass;
	}
	function resizeTextArea() {
		let bioArea = document.getElementById('bioArea');
		bioArea.style.height = '3rem';
		let h = event.target.scrollHeight;
		bioArea.style.height = `${h}px`;
		bioArea.style.overflowX = 'hidden';
	}
	if (profileForm?.success){
		console.log(profileForm)
	}
	$: console.log(profileForm)

</script>

<div
	class="mx-auto shadow-2xl h-full w-full bg-base-300 flex flex-col justify-center items-center scrollbar-thin z-10 relative"
>
			<div class="svg-container top-0 bottom-0 left-0 right-0 absolute ">
				<!-- <svg id="patternId" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg"
					><defs
						><pattern
							id="a"
							patternUnits="userSpaceOnUse"
							width="120"
							height="20.5"
							patternTransform="scale(2) rotate(5)"
							><rect class="path-bg" x="0" y="0" width="100%" height="100%" fill="hsla(0,0%,100%,1)" /><path
								class="path-secondary"
								d="M-50.129 12.685C-33.346 12.358-16.786 4.918 0 5c16.787.082 43.213 10 60 10s43.213-9.918 60-10c16.786-.082 33.346 7.358 50.129 7.685"
								stroke-width="1.5"
								stroke="hsla(258.5,59.4%,59.4%,1)"
								fill="none"
							/></pattern
						></defs
					><rect width="800%" height="800%" transform="translate(0,0)" fill="url(#a)" /></svg
				> -->
				<svg id="patternId" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg"
					><defs
						><pattern
							id="a"
							patternUnits="userSpaceOnUse"
							width="100"
							height="100"
							patternTransform="scale(3) rotate(65)"
							><rect class="path-bg" classx="0" y="0" width="100%" height="100%" fill="hsla(342, 0%, 98%, 1)" /><path
								d="M19.95-15.33L18.32-.68 16.7 13.97l13.5-5.92 13.5-5.91L31.82-6.6zM62 68.18l21.15-23.32 9.62 29.98zm2.64-.85l26.08 5.64-8.15-25.4zm-44.7 17.42l-1.63 14.64-1.63 14.66 13.5-5.92 13.5-5.92-11.87-8.73z"
								stroke-width="1"
								stroke="none"
								fill="hsla(330, 100%, 0%, 1)"
								class="path-primary"
							/><path
								class="path-secondary"
								d="M96.78 82.3a3.74 3.74 0 104.93-5.65 3.74 3.74 0 00-5.3.37 3.76 3.76 0 00.37 5.28zm-47.2-69.69l3.44-.23-.23-3.45-3.44.24zm-3.37 45.7a1.5 1.5 0 002.1-.15 1.5 1.5 0 00-.14-2.1 1.5 1.5 0 00-2.1.15 1.5 1.5 0 00.14 2.1zm24.66-45.06A8.5 8.5 0 1082.07.43a8.5 8.5 0 10-11.2 12.82zM-3.3 82.3a3.74 3.74 0 104.93-5.65 3.74 3.74 0 00-5.29.37 3.76 3.76 0 00.36 5.28zm74.17 31.03a8.5 8.5 0 1011.2-12.82 8.5 8.5 0 10-11.2 12.82zm6.34-78.02c-2.44.5-5.05-.5-7.13-2.7-.28-.3-.43-.68-.41-1.1a1.5 1.5 0 011.56-1.46c.4 0 .78.17 1.06.47 1.37 1.45 2.9 2.1 4.33 1.8 1.41-.28 2.58-1.47 3.28-3.35 1.06-2.84 3.08-4.77 5.52-5.26 2.44-.5 5.05.5 7.13 2.7.54.57.56 1.43.06 2.02l-.12.13c-.6.57-1.57.54-2.14-.07-1.37-1.45-2.9-2.1-4.32-1.8-1.42.28-2.6 1.47-3.29 3.35-.92 2.46-2.54 4.22-4.55 4.97-.32.14-.64.24-.98.3zm8.64-9.5c1.73-.34 3.56.4 5.15 2.08a.63.63 0 00.94-.03c.2-.24.2-.6-.03-.83-1.87-1.98-4.17-2.87-6.3-2.43-2.14.43-3.91 2.15-4.86 4.7-.82 2.17-2.22 3.55-3.95 3.91-1.73.35-3.56-.38-5.15-2.07a.62.62 0 00-1.08.41c-.01.17.05.32.17.45 1.87 1.98 4.17 2.87 6.3 2.43 2.14-.43 3.91-2.15 4.87-4.7.7-1.89 1.85-3.18 3.28-3.72.2-.08.43-.15.66-.2zM39.33 79.5c.54 0 1-.4 1.07-.96.32-2.86-.55-5.34-2.39-6.8-1.83-1.45-4.44-1.72-7.15-.74-2.03.73-3.84.58-5.11-.41-1.26-1-1.82-2.73-1.58-4.87a1.08 1.08 0 00-.94-1.2 1.08 1.08 0 00-1.19.95c-.32 2.87.54 5.35 2.38 6.8 1.84 1.45 4.44 1.72 7.15.75 2.04-.73 3.85-.58 5.12.41 1.25 1 1.82 2.73 1.57 4.87a1.08 1.08 0 001.07 1.2z"
								stroke-width="1"
								stroke="none"
								fill="hsla(4, 100%, 50%, 1)"
							/><path
							id="squares"
							class="path-third"
								d="M6.7 27.57l18.65-5.83 5.84 18.64-18.65 5.84zm17.68-3.97l-15.8 4.96 4.94 15.8 15.81-4.95zm78.1-33.38l-9.04 3.62 3.62 9.05 9.04-3.62zm3.68 67.2l-9.67 2.99.57 1.86 9.67-3zM55.35 89.61l.7 1.74 12.14-4.87-.7-1.74zm5.28-48.27l1.32-.91-12.24-17.66-1.32.92zM2.4-9.78l-9.04 3.62 3.62 9.04L6.02-.74zm3.68 67.2l-9.67 3 .57 1.85 9.67-2.99zm96.4 32.88l-9.05 3.62 3.62 9.04 9.04-3.62zM2.4 90.3l-9.05 3.62 3.63 9.04 9.04-3.62z"
								stroke-width="1"
								stroke="none"
								fill="#ffff"
							/></pattern
						></defs
					><rect width="800%" height="800%" transform="translate(-147,0)" fill="url(#a)" /></svg
				>
			</div>
	<div class="absolute top-0 left-0">
		<button disabled={loading} class="btn btn-ghost hover:bg-transparent hover:text-accent-focus btn-sm text-lg">
			<a href="/" class="flex justify-center items-center">
				<Fa class="mt-0.5" icon={faMessage} />
				<p class="ml-2">Chat Principal</p>
			</a>
		</button>
	</div>
	<form method="POST" action="?/signout" class="absolute top-0 right-0">
		<button disabled={loading} class="btn btn-ghost hover:bg-transparent hover:text-accent-focus btn-sm text-lg">
			<Fa icon={faRightFromBracket} />
		</button>
	</form>

	<div class="bg-base-100 w-2/5 h-fit pt-5 pb-5 px-5 rounded-lg drop-shadow-2xl">
		<div class="flex justify-center mb-2">
			<Avatar
				{supabase}
				{session}
				bind:url={avatarUrl}
				on:upload={() => {
					profileForm.requestSubmit();
				}}
			/>
		</div>

		<div class="prose text-center mb-5 mx-auto">
			<h1>anexado #{code}.</h1>
		</div>
		<form
			method="POST"
			action="?/update"
			bind:this={profileForm}
			use:enhance={handleSubmit}
			class="flex flex-col justify center items-center w-full"
		>
			<input type="hidden" name="avatarUrl" value={form?.avatarUrl ?? avatarUrl} />
			<div class="form-control w-full max-w-xs mb-1">
				<label for="username" class="label">
					<span class="label-text {textError}">Nombre de Usuario</span>
				</label>
				<input
					type="text"
					name="username"
					placeholder="Ingresa un nombre de usuario"
					class="input {inputClass} w-full max-w-xs bg-base-300 focus:outline-none focus:input-accent focus:border-none"
					autocomplete="off"
					value={form?.username ?? username}
					required
				/>
			</div>
			<!-- <div class="form-control w-full max-w-xs mb-1">
				<label for="email" class="label">
					<span class="label-text {textError}">Email</span>
				</label>
				<input
					type="email"
					placeholder="email@example.com"
					class="input {inputClass} w-full max-w-xs"
					autocomplete="off"
					value={form?.email ?? email}
					disabled
				/>
			</div> -->
			<div class="form-control w-full max-w-xs mb-2">
				<label for="bio" class="label">
					<span class="label-text {textError}">Bio</span>
				</label>
				<textarea
					id="bioArea"
					name="bio"
					placeholder="Escribe cualquier burrada."
					class="bg-base-300 textarea {textAreaClass} textarea-sm w-full max-w-xs h-20 overflow-y-hidden overflow-x-hidden focus:outline-none focus:textarea-accent resize-none focus:border-none"
					autocomplete="off"
					value={form?.bio ?? bio}
					on:input={resizeTextArea}
				/>
				<label for="bio" class="label">
					<span class="label-text-alt">Máximo 150 caracteres</span>
				</label>
			</div>
			<div class="mt-5 w-3/4">
				<input
					type="submit"
					class="btn btn-primary btn-md w-full"
					value={loading ? '...' : 'Guardar'}
					disabled={loading}
				/>
			</div>
		</form>
	</div>
</div>

<style>
		.path-bg {
		fill: hsl(var(--b1));
	}

	.path-secondary {
		fill: hsl(var(--b3));
	}

	.path-primary {
		fill: hsl(var(--b2));
	}
	.path-third {
		fill: hsl(var(--b2));
	}
</style>