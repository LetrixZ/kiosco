<!-- src/lib/components/NavLink.svelte -->
<script>
  import { page } from "$app/stores";
  $: isActive = $page.path === $$props.href;
</script>

<!-- svelte-ignore a11y-missing-attribute -->
<a {...$$props} class:active={isActive}>
  <slot />
</a>

<style lang="postcss">
  a {
    @apply text-lg font-medium uppercase
  }

  a.active {
    @apply font-bold
  }
</style>
