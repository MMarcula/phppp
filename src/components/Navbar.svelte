<script>
	import { get } from 'svelte/store';
	import { supabase } from '../supabase.js';
	import { resetTodos, currentProject } from '../stores/todoStore.js';

	const logout = () => {
		console.log('logging out');
		supabase.auth.signOut();
		resetTodos();
	};

	const leaveProject = async () => {
		const prompt = confirm('Do you really want to leave this project?');
		if (!prompt) {
			return;
		}

		const {data: {user: {id}}} = await supabase.auth.getUser();
		await supabase.from('grants').delete().eq('user_id', id).eq('share_id', get(currentProject));
		currentProject.set('');
	};

	let share;

	const shareProject = async () => {
		share.disabled = true;
		const text = share.innerText;
		share.innerText = 'Sharing...';

		try {
			const {data} = await supabase.from('shares').insert({
				owner: (await supabase.auth.getUser()).data.user.id
			}).select();

			const url = new URL(`/join/${data[0].id}`, location.href);

			await navigator.clipboard.writeText(url.href);

			share.innerText = 'Copied to clipboard!';

			await new Promise(resolve => setTimeout(resolve, 1000));
		} finally {
			share.innerText = text;
			share.disabled = false;
		}
	};
</script>

<div class="my-4 flex justify-end gap-2">
	{#if $currentProject}
		<button
			class="shadow-sm rounded bg-purple-900 hover:bg-purple-600 text-white py-2 px-4"
			on:click={leaveProject}
		>Leave project</button>
	{:else}
		<button
			class="shadow-sm rounded bg-purple-900 hover:bg-purple-600 disabled:bg-purple-800 text-white py-2 px-4"
			on:click={shareProject}
			bind:this={share}
		>Share project</button>
	{/if}
	<button
		class="shadow-sm rounded bg-purple-900 hover:bg-purple-600 text-white py-2 px-4"
		on:click={logout}
	>
		Log Out
	</button>
</div>
