<script lang="typescript">
  import ProductItem from "./ProductItem.svelte";
  import { itemList as items } from "$lib/store";

  let _refs = [];
  $: refs = _refs.filter(Boolean);

  function deleteItem(index) {
    $items = $items.filter((_, idx) => idx !== index);
  }

  function modifyQuantity(index, q) {
    let item = $items[index]    
    if (q === -1 && item.unidades < 2) return
    $items[index].unidades += q;
  }

  function handleKey(e) {
    if (e.key != '+' && e.key != '-') return
    if (e.key == '+') modifyQuantity($items.length - 1, 1)
    else if (e.key == '-') modifyQuantity($items.length - 1, -1)
    
  }
</script>

<svelte:window on:keydown={handleKey}/>

{#each $items as item, idx (idx)}
  <ProductItem
    {item}
    {idx}
    bind:this={_refs[idx]}
    on:delete={() => deleteItem(idx)}
    on:update={(e) => modifyQuantity(idx, e.detail.q)}
  />
{/each}
