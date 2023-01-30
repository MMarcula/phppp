import { writable } from "svelte/store";
import { supabase } from "../supabase.js";

export const todos = writable([]);

export const currentProject = writable('');
export const currentProjectOwnerId = writable('');

export const loadTodos = async (uid) => {
	if (uid === undefined) {
		uid = (await supabase.auth.getUser()).data.user?.id;
	}

	const { data, error } = await supabase.from('todos').select().eq('user_id', uid).order('completed').order('id');
	if (error) {
		return console.error(error);
	}
	todos.set(data);
	console.log(data);
};

currentProject.subscribe(async share_id => {
	if (share_id) {
		const {data} = await supabase.from('shared').select().eq('share_id', share_id);
		currentProjectOwnerId.set(data[0].id);

		loadTodos(data[0].id);
	} else {
		const uid = (await supabase.auth.getUser()).data.user?.id;
		currentProjectOwnerId.set('');

		loadTodos(uid);
	}
});

export const resetTodos = () => {
	todos.set([]);
}

export const addTodo = async (text, user_id) => {
	const { data, error } = await supabase.from('todos').insert([{ text, user_id, completed: false }]).select();

	if (error) {
		return console.error(error);
	}

	todos.update(cur => [...cur, data[0]]);
};

export const updateTodo = async (text, id) => {
	const { error } = await supabase.from('todos').update([{ text }]).eq('id', id);
	if (error) {
		return console.error(error);
	}
}

export const deleteTodo = async (id) => {
	const { error } = await supabase.from('todos').delete().match({ id });

	if (error) {
		return console.error(error);
	}

	todos.update((todos) => todos.filter((todo) => todo.id !== id));
};

export const toggleTodoCompleted = async (id, currentState) => {
	const { error } = await supabase.from('todos').update({ completed: currentState }).match({ id })
	if (error) {
		return console.error(error);
	}

};
