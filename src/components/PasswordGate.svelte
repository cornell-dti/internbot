<!-- PasswordGate.svelte -->
<script>
	import { onDestroy, onMount } from 'svelte';

	const PASSWORD = 'iknowdawei';
	let inputPassword = '';
	let isUnlocked = false;

	function checkPassword() {
		if (inputPassword === PASSWORD) {
			isUnlocked = true;
		} else {
			alert('Incorrect password. Please try again.');
		}
	}
</script>

{#if !isUnlocked}
	<div class="password-gate">
		<div class="password-form">
			<h1>Enter Password</h1>
			<input
				type="password"
				bind:value={inputPassword}
				placeholder="Enter password"
				on:keyup={(e) => {
					if (e.key === 'Enter') {
						checkPassword();
					}
				}}
			/>
			<button on:click={checkPassword}> Unlock </button>
		</div>
	</div>
{/if}

<style>
	.password-gate {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background-color: rgba(0, 0, 0, 0.5);
		backdrop-filter: blur(15px);
		display: flex;
		justify-content: center;
		align-items: center;
		z-index: 9999;
	}

	.password-form {
		width: 300px;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		gap: 10px;
	}

	.password-form h1 {
		color: white;
		text-align: center;
	}

	.password-form input {
		display: block;
		width: 250px;
		padding: 8px;
		margin-bottom: 10px;
	}

	.password-form button {
		display: block;
		width: 150px;
		padding: 8px;
		background-color: var(--var-color-red);
		color: white;
		font-weight: bold;
		cursor: pointer;
		border: none;
		border-radius: var(--var-border-radius);
	}
</style>
