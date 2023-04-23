<script lang="ts">
	import Temporary from './Temporary.svelte';

	export let msg: string;
</script>

<Temporary duration={5000} trigger={msg}>
	<div class="alert"><p>{msg}</p></div>
</Temporary>

<style>
	div {
		position: absolute;
		bottom: 1.5rem;
		right: 1.5rem;
		width: fit-content;
		padding: 0.25rem 1.25rem;
		background-color: var(--var-color-red);
		border-radius: var(--var-border-radius);
		font-size: 0.75rem;
		box-shadow: 0px 10px 35px 5px rgba(0, 0, 0, 0.25);
	}
</style>
