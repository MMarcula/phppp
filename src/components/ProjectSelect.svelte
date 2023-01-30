<script>
import { currentProject } from '../stores/todoStore';
import { supabase } from "../supabase";

let currentUser = {email: ''};

let shared = [];

const getSharedProjects = async () => {
    const {data} = await supabase.from('shared').select().neq('id', currentUser.id);

    return data;
};

(async () => {
    currentUser = (await supabase.auth.getUser()).data.user;
    if (!currentUser) {
        return;
    }
    shared = await getSharedProjects();

    currentProject.subscribe(async (change) => {
        if (change === '') {
            shared = await getSharedProjects();
        }
    });
})();
</script>

<select class="w-full p-2" on:change={(e) => currentProject.set(e.target.value)}>
    <option value="">(me) {currentUser.email}</option>
    {#each shared as project}
        <option value={project.share_id}>{project.email}</option>
    {/each}
</select>
