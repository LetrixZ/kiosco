<script>
  import { onMount } from "svelte";

  import { slide } from "svelte/transition";

  let status = { show: false, type: "", msg: "" };

  let hideTimeout;

  export function setMessage(msg) {
    status.msg = msg;
  }

  export function warn(msg, timeout = true) {
    status.type = "warning";
    show(msg, timeout);
  }

  export function show(msg, timeout = true) {
    status.msg = msg;
    status.show = true;
    clearTimeout(hideTimeout);
    if (timeout) {
      hideTimeout = setTimeout(() => (status.show = false), 3000);
    }
  }

  export function hide() {
    status.show = false;
  }

  export function toggle() {
    status.show = !status.show;
  }
</script>

{#if status.show}
  <div transition:slide={{ duration: 250 }} class:warning={status.type === "warning"} class="w-2/5 bg-green-500 rounded mx-auto p-2 text-white text-center font-medium">
    {status.msg}
  </div>
{/if}

<style lang="postcss">
  .warning {
    @apply bg-red-500;
  }
</style>
