<script lang="ts">
	export let data;

	// enablement is a boolean
	$: enablement = data.currentlyEnabled === 'true' ? true : false;

	// local state for the roster text
	let rosterText = '';

	const parseRosterText = (rosterText: string): string[] =>
		rosterText.split('\n').map((netid) => netid.trim());

	// call the local /api/disable or /api/enable endpoint with POST
	const statusFormSubmit = async () =>
		fetch(`/api/${enablement ? 'disable' : 'enable'}`, {
			method: 'POST'
		}).then(() => window.location.reload());

	// call the local /api/coffeechat endpoint with POST
	const coffeechatFormSubmit = async () =>
		await fetch(`/api/coffeechat`, {
			method: 'GET'
		});

	// POST to /api/storeroster where the JSON body is the roster
	const rosterFormSubmit = async () =>
		await fetch(`/api/storeroster`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				roster: parseRosterText(rosterText)
			})
		});
</script>

<svelte:head>
	<title>Home</title>
	<meta name="description" content="YASS home page" />
</svelte:head>

<section>
	<h1>YASS 🤖💅</h1>
	<br />
	<br />

	<h2>Actions</h2>
	<div class="row">
		<button on:click={statusFormSubmit}>Toggle {enablement ? 'Off' : 'On'}</button>
		<button on:click={coffeechatFormSubmit}>Trigger Coffee Chats Manually</button>
	</div>
	<br />

	<form on:submit|preventDefault={rosterFormSubmit}>
		<h2>Update Roster</h2>
		<label for="roster">
			Enter this year's roster with each NetID on a new line and nothing else!
		</label>
		<textarea rows={10} cols={10} name="roster" bind:value={rosterText} />
		<button type="submit">Update Roster</button>
	</form>
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

	h2 {
		padding: 0;
		margin: 0;
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

	form {
		border-top: 1px solid white;
		display: flex;
		flex-direction: column;
		gap: 1rem;
		margin: 1rem;
		padding: 2rem 0 0 0;
	}
</style>
