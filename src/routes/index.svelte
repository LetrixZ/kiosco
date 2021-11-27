<script lang="ts">
  import { onMount, onDestroy } from "svelte";
  import { fade, slide } from "svelte/transition";
  import ProductList from "$lib/ventas/ProductList.svelte";
  import { itemList } from "$lib/store";
  import SearchResults from "$lib/ventas/SearchResults.svelte";
  import Fa from "svelte-fa/src/fa.svelte";
  import { faTimes, faTimesCircle, faTrash } from "@fortawesome/free-solid-svg-icons";
  import type { Product } from "$lib/models/Product";

  let barcode = "";
  let error = null;
  let totalPrice = 0;
  let searchResults = null;
  async function search(query) {
    if (query.length > 2) {
      searchResults = null;
      const res = await fetch("/api/prod?q=" + query);
      if (res.ok) {
        const results = await res.json();
        if (results.length) {
          searchResults = results;
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
          const it = await res.json();
          console.log(it);
          if (!it.id) {
            return;
          }
          it.units = 1;
          $itemList = [...$itemList, it];
        } else {
          if (res.status === 404) error = `${code} no encontrado`;
        }
        code = "";
      }
    }
    barcode = "";
  }

  onDestroy(() => {
    $itemList = [];
  });

  let input;
  $: {
    $itemList;
    focusInput();
  }

  function focusInput() {
    input?.focus();
  }

  function dismissResults() {
    searchResults = null;
    focusInput();
  }

  $: {
    if ($itemList.length > 0) {
      totalPrice = $itemList.map((it) => it.price * it.units).reduce((p, n) => p + n);
    } else {
      totalPrice = 0;
    }
  }

  let modalAdd = false;
  let priceInput, nameInput, unitsInput;
  let newItem = { price: null, name: "", units: 1 };

  function addPrice(item) {
    const product: Product = { name: item.name, barcode: null, price: item.price, units: item.units };
    $itemList = [...$itemList, product];
    modalAdd = false;
    newItem = { price: null, name: "", units: 1 };
  }

  $: {
    if (modalAdd) {
      priceInput?.focus();
    }
  }

  function handleKey(e) {
    if (modalAdd) {
      if (e.key === "Enter") {
        if (document.activeElement == priceInput) {
          e.preventDefault();
          priceInput.blur();
          unitsInput.focus();
        } else if (document.activeElement == unitsInput) {
          e.preventDefault();
          unitsInput.blur();
          nameInput.focus();
        }
      } else if (e.key === "Escape") {
        modalAdd = false;
        focusInput();
      }
    }
    if (searchResults) {
      if (e.key === "Escape") {
        dismissResults();
      }
    }
    if (e.key !== "+") return;
    if (e.key === "+") modalAdd = true;
    e.preventDefault();
  }
</script>

<svelte:window on:keydown={handleKey} />

<main class="w-full">
  <div class="w-[80vw] lg:w-[70vw] mx-auto py-12">
    <form on:submit|preventDefault={() => addItem(barcode)}>
      <input class="round w-full p-1 text-2xl" bind:value={barcode} bind:this={input} tabindex="0" />
    </form>
    {#if error}
      <div transition:fade={{ duration: 100 }}>
        <div class="relative">
          <div class="absolute bg-red-500 w-full rounded py-1 px-2 mt-1 text-white text-center text-xl">
            {error}
          </div>
        </div>
      </div>
    {/if}
    {#if modalAdd}
      <div transition:slide={{ duration: 100 }}>
        <div class="w-full bg-yellow-100 border border-black border-opacity-20 shadow my-2 p-2 rounded">
          <form on:submit|preventDefault={() => addPrice(newItem)} class="flex gap-x-1">
            <input bind:value={newItem.price} bind:this={priceInput} placeholder="Precio" required type="number" class="pl-1 rounded py-1" />
            <input bind:value={newItem.units} bind:this={unitsInput} placeholder="Unidades" required type="number" class="pl-1 rounded py-1" />
            <input bind:value={newItem.name} bind:this={nameInput} placeholder="Nombre" type="text" class="pl-1 rounded py-1" />
            <button class="bg-red-500 text-white p-1 px-3 rounded" type="submit">Agregar</button>
            <button class="bg-red-500 text-white p-1 px-3 rounded" type="button" on:click={() => (modalAdd = false)}><Fa icon={faTimes} /></button>
          </form>
        </div>
      </div>
    {/if}
    {#if searchResults}
      <div transition:slide={{ duration: 250 }}>
        <SearchResults items={searchResults} on:add={(e) => addItem(e.detail.barcode)} on:dismiss={() => dismissResults()} />
      </div>
    {/if}
    <div class="mt-14" />
    <ProductList />
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
</style>
