<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import type { Product } from "$lib/models/Product";
  export let item: Product, index;

  const dispatch = createEventDispatcher();

  function selectItem() {
    dispatch("select", { index });
  }
</script>

<li class="flex gap-x-4 items-center bg-yellow-50 rounded hover:bg-yellow-200 cursor-pointer" on:click={selectItem}>
  <span class="w-44 text-center font-semibold border-r border-black bg-yellow-300">
    {item.barcode}
  </span>
  <span class="font-medium">
    {item.name}
  </span>
</li>
