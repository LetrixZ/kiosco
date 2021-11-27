<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import { itemList } from "$lib/store";
  import type { Product } from "$lib/models/Product";

  export let items: Product[];
  const dispatch = createEventDispatcher();

  function dismissResults() {
    dispatch("dismiss");
  }

  function addItem(barcode) {
    dispatch("add", {
      barcode,
    });
  }
</script>

<div class="flex justify-end mt-2">
  <button class="button" on:click={dismissResults}>Cerrar</button>
</div>
<ul class="rounded-md my-2 text-lg font-medium bg-yellow-100 flex flex-col border border-black shadow">
  {#each items as item, idx (idx)}
    <li
      class="flex first:border-0 border-t first:rounded-t-md last:rounded-b-md w-full gap-x-2 px-4 border-gray-600 hover:bg-yellow-200 p-1 cursor-pointer"
      on:click={() => addItem(item.barcode)}
    >
      <span>
        {item.name} | {item.barcode}
      </span>
      <span class="flex-grow font-normal">
        {item.description ? `(${item.description})` : ""}
      </span>
      <span class="mx-auto">
        ${item.price}
      </span>
    </li>
  {/each}
</ul>
