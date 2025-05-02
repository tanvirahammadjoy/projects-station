<!-- src/routes/+layout.svelte -->
<script>
  import "../app.css";
//   import Footer from "$lib/Footer.svelte";
  import { page } from '$app/stores';
  import Footer from '$lib/Footer.svelte';
  $: currentPath = $page.url.pathname;
</script>

<nav class="flex justify-center py-4 bg-gray-500">
  <ul class="flex gap-4">
    <li class="mr-4 text-white"><a href="/">Home</a></li>
    <li class="mr-4 text-white"><a href="/about">About</a></li>
  </ul>
</nav>


<slot />

<!-- <Footer text="© 2025 Tanvir’s Library — All rights reserved." /> -->
 <Footer text={currentPath === '/about'
  ? "About Project | © 2025 Tanvir"
  : "© 2025 Tanvir’s Main Project"} />