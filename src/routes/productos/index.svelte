<script context="module" lang="ts">
  export async function load({ page, fetch }) {
    const res = await fetch("/api/prod");
    const json = await res.json();
    return { props: { items: json } };
  }
</script>

<script lang="ts">
  import VirtualList from "@sveltejs/svelte-virtual-list";
  import { faPlus, faTimes } from "@fortawesome/free-solid-svg-icons";
  import { onMount } from "svelte";
  import Fa from "svelte-fa/src/fa.svelte";
  import { fade, slide } from "svelte/transition";
  import ListItem from "$lib/products/ListItem.svelte";
  import type { Product } from "$lib/models/Product";

  export let items: Product[];
  let selectedItem: Product;
  let searchText = "";
  let updated = false;
  let isNew = true;

  $: filteredList = items.filter((item) => item.name?.toLowerCase().indexOf(searchText.toLowerCase()) !== -1).sort((a, b) => a["id"] - b["id"]);
  $: if (RegExp(/^\d+$/).test(searchText)) filteredList = items.filter((item) => item.barcode.indexOf(searchText) !== -1);
  let listInput;

  onMount(() => {
    listInput?.focus();
  });

  let deletePrompt = { show: false };

  async function upsertItem(e) {
    if (selectedItem) {
      switch (e.submitter.value) {
        case "update":
          update();
          break;
        case "create":
          create();
          break;
        case "delete_prompt":
          delPrompt();
          break;
        case "delete":
          del();
          break;
      }
    }
  }

  function delPrompt() {
    deletePrompt.show = true;
  }

  async function del() {
    deletePrompt.show = false
    const res = await fetch("/api/prod/" + selectedItem.barcode, { method: "DELETE" });
    if (res.ok) {
      items = items.filter((it) => it.barcode !== selectedItem.barcode);
    }
    showAlert("delete");
  }

  async function create() {
    const res = await fetch("/api/prod/" + selectedItem.barcode, { method: "POST", body: JSON.stringify(selectedItem) });
    if (res.ok) {
      items = [...items, (await res.json()).data];
    }
    showAlert("create");
  }

  async function update() {
    const index = items.indexOf(selectedItem);
    let res = await fetch("/api/prod/" + selectedItem.barcode, { method: "PUT", body: JSON.stringify(selectedItem) });
    if (res.ok) {
      const item = await res.json();
      items[index] = item.data;
    }
    showAlert("update");
  }

  let alert = { show: false, type: "", msg: "" };

  let hideTimeout;

  function showAlert(type) {
    switch (type) {
      case "update":
        alert.type = "update";
        alert.msg = `Se ha actualizado el producto ${selectedItem.name} con el codigo de barras ${selectedItem.barcode}`;
        alert.show = true;
        break;
      case "create":
        alert.type = "create";
        alert.msg = `Se ha creado el producto ${selectedItem.name} con el codigo de barras ${selectedItem.barcode}`;
        alert.show = true;
        break;
      case "delete":
        alert.type = "delete";
        alert.msg = `Se ha elimiado el producto ${selectedItem.name} con el codigo de barras ${selectedItem.barcode}`;
        alert.show = true;
        break;
    }
    clearTimeout(hideTimeout);
    hideTimeout = setTimeout(() => (alert.show = false), 3000);
  }

  $: {
    let matches = items?.filter((item) => item.barcode === searchText);
    if (matches.length === 1) {
      selectedItem = matches[0];
      isNew = false;
    }
  }

  $: {
    let matches = items?.filter((item) => item.barcode === selectedItem?.barcode);
    if (matches.length === 0) {
      isNew = true;
    } else if (matches.length === 1) {
      selectedItem = matches[0];
      isNew = false;
    } else {
      isNew = false;
    }
  }

  function createItem() {
    if (searchText)
      if (!RegExp(/^\d+$/).test(searchText))
        selectedItem = {
          barcode: null,
          name: searchText,
          description: "",
          price: null,
          cost: null,
          units: null,
        };
      else if (!items.filter((item) => item.barcode == searchText).length)
        selectedItem = {
          barcode: searchText,
          name: "",
          description: "",
          price: null,
          cost: null,
          units: null,
        };
  }

  function select(index) {
    selectedItem = filteredList[index];
  }
</script>

<main class="w-full">
  <div class="w-[80vw] mx-auto">
    <div class="mt-20 text flex gap-x-20">
      <div class="flex flex-col gap-y-2 justify-center w-[50%]">
        <form on:submit|preventDefault={createItem}>
          <div class="flex items-stretch">
            <input class="border text-xl py-1 px-2 w-full rounded-none outline-none border-black transition-all" bind:value={searchText} bind:this={listInput} type="text" />
            <button class="bg-red-500 text-white w-10 flex justify-center items-center rounded-sm hover:bg-red-600 transition-all" type="submit"><Fa icon={faPlus} /></button>
          </div>
        </form>
        <ul class="h-[70vh] overflow-auto flex flex-col text-lg rounded border border-black">
          <VirtualList items={filteredList} let:item let:index>
            <ListItem {item} {index} on:select={() => select(index)} />
          </VirtualList>
        </ul>
      </div>
      <div class="w-1/3">
        {#if selectedItem}
          <form on:submit|preventDefault={upsertItem}>
            <div class="product text-lg flex flex-col items-end gap-y-2">
              <div class="flex fg">
                <span>Codigo de barras</span>
                <input type="text" bind:value={selectedItem.barcode} />
              </div>
              <div class="flex fg">
                <span>Nombre</span>
                <input bind:value={selectedItem.name} />
              </div>
              <div class="flex fg">
                <span>Descripción del producto</span>
                <textarea bind:value={selectedItem.description} />
              </div>
              <div class="flex fg">
                <span>Precio de costo</span>
                <input bind:value={selectedItem.cost} />
              </div>
              <div class="flex fg">
                <span>Precio final</span>
                <input bind:value={selectedItem.price} />
              </div>
              <div class="flex gap-x-2 font-semibold">
                {#if deletePrompt.show}
                  <button class="bg-red-500 text-white rounded px-2 py-1 flex-1" value="delete">Confirmar eliminacion</button>
                  <button class="bg-gray-700 text-white rounded px-2 py-1" type="button" on:click="{() => deletePrompt.show = false}"><Fa icon={faTimes}/></button>
                {:else if !isNew}
                  <button class="bg-yellow-500 text-white rounded px-2 py-1" value="update">Actualizar</button>
                  <button class="bg-red-500 text-white rounded px-2 py-1" value="delete_prompt">Eliminar</button>
                {:else}
                  <button class="bg-indigo-500 text-white rounded px-2 py-1" value="create">Crear</button>
                {/if}
              </div>
              {#if updated}
                <span class="text-green-500 text-2xl self-center" transition:fade={{ duration: 500 }}>
                  {isNew ? "Guardado" : "Actualizado"}
                </span>
              {/if}
              {#if alert.show}
                <div
                  transition:slide={{ duration: 250 }}
                  class:create={alert.type === "create"}
                  class:update={alert.type === "update"}
                  class:delete={alert.type === "delete"}
                  class="w-full bg-green-500 mx-auto text-center text-white text-lg p-2 rounded shadow"
                >
                  <span>
                    {alert.msg}
                  </span>
                </div>
              {/if}
            </div>
          </form>
        {/if}
      </div>
    </div>
  </div>
</main>

<style lang="postcss">
  .product input,
  .product textarea {
    @apply px-1 w-96;
  }
  input::-webkit-inner-spin-button {
    margin: 0;
    -webkit-appearance: none;
  }
  .product span {
    @apply text-right font-medium w-40;
  }

  .product .flex.fg {
    @apply gap-x-4;
  }

  .font-semibold button {
    @apply font-semibold;
  }
</style>
