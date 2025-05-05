<script>
	import '../app.css';

	import { page } from '$app/stores';
    $: hideNav = ['/login', '/register'].includes($page.url.pathname);
	// let { children } = $props();
</script>

{#if !hideNav}
  <nav class="p-4 text-center">
	<a href="/">Home |</a>
	<a href="/demo/paraglide"> Paraglide</a>
</nav>
{/if}
<!-- {@render children()} -->
<slot/>


