<script lang="ts">
	import * as Form from '$lib/components/ui/form';
	import { type InsertUser, userInsertSchema } from '@public/core/db/schema';
	import { type SuperValidated, type Infer, superForm } from 'sveltekit-superforms';
</script>

<div class="flex h-screen flex-col items-center justify-center">
	<div class="w-96 rounded-md bg-white p-8 shadow-md">
		<h2 class="mb-4 text-2xl font-bold">Login</h2>
		<form method="POST" action="?/auth">
			<div class="mt-4 mt-4 flex flex-row items-center justify-center space-x-4">
				<Form.Button class="btn bg-[#594c5d] text-white" value="signin"
					>Sign In with Google</Form.Button
				>
			</div>
		</form>
	</div>
</div>
