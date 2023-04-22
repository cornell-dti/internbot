<script>
	import { page } from '$app/stores';
	import logo from '$lib/images/dtilogo-white-small.png';
	import github from '$lib/images/github.png';
</script>

<header>
	<div class="corner">
		<a href="https://www.cornelldti.org/">
			<img src={logo} alt="DTI" />
		</a>
	</div>

	<div class="corner">
		<a href="https://github.com/epicdragon44/yassbot">
			<img src={github} alt="GitHub" />
		</a>
	</div>
</header>

<style>
	header {
		display: flex;
		justify-content: space-between;
	}

	.corner {
		width: 3em;
		height: 3em;
	}

	.corner a {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 100%;
		height: 100%;
	}

	.corner img {
		width: 2em;
		height: 2em;
		object-fit: contain;
	}

	nav {
		display: flex;
		justify-content: center;
	}

	ul {
		position: relative;
		padding: 0;
		display: flex;
		justify-content: center;
		align-items: center;
		list-style: none;
	}

	li {
		position: relative;
		height: 100%;
	}

	li[aria-current='page']::before {
		--size: 6px;
		content: '';
		width: 0;
		height: 0;
		position: absolute;
		top: 0;
		left: calc(50% - var(--size));
		border: var(--size) solid transparent;
		border-top: var(--size) solid var(--color-theme-1);
	}

	nav li {
		display: flex;
		height: 100%;
		align-items: center;
		padding: 0 1rem;
		font-size: 0.85rem;
		text-transform: uppercase;
		letter-spacing: 0.15em;
		text-decoration: none;
	}
</style>
