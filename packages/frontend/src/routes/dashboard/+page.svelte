<script lang="ts">
	import { DashboardPage } from '$lib/components/dashboard/index.ts';
	import { MagicLinkForm, LoginForm } from '$lib/components/forms/index.ts';
	export let data;
</script>

{#if !data.user.authenticated}
	<!-- <MagicLinkForm data={data.formMagicLink} /> -->
	<LoginForm data={data.formLogin} />
{:else}
	<DashboardPage {data} />
{/if}
