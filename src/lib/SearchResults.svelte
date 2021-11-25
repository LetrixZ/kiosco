<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import { itemList } from "$lib/store";

  export let items;
  const dispatch = createEventDispatcher();

  function dismissResults() {
    dispatch("dismiss");
  }

  function addItem(codigoprod) {
    dispatch('add', {
      barcode: codigoprod
    })
  }
</script>

<div class="flex justify-end mt-2">
  <button class="button" on:click={dismissResults}>Cerrar</button>
</div>
<ul
  class="rounded-md my-2 text-lg font-medium bg-blue-100 flex flex-col gap-y-1"
>
  {#each items as item, idx (idx)}
    <li
      class="flex rounded-md w-full gap-x-2 px-4 hover:bg-blue-200 p-1 cursor-pointer"
      on:click={() => addItem(item.codigoprod)}
    >
      <span>
        {item.nombre} | {item.codigoprod}
      </span>
      <span class="flex-grow font-normal">
        {item.descripcion ? `(${item.descripcion})` : ""}
      </span>
      <span class="mx-auto">
        ${item.preciofinal}
      </span>
    </li>
  {/each}
</ul>
