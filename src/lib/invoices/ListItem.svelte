<script lang="ts">
  import type { Invoice } from "$lib/models/Invoice";
  import type { Line } from "$lib/models/Line";
  import { createEventDispatcher, onMount } from "svelte";
  import moment from "moment";
  import { slide } from "svelte/transition";

  const dispatch = createEventDispatcher();
  function click() {
    dispatch("click", {
      index,
    });
  }

  export let item: Invoice, index;

  let expand = false;

  let date = moment(item.date);
  let totalPrice;

  $: {
    if (item.lines.length > 0) totalPrice = item.lines.map((it) => it.price).reduce((prev, cur) => prev + cur);
    else totalPrice = 0
  }
</script>

<div class="text-lg mx-2 my-1">
  <div class="w-full bg-yellow-200 p-2 flex gap-x-2 items-center cursor-pointer hover:bg-red-300 rounded font-medium" on:click={click}>
    <span>
      {date.format("HH:mm")}
    </span>
    -
    <span class="flex-1">
      {date.format("DD/MM/YYYY")}
    </span>
    <span class="mx-auto">Total: ${totalPrice} </span>
  </div>
</div>
