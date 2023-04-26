<script>
	import { goto } from '$app/navigation';
	import no_image from '$lib/assets/defaultimg.jpg';
	import { onDestroy, onMount, afterUpdate, tick } from 'svelte';
	import Fa from 'svelte-fa/src/fa.svelte';
	import { faPaperPlane, faRightFromBracket, faMessage } from '@fortawesome/free-solid-svg-icons';
	import moment from 'moment-timezone';
	import { enhance } from '$app/forms';
	import { fly } from 'svelte/transition'
	export let data;
	let { session, profile, msgs, supabase } = data;
	let element;
	let user;
	let messages = msgs ?? [];
	let msgForm
	if (session) {
		user = session.user;
	}
	let downloadedAvatars = {};
	$: if (messages) {
		for (const prop in messages) {
			const userId = messages[prop].userid.id;
			if (messages[prop].userid.avatar_url) {
				if (downloadedAvatars[userId] && downloadedAvatars[userId].avatarUrl) {
					messages[prop].userid.avatar_url = downloadedAvatars[userId].avatarUrl;
				} else if (messages[prop].userid.avatar_url.startsWith('blob')) {
					downloadedAvatars[userId] = {
						avatarUrl: messages[prop].userid.avatar_url,
						downloaded: true
					};
					continue;
				} else {
					async function downloadImage() {
						try {
							const { data, error: downloadError } = await supabase.storage
								.from('avatars')
								.download(messages[prop].userid.avatar_url);

							if (downloadError) {
								throw downloadError;
							}
							const url = URL.createObjectURL(data);
							messages[prop].userid.avatar_url = url;
							downloadedAvatars[userId] = { avatarUrl: url, downloaded: true };
						} catch (error) {
							if (error instanceof Error) {
								console.log('Error downloading image: ', error);
							}
						}
					}
					downloadImage();
				}
			}
		}
	}
	let message = '';
	onMount(() => {
		if (!user) {
			goto('/login');
		}
	});
	function resizeTextArea() {
		let msgArea = document.getElementById('msgArea');
		msgArea.style.height = '3rem';
		let h = event.target.scrollHeight;
		msgArea.style.height = `${h}px`;
		msgArea.style.overflowX = 'hidden';
	}
	const messagesChannel = supabase
		.channel('custom-insert-channel')
		.on(
			'postgres_changes',
			{ event: '*', schema: 'public', table: 'messages' },
			async (payload) => {
				if (payload.eventType == 'INSERT') {
					let { data: user, error: err } = await supabase
						.from('profiles')
						.select('*')
						.eq('id', payload.new.userid)
						.single();
					payload.new.userid = user;
					messages = [...messages, payload.new];
					if (messages.length > 100) {
						messages.reverse().pop();
						messages.reverse();
					}
				}
				if (payload.eventType == 'DELETE') {
					messages = messages.filter((msg) => msg.id != payload.old.id);
				}
				if (payload.eventType == 'UPDATE') {
					messages[messages.findIndex((msg) => msg.id == payload.new.id)].content =
						payload.new.content;
				}
				if (messages.length > 100) {
							messages.reverse().pop();
							messages.reverse();
				}
			}
		)
		.subscribe();
	const profiles = supabase
			.channel('custom-all-channel')
			.on('postgres_changes', { event: '*', schema: 'public', table: 'profiles' }, (payload) => {
				if (payload.eventType == 'UPDATE') {
					console.log(payload.new)
				}
			})
			.subscribe();
	const scrollToBottom = async (node) => {
		node.scroll({ top: node.scrollHeight, behavior: 'smooth' });
	};
	afterUpdate(() => {
		if (messages) scrollToBottom(element);
	});
	$: if (messages && element) {
		scrollToBottom(element);
	}
</script>

<div
	class="chatDiv mx-auto shadow-2xl h-full w-full bg-base-200 flex flex-col overflow-hidden z-10 relative"
>
	<div class="navbar bg-base-300 h-9 z-10">
		<div class="navbar-start prose">
			<div class="flex flex-row justify-center items-center px-5">
				<Fa class="mt-0.5" icon={faMessage} />
				<p class="ml-2">Chat Principal</p>
			</div>
		</div>
		<div class="navbar-center prose">
			<p>
				Iniciaste sesión como: <strong
					><a
						href="/account"
						class="text-accent font-bold no-underline hover:text-accent-focus hover:transition-colors"
						>{profile.username}</a
					></strong
				>
			</p>
		</div>
		<div class="navbar-end prose">
			<form method="post" action="?/signout">
				<button class="btn btn-ghost hover:bg-transparent hover:text-accent-focus btn-lg">
					<Fa icon={faRightFromBracket} />
				</button>
			</form>
		</div>
	</div>
	<!-- <div class="svg-container top-0 bottom-0 left-0 right-0 w-full h-full">
		<svg id="patternId" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg"
			><defs
				><pattern
					id="a"
					patternUnits="userSpaceOnUse"
					width="100"
					height="100"
					patternTransform="scale(3) rotate(65)"
					><rect
						class="path-bg"
						classx="0"
						y="0"
						width="100%"
						height="100%"
						fill="hsla(342, 0%, 98%, 1)"
					/><path
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
	</div> -->

	<div
		bind:this={element}
		id="chatDiv"
		class="z-10 msg p-4 pb-5 overflow-y-auto top-0 h-4/5 scrollbar-thin scrollbar-thumb-red-700 relative"
		style="scroll-behavior: smooth;"
	>
		{#each messages as message}
			{#if message.userid.id === user.id}
				<div class="message chat chat-end">
					<div class="chat-image avatar">
						<div class="w-10 rounded-full">
							<img
								src={downloadedAvatars[message.userid.id] ? message.userid.avatar_url : no_image}
								alt="imagen"
							/>
						</div>
					</div>
					<div class="chat-header">
						{message.userid.username}
						<time class="text-xs opacity-50"
							>{moment(message.sent).tz('America/Caracas').format('HH:mm DD/MM/yyyy')}</time
						>
					</div>
					<div class="chat-bubble chat-bubble-primary">{message.content}</div>
				</div>
			{:else}
				<div class="message chat chat-start">
					<div class="chat-image avatar">
						<div class="w-10 rounded-full">
							<img
								src={downloadedAvatars[message.userid.id] ? message.userid.avatar_url : no_image}
								alt="imagen"
							/>
						</div>
					</div>
					<div class="chat-header">
						{message.userid.username}
						<time class="text-xs opacity-50"
							>{moment(message.sent).tz('America/Caracas').format('HH:mm DD/MM/yyyy')}</time
						>
					</div>
					<div class="chat-bubble chat-bubble-secondary">{message.content}</div>
				</div>
			{/if}
		{/each}
	</div>

	<div
		id="txtContainer"
		class="txt bg-base-300 flex justify-center items-center p-2 w-full max-h-24 absolute bottom-0 z-10"
	>
		<textarea
			name="msgArea"
			class="msgArea overflow-y-auto overflow-x-hidden max-h-24 flex-grow textarea-md focus:outline-none focus:textarea-accent h-12 w-3/4 resize-none rounded-xl px-3 py-2 text-left"
			placeholder="Escribe tu comentario de odio aquí"
			id="msgArea"
			style="overflow-x: hidden;"
			on:input={resizeTextArea}
			bind:value={message}
			on:keydown={(e) => {
					if (e.which === 13 && !e.shiftKey){
						e.preventDefault()
						msgForm.requestSubmit()
					}
				}}
		/>
		<form
		bind:this={msgForm}
			action="?/sendMessage"
			method="post"
			use:enhance={({ form, data, action, cancel }) => {
				return async ({ result }) => {
					message = '';
				};
			}}
		>
			<textarea
				name="message"
				id="msgtxt"
				cols="30"
				rows="10"
				hidden
				bind:value={message}
				required
			/>
			<button
				type="submit"
				class="btn btn-ghost hover:bg-transparent hover:text-accent-focus btn-lg"
			>
				<Fa icon={faPaperPlane} class="text-inherit" />
			</button>
		</form>
	</div>
</div>

<style>
	.chat-bubble {
		max-width: 60%;
	}
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
