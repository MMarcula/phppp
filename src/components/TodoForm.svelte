<script>
	import { get } from 'svelte/store';
	import { addTodo, currentProjectOwnerId } from '../stores/todoStore.js';
	let todo = '';
	let errorMessage = '';
	export let session;
	const handleSubmit = () => {
		if(todo===''){
			errorMessage = 'Wrong value';
		}else{
		addTodo(todo, get(currentProjectOwnerId) || session.user.id);
		todo = '';
		errorMessage = '';
		}
	};
</script>

<form class="my-6" on:submit|preventDefault={handleSubmit}>
	<div class="flex flex-col text-sm mb2">
		<label class="font-bold mb-2 text-purple-500" for="todo"> Todo </label>
		<input
			type="text"
			bind:value={todo}
			name="todo"
			required
			placeholder="Type your Todo"
			class="appearance-none shadow-sm border-2 border-gray-200 p-2 focus:outline-none focus:border-gray-500 rounded-t-lg"
		/>
	</div>
	<button
		type="submit"
		class="w-full shadow-sm rounded-b-lg bg-purple-900 hover:bg-purple-600 text-white py-2 px-4"
	>
		Submit
	</button>
	{#if errorMessage}
		<p class="text-red-600">{errorMessage}!</p>
	{/if}
</form>
