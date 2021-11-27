<script lang="typescript">
  import ProductItem from "./ProductListItem.svelte";
  import { itemList, itemList as items } from "$lib/store";

  let _refs = [];
  $: refs = _refs.filter(Boolean);

  function deleteItem(index) {
    $items = $items.filter((_, idx) => idx !== index);
  }

  function modifyQuantity(index, q) {
    let item = $items[index];
    if (q === -1 && item.units < 2) return;
    $items[index].units += q;
  }

  function handleKey(e) {
    if (e.key != "+" && e.key != "-") return;
    // if (e.key == '+') modifyQuantity($items.length - 1, 1)
    // else if (e.key == '-') modifyQuantity($items.length - 1, -1)
    e.preventDefault();
  }

  $: totalPrice = $itemList.length > 0 ? $itemList.map((it) => it.price * it.units).reduce((p, n) => p + n) : 0;
</script>

<svelte:window on:keydown={handleKey} />

<div>
  <ul class="select-none">
    <li class="flex text-lg items-end border-b border-black">
      <span class="w-[2%]" />
      <span class="w-[60%]">Producto</span>
      <span class="w-[15%] text-center">Precio unitario</span>
      <span class="w-[10%] text-center">Unidades</span>
      <span class="w-[15%] text-center">Precio total</span>
      <span class="w-[2%]" />
    </li>
    {#each $items as item, idx (idx)}
      <ProductItem {item} {idx} bind:this={_refs[idx]} on:delete={() => deleteItem(idx)} on:update={(e) => modifyQuantity(idx, e.detail.q)} />
    {/each}
    <li class="flex gap-x-4 text-5xl font-bold justify-between border-t border-black py-2 px-4">
      <span>Precio total</span>
      <span>${totalPrice}</span>
    </li>
  </ul>
</div>

<style lang="postcss">
  li span {
    @apply px-2;
  }
</style>
