<script>
	import no_image from '$lib/assets/defaultimg.jpg';
    import { createEventDispatcher } from 'svelte';
	export let supabase;
	export let url;
	export let session
	export let isChat = false
	let avatarUrl = null;
	let uploading = false;
	let files = [];

	const dispatch = createEventDispatcher();

	const downloadImage = async (path) => {
		try {
			const { data, error } = await supabase.storage.from('avatars').download(path);

			if (error) {
				throw error;
			}
			const url = URL.createObjectURL(data);
			avatarUrl = url;
			console.log(avatarUrl)
		} catch (error) {
			if (error instanceof Error) {
				console.log('Error downloading image: ', error.message);
			}
		}
	};

	const uploadAvatar = async () => {
		try {
			uploading = true;

			if (!files || files.length === 0) {
				throw new Error('Debes seleccionar una imagen para subir.');
			}

			const file = files[0];
			const fileExt = file.name.split('.').pop();
			const filePath = `${Math.random()}.${fileExt}`;
			let { error } = await supabase.storage.from('avatars').upload(filePath, file);

			if (error) {
				throw error;
			}
			
			url = filePath

			let {error:err} = await supabase.from('profiles').upsert({
				id: session?.user.id,
				avatar_url : url
			})

			if (err){
				throw err
			}
			dispatch('upload');
		} catch (error) {
			if (error instanceof Error) {
				alert(error.message);
			}
		} finally {
			uploading = false;
		}
	};

	$: if (url) downloadImage(url);
</script>
<div class="flex flex-col justify-center items-center">
{#if avatarUrl}
	<div class="avatar">
		<div class="w-24 rounded-full">
			<img src={avatarUrl} 
            alt={avatarUrl ? 'Avatar' : 'No image'} 
             />
		</div>
	</div>
{:else}
	<div class="avatar">
		<div class="w-24 rounded-full">
			<img src={no_image} alt="noimage" />
		</div>
	</div>
{/if}
{#if !isChat}
<input type="hidden" name="avatarUrl" value={url} />
<div class="mt-2">
		<label class="btn btn-accent btn-sm" for="single">
			{uploading ? '...' : 'Subir imagen'}
		</label>
		<input
			style="visibility: hidden; position:absolute;"
			type="file"
			id="single"
			accept="image/*"
			bind:files
			on:change={uploadAvatar}
			disabled={uploading}
		/>
	</div>
	{/if}
</div>
