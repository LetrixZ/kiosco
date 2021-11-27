<script lang="ts" context="module">
  export async function load({ page, fetch }) {
    const barcode = page.params.code;
    const res = await fetch("/api/prod/" + barcode);
    if (res.ok) {
      return {
        status: 200,
        props: { item: await res.json() },
      };
    }
    return {
      status: res.status,
      error: new Error("Ha ocurrido un error con el producto " + barcode),
    };
  }
</script>

<script lang="ts">
  import type { Product } from "$lib/models/Product";

  import { slide } from "svelte/transition";

  export let item: Product;

  let deleted = false;

  let alert = { show: false, msg: "", type: "" };

  function upsertItem(e) {
    if (item) {
      switch (e.submitter.value) {
        case "update":
          update();
          break;
        case "create":
          create();
          break;
        case "delete":
          del();
          break;
      }
    }
  }

  let hideTimeout;

  function showAlert(type: string) {
    switch (type) {
      case "update":
        alert.type = "update";
        alert.msg = `Se ha actualizado el producto ${item.name} con el codigo de barras ${item.barcode}`;
        alert.show = true;
        break;
      case "create":
        alert.type = "create";
        alert.msg = `Se ha creado el producto ${item.name} con el codigo de barras ${item.barcode}`;
        alert.show = true;
        break;
      case "delete":
        alert.type = "delete";
        alert.msg = `Se ha elimiado el producto ${item.name} con el codigo de barras ${item.barcode}`;
        alert.show = true;
        break;
    }
    clearTimeout(hideTimeout);
    hideTimeout = setTimeout(() => (alert.show = false), 3000);
  }

  async function create() {
    const res = await fetch("/api/prod/" + item.barcode, { method: "POST", body: JSON.stringify(item) });
    if (res.ok) {
      showAlert("create");
      deleted = false
    }
  }

  async function del() {
    const res = await fetch("/api/prod/" + item.barcode, { method: "DELETE" });
    if (res.ok) {
      deleted = true;
      showAlert("delete");
    }
  }

  async function update() {
    let res = await fetch("/api/prod/" + item.barcode, { method: "PUT", body: JSON.stringify(item) });
    if (res.ok) {
      item = (await res.json()).data;
      showAlert("update");
    }
  }
</script>

<div class="mt-24">
  {#if alert.show}
    <div
      transition:slide={{ duration: 250 }}
      class:update={alert.type === "update"}
      class:delete={alert.type === "delete"}
      class="w-1/3 bg-green-500 mx-auto top-14 inset-x-0 text-center text-white text-lg p-2 rounded shadow absolute"
    >
      <span>
        {alert.msg}
      </span>
    </div>
  {/if}
  {#if item}
    <form on:submit|preventDefault={upsertItem}>
      <div class="text-lg flex w-full items-center flex-col h-full top-28 inset-x-0 mx-auto gap-y-4">
        <div class="flex flex-col items-center text-center">
          <span>Codigo de barras</span>
          <input type="text" bind:value={item.barcode} />
        </div>
        <div class="flex flex-col items-center text-center">
          <span>Nombre</span>
          <input bind:value={item.name} />
        </div>
        <div class="flex flex-col items-center text-center">
          <span>Descripción del producto</span>
          <textarea bind:value={item.description} />
        </div>
        <div class="flex flex-col items-center text-center">
          <span>Precio de costo</span>
          <input bind:value={item.cost} />
        </div>
        <div class="flex flex-col items-center text-center">
          <span>Precio final</span>
          <input bind:value={item.price} />
        </div>
        <div class="flex gap-x-4">
          {#if !deleted}
            <button class="bg-yellow-500 text-white rounded px-2 py-1" value="update">Actualizar</button>
            <button class="bg-red-500 text-white rounded px-2 py-1" value="delete">Eliminar</button>
          {:else}
            <button class="bg-indigo-500 text-white rounded px-2 py-1" value="create">Crear</button>
          {/if}
        </div>
      </div>
    </form>
  {/if}
</div>

<style lang="postcss">
  input,
  textarea {
    @apply w-96 px-1;
  }
</style>
