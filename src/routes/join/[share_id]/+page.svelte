<script>
import { supabase } from "../../../supabase";

(async () => {
    if (!globalThis.window) {
        return;
    }

    const share_id = location.pathname.split('/').pop();
    const user_id = (await supabase.auth.getUser()).data.user.id;

    try {
        await supabase.from('grants').insert({
            share_id,
            user_id,
        });
    } finally {
        location.href = '../../';
    }
})();
</script>

<p class="text-white">Joining...</p>