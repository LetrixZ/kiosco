<script>
  import { slide } from "svelte/transition";
  import { createEventDispatcher } from "svelte";
  import Fa from "svelte-fa/src/fa.svelte";
  import { faPlus, faMinus, faTimes } from "@fortawesome/free-solid-svg-icons";

  const dispatch = createEventDispatcher();

  function deleteItem() {
    dispatch("delete");
  }

  function modifyQuantity(q) {
    dispatch("update", {
      q,
    });
  }

  export let item, idx;
</script>

<li
  class="flex gap-x-4 text-2xl border-b py-0.5"
  transition:slide={{ duration: 150 }}
>
  <span class="w-14 text-right">{idx + 1}</span>
  <span class="w-full select-text font-semibold">{item.nombre}</span>
  <span class="w-64 text-center">${item.preciofinal}</span>
  <span
    class="w-80 text-center flex items-center justify-center gap-x-4"
    tabindex="0"
  >
    <button
      class="text-xs text-red-600 p-1 hover:text-red-300 transition-all"
      disabled={item.unidades < 2}
      on:click={() => {
        modifyQuantity(-1);
      }}><Fa icon={faMinus} /></button
    >
    {item.unidades}
    <button
      class="text-xs text-green-500 p-1 hover:text-green-100 transition-all"
      on:click={() => {
        modifyQuantity(+1);
      }}><Fa icon={faPlus} /></button
    >
  </span>
  <span class="w-64 text-center  font-semibold"
    >${item.preciofinal * item.unidades}</span
  >
  <button
    class="text-red-600 text-sm p-1 hover:text-red-300 transition-all"
    on:click={deleteItem}><Fa icon={faTimes} /></button
  >
</li>
<div class="relative text-sm" />

<style lang="postcss">
  li:focus {
    @apply bg-blue-50;
  }
  li:hover {
    @apply bg-blue-100 cursor-pointer;
  }
</style>
