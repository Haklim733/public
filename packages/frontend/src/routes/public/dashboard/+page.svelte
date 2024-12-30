
<script lang="ts">
    import { featureFlags } from '$lib/store';
	import { DashboardPage } from '$lib/components/dashboard/index.ts';
</script>

<!-- {#if featureFlags.dashboard && ['dev', 'production'].includes(import.meta.env['VITE_STAGE'])} -->
	<DashboardPage />
<!-- {/if} -->
