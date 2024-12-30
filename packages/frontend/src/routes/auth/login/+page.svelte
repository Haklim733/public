<script lang="ts">
	import { DashboardPage } from '$lib/components/dashboard/index.ts';
	import { MagicLinkForm, LoginForm } from '$lib/components/forms/index.ts';
	export let data;
</script>

	<LoginForm data={data.formLogin} />
