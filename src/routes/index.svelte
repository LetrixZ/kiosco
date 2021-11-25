<script lang="ts">
  import { onMount } from "svelte";
  import { fade, slide } from "svelte/transition";
  import type { Prod } from "$lib/models";
  import ProductList from "$lib/ProductList.svelte";
  import { itemList } from "$lib/store";
  import SearchResults from "$lib/SearchResults.svelte";

  let barcode = "";
  let error = null;
  let totalPrice = 0;
  let itemsResult: Prod[] = null;
  async function search(query) {
    if (query.length > 2) {
      itemsResult = null;
      const res = await fetch("/api/prod?q=" + query);
      if (res.ok) {
        const results = await res.json();
        if (results.length) {
          itemsResult = results;
        } else {
          error = "No hay resultados";
        }
      } else {
        error = "Error en la busqueda";
      }
    }
  }

  async function addItem(code) {
    error = null;
    code = code.trim();
    if (!RegExp(/^\d+$/).test(code)) {
      search(code);
    } else {
      if (code) {
        const res = await fetch("/api/prod/" + code);
        if (res.ok) {
          error = null;
          const it: Prod = await res.json();
          if (!it.Id) {
            return;
          }
          it.unidades = 1;          
          $itemList = [...$itemList, it];
        } else {
          if (res.status === 404) error = `${code} no encontrado`;
        }
        code = "";
      }
    }
  }

  const add = () => {
    barcode = "7790290000523";
    addItem(barcode);
    barcode = "9002490100070";
    addItem(barcode);
    barcode = "7790580103422";
    addItem(barcode);
    barcode = "7790290000523";
    addItem(barcode);
    barcode = "9002490100070";
    addItem(barcode);
    barcode = "7790580103422";
    addItem(barcode);
    barcode = "7790895000997";
    addItem(barcode);
  };

  function dismissResults() {
    itemsResult = null;
  }

  onMount(async () => {
    // search("fernet");
    add();
  });  

  $: {
    if ($itemList.length > 0) {
      totalPrice = $itemList
        .map((it) => it.preciofinal * it.unidades)
        .reduce((p, n) => p + n);
    } else {
      totalPrice = 0;
    }
  }
</script>

<main class="w-full">
  <div class="w-[80vw] lg:w-[70vw] mx-auto py-12">
    <form on:submit|preventDefault={() => addItem(barcode)}>
      <input class="rounded w-full p-1 text-2xl" bind:value={barcode} />
    </form>
    {#if error}
      <div transition:fade={{ duration: 100 }}>
        <div class="relative">
          <div
            class="absolute bg-red-500 w-full rounded py-1 px-2 mt-1 text-white text-center text-xl"
          >
            {error}
          </div>
        </div>
      </div>
    {/if}
    {#if itemsResult}
      <div transition:slide={{ duration: 250 }}>
        <SearchResults
          items={itemsResult}
          on:add={(e) => addItem(e.detail.barcode)}
          on:dismiss={() => dismissResults()}
        />
      </div>
    {/if}
    <div class="mt-14" />
    <div>
      <ul class="select-none">
        <li class="flex gap-x-4 text-lg items-end border-b border-black mb-2">
          <span class="w-14" />
          <span class="w-full">Producto</span>
          <span class="w-64 text-center">Precio unitario</span>
          <span class="w-52 text-center">Unidades</span>
          <span class="w-64 text-center">Precio total</span>
          <span class="w-14" />
        </li>
        <ProductList />
        <li
          class="flex gap-x-4 text-5xl font-bold justify-between border-t border-black py-2 px-4"
        >
          <span>Precio total</span>
          <span>${totalPrice}</span>
        </li>
      </ul>
    </div>
  </div>
</main>

<style lang="postcss" global>
  button.button {
    @apply bg-red-500 text-white p-2 px-3 rounded-md font-medium;
  }
  button.button:hover {
    @apply bg-red-600;
  }
  button:disabled {
    @apply text-gray-600 opacity-50 pointer-events-none;
  }
  input {
    @apply border-2 border-black border-opacity-30 transition-all;
  }
  input:focus {
    @apply border-2 border-green-600 outline-none;
  }
</style>
