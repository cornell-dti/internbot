<script lang="ts">
	import PasswordGate from '../components/PasswordGate.svelte';
	import logo from '$lib/images/internbot-logo.png';
	import Message from '../components/Message.svelte';

	export let data: {
		currentlyEnabled: string;
		currentRoster: string[];
		password: string;
	};

	// local state to track whether we've triggered the bot once
	let triggered = false;

	// local state for whether the bot is enabled or not
	let enablement = data.currentlyEnabled === 'true' ? true : false;

	// local state for the roster text -- reduce input array into new-line separated string
	let rosterText = data.currentRoster.reduce(
		(acc, netid) => (acc === '' ? netid : `${acc}\n${netid}`), // if acc is empty, just return netid, otherwise return acc + netid
		'' // initial value of acc
	);

	// message dispalyed
	let message = '';

	// parse the roster text into an array of netids
	const parseRosterText = (rosterText: string): string[] =>
		rosterText.split('\n').map((netid) => netid.trim().toLowerCase());

	// check that the roster text is valid: composed of only newlines and strings containing only letters, numbers, and leading/trailing whitespace
	const rosterTextIsValid = (rosterText: string): boolean =>
		rosterText.split('\n').every((netid) => /^[a-zA-Z0-9\s]*$/.test(netid));

	// call the local /api/disable or /api/enable endpoint with POST
	const statusFormSubmit = async () =>
		fetch(`/api/${enablement ? 'disable' : 'enable'}`, {
			method: 'POST'
		}).then(() => {
			enablement = !enablement;
			message = `Internbot is now ${enablement ? 'enabled' : 'disabled'}`;
		});

	// call the local /api/coffeechat endpoint with POST
	const coffeechatFormSubmit = async () => {
		triggered = true;
		fetch(`/api/coffeechat`, {
			method: 'GET'
		}).then(() => {
			message = 'Coffee chats sent!';
		});
	};

	// POST to /api/storeroster where the JSON body is the roster
	const rosterFormSubmit = async () => {
		if (rosterTextIsValid(rosterText)) {
			fetch(`/api/storeroster`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					roster: parseRosterText(rosterText)
				})
			}).then(() => {
				message = 'Roster updated!';
			});
		} else {
			message = 'Invalid roster text!';
		}
	};
</script>

<svelte:head>
	<title>Home</title>
	<meta name="description" content="YASS home page" />
</svelte:head>

<PasswordGate pass={data.password} />

<Message msg={message} />

<section>
	<img src={logo} alt="Internbot Logo" width={300} />
	<br />

	<div class="row">
		<button on:click={statusFormSubmit}>Turn {enablement ? 'Off' : 'On'}</button>
		<button on:click|once|preventDefault={coffeechatFormSubmit}
			>Trigger Coffee Chats Manually</button
		>
	</div>

	<form on:submit|preventDefault={rosterFormSubmit}>
		<h2>Roster</h2>
		<label for="roster">
			Keep each NetID on its own line, and input nothing else. <br />
		</label>
		<textarea rows={10} cols={10} name="roster" bind:value={rosterText} />
		<button class="roster" type="submit">Modify Roster</button>
	</form>
</section>

<style>
	section {
		display: flex;
		flex-direction: column;
		justify-content: space-around;
		align-items: left;
		padding: 1rem;
		width: 100%;
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

	textarea {
		width: clamp(25rem, 100%, 33rem);
	}

	button.roster {
		width: fit-content;
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
