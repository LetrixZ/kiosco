<script context="module">
  import moment from "moment";

  function getDate(date = new Date()) {
    let month, day, year;
    let dateString;

    (month = "" + (date.getMonth() + 1)), (day = "" + date.getDate()), (year = date.getFullYear());

    if (month.length < 2) month = "0" + month;
    if (day.length < 2) day = "0" + day;

    dateString = [year, month, day].join("-");
    return dateString;
  }

  /** @type {import('@sveltejs/kit').Load} */
  export async function load({ page, fetch }) {
    return {
      status: 200,
      props: { date: { start: getDate(moment().subtract(1, "month").toDate()), end: getDate() } },
    };
  }
</script>

<script lang="ts">
  import Alert from "$lib/Alert.svelte";
  import VirtualList from "@sveltejs/svelte-virtual-list";
  import ListItem from "$lib/invoices/ListItem.svelte";
  import { onMount } from "svelte";
  import type { Invoice } from "$lib/models/Invoice";
  import Fa from "svelte-fa/src/fa.svelte";
  import { fade, slide } from "svelte/transition";
  import { faLightbulb } from "@fortawesome/free-solid-svg-icons";

  export let date;

  let itemList: Invoice[] = [];

  let sortType = "desc";

  // $: filteredList = sortType === "desc" ? itemList?.sort((a, b) => new Date(b.date) - new Date(a.date)) : itemList.sort((a, b) => new Date(a.date) - new Date(b.date));


  async function send() {
    const query = new URLSearchParams();
    query.append("start", date.start);
    query.append("end", date.end);
    const res = await fetch("/api/invoice?" + query);
    if (res.ok) {
      itemList = await res.json();
    } else {
      itemList = [];
    }
  }

  let alertComponent,
    expand = false;

  $: {
    if (date.start > date.end) {
      alertComponent?.warn("La fecha de inicio no debe ser mayor a la fecha de fin", false);
    } else {
      alertComponent?.hide();
    }
  }

  let selectedIndex;

  $: selectedItem = itemList?.[selectedIndex];  

  onMount(() => send());

  function select(e) {
    selectedIndex = e.detail.index;
  }

  $: totalPrice = selectedItem?.lines.length > 0 ? selectedItem?.lines.map((it) => it.price).reduce((prev, cur) => prev + cur) : 0;

  function handleKey(e) {
    if (e.key !== "Escape") return;

    if (e.key === "Escape") {
      selectedIndex = null;
    }
  }
</script>

<svelte:window on:keydown={handleKey} />

<div class="mt-10 flex flex-col gap-y-4 h-full">
  <form on:submit|preventDefault={send}>
    <div class="flex justify-center items-center gap-x-4">
      <label>
        Desde
        <input type="date" bind:value={date.start} />
      </label>

      <label>
        Hasta
        <input type="date" bind:value={date.end} />
      </label>

      <button>Enviar</button>
    </div>
  </form>
  <Alert bind:this={alertComponent} />
  {#if selectedItem}
    <div transition:fade={{ duration: 100 }} class="fixed inset-0 z-10  bg-black bg-opacity-20 p-20">
      <div class="bg-white rounded p-2 mt-1 shadow w-[50%] mx-auto text-lg">
        <ul class="px-4">
          <li class="font-medium">
            <p class="flex gap-x-4">
              <span class="w-[5%] text-center">Linea</span>
              <span class="flex-1">Producto</span>
              <span class="w-[10%] text-center">Cantidad</span>
              <span class="w-[10%] text-right">Precio</span>
            </p>
          </li>
          {#each selectedItem.lines as line (line.id)}
            <!-- <li>
              <span class="font-medium">
                ({line.number + 1}) {line.product.name}
              </span>
              <ul class="px-4">
                <li>
                  Cantidad: {line.units}
                </li>
                <li>
                  Precio: ${line.price}
                </li>
              </ul>
            </li> -->
            <li>
              <p class="flex gap-x-4">
                <span class="w-[5%] text-center">{line.number + 1}</span>
                <span class="flex-1">
                  {line.product.name}
                </span>
                <span class="w-[10%] text-center">
                  {line.units}
                </span>
                <span class="w-[10%] text-right">
                  ${line.price}
                </span>
              </p>
            </li>
          {/each}
        </ul>
        <p class="flex flex-row justify-between text-center text-4xl border-t font-semibold border-black mt-4 py-2 px-4">
          <span> Total </span>
          <span>
            ${totalPrice}
          </span>
        </p>
      </div>
    </div>
  {/if}
  <div class="w-[80%] mx-auto  h-[80%]">
    <VirtualList items={itemList} let:item let:index>
      <ListItem {item} {index} on:click={select} />
    </VirtualList>
  </div>
</div>

<style lang="postcss">
  button {
    @apply py-2 px-3 bg-yellow-500 rounded font-medium hover:bg-yellow-600 text-white transition-all duration-100;
  }
</style>
