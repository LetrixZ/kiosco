<script lang="ts">
  import { slide } from "svelte/transition";
  import { createEventDispatcher } from "svelte";
  import Fa from "svelte-fa/src/fa.svelte";
  import { faPlus, faMinus, faTimes } from "@fortawesome/free-solid-svg-icons";
  import type { Product } from "$lib/models/Product";

  const dispatch = createEventDispatcher();

  function deleteItem() {
    dispatch("delete");
  }

  function modifyQuantity(q) {
    dispatch("update", {
      q,
    });
  }

  export let item: Product;
  export let idx;
</script>

<li class="flex text-2xl items-center" transition:slide={{ duration: 150 }}>
  <span class="w-[2%] text-center py-1">{idx + 1}</span>
  <span class="w-[60%] select-text font-semibold" class:no-name={!item.name}>{item.name ? item.name : "sin nombre"}</span>
  <span class="w-[15%] text-center">${item.price.toFixed(2)}</span>
  <span class="w-[10%] text-center flex items-center justify-center gap-x-4">
    <button
      tabindex="-1"
      class="text-xs text-red-600 p-1 hover:text-red-300 transition-all"
      disabled={item.units < 2}
      on:click={() => {
        modifyQuantity(-1);
      }}><Fa icon={faMinus} /></button
    >
    {item.units}
    <button
      tabindex="-1"
      class="text-xs text-green-500 p-1 hover:text-green-300 transition-all"
      on:click={() => {
        modifyQuantity(+1);
      }}><Fa icon={faPlus} /></button
    >
  </span>
  <span class="w-[15%] text-center  font-semibold">${(item.price * item.units).toFixed(2)}</span>
  <span class="w-[2%]">
    <button tabindex="-1" class="text-red-600 text-sm p-1 hover:text-red-300 transition-all" on:click={deleteItem}><Fa icon={faTimes} /></button>
  </span>
</li>
<div class="relative text-sm" />

<style lang="postcss">
  li:focus {
    @apply bg-yellow-50;
  }
  li:hover {
    @apply bg-yellow-100 cursor-pointer;
  }
  .no-name {
    @apply text-gray-700 font-normal italic;
  }
  li {
    @apply border-t border-black border-opacity-25;
  }
  li span {
    @apply px-2;
  }
</style>
