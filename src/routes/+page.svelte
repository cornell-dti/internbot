<script>
	export let data;

	$: enablement = data.currentlyEnabled === 'true' ? true : false;

	const statusFormSubmit = async () => {
		// call the local /api/disable or /api/enable endpoint with POST
		await fetch(`/api/${enablement ? 'disable' : 'enable'}`, {
			method: 'POST'
		});
		// reload page after 1s
		setTimeout(() => {
			location.reload();
		}, 1000);
	};

	const coffeechatFormSubmit = async () => {
		// call the local /api/coffeechat endpoint with POST
		await fetch(`/api/coffeechat`, {
			method: 'POST'
		});
	};
</script>

<svelte:head>
	<title>Home</title>
	<meta name="description" content="YASS home page" />
</svelte:head>

<section>
	<h1>YASS 🤖💅</h1>
	<br />
	<div class="row">
		<button on:click={statusFormSubmit}>Toggle {enablement ? 'Off' : 'On'}</button>
		<button on:click={coffeechatFormSubmit}>Trigger Coffee Chats Manually</button>
	</div>
</section>

<style>
	section {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		flex: 0.6;
	}

	h1 {
		width: 100%;
		text-align: center;
		font-size: 2rem;
		margin: 0;
	}

	div.row {
		display: flex;
		flex-direction: row;
		gap: 1rem;
		margin: 1rem;
	}

	button {
		padding: 0.5rem 1rem;
		border-radius: 5rem;
		border: 1px solid var(--var-color-white);
		background-color: var(--var-color-white);
		color: var(--var-color-grey);
		font-size: 1rem;
		cursor: pointer;
		transition: all 0.2s ease-in-out;
	}

	button:hover {
		background-color: var(--var-color-red);
		color: var(--var-color-white);
	}
</style>
