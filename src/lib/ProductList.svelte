<script lang="typescript">
  import ProductItem from "./ProductItem.svelte";
  import { itemList as items } from "$lib/store";

  let _refs = [];
  $: refs = _refs.filter(Boolean);

  function deleteItem(index) {
    $items = $items.filter((_, idx) => idx !== index);
  }

  function modifyQuantity(index, q) {
    $items[index].unidades += q;
  }
</script>

{#each $items as item, idx (idx)}
  <ProductItem
    {item}
    {idx}
    bind:this={_refs[idx]}
    on:delete={() => deleteItem(idx)}
    on:update={(e) => modifyQuantity(idx, e.detail.q)}
  />
{/each}
