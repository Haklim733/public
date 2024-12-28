<script lang="ts">
	import { DashboardPage } from '$lib/components/dashboard/index.ts';
	import { SignUpForm } from '$lib/components/forms/index.ts';
	export let data;
</script>

{#if !data.user.authenticated}
	<SignUpForm data={data.form} />
{:else}
	<DashboardPage {data} />
{/if}
